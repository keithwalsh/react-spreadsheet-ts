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

/** Represents a selected cell with row and column indices */
export interface CellCoordinate {
    row: number;
    col: number;
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
    activeCell?: CellCoordinate | null;
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


/** Represents a range of selected cells */
export type SelectionRange = {
    startCoordinate: CellCoordinate;
    endCoordinate: CellCoordinate;
};

/** Represents the state of the spreadsheet */
export type State = {
    data: CellData[][];
    past: DataPayload[];
    future: DataPayload[];
    selectedColumn: number | null;
    selectedRow: number | null;
    selectedCell: CellCoordinate | null;
    selectedCells: boolean[][];
    selectedRows: number[];
    selectedColumns: number[];
    selectAll: boolean;
    isDragging: boolean;
    dragStart: CellCoordinate | null;
    dragStartRow: number | null;
    dragStartColumn: number | null;
};
