/**
 * @file src/types/interactionTypes.ts
 * @fileoverview Types related to user interactions, selection states, and event handling within the spreadsheet.
 */

import { PrimitiveAtom } from "jotai";
import { Alignment, CellData, PasteOperationResult, SpreadsheetState, TableStructureModification } from "./dataTypes";

/** Action types for spreadsheet operations */
export enum ActionType {
    SET_DATA = "SET_DATA",
    UNDO = "UNDO",
    REDO = "REDO",
    SET_ALIGNMENTS = "SET_ALIGNMENTS",
    SET_SELECTED_COLUMN = "SET_SELECTED_COLUMN",
    SET_SELECTED_ROW = "SET_SELECTED_ROW",
    SET_SELECTED_CELL = "SET_SELECTED_CELL",
    SET_SELECTED_CELLS = "SET_SELECTED_CELLS",
    SET_SELECT_ALL = "SET_SELECT_ALL",
    CLEAR_SELECTION = "CLEAR_SELECTION",
    ADD_ROW = "ADD_ROW",
    REMOVE_ROW = "REMOVE_ROW",
    ADD_COLUMN = "ADD_COLUMN",
    REMOVE_COLUMN = "REMOVE_COLUMN",
    SET_ALIGNMENT = "SET_ALIGNMENT",
    HANDLE_PASTE = "HANDLE_PASTE",
    START_DRAG = "START_DRAG",
    UPDATE_DRAG = "UPDATE_DRAG",
    END_DRAG = "END_DRAG",
    START_ROW_DRAG = "START_ROW_DRAG",
    UPDATE_ROW_DRAG = "UPDATE_ROW_DRAG",
    END_ROW_DRAG = "END_ROW_DRAG",
    START_COLUMN_DRAG = "START_COLUMN_DRAG",
    UPDATE_COLUMN_DRAG = "UPDATE_COLUMN_DRAG",
    END_COLUMN_DRAG = "END_COLUMN_DRAG",
    SET_TABLE_SIZE = "SET_TABLE_SIZE",
    CLEAR_TABLE = "CLEAR_TABLE",
    TRANSPOSE_TABLE = "TRANSPOSE_TABLE",
    APPLY_TEXT_FORMATTING = "APPLY_TEXT_FORMATTING",
    START_ROW_SELECTION = "START_ROW_SELECTION",
    UPDATE_ROW_SELECTION = "UPDATE_ROW_SELECTION",
    END_ROW_SELECTION = "END_ROW_SELECTION",
    START_COLUMN_SELECTION = "START_COLUMN_SELECTION",
    UPDATE_COLUMN_SELECTION = "UPDATE_COLUMN_SELECTION",
    END_COLUMN_SELECTION = "END_COLUMN_SELECTION"
}

/** Represents actions for spreadsheet state management. */
export type Action =
    | { type: ActionType.SET_DATA; payload: CellData[][] }
    | { type: ActionType.UNDO }
    | { type: ActionType.REDO }
    | { type: ActionType.SET_ALIGNMENTS; payload: Alignment[][] }
    | { type: ActionType.SET_SELECTED_COLUMN; payload: number | null }
    | { type: ActionType.SET_SELECTED_ROW; payload: number | null }
    | { type: ActionType.SET_SELECTED_CELL; payload: { row: number; col: number } | null }
    | { type: ActionType.SET_SELECTED_CELLS; payload: boolean[][] }
    | { type: ActionType.SET_SELECT_ALL; payload: boolean }
    | { type: ActionType.CLEAR_SELECTION }
    | { type: ActionType.ADD_ROW }
    | { type: ActionType.REMOVE_ROW }
    | { type: ActionType.ADD_COLUMN; payload: { index: number; position: "left" | "right" } }
    | { type: ActionType.REMOVE_COLUMN; payload: { index: number } }
    | { type: ActionType.SET_ALIGNMENT; payload: Alignment }
    | { type: ActionType.HANDLE_PASTE; payload: PasteOperationResult }
    | { type: ActionType.START_DRAG; payload: { row: number; col: number } }
    | { type: ActionType.UPDATE_DRAG; payload: { row: number; col: number } }
    | { type: ActionType.END_DRAG }
    | { type: ActionType.START_ROW_DRAG; payload: number }
    | { type: ActionType.UPDATE_ROW_DRAG; payload: number }
    | { type: ActionType.END_ROW_DRAG }
    | { type: ActionType.START_COLUMN_DRAG; payload: number }
    | { type: ActionType.UPDATE_COLUMN_DRAG; payload: number }
    | { type: ActionType.END_COLUMN_DRAG }
    | { type: ActionType.SET_TABLE_SIZE; payload: { row: number; col: number } }
    | { type: ActionType.CLEAR_TABLE }
    | { type: ActionType.TRANSPOSE_TABLE }
    | { type: ActionType.APPLY_TEXT_FORMATTING; payload: { operation: "BOLD" | "ITALIC" | "CODE" } }
    | { type: ActionType.START_ROW_SELECTION; payload: number }
    | { type: ActionType.UPDATE_ROW_SELECTION; payload: number }
    | { type: ActionType.END_ROW_SELECTION }
    | { type: ActionType.START_COLUMN_SELECTION; payload: number }
    | { type: ActionType.UPDATE_COLUMN_SELECTION; payload: number }
    | { type: ActionType.END_COLUMN_SELECTION };

/** Options for adding a column, including position and table structure modification. */
export interface AddColumnOptions extends TableStructureModification {
    position: "left" | "right";
}

/** Options for adding a row, including position and table structure modification. */
export interface AddRowOptions extends TableStructureModification {
    position: "above" | "below";
}

/** Represents a mapping of button handler keys to their corresponding functions. */
export interface ButtonHandlerKey {
    [key: string]: () => void;
}

/** Handlers for drag events in the spreadsheet. */
export interface DragHandlers {
    onDragStart: (colIndex: number) => void;
    onDragEnter: (colIndex: number) => void;
    onDragEnd: () => void;
}

/** Keys for handler functions related to adding rows and columns. */
export type HandlerKey = "onClickAddRow" | "onClickAddColumn";

/** Mapping of handler keys to their corresponding functions for adding rows and columns. */
export type HandlerMap = {
    onClickAddRow: (position: "above" | "below") => void;
    onClickAddColumn: (position: "left" | "right") => void;
};

/** Represents various handler types used in the spreadsheet. */
export type Handler = HandlerMap[HandlerKey] | string | number | boolean | PrimitiveAtom<SpreadsheetState>;

/** Text formatting operations with optional payloads. */
export type TextFormattingOperation =
    | { operation: "BOLD" | "ITALIC" | "CODE" | "LINK" | "REMOVE_LINK"; payload?: string }
    | { operation: "ALIGN_LEFT" | "ALIGN_CENTER" | "ALIGN_RIGHT" };
    

