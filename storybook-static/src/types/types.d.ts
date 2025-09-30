import { TableCellProps } from '@mui/material';
import { PrimitiveAtom } from 'jotai';
import { CSSProperties } from '../../node_modules/react';
import { ActionType, Alignment, BaseHeaderCellProps, BaseMenuProps, BaseProps, BaseStructurePayload, BaseHandlers, CellCoordinate, CellData, DimensionPayload, Dimensions, HandlerAction, HeaderCellProps, InsertPosition, OperationResult, PositionalPayload, SpreadsheetDirection, SpreadsheetState, TextFormatting } from './';
/**
 * Payload for adding rows or columns with direction-specific positions.
 * Combines the base with row/column union constraints.
 */
export type AddStructurePayload = BaseStructurePayload & ({
    direction: SpreadsheetDirection.ROW;
    position: InsertPosition.ROW_ABOVE | InsertPosition.ROW_BELOW;
} | {
    direction: SpreadsheetDirection.COLUMN;
    position: InsertPosition.COL_LEFT | InsertPosition.COL_RIGHT;
});
/** Function type for a structure operation */
export type StructureOperation = (options: AddStructurePayload) => OperationResult;
/** For Jotai-based state; replace import path if needed */
export type SpreadsheetAtom = ReturnType<typeof import('../store/atoms').createSpreadsheetAtom>;
/** Payload for drag events: row-based, column-based, or cell-based */
export type DragPayload = Omit<CellCoordinate, "colIndex"> | Omit<CellCoordinate, "rowIndex"> | CellCoordinate;
/** Consolidated action definition for spreadsheet updates */
export type Action = {
    type: ActionType.UPDATE_TABLE_DATA;
    payload: CellData[][];
} | {
    type: Extract<ActionType, ActionType.UNDO | ActionType.REDO | ActionType.CLEAR_SELECTION>;
} | {
    type: ActionType.INSERT_ROW | ActionType.INSERT_COLUMN;
    payload: PositionalPayload;
} | {
    type: ActionType.DELETE_ROW | ActionType.DELETE_COLUMN;
    payload: DimensionPayload;
} | {
    type: ActionType.START_CELL_DRAG | ActionType.UPDATE_CELL_DRAG;
    payload: CellCoordinate;
} | {
    type: ActionType.END_CELL_DRAG;
} | {
    type: ActionType.START_ROW_DRAG;
    payload: number;
} | {
    type: ActionType.UPDATE_ROW_DRAG;
    payload: number;
} | {
    type: ActionType.END_ROW_DRAG;
} | {
    type: ActionType.START_COLUMN_DRAG;
    payload: number;
} | {
    type: ActionType.UPDATE_COLUMN_DRAG;
    payload: number;
} | {
    type: ActionType.END_COLUMN_DRAG;
} | {
    type: ActionType.RESIZE_TABLE;
    payload: {
        row: number;
        col: number;
    };
} | {
    type: ActionType.CLEAR_TABLE;
} | {
    type: ActionType.TRANSPOSE_DATA;
} | {
    type: ActionType.APPLY_TEXT_FORMAT;
    payload: {
        operation: TextFormatting;
    };
} | {
    type: ActionType.START_ROW_SELECTION;
    payload: number;
} | {
    type: ActionType.UPDATE_ROW_SELECTION;
    payload: number;
} | {
    type: ActionType.END_ROW_SELECTION;
} | {
    type: ActionType.START_COLUMN_SELECTION;
    payload: number;
} | {
    type: ActionType.UPDATE_COLUMN_SELECTION;
    payload: number;
} | {
    type: ActionType.END_COLUMN_SELECTION;
};
/** Generic drag event handler type */
export type DragEventHandler = (row: number, col: number) => void;
/** Pattern for handler method names using HandlerAction enum */
export type HandlerPattern = `${Lowercase<keyof typeof HandlerAction>}${string}`;
/** Unified click/handle action type */
export type ActionHandler = {
    [K in TextFormatting | keyof typeof Alignment | ToolbarTableAction as `onClick${K}` | `handle${K}`]: () => void;
};
/** Configuration for a menu action's key and method names */
export type ActionConfig = {
    key: string;
    method: string;
};
/** Base click handlers for alignment, text formatting, and toolbar actions */
export type BaseClickHandlers = {
    [K in keyof typeof Alignment | TextFormatting | ToolbarTableAction as `onClick${K}` | `handle${K}`]: () => void;
};
/** Base actions available for menu operations */
export type BaseMenuAction = Extract<ActionType, ActionType.INSERT_ROW | ActionType.INSERT_COLUMN | ActionType.DELETE_ROW | ActionType.DELETE_COLUMN>;
/** Directional menu actions */
export type DirectionalMenuHandlers<T extends SpreadsheetDirection> = T extends SpreadsheetDirection.ROW ? {
    onAddAbove: () => void;
    onAddBelow: () => void;
    onRemove: () => void;
} : {
    onAddLeft: () => void;
    onAddRight: () => void;
    onRemove: () => void;
};
/** Unified menu props */
export type DirectionalMenuProps<T extends SpreadsheetDirection> = BaseMenuProps & DirectionalMenuHandlers<T>;
/** Props for the column context menu. */
export type ColumnContextMenuProps = DirectionalMenuProps<SpreadsheetDirection.COLUMN>;
/** Directional header cell props */
export type DirectionalHeaderCellProps<T extends SpreadsheetDirection> = BaseHeaderCellProps & (T extends SpreadsheetDirection.ROW ? {
    onAddAbove: (index: number) => void;
    onAddBelow: (index: number) => void;
    onRemove: (index: number) => void;
} : {
    onAddColumnLeft: (index: number) => void;
    onAddColumnRight: (index: number) => void;
    onRemoveColumn: (index: number) => void;
});
/** Props for creating a menu based on type (row or column) */
export type CreateMenuProps<T extends SpreadsheetDirection> = {
    props: HeaderCellProps<T>;
    index: number;
    type: T;
};
/** Get menu actions for a specific direction */
export type DirectionalMenuActions<T extends SpreadsheetDirection> = MenuActionMap[T];
/** Generic menu actions map keyed by SpreadsheetDirection */
export type MenuActionMap = {
    [D in SpreadsheetDirection]: D extends SpreadsheetDirection.ROW ? {
        addAbove: () => void;
        addBelow: () => void;
        remove: () => void;
    } : {
        addLeft: () => void;
        addRight: () => void;
        remove: () => void;
    };
};
export type MenuActionConfig = {
    [D in SpreadsheetDirection]: {
        props: D extends SpreadsheetDirection.ROW ? DirectionalMenuProps<SpreadsheetDirection.ROW> : Omit<ColumnContextMenuProps, keyof BaseMenuProps>;
        actions: MenuActionMap[D];
    };
};
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
    rowIndex: number;
    onDragStart: (event: React.DragEvent<HTMLElement>) => void;
    onDragEnter: (event: React.DragEvent<HTMLElement>) => void;
    onDragEnd: () => void;
    onAddAbove: (index: number) => void;
    onAddBelow: (index: number) => void;
    onRemove: (index: number) => void;
};
export type SelectAllCellProps = TableCellProps & {
    selectAll: boolean;
    toggleSelectAll: () => void;
    iconSize?: number;
};
export type ToolbarTableAction = Extract<ActionType, ActionType.UNDO | ActionType.REDO> | ActionType.CLEAR_TABLE | ActionType.TRANSPOSE_DATA;
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
/** All toolbar actions */
export type ToolbarActionHandlers = {
    [K in TextFormatting | keyof typeof Alignment as `onClick${K}` | `handle${K}`]: () => void;
} & {
    [K in ToolbarTableAction as `onClick${K}` | `handle${K}`]: () => void;
} & {
    onClickAddRow: (position: InsertPosition.ROW_ABOVE | InsertPosition.ROW_BELOW) => void;
    onClickAddColumn: (position: InsertPosition.COL_LEFT | InsertPosition.COL_RIGHT) => void;
    onClickRemoveRow: () => void;
    onClickRemoveColumn: () => void;
    onClickSetLink: () => void;
    handleLink: (params: {
        url: string | undefined;
        activeCell: CellCoordinate;
    }) => void;
};
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
export type WithDirectionalMenuProps<T extends SpreadsheetDirection> = T extends SpreadsheetDirection.ROW ? RowContextMenuProps : ColumnContextMenuProps;
//# sourceMappingURL=types.d.ts.map