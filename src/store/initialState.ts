import { SpreadsheetState, Alignment } from "../types";

export const initialState = (rows: number, columns: number): SpreadsheetState => ({
    data: Array.from({ length: rows }, () =>
        Array(columns)
            .fill(undefined)
            .map(() => ({
                value: "",
                align: Alignment.LEFT,
                bold: false,
                italic: false,
                code: false,
                link: undefined,
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
