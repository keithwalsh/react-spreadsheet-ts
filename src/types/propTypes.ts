/**
 * @file src/types/propTypes.ts
 * @fileoverview Defines prop types for React components in the spreadsheet to ensure type safety.
 */

import { MenuItemProps, PopoverOrigin, TableCellProps, TextFieldProps } from "@mui/material";
import { PrimitiveAtom } from "jotai";
import { CellCoordinate, CellData, SpreadsheetState } from "./dataTypes";
import { CSSProperties } from "react";
import { RowContextMenu, ColumnContextMenu } from "../components";
import { ArrowBack } from "@mui/icons-material";
import { ArrowForward } from "@mui/icons-material";
import { ArrowDownward } from "@mui/icons-material";
import { ArrowUpward } from "@mui/icons-material";
import { ActionType, Position, TextFormatOperation } from "./interactionTypes";

export type ActionHandler<T extends string> = `onClick${T}` | `handle${T}`;

/** Configuration for a menu action's key and method names */
export type ActionConfig = {
    key: string;
    method: string;
};

export type AlignmentAction = "AlignLeft" | "AlignCenter" | "AlignRight";

/** Props for action menu items, omitting onClick from MenuItemProps */
export interface ActionMenuItemProps extends Omit<MenuItemProps, "onClick"> {
    icon: React.ElementType;
    text: string;
    onClick: () => void;
}

// Base click handlers
export type BaseClickHandlers = {
    [K in AlignmentAction | TextFormatAction | TableAction as ActionHandler<K>]: () => void;
};

/** Base actions available for menu operations */
export type BaseMenuAction = Extract<
    ActionType,
    | ActionType.ADD_ROW 
    | ActionType.ADD_COLUMN 
    | ActionType.REMOVE_ROW 
    | ActionType.REMOVE_COLUMN
>;

// Common handler props
export interface BaseHandlers {
    onDragStart: (index: number) => void;
    onDragEnter: (index: number) => void;
    onDragEnd: () => void;
}

// Base props that several components share
export interface BaseProps {
    spreadsheetAtom: PrimitiveAtom<SpreadsheetState>;
}

/** Base props shared by all menu types */
export interface BaseMenuProps {
    anchorEl: HTMLElement | null;
    open: boolean;
    onClose: () => void;
}

