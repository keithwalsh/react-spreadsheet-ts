/**
 * @fileoverview Redux slice for spreadsheet state management. Handles all spreadsheet
 * operations including cell selection, data manipulation, and formatting.
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { State, Alignment } from '../types'

export const initialState = (rows: number, columns: number): State => ({
    data: Array.from({ length: rows }, () => Array(columns).fill("")),
    alignments: Array.from({ length: rows }, () => Array(columns).fill("left")),
    bold: Array.from({ length: rows }, () => Array(columns).fill(false)),
    italic: Array.from({ length: rows }, () => Array(columns).fill(false)),
    code: Array.from({ length: rows }, () => Array(columns).fill(false)),
    past: [],
    future: [],
    selectedColumn: null,
    selectedRow: null,
    selectedCell: null,
    selectedCells: Array.from({ length: rows }, () => Array(columns).fill(false)),
    selectedRows: [],
    selectAll: false,
    isDragging: false,
    dragStart: null,
    dragStartRow: null,
    dragStartColumn: null,
    selectedColumns: []
})

interface TableSizePayload {
    row: number
    col: number
}

const spreadsheetSlice = createSlice({
    name: 'spreadsheet',
    initialState: {
        ...initialState(10, 10),
        selectedColumns: [] as number[]
    },
    reducers: {
        setData: (state, action: PayloadAction<[string[][], Alignment[][]]>) => {
            state.past.push([state.data, state.alignments])
            state.data = action.payload[0]
            state.alignments = action.payload[1]
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
            
            // Set new selection
            state.selectedCell = { row, col }
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

        toggleBold: (state, action: PayloadAction<{ row: number, col: number }>) => {
            const { row, col } = action.payload
            state.bold[row][col] = !state.bold[row][col]
        },

        toggleItalic: (state, action: PayloadAction<{ row: number, col: number }>) => {
            const { row, col } = action.payload
            state.italic[row][col] = !state.italic[row][col]
        },

        toggleCode: (state, action: PayloadAction<{ row: number, col: number }>) => {
            const { row, col } = action.payload
            state.code[row][col] = !state.code[row][col]
        },

        setAlignment: (state, action: PayloadAction<{ row: number, col: number, alignment: Alignment }>) => {
            const { row, col, alignment } = action.payload
            state.alignments[row][col] = alignment
        },

        applyTextFormatting: (state, action: PayloadAction<{ operation: 'BOLD' | 'ITALIC' | 'CODE' | 'ALIGN_LEFT' | 'ALIGN_CENTER' | 'ALIGN_RIGHT' }>) => {
            const { operation } = action.payload
            
            // Collect all cells that need formatting
            const cellsToFormat: [number, number][] = []

            // Add cells from multiple selection
            state.selectedCells.forEach((row, rowIndex) => {
                row.forEach((isSelected, colIndex) => {
                    if (isSelected) {
                        cellsToFormat.push([rowIndex, colIndex])
                    }
                })
            })

            // Add cells from column selection
            state.selectedColumns.forEach(colIndex => {
                for (let rowIndex = 0; rowIndex < state.data.length; rowIndex++) {
                    cellsToFormat.push([rowIndex, colIndex])
                }
            })

            // Add cells from row selection
            state.selectedRows.forEach(rowIndex => {
                for (let colIndex = 0; colIndex < state.data[0].length; colIndex++) {
                    cellsToFormat.push([rowIndex, colIndex])
                }
            })

            // Add single selected cell if no other selections exist
            if (cellsToFormat.length === 0 && state.selectedCell) {
                cellsToFormat.push([state.selectedCell.row, state.selectedCell.col])
            }

            if (cellsToFormat.length === 0) return

            // Handle alignment operations
            if (operation.startsWith('ALIGN_')) {
                const newValue: Alignment = operation === 'ALIGN_LEFT' ? 'left' : operation === 'ALIGN_CENTER' ? 'center' : 'right'
                
                // Create a new alignment array with the updates
                const newAlignments = state.alignments.map((row, rowIndex) => 
                    row.map((value, colIndex) => {
                        const isSelected = cellsToFormat.some(
                            ([r, c]) => r === rowIndex && c === colIndex
                        )
                        return isSelected ? newValue : value
                    })
                )
                
                state.alignments = newAlignments
                return
            }

            // Handle style operations (bold/italic/code)
            let styleArray: boolean[][]
            switch (operation) {
                case 'BOLD':
                    styleArray = state.bold
                    break
                case 'ITALIC':
                    styleArray = state.italic
                    break
                case 'CODE':
                    styleArray = state.code
                    break
                default:
                    return
            }

            // Get the current state of the first selected cell to determine the toggle
            const [firstRow, firstCol] = cellsToFormat[0]
            const newValue = !styleArray[firstRow][firstCol]

            // Create a new style array with the updates
            const newStyleArray = styleArray.map((row, rowIndex) => 
                row.map((value, colIndex) => {
                    const isSelected = cellsToFormat.some(
                        ([r, c]) => r === rowIndex && c === colIndex
                    )
                    return isSelected ? newValue : value
                })
            )

            // Update the state with the new style array
            switch (operation) {
                case 'BOLD':
                    state.bold = newStyleArray
                    break
                case 'ITALIC':
                    state.italic = newStyleArray
                    break
                case 'CODE':
                    state.code = newStyleArray
                    break
            }
        }
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
    toggleSelectAll,
    setSelectedCell,
    toggleBold,
    toggleItalic,
    toggleCode,
    setAlignment,
    applyTextFormatting
} = spreadsheetSlice.actions

export const spreadsheetReducer = spreadsheetSlice.reducer