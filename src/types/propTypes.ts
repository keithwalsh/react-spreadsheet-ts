/**
 * @file src/types/propTypes.ts
 * @fileoverview Defines prop types for React components in the spreadsheet to ensure type safety.
 */

import { MenuItemProps, TableCellProps } from "@mui/material";
import { PrimitiveAtom } from "jotai";
import { CellData, State } from "./dataTypes";
import { CSSProperties } from "react";
import { RowContextMenu, ColumnContextMenu } from "../components";
import { DirectionalMenuActions, ToolbarContextType } from "./interactionTypes";

/** Props for action menu items, omitting onClick from MenuItemProps */
export interface ActionMenuItemProps extends Omit<MenuItemProps, "onClick"> {
    icon: React.ElementType;
    text: string;
    onClick: () => void;
}

/** Props for base context menu component */
export interface BaseContextMenuProps {
    anchorEl: HTMLElement | null;
    onClose: () => void;
    open: boolean;
}

/** Defines a button with a title, icon, and handler key. */
export interface ButtonDefinition {
    title: string;
    icon: React.ElementType;
    handlerKey: string;
}

/** Props for cell content styling */
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

/** Props for individual spreadsheet cells. */
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

/** Props for cell styling */
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

/** Props for the column context menu. */
export type ColumnContextMenuProps = {
    anchorEl: HTMLElement | null;
    open: boolean;
    onClose: () => void;
    onAddLeft: () => void;
    onAddRight: () => void;
    onRemove: () => void;
};

/** Props for the column header cell component. */
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

/** Actions for column menu */
export type ColumnMenuActions = DirectionalMenuActions<"column">;

/** Props for column menu excluding base context menu props */
export type ColumnMenuProps = Omit<ColumnContextMenuProps, keyof BaseContextMenuProps>;

/** Props for creating a menu based on type (row or column) */
export type CreateMenuProps<T extends "row" | "column"> = {
    props: T extends "row" ? RowNumberCellProps : ColumnHeaderCellProps;
    index: number;
    type: T;
};

/** Represents the dimensions of the table. */
export type Dimensions = {
    rows: string;
    columns: string;
};

/** Props for directional context menu */
export interface DirectionalContextMenuProps extends BaseContextMenuProps {
    direction: MenuDirection;
    onAddBefore: () => void;
    onAddAfter: () => void;
    onRemove: () => void;
}

export type MenuActionMap = {
    row: {
        addAbove: () => void;
        addBelow: () => void;
        remove: () => void;
    };
    column: {
        addLeft: () => void;
        addRight: () => void;
        remove: () => void;
    };
};

export type MenuActionConfig = {
    row: {
        props: RowMenuProps;
        actions: MenuActionMap["row"];
    };
    column: {
        props: ColumnMenuProps;
        actions: MenuActionMap["column"];
    };
};

/** Parameters for configuring the menu */
export interface MenuConfigParams extends ToolbarContextType {
    handleNewTable: () => void;
    onDownloadCSV: () => void;
    TableSizeChooser: React.ComponentType<TableSizeChooserProps>;
    toolbarContext: ToolbarContextType;
}

export type MenuDirection = "row" | "column";

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

export type TableSizePayload = {
    row: number;
    col: number;
    isInitialSetup?: boolean;
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

export interface ButtonGroupProps {
    visibleButtons?: string[];
    orientation?: "horizontal" | "vertical";
    iconSize?: number;
    iconMargin?: number;
    dividerMargin?: number;
    tooltipArrow?: boolean;
    tooltipPlacement?: "top" | "bottom" | "left" | "right";
}
