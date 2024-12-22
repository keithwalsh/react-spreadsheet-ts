// src/types/interactionTypes.ts
/**
 * @fileoverview Types related to user interactions, selection states, and event
 * handling within the spreadsheet.
 */

import { PrimitiveAtom } from "jotai";
import { Alignment, CellData, PasteOperationResult, SpreadsheetState } from "./dataTypes";
import type { MenuDirection } from "./propTypes";
import { PopoverOrigin, TextFieldProps } from "@mui/material";
import { ArrowForward } from "@mui/icons-material";
import { ArrowBack } from "@mui/icons-material";
import { ArrowDownward } from "@mui/icons-material";
import { ArrowUpward } from "@mui/icons-material";

/** Represents actions for spreadsheet state management. */
export type Action =
    | { type: "SET_DATA"; payload: CellData[][] }
    | { type: "UNDO" }
    | { type: "REDO" }
    | { type: "SET_ALIGNMENTS"; payload: Alignment[][] }
    | { type: "SET_SELECTED_COLUMN"; payload: number | null }
    | { type: "SET_SELECTED_ROW"; payload: number | null }
    | { type: "SET_SELECTED_CELL"; payload: { row: number; col: number } | null }
    | { type: "SET_SELECTED_CELLS"; payload: boolean[][] }
    | { type: "SET_SELECT_ALL"; payload: boolean }
    | { type: "CLEAR_SELECTION" }
    | { type: "ADD_ROW" }
    | { type: "REMOVE_ROW" }
    | { type: "ADD_COLUMN"; payload: { index: number; position: "left" | "right" } }
    | { type: "REMOVE_COLUMN"; payload: { index: number } }
    | { type: "SET_ALIGNMENT"; payload: Alignment }
    | { type: "HANDLE_PASTE"; payload: PasteOperationResult }
    | { type: "START_DRAG"; payload: { row: number; col: number } }
    | { type: "UPDATE_DRAG"; payload: { row: number; col: number } }
    | { type: "END_DRAG" }
    | { type: "START_ROW_DRAG"; payload: number }
    | { type: "UPDATE_ROW_DRAG"; payload: number }
    | { type: "END_ROW_DRAG" }
    | { type: "START_COLUMN_DRAG"; payload: number }
    | { type: "UPDATE_COLUMN_DRAG"; payload: number }
    | { type: "END_COLUMN_DRAG" }
    | { type: "SET_TABLE_SIZE"; payload: { row: number; col: number } }
    | { type: "CLEAR_TABLE" }
    | { type: "TRANSPOSE_TABLE" }
    | { type: "APPLY_TEXT_FORMATTING"; payload: { operation: "BOLD" | "ITALIC" | "CODE" } }
    | { type: "START_ROW_SELECTION"; payload: number }
    | { type: "UPDATE_ROW_SELECTION"; payload: number }
    | { type: "END_ROW_SELECTION" }
    | { type: "START_COLUMN_SELECTION"; payload: number }
    | { type: "UPDATE_COLUMN_SELECTION"; payload: number }
    | { type: "END_COLUMN_SELECTION" };
    
export interface AddColumnOptions extends TableStructureModification {
    position: "left" | "right";
}

export interface AddRowOptions extends TableStructureModification {
    position: "above" | "below";
}

export interface ButtonHandlerKey {
    [key: string]: () => void;
}

/** Handlers for drag events in the spreadsheet. */
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

export type Handler = HandlerMap[HandlerKey] | string | number | boolean | PrimitiveAtom<SpreadsheetState>;

export interface MenuPositionConfig {
    anchorOrigin: PopoverOrigin;
    transformOrigin: PopoverOrigin;
    beforeIcon: typeof ArrowUpward | typeof ArrowBack;
    afterIcon: typeof ArrowDownward | typeof ArrowForward;
    beforeText: string;
    afterText: string;
}

export interface SizeInputProps extends Omit<TextFieldProps, 'onChange'> {
    label: 'Rows' | 'Columns';
    type: 'rows' | 'cols';
    value: string;
    onChange: (type: 'rows' | 'cols', value: string) => void;
    max: number;
}

export interface TableStructureModification {
    data: CellData[][];
    selectedCells: boolean[][];
    index: number;
}

export interface ToolbarContextType {
    spreadsheetAtom: PrimitiveAtom<SpreadsheetState>;
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
    handleUndo: () => void;
    handleRedo: () => void;
}

export type TextFormattingOperation =
    | { operation: "BOLD" | "ITALIC" | "CODE" | "LINK" | "REMOVE_LINK"; payload?: string }
    | { operation: "ALIGN_LEFT" | "ALIGN_CENTER" | "ALIGN_RIGHT" };
    
export type DirectionalMenuActions<T extends MenuDirection> = T extends "row"
    ? {
          onAddAbove: () => void;
          onAddBelow: () => void;
          onRemove: () => void;
      }
    : {
          onAddLeft: () => void;
          onAddRight: () => void;
          onRemove: () => void;
      };
