/**
 * @fileoverview Selection state utility functions for determining if a cell is selected
 * based on various selection modes (all, column, row, individual cell, or cell range)
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