/**
 * @file src/types/propTypes.ts
 * @fileoverview Defines prop types for React components in the spreadsheet to ensure type safety.
 */

import { MenuItemProps, PopoverOrigin, TableCellProps, TextFieldProps } from "@mui/material";
import { PrimitiveAtom } from "jotai";
import { CSSProperties } from "react";
import { ArrowBack, ArrowForward, ArrowDownward, ArrowUpward } from "@mui/icons-material";
import { RowContextMenu, ColumnContextMenu } from "../components";
import { ActionType, Alignment, CellCoordinate, CellData, Dimensions, InsertPosition, SpreadsheetDirection, SpreadsheetState, TableDimensions, TextFormatOperation, UIState } from "./";

/** Base handler name pattern */
export type HandlerPattern = `on${'Click' | 'Handle'}${string}`;

/** Unified click/handle action type */
export type ActionHandler = {
    [K in TextFormatOperation | keyof typeof Alignment | ToolbarTableAction as 
        | `onClick${K}` 
        | `handle${K}`]: () => void;
};

/** Configuration for a menu action's key and method names */
export type ActionConfig = {
    key: string;
    method: string;
};

/** Props for action menu items, omitting onClick from MenuItemProps */
export interface ActionMenuItemProps extends Omit<MenuItemProps, "onClick"> {
    icon: React.ElementType;
    text: string;
    onClick: () => void;
}

