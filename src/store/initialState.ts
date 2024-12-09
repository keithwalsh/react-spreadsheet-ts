import { State, CellData } from "../types";

export const initialState = (rows: number, columns: number): State => ({
    data: Array.from({ length: rows }, () => 
        Array(columns).fill(null).map(() => ({
            content: "",
            alignment: "left",
            bold: false,
            italic: false,
            code: false
        } as CellData))
    ),
    past: [],
    future: [],
    selectedColumn: null,
    selectedRow: null,
    selectedCell: null,
    selectedCells: Array.from({ length: rows }, () => Array(columns).fill(false)),
    selectedRows: [],
    selectAll: false,
    isDragging: false,
    dragStart: null,
    dragStartRow: null,
    dragStartColumn: null,
    selectedColumns: [],
});
