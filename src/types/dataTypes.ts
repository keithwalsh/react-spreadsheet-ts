/**
 * @file src/types/dataTypes.ts
 * @fileoverview Core data structures and state management types for the spreadsheet,
 * including cell data, state shape, and action definitions.
 */

export enum Alignment {
    LEFT = "left",
    CENTER = "center",
    RIGHT = "right"
}

export interface CellData {
    value: string;
    bold: boolean;
    italic: boolean;
    code: boolean;
    align?: Alignment;
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
