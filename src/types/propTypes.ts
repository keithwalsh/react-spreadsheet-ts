// src/types/propTypes.ts
/**
 * @fileoverview Component prop type definitions for all React components in the
 * spreadsheet, ensuring type safety across the component hierarchy.
 */

import { TableCellProps } from "@mui/material";
import { IconBaseProps } from "react-icons";
import { PrimitiveAtom } from "jotai";
import { CellData, Dimensions, State } from "./dataTypes";
import { CSSProperties } from "react";
import { RowContextMenu, ColumnContextMenu } from "../components";
import { DirectionalMenuActions } from "./interactionTypes";

export interface BaseContextMenuProps {
    anchorEl: HTMLElement | null;
    open: boolean;
    onClose: () => void;
}

export type ButtonDefinition = {
    title: string;
    icon: React.ComponentType<IconBaseProps>;
    handlerKey: string;
};

export interface ButtonGroupProps {
    visibleButtons?: string[];
    orientation?: "horizontal" | "vertical";
    iconSize?: number;
    iconMargin?: number;
    dividerMargin?: number;
    tooltipArrow?: boolean;
    tooltipPlacement?: "top" | "bottom" | "left" | "right";
}

export interface CellContentStyleProps {
    isEditing: boolean;
    cellData: {
        bold?: boolean;
        italic?: boolean;
        code?: boolean;
        align?: string;
        value: string;
        link?: string;
    };
    style?: CSSProperties;
}

export interface CellProps {
    rowIndex: number;
    colIndex: number;
    cellData: CellData;
    selectedCells: Record<number, Record<number, boolean>>;
    selectedCell: { row: number; col: number } | null;
    selectedColumns?: number[];
    selectedRows?: number[];
    style?: React.CSSProperties;
    isDarkMode: boolean;
    selectAll?: boolean;
    onMouseDown?: (rowIndex: number, colIndex: number, shiftKey: boolean, ctrlKey: boolean) => void;
    onMouseEnter?: (rowIndex: number, colIndex: number) => void;
    onMouseUp?: () => void;
    onDoubleClick?: (rowIndex: number, colIndex: number) => void;
    onCellBlur?: () => void;
    onCellKeyDown?: (event: React.KeyboardEvent) => void;
    onCellChange?: (rowIndex: number, colIndex: number, value: string) => void;
}

export interface CellStyleProps {
    isDarkMode: boolean;
    isEditing: boolean;
    isSelected: boolean;
    selectedCells: Record<number, Record<number, boolean>>;
    rowIndex: number;
    colIndex: number;
    multipleCellsSelected: boolean;
    style?: CSSProperties;
    isColumnSelected: boolean;
    isRowSelected: boolean;
    isSelectAllSelected: boolean;
    hasLink?: boolean;
}

export type ColumnContextMenuProps = {
    anchorEl: HTMLElement | null;
    open: boolean;
    onClose: () => void;
    onAddLeft: () => void;
    onAddRight: () => void;
    onRemove: () => void;
};

export type ColumnHeaderCellProps = {
    atom: PrimitiveAtom<State>;
    index: number;
    onAddColumnLeft: (index: number) => void;
    onAddColumnRight: (index: number) => void;
    onRemoveColumn: (index: number) => void;
    onDragStart: (colIndex: number) => void;
    onDragEnter: (colIndex: number) => void;
    onDragEnd: () => void;
};

export type ColumnMenuActions = DirectionalMenuActions<"column">;

export type ColumnMenuProps = Omit<ColumnContextMenuProps, keyof BaseContextMenuProps>;

export type CreateMenuProps<T extends "row" | "column"> = {
    props: T extends "row" ? RowNumberCellProps : ColumnHeaderCellProps;
    index: number;
    type: T;
};

export interface HeaderCellProps<T extends "row" | "column"> {
    atom: PrimitiveAtom<State>;
    index: number;
    type: T;
    isHighlighted: boolean;
    isSelected: boolean;
    onDragStart: (index: number) => void;
    onDragEnter: (index: number) => void;
    onDragEnd: () => void;
    ContextMenu: T extends "row" ? typeof RowContextMenu : typeof ColumnContextMenu;
    menuProps: T extends "row" ? MenuActionConfig["row"]["props"] : MenuActionConfig["column"]["props"];
    renderContent: (index: number) => React.ReactNode;
}

