/**
 * @fileoverview Redux slice for spreadsheet state management. Handles all spreadsheet
 * operations including cell selection, data manipulation, and formatting.
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { initialState } from './initialState'
import { State, DataPayload, CellData } from '../types'

type TableSizePayload = {
    row: number
    col: number
}

const spreadsheetSlice = createSlice({
    name: 'spreadsheet',
    initialState: {
        ...initialState(4, 4), // Default to minimum size, will be updated by component
        selectedColumns: [] as number[],
        past: [] as DataPayload[],
        future: [] as DataPayload[]
    } as State,
    reducers: {
        setData: (state, action: PayloadAction<DataPayload>) => {
            const { 
                data,
                selectedCell,
                selectedCells,
                selectedRows,
                selectedColumns,
                isDragging,
                selectAll
            } = action.payload

            // Only save state if data actually changed
            if (JSON.stringify(state.data) !== JSON.stringify(data)) {
                state.past.push({
                    data: state.data,
                    selectedCell: state.selectedCell,
                    selectedCells: state.selectedCells,
                    selectedRows: state.selectedRows,
                    selectedColumns: state.selectedColumns,
                    isDragging: state.isDragging,
                    selectAll: state.selectAll
                })
                state.future = []
            }

            state.data = data
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
                
                // Update selectedCells matrix to reflect row selection
                state.selectedCells = state.selectedCells.map((rowCells, rowIndex) => 
                    rowCells.map(() => state.selectedRows.includes(rowIndex))
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
                
                // Update selectedCells matrix to reflect column selection
                state.selectedCells = state.selectedCells.map(rowCells => 
                    rowCells.map((_, colIndex) => state.selectedColumns.includes(colIndex))
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

        setTableSize: (state, action: PayloadAction<TableSizePayload & { isInitialSetup?: boolean }>) => {
            const { row, col, isInitialSetup } = action.payload
            const newData: CellData[][] = Array.from({ length: row }, () =>
                Array(col).fill(null).map(() => ({
                    content: "",
                    alignment: "left",
                    bold: false,
                    italic: false,
                    code: false
                }))
            )

            // Copy existing data
            for (let i = 0; i < Math.min(state.data.length, row); i++) {
                for (let j = 0; j < Math.min(state.data[0].length, col); j++) {
                    newData[i][j] = { ...state.data[i][j] }
                }
            }

            state.data = newData
            state.selectedCells = Array.from({ length: row }, () => Array(col).fill(false))
            
            if (!isInitialSetup) {
                state.past.push({
                    data: state.data,
                    selectedCell: state.selectedCell,
                    selectedCells: state.selectedCells,
                    selectedRows: state.selectedRows,
                    selectedColumns: state.selectedColumns,
                    isDragging: state.isDragging,
                    selectAll: state.selectAll
                })
            }
        },

        clearTable: (state) => {
            const rows = state.data.length
            const cols = state.data[0].length

            state.past.push({
                data: state.data,
                selectedCell: state.selectedCell,
                selectedCells: state.selectedCells,
                selectedRows: state.selectedRows,
                selectedColumns: state.selectedColumns,
                isDragging: state.isDragging,
                selectAll: state.selectAll
            })

            state.data = Array.from({ length: rows }, () =>
                Array(cols).fill(null).map(() => ({
                    content: "",
                    alignment: "left",
                    bold: false,
                    italic: false,
                    code: false
                }))
            )

            state.selectedCell = null
            state.selectedCells = Array.from({ length: rows }, () => Array(cols).fill(false))
            state.selectedRows = []
            state.selectedColumns = []
            state.selectAll = false
            state.future = []
        },

        transposeTable: (state) => {
            const rows = state.data[0].length;
            const cols = state.data.length;
            const newData: CellData[][] = Array.from({ length: rows }, () =>
                Array(cols).fill(null).map(() => ({
                    content: "",
                    alignment: "left",
                    bold: false,
                    italic: false,
                    code: false
                }))
            );

            // Transpose the data
            for (let i = 0; i < rows; i++) {
                for (let j = 0; j < cols; j++) {
                    newData[i][j] = { ...state.data[j][i] };
                }
            }

            state.past.push({
                data: state.data,
                selectedCell: state.selectedCell,
                selectedCells: state.selectedCells,
                selectedRows: state.selectedRows,
                selectedColumns: state.selectedColumns,
                isDragging: state.isDragging,
                selectAll: state.selectAll
            })

            state.data = newData
            state.selectedCell = null
            state.selectedCells = Array.from({ length: rows }, () => Array(cols).fill(false))
            state.selectedRows = []
            state.selectedColumns = []
            state.selectAll = false
            state.future = []
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
                const colCount = state.data[0].length
                state.selectedRows = Array.from({ length: rowCount }, (_, i) => i)
                state.selectedColumns = Array.from({ length: colCount }, (_, i) => i)
            } else {
                state.selectedRows = []
                state.selectedColumns = []
            }
        },

        applyTextFormatting: (state, action: PayloadAction<{ operation: 'BOLD' | 'ITALIC' | 'CODE' | 'ALIGN_LEFT' | 'ALIGN_CENTER' | 'ALIGN_RIGHT' }>) => {
            const { operation } = action.payload;
            let modified = false;

            const newData = state.data.map((row, i) =>
                row.map((cell, j) => {
                    if (state.selectedCells[i][j] || 
                        (state.selectedCell && state.selectedCell.row === i && state.selectedCell.col === j) ||
                        state.selectedRows.includes(i) ||
                        state.selectedColumns.includes(j) ||
                        state.selectAll) {
                        modified = true;
                        const newCell = { ...cell };
                        switch (operation) {
                            case 'BOLD':
                                newCell.bold = !cell.bold;
                                break;
                            case 'ITALIC':
                                newCell.italic = !cell.italic;
                                break;
                            case 'CODE':
                                newCell.code = !cell.code;
                                break;
                            case 'ALIGN_LEFT':
                                newCell.alignment = 'left';
                                break;
                            case 'ALIGN_CENTER':
                                newCell.alignment = 'center';
                                break;
                            case 'ALIGN_RIGHT':
                                newCell.alignment = 'right';
                                break;
                        }
                        return newCell;
                    }
                    return cell;
                })
            );

            if (modified) {
                state.past.push({
                    data: state.data,
                    selectedCell: state.selectedCell,
                    selectedCells: state.selectedCells,
                    selectedRows: state.selectedRows,
                    selectedColumns: state.selectedColumns,
                    isDragging: state.isDragging,
                    selectAll: state.selectAll
                });
                state.data = newData;
                state.future = [];
            }
        },

        undo: (state) => {
            if (state.past.length > 0) {
                const previous = state.past[state.past.length - 1]
                state.future.push({
                    data: state.data,
                    selectedCell: state.selectedCell,
                    selectedCells: state.selectedCells,
                    selectedRows: state.selectedRows,
                    selectedColumns: state.selectedColumns,
                    isDragging: state.isDragging,
                    selectAll: state.selectAll
                })

                state.data = previous.data
                if (previous.selectedCell !== undefined) state.selectedCell = previous.selectedCell
                if (previous.selectedCells !== undefined) state.selectedCells = previous.selectedCells
                if (previous.selectedRows !== undefined) state.selectedRows = previous.selectedRows
                if (previous.selectedColumns !== undefined) state.selectedColumns = previous.selectedColumns
                if (previous.isDragging !== undefined) state.isDragging = previous.isDragging
                if (previous.selectAll !== undefined) state.selectAll = previous.selectAll

                state.past.pop()
            }
        },

        redo: (state) => {
            if (state.future.length > 0) {
                const next = state.future[state.future.length - 1]
                state.past.push({
                    data: state.data,
                    selectedCell: state.selectedCell,
                    selectedCells: state.selectedCells,
                    selectedRows: state.selectedRows,
                    selectedColumns: state.selectedColumns,
                    isDragging: state.isDragging,
                    selectAll: state.selectAll
                })

                state.data = next.data
                if (next.selectedCell !== undefined) state.selectedCell = next.selectedCell
                if (next.selectedCells !== undefined) state.selectedCells = next.selectedCells
                if (next.selectedRows !== undefined) state.selectedRows = next.selectedRows
                if (next.selectedColumns !== undefined) state.selectedColumns = next.selectedColumns
                if (next.isDragging !== undefined) state.isDragging = next.isDragging
                if (next.selectAll !== undefined) state.selectAll = next.selectAll

                state.future.pop()
            }
        },
        
        clearSelected: (state) => {
            // Save current state before clearing
            state.past.push({
                data: state.data,
                selectedCell: state.selectedCell,
                selectedCells: state.selectedCells,
                selectedRows: state.selectedRows,
                selectedColumns: state.selectedColumns,
                isDragging: state.isDragging,
                selectAll: state.selectAll
            });

            // Clear selected cells
            state.selectedCells = Array.from(
                { length: state.data.length }, 
                () => Array(state.data[0].length).fill(false)
            );
            state.selectedCell = null;
            state.selectedRows = [];
            state.selectedColumns = [];
            state.selectAll = false;
            state.future = [];
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
    clearSelected,
    transposeTable,
    setSelectedCell,
    setSelectedColumn,
    toggleSelectAll,
    applyTextFormatting,
    undo,
    redo
} = spreadsheetSlice.actions

export const spreadsheetReducer = spreadsheetSlice.reducer