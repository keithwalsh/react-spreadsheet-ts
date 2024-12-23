/**
 * @file src/store/initialState.ts
 * @fileoverview Provides the initial state configuration for spreadsheet instances,
 * including default cell properties and selection states.
 */

import { SpreadsheetState, Alignment } from "../types";

export const initialState = (rows: number, columns: number): SpreadsheetState => ({
    data: Array.from({ length: rows }, () =>
        Array(columns)
            .fill(undefined)
            .map(() => ({
                value: "",
                align: Alignment.LEFT,
                link: undefined,
                style: {
                    bold: false,
                    italic: false,
                    code: false
                }
            }))
    ),
    past: [],
    future: [],
    selection: {
        cells: Array.from({ length: rows }, () => Array(columns).fill(false)),
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
