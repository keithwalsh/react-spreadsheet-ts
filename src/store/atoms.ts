/**
 * @fileoverview Jotai atoms for spreadsheet state management. Each spreadsheet instance
 * gets its own isolated state.
 */

import { atom } from "jotai";
import { DataPayload, State } from "../types";
import { initialState } from "./initialState";

// Create the root atom with initial state
export const createSpreadsheetAtom = (rows: number = 4, cols: number = 4) => {
    const state = initialState(rows, cols);
    return atom<State>({
        data: state.data,
        past: [],
        future: [],
        selectedColumn: null,
        selectedRow: null,
        selectedCell: null,
        selectedCells: state.selectedCells,
        selectedRows: [],
        selectedColumns: [],
        selectAll: false,
        isDragging: false,
        dragStart: null,
        dragStartRow: null,
        dragStartColumn: null,
    });
};

// Type for the spreadsheet atom
export type SpreadsheetAtom = ReturnType<typeof createSpreadsheetAtom>;

// Helper functions for state updates
export const updateData = (state: State, payload: DataPayload): State => {
    const hasDataChanged = JSON.stringify(state.data) !== JSON.stringify(payload.data);

    return {
        ...state,
        data: payload.data,
        selectedCell: payload.selectedCell ?? state.selectedCell,
        selectedCells: payload.selectedCells ?? state.selectedCells,
        selectedRows: payload.selectedRows ?? state.selectedRows,
        selectedColumns: payload.selectedColumns ?? state.selectedColumns,
        isDragging: payload.isDragging ?? state.isDragging,
        selectAll: payload.selectAll ?? state.selectAll,
        past: hasDataChanged ? [...state.past, { ...state }] : state.past,
        future: hasDataChanged ? [] : state.future,
    };
};
