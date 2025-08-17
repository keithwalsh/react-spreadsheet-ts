/**
 * @file src/store/atoms.ts
 * @fileoverview Defines Jotai atoms for managing the state of spreadsheet instances,
 * ensuring each instance maintains its own isolated state.
 */

import { atom } from "jotai";
import { SpreadsheetState, SelectionType } from "../types";
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
            type: SelectionType.NONE,
            dragState: {
                isDragging: false,
                start: null
            }
        }
    });
};