/** Base click handlers for alignment, text formatting, and toolbar actions */
export type BaseClickHandlers = {
    [K in keyof typeof Alignment | TextFormatOperation | ToolbarTableAction as 
        | `onClick${K}` 
        | `handle${K}`]: () => void;
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

/** Directional menu actions */
export type DirectionalMenuHandlers<T extends SpreadsheetDirection> = T extends SpreadsheetDirection.ROW
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

/** Unified menu props */
export type DirectionalMenuProps<T extends SpreadsheetDirection> = BaseMenuProps & DirectionalMenuHandlers<T>;

/** Props for the column context menu. */
export type ColumnContextMenuProps = DirectionalMenuProps<SpreadsheetDirection.COLUMN>;

/** Base header cell props */
export interface BaseHeaderCellProps extends BaseProps, BaseHandlers {
    index: number;
    atom: PrimitiveAtom<SpreadsheetState>;
}

/** Directional header cell props */
export type DirectionalHeaderCellProps<T extends SpreadsheetDirection> = BaseHeaderCellProps & 
    (T extends SpreadsheetDirection.ROW 
        ? {
            onAddAbove: (index: number) => void;
            onAddBelow: (index: number) => void;
            onRemove: (index: number) => void;
        }
        : {
            onAddColumnLeft: (index: number) => void;
            onAddColumnRight: (index: number) => void;
            onRemoveColumn: (index: number) => void;
        }
    );

/** Props for column menu excluding base context menu props */
export type ColumnMenuProps = Omit<ColumnContextMenuProps, keyof BaseMenuProps>;

export type RowMenuProps = DirectionalMenuProps<SpreadsheetDirection.ROW>;

/** Props for creating a menu based on type (row or column) */
export type CreateMenuProps<T extends SpreadsheetDirection> = {
    props: HeaderCellProps<T>;
    index: number;
    type: T;
};

/** Props for directional context menu */
export interface DirectionalContextMenuProps extends BaseMenuProps {
    direction: SpreadsheetDirection;
    onAddBefore: () => void;
    onAddAfter: () => void;
    onRemove: () => void;
}

/** Get menu actions for a specific direction */
export type DirectionalMenuActions<T extends SpreadsheetDirection> = MenuActionMap[T];

/** Props for header cells with type safety */
export interface HeaderCellProps<T extends SpreadsheetDirection> {
    atom: PrimitiveAtom<SpreadsheetState>;
    index: number;
    type: T;
    isHighlighted: boolean;
    isSelected: boolean;
    onDragStart: (index: number) => void;
    onDragEnter: (index: number) => void;
    onDragEnd: () => void;
    ContextMenu: T extends SpreadsheetDirection.ROW ? typeof RowContextMenu : typeof ColumnContextMenu;
    menuProps: T extends SpreadsheetDirection.ROW ? RowMenuProps : ColumnMenuProps;
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

/** Generic menu actions map keyed by SpreadsheetDirection */
export type MenuActionMap = {
    [D in SpreadsheetDirection]: D extends SpreadsheetDirection.ROW
        ? { addAbove: () => void; addBelow: () => void; remove: () => void }
        : { addLeft: () => void; addRight: () => void; remove: () => void };
};

export type MenuActionConfig = {
    [D in SpreadsheetDirection]: {
        props: D extends SpreadsheetDirection.ROW ? RowMenuProps : ColumnMenuProps;
        actions: MenuActionMap[D];
    };
};

/** Parameters for configuring the menu */
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
    onClickAddRow: (position: InsertPosition.ROW_ABOVE | InsertPosition.ROW_BELOW) => void;
    onClickAddColumn: (position: InsertPosition.COL_LEFT | InsertPosition.COL_RIGHT) => void;
    onClickRemoveRow: () => void;
    onClickRemoveColumn: () => void;
};

export type RowContextMenuProps = DirectionalMenuProps<SpreadsheetDirection.ROW>;

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

export type ToolbarTableAction = 
    | Extract<ActionType, ActionType.UNDO | ActionType.REDO>
    | ActionType.CLEAR_TABLE
    | ActionType.TRANSPOSE_TABLE;

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

/** All toolbar actions */
export type ToolbarActionHandlers = {
    [K in TextFormatOperation | keyof typeof Alignment as `onClick${K}` | `handle${K}`]: () => void;
} & {
    [K in ToolbarTableAction as `onClick${K}` | `handle${K}`]: () => void;
} & {
    onClickAddRow: (position: InsertPosition.ROW_ABOVE | InsertPosition.ROW_BELOW) => void;
    onClickAddColumn: (position: InsertPosition.COL_LEFT | InsertPosition.COL_RIGHT) => void;
    onClickRemoveRow: () => void;
    onClickRemoveColumn: () => void;
    onClickSetLink: () => void;
    handleLink: (url: string | undefined, activeCell: CellCoordinate) => void;
};

/** Base context interface */
export interface BaseContextType {
    spreadsheetAtom: PrimitiveAtom<SpreadsheetState>;
    clearTable: () => void;
    deleteSelected: () => void;
    transposeTable: () => void;
    // Add alignment handlers using enum values
    onClickLEFT: () => void;
    handleLEFT: () => void;
    onClickCENTER: () => void;
    handleCENTER: () => void;
    onClickRIGHT: () => void;
    handleRIGHT: () => void;
}

/** Extended toolbar context */
export interface ToolbarContextType extends 
    BaseContextType,
    ToolbarActionHandlers,
    UIState,
    TableDimensions {
    handleUndo: () => void;
    handleRedo: () => void;
    onClickUndo: () => void;
    onClickRedo: () => void;
    // Text formatting handlers
    handleBold: () => void;
    handleItalic: () => void;
    handleCode: () => void;
    onClickBold: () => void;
    onClickItalic: () => void;
    onClickCode: () => void;
    onClickLink: () => void;
    handleLink: () => void;
    // Toggle handlers
    handleTOGGLE_BOLD: () => void;
    handleTOGGLE_ITALIC: () => void;
    handleTOGGLE_CODE: () => void;
    handleTOGGLE_LINK: () => void;
    onClickTOGGLE_BOLD: () => void;
    onClickTOGGLE_ITALIC: () => void;
    onClickTOGGLE_CODE: () => void;
    onClickTOGGLE_LINK: () => void;
    // Alignment handlers
    handleAlignLeft: () => void;
    handleAlignCenter: () => void;
    handleAlignRight: () => void;
    onClickAlignLeft: () => void;
    onClickAlignCenter: () => void;
    onClickAlignRight: () => void;
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
    onClickAddRow: (position: InsertPosition.ROW_ABOVE | InsertPosition.ROW_BELOW) => void;
    onClickRemoveRow: () => void;
    onClickAddColumn: (position: InsertPosition.COL_LEFT | InsertPosition.COL_RIGHT) => void;
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

/** Menu actions mapped by direction */
export type DirectionalMenuActionMap = {
    [SpreadsheetDirection.ROW]: DirectionalMenuActions<SpreadsheetDirection.ROW>;
    [SpreadsheetDirection.COLUMN]: DirectionalMenuActions<SpreadsheetDirection.COLUMN>;
};

/** Base menu configuration */
export interface MenuConfig<T extends SpreadsheetDirection> {
    props: DirectionalMenuProps<T>;
    actions: MenuActionMap[T];
}

/** Menu configuration by direction */
export type DirectionalMenuConfig = {
    [D in SpreadsheetDirection]: MenuConfig<D>;
};

export type WithDirectionalMenuProps<T extends SpreadsheetDirection> = T extends SpreadsheetDirection.ROW
    ? RowContextMenuProps
    : ColumnContextMenuProps;