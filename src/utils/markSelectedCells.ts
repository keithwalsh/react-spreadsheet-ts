/**
 * @fileoverview Utility functions for handling cell selection in a spreadsheet grid.
 * Provides functionality to create selection matrices and check if cells are within
 * a selection range.
 */

import { SelectionRange } from "../types";

function isWithinRange({ startRow, startCol, endRow, endCol }: SelectionRange, row: number, col: number): boolean {
    return row >= Math.min(startRow, endRow) && 
           row <= Math.max(startRow, endRow) && 
           col >= Math.min(startCol, endCol) && 
           col <= Math.max(startCol, endCol)
}

export function markSelectedCells(
    numRows: number,
    numCols: number,
    range: SelectionRange
): boolean[][] {
    return Array(numRows).fill(null).map((_, row) =>
        Array(numCols).fill(null).map((_, col) => 
            isWithinRange(range, row, col)
        )
    )
}
