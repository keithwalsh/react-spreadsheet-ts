/**
 * @file src/types/dataTypes.ts
 * @fileoverview Core data structures and state management types for the spreadsheet,
 * including cell data, state shape, and action definitions.
 */

/** Enum for cell alignment options */
export enum Alignment {
    LEFT = "left",
    CENTER = "center",
    RIGHT = "right"
}

/** Interface for cell data structure */
export interface CellData {
    value: string;
    bold: boolean;
    italic: boolean;
    code: boolean;
    align?: Alignment;
    link?: string;
}

/** Payload structure for data-related actions */
export type DataPayload = {
    data: CellData[][];
    activeCell?: { row: number; col: number } | null;
    selectedCells?: boolean[][];
    selectedRows?: number[];
    selectedColumns?: number[];
    isDragging?: boolean;
    isAllSelected?: boolean;
};

/** Result of a paste operation */
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

/** Represents a selected cell with row and column indices */
export interface SelectedCell {
    row: number;
    col: number;
}

/** Represents a matrix of selected cells */
export type SelectedCells = Record<number, Record<number, boolean>>;

/** Represents a range of selected cells */
export type SelectionRange = {
    startRow: number;
    startCol: number;
    endRow: number;
    endCol: number;
};

/** Represents the state of the spreadsheet */
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
