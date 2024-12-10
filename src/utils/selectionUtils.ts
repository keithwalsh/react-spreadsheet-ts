/**
 * @fileoverview Selection state utility functions for the spreadsheet component
 */

import { SelectionRange, State } from '../types/index'
import { CellData } from '../types/index'
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
    const startRow = state.selectedCell?.row ?? 0;
    const startCol = state.selectedCell?.col ?? 0;
    return (
        state.selectAll ||
        (state.selectedColumns.includes(colIndex)) ||
        (state.selectedRows.includes(rowIndex)) ||
        (rowIndex === startRow && 
            colIndex === startCol) ||
        state.selectedCells[rowIndex][colIndex]
    )
} 