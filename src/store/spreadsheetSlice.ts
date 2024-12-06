/**
 * @fileoverview Redux slice for spreadsheet state management. Handles all spreadsheet
 * operations including cell selection, data manipulation, and formatting.
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { initialState } from './initialState'
import { State, DataPayload } from '../types'

type TableSizePayload = {
    row: number
    col: number
}

const spreadsheetSlice = createSlice({
    name: 'spreadsheet',
    initialState: {
        ...initialState(10, 10),
        selectedColumns: [] as number[],
        past: [] as DataPayload[],
        future: [] as DataPayload[]
    } as State,
    reducers: {
        setData: (state, action: PayloadAction<DataPayload>) => {
            const { 
                data, 
                alignments, 
                bold, 
                italic, 
                code,
                selectedCell,
                selectedCells,
                selectedRows,
                selectedColumns,
                isDragging,
                selectAll
            } = action.payload

            // Only save state if data actually changed
            if (
                JSON.stringify(state.data) !== JSON.stringify(data) ||
                JSON.stringify(state.alignments) !== JSON.stringify(alignments)
            ) {
                state.past.push({
                    data: state.data,
                    alignments: state.alignments,
                    bold: state.bold,
                    italic: state.italic,
                    code: state.code,
                    selectedCell: state.selectedCell,
                    selectedCells: state.selectedCells,
                    selectedRows: state.selectedRows,
                    selectedColumns: state.selectedColumns,
                    isDragging: state.isDragging,
                    selectAll: state.selectAll
                })
                state.future = [] // Clear future when new changes are made
            }

            state.data = data
            state.alignments = alignments
            state.bold = bold
            state.italic = italic
            state.code = code

            // Update optional state properties if provided
            if (selectedCell !== undefined) state.selectedCell = selectedCell
            if (selectedCells !== undefined) state.selectedCells = selectedCells
            if (selectedRows !== undefined) state.selectedRows = selectedRows
            if (selectedColumns !== undefined) state.selectedColumns = selectedColumns
            if (isDragging !== undefined) state.isDragging = isDragging
            if (selectAll !== undefined) state.selectAll = selectAll
        },
        
        startDrag: (state, action: PayloadAction<{ row: number, col: number }>) => {
            const { row, col } = action.payload
            
            // Don't start a new drag if already dragging
            if (state.isDragging) return
            
            state.isDragging = true
            state.dragStart = { row, col }
            
            // Clear previous selections first
            state.selectedCell = null
            state.selectedColumns = []
            state.selectedRows = []
            state.selectedCells = state.selectedCells.map(row => row.map(() => false))
            state.selectAll = false  // Clear selectAll when starting drag
            
            // Then set new selection
            if (col === -1 && row >= 0) {
                state.selectedRows = [row]
            } else if (row === -1 && col >= 0) {
                state.selectedColumns = [col]
            } else if (row >= 0 && col >= 0) {
                state.dragStartRow = row
                state.dragStartColumn = col
                if (state.selectedCells[row]) {
                    state.selectedCells[row][col] = true
                }
            }
        },

        updateDragSelection: (state, action: PayloadAction<{ row: number, col: number }>) => {
            if (!state.isDragging || !state.dragStart) return
            const { row, col } = action.payload
            const { row: startRow, col: startCol } = state.dragStart

            // Clear selectAll when dragging
            state.selectAll = false

            // Handle row selection drag
            if (startCol === -1 && row >= 0) {
                const minRow = Math.min(startRow, row)
                const maxRow = Math.max(startRow, row)
                state.selectedRows = Array.from(
                    { length: maxRow - minRow + 1 },
                    (_, i) => minRow + i
                )
                return
            }

            // Handle column selection drag
            if (startRow === -1 && col >= 0) {
                const minCol = Math.min(startCol, col)
                const maxCol = Math.max(startCol, col)
                state.selectedColumns = Array.from(
                    { length: maxCol - minCol + 1 },
                    (_, i) => minCol + i
                )
                return
            }

            // Handle cell selection drag
            if (row >= 0 && col >= 0) {
                const minRow = Math.min(startRow, row)
                const maxRow = Math.max(startRow, row)
                const minCol = Math.min(startCol, col)
                const maxCol = Math.max(startCol, col)

                state.selectedCells = state.selectedCells.map((rowCells, rowIndex) =>
                    rowCells.map((_, colIndex) =>
                        rowIndex >= minRow && 
                        rowIndex <= maxRow && 
                        colIndex >= minCol && 
                        colIndex <= maxCol
                    )
                )
            }
        },

        endDrag: (state) => {
            state.isDragging = false
            state.dragStart = null
        },

        clearRowSelection: (state) => {
            state.selectedRows = []
        },

        setTableSize: (state, action: PayloadAction<TableSizePayload>) => {
            const { row, col } = action.payload
            state.data = Array.from({ length: row }, () => Array(col).fill(""))
            state.alignments = Array.from({ length: row }, () => Array(col).fill("left"))
            state.selectedCells = Array.from({ length: row }, () => Array(col).fill(false))
        },

        clearTable: (state) => {
            state.data = state.data.map(row => row.map(() => ""))
        },

        transposeTable: (state) => {
            const newData = state.data[0].map((_, colIndex) => 
                state.data.map(row => row[colIndex])
            )
            state.data = newData
        },

        setSelectedCell: (state, action: PayloadAction<{ row: number, col: number }>) => {
            const { row, col } = action.payload
            
            // If the cell is already selected, do nothing
            if (state.selectedCell?.row === row && state.selectedCell?.col === col) {
                return
            }

            // Clear other selections
            state.selectedColumns = []
            state.selectedRows = []
            state.selectedCells = state.selectedCells.map(row => row.map(() => false))
            state.selectAll = false
            
            // Set new selection
            state.selectedCell = { row, col }
        },

        setSelectedColumn: (state, action: PayloadAction<number>) => {
            const col = action.payload
            
            // If the column is already selected, do nothing
            if (state.selectedColumns.includes(col)) {
                return
            }

            // Clear other selections
            state.selectedCell = null
            state.selectedRows = []
            state.selectedCells = state.selectedCells.map(row => row.map(() => false))
            state.selectAll = false
            
            // Set new column selection
            state.selectedColumns = [col]
        },

        toggleSelectAll: (state) => {
            state.selectAll = !state.selectAll
            if (state.selectAll) {
                const rowCount = state.data.length
                state.selectedRows = Array.from({ length: rowCount }, (_, i) => i)
            } else {
                state.selectedRows = []
            }
        },

        applyTextFormatting: (state, action: PayloadAction<{ operation: 'BOLD' | 'ITALIC' | 'CODE' | 'ALIGN_LEFT' | 'ALIGN_CENTER' | 'ALIGN_RIGHT' }>) => {
            const { operation } = action.payload
            
            // Collect all cells that need formatting
            const cellsToFormat: [number, number][] = []

            // If any cells are specifically selected
            if (state.selectedCells.some(row => row.some(cell => cell))) {
                state.selectedCells.forEach((row, rowIndex) => {
                    row.forEach((selected, colIndex) => {
                        if (selected) {
                            cellsToFormat.push([rowIndex, colIndex])
                        }
                    })
                })
            }
            // If a single cell is selected
            else if (state.selectedCell) {
                cellsToFormat.push([state.selectedCell.row, state.selectedCell.col])
            }
            // If entire rows are selected
            else if (state.selectedRows.length > 0) {
                state.selectedRows.forEach(rowIndex => {
                    state.data[0].forEach((_, colIndex) => {
                        cellsToFormat.push([rowIndex, colIndex])
                    })
                })
            }
            // If columns are selected
            else if (state.selectedColumns.length > 0) {
                state.selectedColumns.forEach(colIndex => {
                    state.data.forEach((_, rowIndex) => {
                        cellsToFormat.push([rowIndex, colIndex])
                    })
                })
            }

            if (cellsToFormat.length === 0) return

            // Create deep copies of the current state
            const newBold = state.bold.map(row => [...row])
            const newItalic = state.italic.map(row => [...row])
            const newCode = state.code.map(row => [...row])
            const newAlignments = state.alignments.map(row => [...row])

            // Apply the formatting to the copies
            cellsToFormat.forEach(([row, col]) => {
                switch (operation) {
                    case 'BOLD':
                        newBold[row][col] = !state.bold[row][col]
                        break
                    case 'ITALIC':
                        newItalic[row][col] = !state.italic[row][col]
                        break
                    case 'CODE':
                        newCode[row][col] = !state.code[row][col]
                        break
                    case 'ALIGN_LEFT':
                        newAlignments[row][col] = 'left'
                        break
                    case 'ALIGN_CENTER':
                        newAlignments[row][col] = 'center'
                        break
                    case 'ALIGN_RIGHT':
                        newAlignments[row][col] = 'right'
                        break
                }
            })

            // Save current state to history only if there are actual changes
            const hasChanges = 
                operation === 'BOLD' ? JSON.stringify(newBold) !== JSON.stringify(state.bold) :
                operation === 'ITALIC' ? JSON.stringify(newItalic) !== JSON.stringify(state.italic) :
                operation === 'CODE' ? JSON.stringify(newCode) !== JSON.stringify(state.code) :
                JSON.stringify(newAlignments) !== JSON.stringify(state.alignments)

            if (hasChanges) {
                state.past.push({
                    data: state.data,
                    alignments: state.alignments,
                    bold: state.bold,
                    italic: state.italic,
                    code: state.code,
                    selectedCell: state.selectedCell,
                    selectedCells: state.selectedCells,
                    selectedRows: state.selectedRows,
                    selectedColumns: state.selectedColumns,
                    isDragging: state.isDragging,
                    selectAll: state.selectAll
                })
                state.future = []
            }

            // Update the state with the new values
            state.bold = newBold
            state.italic = newItalic
            state.code = newCode
            state.alignments = newAlignments
        },

        undo: (state) => {
            if (state.past.length === 0) return

            const previousState = state.past.pop()
            if (!previousState) return

            state.future.push({
                data: state.data,
                alignments: state.alignments,
                bold: state.bold,
                italic: state.italic,
                code: state.code,
                selectedCell: state.selectedCell,
                selectedCells: state.selectedCells,
                selectedRows: state.selectedRows,
                selectedColumns: state.selectedColumns,
                isDragging: state.isDragging,
                selectAll: state.selectAll
            })

            state.data = previousState.data
            state.alignments = previousState.alignments
            state.bold = previousState.bold ?? state.bold
            state.italic = previousState.italic ?? state.italic
            state.code = previousState.code ?? state.code
            state.selectedCell = previousState.selectedCell ?? state.selectedCell
            state.selectedCells = previousState.selectedCells ?? state.selectedCells
            state.selectedRows = previousState.selectedRows ?? state.selectedRows
            state.selectedColumns = previousState.selectedColumns ?? state.selectedColumns
            state.isDragging = previousState.isDragging ?? state.isDragging
            state.selectAll = previousState.selectAll ?? state.selectAll
        },

        redo: (state) => {
            if (state.future.length === 0) return

            const nextState = state.future.pop()
            if (!nextState) return

            state.past.push({
                data: state.data,
                alignments: state.alignments,
                bold: state.bold,
                italic: state.italic,
                code: state.code,
                selectedCell: state.selectedCell,
                selectedCells: state.selectedCells,
                selectedRows: state.selectedRows,
                selectedColumns: state.selectedColumns,
                isDragging: state.isDragging,
                selectAll: state.selectAll
            })

            state.data = nextState.data
            state.alignments = nextState.alignments
            state.bold = nextState.bold ?? state.bold
            state.italic = nextState.italic ?? state.italic
            state.code = nextState.code ?? state.code
            state.selectedCell = nextState.selectedCell ?? state.selectedCell
            state.selectedCells = nextState.selectedCells ?? state.selectedCells
            state.selectedRows = nextState.selectedRows ?? state.selectedRows
            state.selectedColumns = nextState.selectedColumns ?? state.selectedColumns
            state.isDragging = nextState.isDragging ?? state.isDragging
            state.selectAll = nextState.selectAll ?? state.selectAll
        },
        
        // ... other reducers remain the same
    }
})

export const { 
    setData,
    startDrag,
    updateDragSelection,
    endDrag,
    clearRowSelection,
    setTableSize,
    clearTable,
    transposeTable,
    setSelectedCell,
    setSelectedColumn,
    toggleSelectAll,
    applyTextFormatting,
    undo,
    redo
} = spreadsheetSlice.actions

export const spreadsheetReducer = spreadsheetSlice.reducer