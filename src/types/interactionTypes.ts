// src/types/interactionTypes.ts
/**
 * @fileoverview Types related to user interactions, selection states, and event
 * handling within the spreadsheet.
 */

import { PrimitiveAtom } from "jotai";
import { CellData, State } from "./dataTypes";
import { BaseContextMenuProps, MenuDirection, TableSizeChooserProps } from "./propTypes";
import { MenuItemProps, PopoverOrigin } from "@mui/material";
import { ArrowForward } from "@mui/icons-material";
import { ArrowBack } from "@mui/icons-material";
import { ArrowDownward } from "@mui/icons-material";
import { ArrowUpward } from "@mui/icons-material";

export interface AddColumnOptions extends TableStructureModification {
    position: "left" | "right";
}

export interface AddRowOptions extends TableStructureModification {
    position: "above" | "below";
}

export interface ActionMenuItemProps extends Omit<MenuItemProps, "onClick"> {
    icon: React.ElementType;
    text: string;
    onClick: () => void;
}

export interface ButtonHandlerKey {
    [key: string]: () => void;
}

export interface DirectionalContextMenuProps extends BaseContextMenuProps {
    direction: MenuDirection;
    onAddBefore: () => void;
    onAddAfter: () => void;
    onRemove: () => void;
}

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

export interface MenuConfigParams extends ToolbarContextType {
    handleNewTable: () => void;
    onDownloadCSV: () => void;
    TableSizeChooser: React.ComponentType<TableSizeChooserProps>;
    toolbarContext: ToolbarContextType;
}

export interface MenuPositionConfig {
    anchorOrigin: PopoverOrigin;
    transformOrigin: PopoverOrigin;
    beforeIcon: typeof ArrowUpward | typeof ArrowBack;
    afterIcon: typeof ArrowDownward | typeof ArrowForward;
    beforeText: string;
    afterText: string;
}

export interface SelectedCell {
    row: number;
    col: number;
}

export interface TableStructureModification {
    data: CellData[][];
    selectedCells: boolean[][];
    index: number;
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
    handleUndo: () => void;
    handleRedo: () => void;
}

export type SelectedCells = Record<number, Record<number, boolean>>;

export type SelectionRange = {
    startRow: number;
    startCol: number;
    endRow: number;
    endCol: number;
};

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
