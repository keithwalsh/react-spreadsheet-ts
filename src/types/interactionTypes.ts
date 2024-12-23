/**
 * @file src/types/interactionTypes.ts
 * @fileoverview Types related to user interactions, selection states, and event handling within the spreadsheet.
 */

import { PrimitiveAtom } from "jotai";
import { CellData, InsertPosition, SpreadsheetDirection, SpreadsheetState, TextFormatOperation } from "./";

/** Action types for spreadsheet operations */
export enum ActionType {
    SET_DATA = "SET_DATA",
    UNDO = "UNDO",
    REDO = "REDO",
    SET_ALIGNMENTS = "SET_ALIGNMENTS",
    SET_SELECTED_COLUMN = "SET_SELECTED_COLUMN",
    SET_SELECTED_ROW = "SET_SELECTED_ROW",
    SET_ACTIVE_CELL = "SET_ACTIVE_CELL",
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



/** Payload for single-dimension operations (row or column) */
interface SingleDimensionPayload {
    index: number;
}

/** Payload for cell coordinate operations */
interface CellCoordinatePayload {
    row: number;
    col: number;
}

/** Consolidated action payloads */
export type PositionalPayload = SingleDimensionPayload & {
    position: InsertPosition.ROW_ABOVE | InsertPosition.ROW_BELOW | InsertPosition.COL_LEFT | InsertPosition.COL_RIGHT;
};

export type DragPayload = Omit<CellCoordinatePayload, "col"> | Omit<CellCoordinatePayload, "row"> | CellCoordinatePayload;

/** Represents actions for spreadsheet state management. */
export type Action =
    | { type: ActionType.SET_DATA; payload: CellData[][] }
    | { type: Extract<ActionType, ActionType.UNDO | ActionType.REDO | ActionType.CLEAR_SELECTION> }
    | { type: ActionType.ADD_ROW | ActionType.ADD_COLUMN; payload: PositionalPayload }
    | { type: ActionType.REMOVE_ROW | ActionType.REMOVE_COLUMN; payload: Pick<SingleDimensionPayload, "index"> }
    | { type: ActionType.START_DRAG | ActionType.UPDATE_DRAG; payload: CellCoordinatePayload }
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
    | { type: ActionType.APPLY_TEXT_FORMATTING; payload: { operation: TextFormatOperation } }
    | { type: ActionType.START_ROW_SELECTION; payload: number }
    | { type: ActionType.UPDATE_ROW_SELECTION; payload: number }
    | { type: ActionType.END_ROW_SELECTION }
    | { type: ActionType.START_COLUMN_SELECTION; payload: number }
    | { type: ActionType.UPDATE_COLUMN_SELECTION; payload: number }
    | { type: ActionType.END_COLUMN_SELECTION };

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

/** Mapping of handler keys to their corresponding functions */
export type HandlerMap = {
    [K in `onClick${'Add'}${Capitalize<Lowercase<SpreadsheetDirection>>}`]: (
        position: K extends `onClickAddRow` 
            ? InsertPosition.ROW_ABOVE | InsertPosition.ROW_BELOW
            : InsertPosition.COL_LEFT | InsertPosition.COL_RIGHT
    ) => void;
};

/** Represents various handler types used in the spreadsheet. */
export type Handler = HandlerMap[keyof HandlerMap] | string | number | boolean | PrimitiveAtom<SpreadsheetState>;


