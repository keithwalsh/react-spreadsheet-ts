/**
 * @file src/utils/selectionUtils.ts
 * @fileoverview Provides utility functions for managing selection state in the spreadsheet component.
 */

import { AdjacentRange, SpreadsheetState } from "../types/index";
import { CellData } from "../types/index";
import { markSelectedCells } from "./markSelectedCells";

export function createSelectionMatrix({ data, selection }: { data: CellData[][]; selection: AdjacentRange }): boolean[][] {
    return markSelectedCells(data.length, data[0].length, selection);
}

export function isCellInSelection({ state, rowIndex, colIndex }: { state: SpreadsheetState; rowIndex: number; colIndex: number }): boolean {
    return (
        state.selection.isAllSelected ||
        (state.selection.activeCell?.row === rowIndex && state.selection.activeCell?.col === colIndex) ||
        state.selection.cells[rowIndex]?.[colIndex] ||
        state.selection.columns.includes(colIndex) ||
        state.selection.rows.includes(rowIndex)
    );
}

export function isCellSelected({ state, rowIndex, colIndex }: { state: SpreadsheetState; rowIndex: number; colIndex: number }): boolean {
    return isCellInSelection({ state, rowIndex, colIndex });
}

export function createNewSelectionState(data: CellData[][], result: { row: number; col: number }): boolean[][] {
    const newSelectedCells = data.map((row) => row.map(() => false));
    newSelectedCells[result.row][result.col] = true;
    return newSelectedCells;
}
