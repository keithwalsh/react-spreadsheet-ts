/**
 * @file src/utils/selectionUtils.ts
 * @fileoverview Provides utility functions for managing selection state in the spreadsheet component.
 */

import { AdjacentRange, CellCoordinate, CellData, SpreadsheetState } from "../types";
import { markSelectedCells } from "./markSelectedCells";

export function createSelectionMatrix({ data, selection }: { data: CellData[][]; selection: AdjacentRange }): boolean[][] {
    return markSelectedCells(data.length, data[0].length, selection);
}

export function isCellInSelection({ state, rowIndex, colIndex }: { state: SpreadsheetState; rowIndex: number; colIndex: number }): boolean {
    return (
        state.selection.isAllSelected ||
        (state.selection.activeCell?.rowIndex === rowIndex && state.selection.activeCell?.colIndex === colIndex) ||
        state.selection.cells[rowIndex]?.[colIndex] ||
        state.selection.columns.includes(colIndex) ||
        state.selection.rows.includes(rowIndex)
    );
}

export function isCellSelected({ state, rowIndex, colIndex }: { state: SpreadsheetState; rowIndex: number; colIndex: number }): boolean {
    return isCellInSelection({ state, rowIndex, colIndex });
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
