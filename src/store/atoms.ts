/**
 * @fileoverview Jotai atoms for spreadsheet state management. Each spreadsheet instance
 * gets its own isolated state.
 */

import { atom } from "jotai";
import { State, CellData } from "../types/index";
import { initialState } from "./initialState";

// Create the main spreadsheet atom with initial state
export const createSpreadsheetAtom = (rows: number = 4, cols: number = 4) => {
    const baseState = initialState(rows, cols);
    return atom(baseState);
};

// Helper functions for state updates
export const updateData = (
    state: State,
    {
        data,
        selectedCell = state.selectedCell,
        selectedCells = state.selectedCells,
        selectedRows = state.selectedRows,
        selectedColumns = state.selectedColumns,
        isDragging = state.isDragging,
        selectAll = state.selectAll,
    }: {
        data: CellData[][];
        selectedCell?: { row: number; col: number } | null;
        selectedCells?: boolean[][];
        selectedRows?: number[];
        selectedColumns?: number[];
        isDragging?: boolean;
        selectAll?: boolean;
    }
): State => {
    const hasDataChanged = JSON.stringify(state.data) !== JSON.stringify(data);

    return {
        ...state,
        data,
        selectedCell,
        selectedCells,
        selectedRows,
        selectedColumns,
        isDragging,
        selectAll,
        past: hasDataChanged ? [...state.past, { ...state }] : state.past,
        future: hasDataChanged ? [] : state.future,
    };
};
