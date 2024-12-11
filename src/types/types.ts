/**
 * @fileoverview Core type definitions for the spreadsheet component, including
 * cell data structures, selection states, and component props.
 */

import { TableCellProps } from "@mui/material";
import { IconBaseProps } from "react-icons";
import { PrimitiveAtom } from "jotai";

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

export type Alignment = "left" | "center" | "right";

export interface ButtonHandlerKey {
    [key: string]: () => void;
}

export type ButtonDefinition = {
    title: string;
    icon: React.ComponentType<IconBaseProps>;
    handlerKey: string;
};

export interface CellData {
    value: string;
    // Add any other cell-specific properties here
}

export interface SelectedCell {
    row: number;
    col: number;
}

export type SelectedCells = Record<number, Record<number, boolean>>;

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

export type NewTableModalProps = {
    open: boolean;
    onClose: () => void;
    onCreateNewTable: (rows: number, columns: number) => void;
};

export type PasteOperationResult = {
    newData: CellData[][];
    newSelectedCells: boolean[][];
    newAlignments: Alignment[][];
    newBold: boolean[][];
    newItalic: boolean[][];
    newCode: boolean[][];
    dimensions: {
        rows: number;
        cols: number;
    };
};

export interface RowContextMenuProps {
    anchorEl: HTMLElement | null;
    open: boolean;
    onClose: () => void;
    onAddAbove: () => void;
    onAddBelow: () => void;
    onRemove: () => void;
}

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

export type SelectionRange = {
    startRow: number;
    startCol: number;
    endRow: number;
    endCol: number;
};

export type DataPayload = {
    data: CellData[][];
    selectedCell?: { row: number; col: number } | null;
    selectedCells?: boolean[][];
    selectedRows?: number[];
    selectedColumns?: number[];
    isDragging?: boolean;
    selectAll?: boolean;
};

export type State = {
    data: CellData[][];
    past: DataPayload[];
    future: DataPayload[];
    selectedColumn: number | null;
    selectedRow: number | null;
    selectedCell: { row: number; col: number } | null;
    selectedCells: boolean[][];
    selectedRows: number[];
    selectedColumns: number[];
    selectAll: boolean;
    isDragging: boolean;
    dragStart: { row: number; col: number } | null;
    dragStartRow: number | null;
    dragStartColumn: number | null;
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
    label: "Rows" | "Columns";
    value: string;
    onChange: (value: string) => void;
    max: number;
};

export type TableMenuProps = {
    onCreateNewTable: (rows: number, columns: number) => void;
    onDownloadCSV: () => void;
};

export type TableProps = {
    children?: React.ReactNode;
    className?: string;
    onPaste?: (event: React.ClipboardEvent<HTMLDivElement>) => void;
    style?: React.CSSProperties;
};

export type TableSizeChooserProps = {
    maxRows?: number;
    maxCols?: number;
    currentRows: number;
    currentCols: number;
    onSizeSelect: (rows: number, cols: number) => void;
};

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
}

export interface ToolbarProviderProps extends ToolbarContextType {
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

export interface HeaderCellStylesParams {
    isSelected: boolean;
    isHighlighted: boolean;
    isHovered: boolean;
}

export interface CellData {
    value: string;
    bold?: boolean;
    italic?: boolean;
    code?: boolean;
    align?: "left" | "center" | "right";
    link?: string;
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

export type ButtonId =
    | "bold"
    | "italic"
    | "code"
    | "alignLeft"
    | "alignCenter"
    | "alignRight"
    | "cut"
    | "copy"
    | "paste"
    | "delete"
    | "undo"
    | "redo"
    | "addRow"
    | "removeRow"
    | "addColumn"
    | "removeColumn"
    | "downloadCSV";

export type ButtonAction =
    | "onFormatBold"
    | "onFormatItalic"
    | "onFormatCode"
    | "onAlignLeft"
    | "onAlignCenter"
    | "onAlignRight"
    | "onCut"
    | "onCopy"
    | "onPaste"
    | "onDelete"
    | "onUndo"
    | "onRedo"
    | "onAddRow"
    | "onRemoveRow"
    | "onAddColumn"
    | "onRemoveColumn"
    | "onDownloadCSV";

export type TextFormattingOperation =
    | { operation: "BOLD" | "ITALIC" | "CODE" | "LINK"; payload?: string }
    | { operation: "ALIGN_LEFT" | "ALIGN_CENTER" | "ALIGN_RIGHT" };

export type TableSizePayload = {
    row: number;
    col: number;
    isInitialSetup?: boolean;
};

export interface AddColumnOptions {
    data: CellData[][];
    selectedCells: boolean[][];
    index: number;
    position: "left" | "right";
}

export interface AddRowOptions {
    data: CellData[][];
    selectedCells: boolean[][];
    index: number;
    position: "above" | "below";
}