/** Defines a button with a title, icon, and handler key. */
export interface ButtonDefinition {
    title: string;
    icon: React.ElementType;
    handlerKey: string;
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

/** Props for the Cell component */
export interface CellProps {
    rowIndex: number;
    colIndex: number;
    cellData: CellData;
    activeCell: CellCoordinate | null;
    selectedCells: boolean[][];
    selectedColumns: number[];
    selectedRows: number[];
    isDarkMode: boolean;
    selectAll: boolean;
    style?: CSSProperties;
    onMouseDown: (rowIndex: number, colIndex: number, shiftKey: boolean, ctrlKey: boolean) => void;
    onMouseEnter: (rowIndex: number, colIndex: number) => void;
    onMouseUp: () => void;
    onDoubleClick?: (rowIndex: number, colIndex: number) => void;
    onCellChange: (rowIndex: number, colIndex: number, value: string) => void;
    onCellKeyDown: (e: React.KeyboardEvent) => void;
    onCellBlur?: () => void;
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
export type ColumnHeaderCellProps = BaseProps & BaseHandlers & {
    index: number;
    onAddColumnLeft: (index: number) => void;
    onAddColumnRight: (index: number) => void;
    onRemoveColumn: (index: number) => void;
    atom: PrimitiveAtom<SpreadsheetState>;
};

/** Actions for column menu */
export type ColumnMenuActions = DirectionalMenuActions<"column">;

/** Props for column menu excluding base context menu props */
export type ColumnMenuProps = Omit<ColumnContextMenuProps, keyof BaseMenuProps>;

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
export interface DirectionalContextMenuProps extends BaseMenuProps {
    direction: MenuDirection;
    onAddBefore: () => void;
    onAddAfter: () => void;
    onRemove: () => void;
}

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

export interface HeaderCellProps<T extends "row" | "column"> {
    atom: PrimitiveAtom<SpreadsheetState>;
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

export interface MenuPositionConfig {
    anchorOrigin: PopoverOrigin;
    transformOrigin: PopoverOrigin;
    beforeIcon: typeof ArrowUpward | typeof ArrowBack;
    afterIcon: typeof ArrowDownward | typeof ArrowForward;
    beforeText: string;
    afterText: string;
}

/** Configuration for add/remove menu actions */
export interface MenuTypeConfig {
    add: ActionConfig[];
    remove: ActionConfig;
}

export type NewTableModalProps = {
    open: boolean;
    onClose: () => void;
    onCreateNewTable: (rows: number, columns: number) => void;
};

export type PositionalHandlers = {
    onClickAddRow: (position: Position.ROW_ABOVE | Position.ROW_BELOW) => void;
    onClickAddColumn: (position: Position.COL_LEFT | Position.COL_RIGHT) => void;
    onClickRemoveRow: () => void;
    onClickRemoveColumn: () => void;
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

export type RowMenuProps = Omit<RowContextMenuProps, keyof BaseMenuProps>;

export type RowNumberCellProps = BaseProps & BaseHandlers & {
    rowIndex: number;
    onAddAbove: (index: number) => void;
    onAddBelow: (index: number) => void;
    onRemove: (index: number) => void;
    children?: React.ReactNode;
    className?: string;
    atom: PrimitiveAtom<SpreadsheetState>;
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

export interface SizeInputProps extends Omit<TextFieldProps, 'onChange'> {
    label: 'Rows' | 'Columns';
    type: 'rows' | 'cols';
    value: string;
    onChange: (type: 'rows' | 'cols', value: string) => void;
    max: number;
}

export interface SpreadsheetProps {
    atom: PrimitiveAtom<SpreadsheetState>;
    tableHeight?: string;
    value?: CellData[][];
    onChange?: (data: CellData[][]) => void;
}

export interface SpreadsheetWrapperProps {
    rows?: number;
    cols?: number;
    darkMode?: boolean;
}

export type TableAction = "Undo" | "Redo" | "ClearTable" | "DeleteSelected" | "TransposeTable";

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

export type TextFormatAction = "Bold" | "Italic" | "Code" | "Link";

// Table operations and state
export interface TableState {
    setTableSize: (rows: number, cols: number) => void;
    currentRows: number;
    currentCols: number;
    clearTable: () => void;
    deleteSelected: () => void;
    transposeTable: () => void;
    handleUndo: () => void;
    handleRedo: () => void;
}

// All text formatting and alignment actions
export type ToolbarActions = {
    [K in TextFormatOperation | "ALIGN_LEFT" | "ALIGN_CENTER" | "ALIGN_RIGHT"]: () => void;
} & {
    onClickUndo: () => void;
    onClickRedo: () => void;
    onClickAddRow: (position: Position.ROW_ABOVE | Position.ROW_BELOW) => void;
    onClickRemoveRow: () => void;
    onClickAddColumn: (position: Position.COL_LEFT | Position.COL_RIGHT) => void;
    onClickRemoveColumn: () => void;
    onClickSetLink: () => void;
};

export interface ToolbarContextType extends 
    BaseClickHandlers,
    PositionalHandlers,
    UIState,
    TableDimensions {
    spreadsheetAtom: PrimitiveAtom<SpreadsheetState>;
    // Text formatting handlers (both naming conventions for compatibility)
    handleBold: () => void;
    handleItalic: () => void;
    handleCode: () => void;
    onClickBold: () => void;
    onClickItalic: () => void;
    onClickCode: () => void;
    onClickLink: () => void;
    // Alignment handlers (both naming conventions for compatibility)
    handleAlignLeft: () => void;
    handleAlignCenter: () => void;
    handleAlignRight: () => void;
    onClickAlignLeft: () => void;
    onClickAlignCenter: () => void;
    onClickAlignRight: () => void;
    // History handlers (both naming conventions for compatibility)
    handleUndo: () => void;
    handleRedo: () => void;
    onClickUndo: () => void;
    onClickRedo: () => void;
    // Table operations
    clearTable: () => void;
    deleteSelected: () => void;
    transposeTable: () => void;
}

export interface TableDimensions {
    currentRows: number;
    currentCols: number;
    setTableSize: (rows: number, cols: number) => void;
}
export type TableProps = {
    atom: PrimitiveAtom<SpreadsheetState>;
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
    style?: CSSProperties;
    children?: React.ReactNode;
};

export interface ToolbarProviderProps {
    children: React.ReactNode;
    spreadsheetAtom: PrimitiveAtom<SpreadsheetState>;
    onClickUndo: () => void;
    onClickRedo: () => void;
    onClickAlignLeft: () => void;
    onClickAlignCenter: () => void;
    onClickAlignRight: () => void;
    onClickAddRow: (position: Position.ROW_ABOVE | Position.ROW_BELOW) => void;
    onClickRemoveRow: () => void;
    onClickAddColumn: (position: Position.COL_LEFT | Position.COL_RIGHT) => void;
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

export interface UIState {
    isLinkModalOpen: boolean;
    isSnackbarOpen: boolean;
    snackbarMessage: string;
    handleLinkModalClose: () => void;
    handleSnackbarClose: () => void;
}