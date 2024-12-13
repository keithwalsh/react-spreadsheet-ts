// src/types/dataTypes.ts
/**
 * @fileoverview Core data structures and state management types for the spreadsheet,
 * including cell data, state shape, and action definitions.
 */

export type Action =
    | { type: "SET_DATA"; payload: CellData[][] }
    | { type: "UNDO" }
    | { type: "REDO" }
    | { type: "SET_ALIGNMENTS"; payload: Alignment[][] }
    | { type: "SET_SELECTED_COLUMN"; payload: number | null }
    | { type: "SET_SELECTED_ROW"; payload: number | null }
    | { type: "SET_SELECTED_CELL"; payload: { row: number; col: number } | null }
    | { type: "SET_SELECTED_CELLS"; payload: boolean[][] }
    | { type: "SET_SELECT_ALL"; payload: boolean }
    | { type: "CLEAR_SELECTION" }
    | { type: "ADD_ROW" }
    | { type: "REMOVE_ROW" }
    | { type: "ADD_COLUMN"; payload: { index: number; position: "left" | "right" } }
    | { type: "REMOVE_COLUMN"; payload: { index: number } }
    | { type: "SET_ALIGNMENT"; payload: Alignment }
    | { type: "HANDLE_PASTE"; payload: PasteOperationResult }
    | { type: "START_DRAG"; payload: { row: number; col: number } }
    | { type: "UPDATE_DRAG"; payload: { row: number; col: number } }
    | { type: "END_DRAG" }
    | { type: "START_ROW_DRAG"; payload: number }
    | { type: "UPDATE_ROW_DRAG"; payload: number }
    | { type: "END_ROW_DRAG" }
    | { type: "START_COLUMN_DRAG"; payload: number }
    | { type: "UPDATE_COLUMN_DRAG"; payload: number }
    | { type: "END_COLUMN_DRAG" }
    | { type: "SET_TABLE_SIZE"; payload: { row: number; col: number } }
    | { type: "CLEAR_TABLE" }
    | { type: "TRANSPOSE_TABLE" }
    | { type: "APPLY_TEXT_FORMATTING"; payload: { operation: "BOLD" | "ITALIC" | "CODE" } }
    | { type: "START_ROW_SELECTION"; payload: number }
    | { type: "UPDATE_ROW_SELECTION"; payload: number }
    | { type: "END_ROW_SELECTION" }
    | { type: "START_COLUMN_SELECTION"; payload: number }
    | { type: "UPDATE_COLUMN_SELECTION"; payload: number }
    | { type: "END_COLUMN_SELECTION" };

export type Alignment = "left" | "center" | "right";

export interface CellData {
    value: string;
    bold: boolean;
    italic: boolean;
    code: boolean;
    align?: "left" | "center" | "right";
    link?: string;
}

export type DataPayload = {
    data: CellData[][];
    selectedCell?: { row: number; col: number } | null;
    selectedCells?: boolean[][];
    selectedRows?: number[];
    selectedColumns?: number[];
    isDragging?: boolean;
    selectAll?: boolean;
};

export type Dimensions = {
    rows: string;
    columns: string;
};

export type PasteOperationResult = {
    newData: CellData[][];
    newSelectedCells: boolean[][];
    newAlignments: Alignment[][];
    newBold: boolean[][];
    newItalic: boolean[][];
    newCode: boolean[][];
    dimensions: {
        rows: number;
        cols: number;
    };
};

export type State = {
    data: CellData[][];
    past: DataPayload[];
    future: DataPayload[];
    selectedColumn: number | null;
    selectedRow: number | null;
    selectedCell: { row: number; col: number } | null;
    selectedCells: boolean[][];
    selectedRows: number[];
    selectedColumns: number[];
    selectAll: boolean;
    isDragging: boolean;
    dragStart: { row: number; col: number } | null;
    dragStartRow: number | null;
    dragStartColumn: number | null;
};

export type TextFormattingOperation =
    | { operation: "BOLD" | "ITALIC" | "CODE" | "LINK" | "REMOVE_LINK"; payload?: string }
    | { operation: "ALIGN_LEFT" | "ALIGN_CENTER" | "ALIGN_RIGHT" };

export type TableSizePayload = {
    row: number;
    col: number;
    isInitialSetup?: boolean;
};
