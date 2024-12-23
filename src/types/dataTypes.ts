/**
 * @file src/types/dataTypes.ts
 * @fileoverview Core data structures and state management types for the spreadsheet,
 * including cell data, state shape, and action definitions.
 */

/** Options for adding rows or columns with direction-specific positions */
export type AddStructureOptions =
  TableStructureModification &
  (
    | {
        position: InsertPosition.ROW_ABOVE | InsertPosition.ROW_BELOW;
        direction: SpreadsheetDirection.ROW;
      }
    | {
        position: InsertPosition.COL_LEFT | InsertPosition.COL_RIGHT;
        direction: SpreadsheetDirection.COLUMN;
      }
  );

/** Adjacent range identified by upper left and lower right cell references */
export type AdjacentRange = {
    startCoordinate: CellCoordinate;
    endCoordinate: CellCoordinate;
};

/** Enum for cell alignment options */
export enum Alignment {
    LEFT = "LEFT",
    CENTER = "CENTER",
    RIGHT = "RIGHT"
}

/** Type for column operations */
export type ColumnOperation = (options: AddStructureOptions) => OperationResult;

/** Represents a cell's coordinates */
export interface CellCoordinate {
    rowIndex: number;
    colIndex: number;
}

/** Interface for cell data structure */
export interface CellData {
    value: string;
    align?: Alignment;
    link?: string;
    style: TextStyle; 
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

/** Represents the dimensions of the table. */
export type Dimensions = {
    rows: string;
    columns: string;
};

/** Represents the drag state during a selection operation */
export interface DragState {
    isDragging: boolean;
    start: CellCoordinate | null;
}

/** Represents possible positions for adding rows and columns */
export enum InsertPosition {
    COL_LEFT = "COL_LEFT",
    COL_RIGHT = "COL_RIGHT",
    ROW_ABOVE = "ROW_ABOVE",
    ROW_BELOW = "ROW_BELOW"
}

/** Determines whether operations or movements in a spreadsheet should proceed vertically by column or horizontally by row */
export enum SpreadsheetDirection {
    COLUMN = "COLUMN",
    ROW = "ROW"
}

/** Result of a table structure operation */
export type OperationResult = {
    newData: CellData[][];
    newSelectedCells: boolean[][];
};

/** Result of a paste operation, pure data transfer object (DTO) */
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

/** Type for row operations */
export type RowOperation = (options: AddStructureOptions) => OperationResult;

/** Represents different types of selections in the spreadsheet */
export interface SpreadsheetSelection {
    cells: boolean[][];
    rows: number[];
    columns: number[];
    isAllSelected: boolean;
    activeCell: CellCoordinate | null;
    dragState?: DragState;
}

/** Type representing a Jotai atom for spreadsheet state management */
export type SpreadsheetAtom = ReturnType<typeof import("../store/atoms").createSpreadsheetAtom>;

/** Represents the state of the spreadsheet */
export type SpreadsheetState = {
    data: CellData[][];
    past: DataPayload[];
    future: DataPayload[];
    selection: SpreadsheetSelection;
}

/** Represents the dimensions and size adjustment method for the table */
export interface TableDimensions {
    currentRows: number;
    currentCols: number;
    setTableSize: (rows: number, cols: number) => void;
}

/** Payload for setting the table size */
export type TableSizePayload = {
    row: number;
    col: number;
    isInitialSetup?: boolean;
};

/** Base interface for table structure modifications */
export interface TableStructureModification {
    data: CellData[][];
    selectedCells: boolean[][];
    targetIndex: number;
}

/** Payload for adding rows or columns with direction-specific positions */
export type AddStructurePayload = TableStructureModification & (
    | { direction: SpreadsheetDirection.ROW; position: InsertPosition.ROW_ABOVE | InsertPosition.ROW_BELOW }
    | { direction: SpreadsheetDirection.COLUMN; position: InsertPosition.COL_LEFT | InsertPosition.COL_RIGHT }
);

/** Type for structure operations (rows or columns) */
export type StructureOperation = (options: AddStructurePayload) => OperationResult;

/** Represents text formatting styles */
export interface TextStyle {
    bold: boolean;
    italic: boolean;
    code: boolean;
}

/** Enum for text formatting operations */
export enum TextFormatOperation {
    TOGGLE_BOLD = "TOGGLE_BOLD",
    TOGGLE_ITALIC = "TOGGLE_ITALIC",
    TOGGLE_CODE = "TOGGLE_CODE",
    TOGGLE_LINK = "TOGGLE_LINK"
}

/** Represents the UI state for modals and snackbars */
export interface UIState {
    isLinkModalOpen: boolean;
    isSnackbarOpen: boolean;
    snackbarMessage: string;
    handleLinkModalClose: () => void;
    handleSnackbarClose: () => void;
}