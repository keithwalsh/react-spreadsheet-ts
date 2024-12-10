import { atom } from "jotai";
import { State } from "../types";
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
