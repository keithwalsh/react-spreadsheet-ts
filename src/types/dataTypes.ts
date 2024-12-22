/**
 * @file src/types/dataTypes.ts
 * @fileoverview Core data structures and state management types for the spreadsheet,
 * including cell data, state shape, and action definitions.
 */

/** Adjacent range identified by upper left and lower right cell references */
export type AdjacentRange = {
    startCoordinate: CellCoordinate;
    endCoordinate: CellCoordinate;
};


/** Enum for cell alignment options */
export enum Alignment {
    LEFT = "left",
    CENTER = "center",
    RIGHT = "right"
}

/** Represents a cell's coordinates */
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

/** Represents the drag state during a selection operation */
export interface DragState {
    isDragging: boolean;
    start: CellCoordinate | null;
}

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

/** Represents different types of selections in the spreadsheet */
export interface SpreadsheetSelection {
    cells: boolean[][];
    rows: number[];
    columns: number[];
    isAllSelected: boolean;
    activeCell: CellCoordinate | null;
    dragState?: DragState;
}

/** Represents the state of the spreadsheet */
export type SpreadsheetState = {
    data: CellData[][];
    past: DataPayload[];
    future: DataPayload[];
    selection: SpreadsheetSelection;
}