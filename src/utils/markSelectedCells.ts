/**
 * @file src/utils/markSelectedCells.ts
 * @fileoverview Provides utility functions for handling cell selection in a spreadsheet grid.
 * Includes functionality to create selection matrices and check if cells are within a selection range.
 */

import { AdjacentRange } from "../types/index";

function isWithinRange({ startCoordinate, endCoordinate }: AdjacentRange, row: number, col: number): boolean {
    return row >= Math.min(startCoordinate.rowIndex, endCoordinate.rowIndex) && 
           row <= Math.max(startCoordinate.rowIndex, endCoordinate.rowIndex) && 
           col >= Math.min(startCoordinate.colIndex, endCoordinate.colIndex) && 
           col <= Math.max(startCoordinate.colIndex, endCoordinate.colIndex)
}

export function markSelectedCells(
    numRows: number,
    numCols: number,
    range: AdjacentRange
): boolean[][] {
    return Array(numRows).fill(null).map((_, row) =>
        Array(numCols).fill(null).map((_, col) => 
            isWithinRange(range, row, col)
        )
    )
}
