/**
 * @file src/utils/selectionUtils.ts
 * @fileoverview Provides utility functions for managing selection state in the spreadsheet component.
 */

import { CellCoordinate, CellData, SpreadsheetState } from "../types";

export function isCellInSelection({ state, rowIndex, colIndex }: { state: SpreadsheetState; rowIndex: number; colIndex: number }): boolean {
    return (
        state.selection.isAllSelected ||
        (state.selection.activeCell?.rowIndex === rowIndex && state.selection.activeCell?.colIndex === colIndex) ||
        state.selection.cells[rowIndex]?.[colIndex] ||
        state.selection.columns.includes(colIndex) ||
        state.selection.rows.includes(rowIndex)
    );
}

export function createNewSelectionState(
    data: CellData[][],
    coordinate: CellCoordinate
): boolean[][] {
    return data.map((row, rowIdx) =>
        row.map((_, colIdx) =>
            rowIdx === coordinate.rowIndex && colIdx === coordinate.colIndex
        )
    );
}
