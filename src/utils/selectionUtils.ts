/**
 * @fileoverview Selection state utility functions for the spreadsheet component
 */

import { State } from '../types'

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