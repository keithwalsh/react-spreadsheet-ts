import { State } from "../types";

export const initialState = (rows: number, columns: number): State => ({
    data: Array.from({ length: rows }, () =>
        Array(columns)
            .fill(undefined)
            .map(() => ({
                value: "",
                align: "left" as const,
                bold: false,
                italic: false,
                code: false,
                link: undefined,
            }))
    ),
    past: [],
    future: [],
    selectedCell: null,
    selectedColumn: null,
    selectedRow: null,
    selectedCells: Array.from({ length: rows }, () => Array(columns).fill(false)),
    selectedRows: [],
    selectedColumns: [],
    selectAll: false,
    isDragging: false,
    dragStart: null,
    dragStartRow: null,
    dragStartColumn: null,
});
