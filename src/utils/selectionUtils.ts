/**
 * @fileoverview Selection state utility functions for the spreadsheet component
 */

import { SelectionRange, State } from "../types/index";
import { CellData } from "../types/index";
import { markSelectedCells } from "./markSelectedCells";

export function createSelectionMatrix({ data, selection }: { data: CellData[][]; selection: SelectionRange }): boolean[][] {
    return markSelectedCells(data.length, data[0].length, selection);
}

export function isCellInSelection({ state, rowIndex, colIndex }: { state: State; rowIndex: number; colIndex: number }): boolean {
    return (
        state.selectAll ||
        (state.selectedCell?.row === rowIndex && state.selectedCell?.col === colIndex) ||
        state.selectedCells[rowIndex]?.[colIndex] ||
        state.selectedColumns.includes(colIndex) ||
        state.selectedRows.includes(rowIndex)
    );
}

export function isCellSelected({ state, rowIndex, colIndex }: { state: State; rowIndex: number; colIndex: number }): boolean {
    return isCellInSelection({ state, rowIndex, colIndex });
}

export function createNewSelectionState(data: CellData[][], result: { row: number; col: number }): boolean[][] {
    const newSelectedCells = data.map((row) => row.map(() => false));
    newSelectedCells[result.row][result.col] = true;
    return newSelectedCells;
}
