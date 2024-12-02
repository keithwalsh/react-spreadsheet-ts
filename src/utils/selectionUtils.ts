/**
 * @fileoverview Selection state utility functions for the spreadsheet component
 */

import { SelectionRange, State } from '../types'
import { markSelectedCells } from './markSelectedCells'

export function createSelectionMatrix({
    data,
    selection
}: {
    data: string[][]
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
        (state.selectedColumn !== null && colIndex === state.selectedColumn) ||
        (state.selectedRow !== null && rowIndex === state.selectedRow) ||
        (state.selectedCell !== null && 
            rowIndex === state.selectedCell.row && 
            colIndex === state.selectedCell.col) ||
        state.selectedCells[rowIndex][colIndex]
    )
} 