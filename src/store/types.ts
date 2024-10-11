export type Alignment = "left" | "center" | "right";

export type State = {
    data: string[][];
    past: [string[][], Alignment[][]][]; // Each element is a tuple of [data, alignments]
    future: [string[][], Alignment[][]][];
    alignments: Alignment[][];
    selectedColumn: number | null;
    selectedRow: number | null;
    selectedCell: { row: number; col: number } | null;
    selectedCells: boolean[][];
    selectAll: boolean;
    isDragging: boolean;
    dragStart: { row: number; col: number } | null;
};

export type Action =
    | { type: "SET_DATA"; payload: string[][] }
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
    | { type: "ADD_COLUMN" }
    | { type: "REMOVE_COLUMN" }
    | { type: "SET_ALIGNMENT"; payload: Alignment }
    | { type: "HANDLE_PASTE"; payload: { newData: string[][]; newAlignments: Alignment[][] } }
    | { type: "START_DRAG"; payload: { row: number; col: number } }
    | { type: "UPDATE_DRAG"; payload: { row: number; col: number } }
    | { type: "END_DRAG" }
    | { type: "SET_TABLE_SIZE"; payload: { row: number; col: number } }
    | { type: "CLEAR_TABLE" }
    | { type: "TRANSPOSE_TABLE" }
    | { type: "APPLY_TEXT_FORMATTING"; payload: { operation: "BOLD" | "ITALIC" | "CODE" } };