export interface HeaderCellStylesParams {
    isSelected: boolean;
    isHighlighted: boolean;
    isHovered: boolean;
}

export interface LinkModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (url: string | undefined) => void;
    initialUrl?: string;
}

export type MenuActionConfig = {
    row: {
        before: "onAddAbove";
        after: "onAddBelow";
        remove: "onRemove";
        props: RowMenuActions;
    };
    column: {
        before: "onAddLeft";
        after: "onAddRight";
        remove: "onRemoveColumn";
        props: ColumnMenuActions;
    };
};

export type MenuActionMap = {
    row: {
        before: "onAddAbove";
        after: "onAddBelow";
        remove: "onRemove";
    };
    column: {
        before: "onAddLeft";
        after: "onAddRight";
        remove: "onRemoveColumn";
    };
};

export type MenuDirection = "row" | "column";

export type MenuPropsMap = {
    row: {
        props: RowNumberCellProps;
        actions: MenuActionMap["row"];
    };
    column: {
        props: ColumnHeaderCellProps;
        actions: MenuActionMap["column"];
    };
};

export type NewTableModalProps = {
    open: boolean;
    onClose: () => void;
    onCreateNewTable: (rows: number, columns: number) => void;
};

export interface RowContextMenuProps {
    anchorEl: HTMLElement | null;
    open: boolean;
    onClose: () => void;
    onAddAbove: () => void;
    onAddBelow: () => void;
    onRemove: () => void;
}

export type RowMenuActions = DirectionalMenuActions<"row">;

export type RowMenuProps = Omit<RowContextMenuProps, keyof BaseContextMenuProps>;

export type RowNumberCellProps = {
    atom: PrimitiveAtom<State>;
    rowIndex: number;
    onAddAbove: (index: number) => void;
    onAddBelow: (index: number) => void;
    onRemove: (index: number) => void;
    onDragStart: (rowIndex: number) => void;
    onDragEnter: (rowIndex: number) => void;
    onDragEnd: () => void;
    children?: React.ReactNode;
    className?: string;
};

export type RowProps = {
    children?: React.ReactNode;
    className?: string;
    ref?: React.Ref<HTMLTableRowElement> | null;
};

export type SelectAllCellProps = TableCellProps & {
    selectAll: boolean;
    toggleSelectAll: () => void;
    iconSize?: number;
};

export type SpreadsheetProps = {
    tableHeight?: string;
    value?: CellData[][];
    onChange?: (data: CellData[][]) => void;
};

export interface SpreadsheetWrapperProps {
    rows?: number;
    cols?: number;
    darkMode?: boolean;
}

export type TableDimensionInputProps = {
    label: keyof Dimensions;
    value: string;
    onChange: (value: string) => void;
    max: number;
};

export type TableMenuProps = {
    onCreateNewTable: (rows: number, columns: number) => void;
    onDownloadCSV: () => void;
};

export type TableProps = {
    atom: PrimitiveAtom<State>;
    onCellChange: (rowIndex: number, colIndex: number, value: string) => void;
    onDragStart: (row: number, col: number) => void;
    onDragEnter: (row: number, col: number) => void;
    onDragEnd: () => void;
    onAddColumnLeft: (index: number) => void;
    onAddColumnRight: (index: number) => void;
    onRemoveColumn: (index: number) => void;
    onAddRowAbove: (index: number) => void;
    onAddRowBelow: (index: number) => void;
    onRemoveRow: (index: number) => void;
    children?: React.ReactNode;
};

export type TableSizeChooserProps = {
    maxRows?: number;
    maxCols?: number;
    currentRows: number;
    currentCols: number;
    onSizeSelect: (rows: number, cols: number) => void;
};

export interface ToolbarProviderProps {
    children: React.ReactNode;
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
    setTableSize: (rows: number, cols: number) => void;
    currentRows: number;
    currentCols: number;
    clearTable: () => void;
    deleteSelected: () => void;
    transposeTable: () => void;
}
