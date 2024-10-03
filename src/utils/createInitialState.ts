import { State } from "@types";

export const createInitialState = (rows: number, columns: number): State => ({
    data: Array.from({ length: rows }, () => Array(columns).fill("")),
    alignments: Array.from({ length: rows }, () => Array(columns).fill("left")),
    past: [],
    future: [],
    selectedColumn: null,
    selectedRow: null,
    selectedCell: null,
    selectedCells: Array.from({ length: rows }, () => Array(columns).fill(false)),
    selectAll: false,
});
