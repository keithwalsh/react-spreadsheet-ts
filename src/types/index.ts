import { CSSProperties } from "react";
import { TableCellProps } from "@mui/material";
import { IconBaseProps } from "react-icons";

// Type definitions

export type Alignment = "left" | "center" | "right";

export type State = {
    data: string[][];
    past: [string[][], Alignment[][]][]; // Each element is a tuple of [data, alignments]
    future: [string[][], Alignment[][]][];
    alignments: Alignment[][];
    selectedColumn: number | null;
    selectedRow: number | null;
    selectedCell: { row: number; col: number } | null;
    selectedCells: boolean[][];
    selectAll: boolean;
    isDragging: boolean;
    dragStart: { row: number; col: number } | null;
};

export type Action =
    | { type: "SET_DATA"; payload: string[][] }
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
    | { type: "ADD_COLUMN" }
    | { type: "REMOVE_COLUMN" }
    | { type: "SET_ALIGNMENT"; payload: Alignment }
    | { type: "HANDLE_PASTE"; payload: { newData: string[][]; newAlignments: Alignment[][] } }
    | { type: "SET_BOLD" }
    | { type: "SET_ITALIC" }
    | { type: "SET_CODE" }
    | { type: "START_DRAG"; payload: { row: number; col: number } }
    | { type: "UPDATE_DRAG"; payload: { row: number; col: number } }
    | { type: "END_DRAG" }
    | { type: "SET_TABLE_SIZE"; payload: { row: number; col: number } };

// ButtonGroup-related types

export type ButtonHandlerKey =
    | "onClickUndo"
    | "onClickRedo"
    | "onClickAlignLeft"
    | "onClickAlignCenter"
    | "onClickAlignRight"
    | "onClickAddRow"
    | "onClickRemoveRow"
    | "onClickAddColumn"
    | "onClickRemoveColumn"
    | "onClickSetBold"
    | "onClickSetItalic"
    | "onClickSetCode";

export interface ButtonDefinition {
    title: string;
    icon: React.ComponentType<IconBaseProps>;
    handlerKey: ButtonHandlerKey;
}

export interface ButtonGroupContextType {
    onClickUndo: () => void;
    onClickRedo: () => void;
    onClickAlignLeft: () => void;
    onClickAlignCenter: () => void;
    onClickAlignRight: () => void;
    onClickAddRow: () => void;
    onClickRemoveRow: () => void;
    onClickAddColumn: () => void;
    onClickRemoveColumn: () => void;
    onClickSetBold: () => void;
    onClickSetItalic: () => void;
    onClickSetCode: () => void;
    setTableSize: (row: number, col: number) => void;
    currentRows: number;
    currentCols: number;
}

export interface ButtonGroupProviderProps extends ButtonGroupContextType {
    children: React.ReactNode;
}

export interface ButtonGroupProps {
    theme?: "light" | "dark";
    visibleButtons?: (string | "divider")[];
    orientation?: "horizontal" | "vertical";
    iconSize?: number;
    iconMargin?: number;
    dividerMargin?: number;
    tooltipArrow?: boolean;
    tooltipPlacement?:
        | "bottom-end"
        | "bottom-start"
        | "bottom"
        | "left-end"
        | "left-start"
        | "left"
        | "right-end"
        | "right-start"
        | "right"
        | "top-end"
        | "top-start"
        | "top";
}

export interface TableSizeChooserProps {
    maxRows?: number;
    maxCols?: number;
    currentRows: number;
    currentCols: number;
    onSizeSelect: (rows: number, cols: number) => void;
}

export interface CellProps {
    theme?: "light" | "dark";
    rowIndex: number;
    colIndex: number;
    align: "inherit" | "left" | "center" | "right" | "justify";
    selectedCells: boolean[][];
    selectedCell: { row: number; col: number } | null;
    handleCellSelection: (rowIndex: number, colIndex: number) => void;
    handleCellChange: (rowIndex: number, colIndex: number, value: string) => void;
    style?: CSSProperties;
    cellData?: string;
    onMouseDown: (row: number, col: number) => void;
    onMouseEnter: (row: number, col: number) => void;
    onMouseUp: () => void;
}

export interface ColumnHeaderCellProps {
    theme?: "light" | "dark";
    index: number;
    handleColumnSelection: (index: number) => void;
    selectedColumns?: Set<number>;
    className?: string;
}

export interface RowProps {
    theme?: "light" | "dark";
    children?: React.ReactNode;
    className?: string;
    ref?: React.Ref<HTMLTableRowElement> | null;
}

export interface RowNumberCellProps {
    theme?: "light" | "dark";
    children?: React.ReactNode;
    className?: string;
    onClick?: () => void;
    selectedRows?: Set<number>;
    rowIndex: number;
    ref?: React.Ref<HTMLTableRowElement> | null;
}

export interface SelectAllTableCellProps extends TableCellProps {
    theme?: "light" | "dark";
    selectAll: boolean;
    toggleSelectAll: () => void;
    iconSize?: number;
}

export interface TableProps {
    theme?: "light" | "dark";
    children?: React.ReactNode;
    className?: string;
    onPaste?: (event: React.ClipboardEvent<HTMLDivElement>) => void;
}

export interface SpreadsheetProps {
    theme?: "light" | "dark";
    toolbarOrientation?: "horizontal" | "vertical";
    initialRows?: number;
    initialColumns?: number;
}
