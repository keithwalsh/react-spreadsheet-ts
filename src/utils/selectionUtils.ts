/**
 * @fileoverview Selection state utility functions for the spreadsheet component
 */

import { SelectionRange, State, CellData } from '../types'
import { markSelectedCells } from './markSelectedCells'

export function createSelectionMatrix({
    data,
    selection
}: {
    data: CellData[][]
    selection: SelectionRange
}): boolean[][] {
    return markSelectedCells(
        data.length,
        data[0].length,
        selection
    )
}

export function isCellSelected({ 
    state, 
    rowIndex, 
    colIndex 
}: {
    state: State
    rowIndex: number
    colIndex: number
}): boolean {
    return (
        state.selectAll ||
        (state.selectedColumns.includes(colIndex)) ||
        (state.selectedRows.includes(rowIndex)) ||
        (state.selectedCell !== null && 
            rowIndex === state.selectedCell.row && 
            colIndex === state.selectedCell.col) ||
        state.selectedCells[rowIndex][colIndex]
    )
} 