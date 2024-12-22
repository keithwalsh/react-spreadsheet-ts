/**
 * @fileoverview Jotai atoms for spreadsheet state management. Each spreadsheet instance
 * gets its own isolated state.
 */

import { atom } from "jotai";
import { DataPayload, SpreadsheetState } from "../types";
import { initialState } from "./initialState";

// Create the root atom with initial state
export const createSpreadsheetAtom = (rows: number = 4, cols: number = 4) => {
    const state = initialState(rows, cols);
    return atom<SpreadsheetState>({
        data: state.data,
        past: [],
        future: [],
        selection: {
            cells: state.selection.cells,
            rows: [],
            columns: [],
            isAllSelected: false,
            activeCell: null,
            dragState: {
                isDragging: false,
                start: null
            }
        }
    });
};

// Type for the spreadsheet atom
export type SpreadsheetAtom = ReturnType<typeof createSpreadsheetAtom>;

// Helper functions for state updates
export const updateData = (state: SpreadsheetState, payload: DataPayload): SpreadsheetState => {
    const hasDataChanged = JSON.stringify(state.data) !== JSON.stringify(payload.data);

    return {
        ...state,
        data: payload.data,
        selection: {
            ...state.selection,
            activeCell: payload.activeCell ?? state.selection.activeCell,
            cells: payload.selectedCells ?? state.selection.cells,
            rows: payload.selectedRows ?? state.selection.rows,
            columns: payload.selectedColumns ?? state.selection.columns,
            isAllSelected: payload.isAllSelected ?? state.selection.isAllSelected,
            dragState: {
                isDragging: payload.isDragging ?? state.selection.dragState?.isDragging ?? false,
                start: state.selection.dragState?.start ?? null
            }
        },
        past: hasDataChanged ? [...state.past, { ...state }] : state.past,
        future: hasDataChanged ? [] : state.future,
    };
};
