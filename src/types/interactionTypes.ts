// src/types/interactionTypes.ts
/**
 * @fileoverview Types related to user interactions, selection states, and event
 * handling within the spreadsheet.
 */

import { PrimitiveAtom } from "jotai";
import { CellData, State } from "./dataTypes";

export interface AddColumnOptions {
    data: CellData[][];
    selectedCells: boolean[][];
    index: number;
    position: "left" | "right";
}

export interface AddRowOptions {
    data: CellData[][];
    selectedCells: boolean[][];
    index: number;
    position: "above" | "below";
}

export type ButtonAction =
    | "onFormatBold"
    | "onFormatItalic"
    | "onFormatCode"
    | "onAlignLeft"
    | "onAlignCenter"
    | "onAlignRight"
    | "onCut"
    | "onCopy"
    | "onPaste"
    | "onDelete"
    | "onUndo"
    | "onRedo"
    | "onAddRow"
    | "onRemoveRow"
    | "onAddColumn"
    | "onRemoveColumn"
    | "onDownloadCSV";

export interface ButtonHandlerKey {
    [key: string]: () => void;
}

export type ButtonId =
    | "bold"
    | "italic"
    | "code"
    | "alignLeft"
    | "alignCenter"
    | "alignRight"
    | "cut"
    | "copy"
    | "paste"
    | "delete"
    | "undo"
    | "redo"
    | "addRow"
    | "removeRow"
    | "addColumn"
    | "removeColumn"
    | "downloadCSV";

export interface DragHandlers {
    onDragStart: (colIndex: number) => void;
    onDragEnter: (colIndex: number) => void;
    onDragEnd: () => void;
}

export type HandlerKey = "onClickAddRow" | "onClickAddColumn";

export type HandlerMap = {
    onClickAddRow: (position: "above" | "below") => void;
    onClickAddColumn: (position: "left" | "right") => void;
};

export type Handler = HandlerMap[HandlerKey] | string | number | boolean | PrimitiveAtom<State>;

export interface SelectedCell {
    row: number;
    col: number;
}

export interface ToolbarContextType {
    spreadsheetAtom: PrimitiveAtom<State>;
    onClickUndo: () => void;
    onClickRedo: () => void;
    onClickAlignLeft: () => void;
    onClickAlignCenter: () => void;
    onClickAlignRight: () => void;
    onClickAddRow: (position: "above" | "below") => void;
    onClickRemoveRow: () => void;
    onClickAddColumn: (position: "left" | "right") => void;
    onClickRemoveColumn: () => void;
    onClickSetBold: () => void;
    onClickSetItalic: () => void;
    onClickSetCode: () => void;
    onClickSetLink: () => void;
    setTableSize: (rows: number, cols: number) => void;
    currentRows: number;
    currentCols: number;
    clearTable: () => void;
    deleteSelected: () => void;
    transposeTable: () => void;
    handleLinkModalClose: () => void;
    handleSnackbarClose: () => void;
    isLinkModalOpen: boolean;
    isSnackbarOpen: boolean;
    snackbarMessage: string;
}

export type SelectedCells = Record<number, Record<number, boolean>>;

export type SelectionRange = {
    startRow: number;
    startCol: number;
    endRow: number;
    endCol: number;
};
