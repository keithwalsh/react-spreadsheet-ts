import { CSSProperties } from "react";
import { TableCellProps } from "@mui/material";
import { IconBaseProps } from "react-icons";

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
    | { type: "ADD_COLUMN"; payload: { index: number; position: "left" | "right" } }
    | { type: "REMOVE_COLUMN"; payload: { index: number } }
    | { type: "SET_ALIGNMENT"; payload: Alignment }
    | {
        type: "HANDLE_PASTE";
        payload: PasteOperationResult;
    }
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

export type Alignment = 'left' | 'center' | 'right' | 'inherit' | 'justify';

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

export interface ButtonGroupProps {
    visibleButtons?: string[];
    orientation?: 'horizontal' | 'vertical';
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

export interface CellFormat {
    bold: boolean
    italic: boolean
    code: boolean
    alignment: Alignment
}

export interface CellProps {
    rowIndex: number;
    colIndex: number;
    align: Alignment;
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

export interface ColumnContextMenuProps {
    anchorEl: HTMLElement | null;
    open: boolean;
    onClose: () => void;
    onAddLeft: () => void;
    onAddRight: () => void;
    onRemove: () => void;
}

export interface ColumnHeaderCellProps {
    index: number;
    handleColumnSelection: (index: number) => void;
    selectedColumns?: Set<number>;
    className?: string;
    onAddColumnLeft: (index: number) => void;
    onAddColumnRight: (index: number) => void;
    onRemoveColumn: (index: number) => void;
    onDragStart: (index: number) => void;
    onDragEnter: (index: number) => void;
    onDragEnd: () => void;
}

export interface NewTableModalProps {
    open: boolean;
    onClose: () => void;
    onCreateNewTable: (rows: number, columns: number) => void;
}

export interface PasteOperationResult {
    newData: string[][]
    newAlignments: Alignment[][]
    dimensions: {
        rows: number
        cols: number
    }
}

export interface RowNumberCellProps {
    children?: React.ReactNode;
    className?: string;
    onClick?: () => void;
    selectedRows?: Set<number>;
    rowIndex: number;
    ref?: React.Ref<HTMLTableRowElement> | null;
    onDragStart: (rowIndex: number) => void;
    onDragEnter: (rowIndex: number) => void;
    onDragEnd: () => void;
}

export interface RowProps {
    children?: React.ReactNode;
    className?: string;
    ref?: React.Ref<HTMLTableRowElement> | null;
}

export interface SelectAllCellProps extends TableCellProps {
    selectAll: boolean;
    toggleSelectAll: () => void;
    iconSize?: number;
}

export interface SpreadsheetProps {
    toolbarOrientation?: 'horizontal' | 'vertical'
    initialRows?: number
    initialColumns?: number
    tableHeight?: string
    value?: string[][]
    onChange?: (data: string[][]) => void
    onFormatChange?: (row: number, col: number, format: CellFormat) => void
}

export interface State {
    data: string[][];
    past: [string[][], Alignment[][]][];
    future: [string[][], Alignment[][]][];
    alignments: Alignment[][];
    bold: boolean[][];
    italic: boolean[][];
    code: boolean[][];
    selectedColumn: number | null;
    selectedRow: number | null;
    selectedCell: { row: number; col: number } | null;
    selectedCells: boolean[][];
    selectAll: boolean;
    isDragging: boolean;
    dragStart: { row: number; col: number } | null;
    dragStartRow: number | null;
    dragStartColumn: number | null;
}

export interface TableMenuProps {
    onCreateNewTable: (rows: number, columns: number) => void;
    onDownloadCSV: () => void;
}

export interface TableProps {
    children?: React.ReactNode;
    className?: string;
    onPaste?: (event: React.ClipboardEvent<HTMLDivElement>) => void;
    style?: React.CSSProperties;
}

export interface TableSizeChooserProps {
    maxRows: number
    maxCols: number
    currentRows: number
    currentCols: number
    onSizeSelect: (rows: number, cols: number) => void
}

export interface ToolbarContextType {
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
    clearTable: () => void;
    transposeTable: () => void;
}

export interface ToolbarProviderProps extends ToolbarContextType {
    children: React.ReactNode;
}

export interface UseTableSizeChooserProps extends TableSizeChooserProps {}

export interface UseTableSizeChooserReturn {
    hoveredRow: number;
    hoveredCol: number;
    inputRows: string;
    inputCols: string;
    handleMouseEnter: (rowIndex: number, colIndex: number) => void;
    handleClick: () => void;
    handleInputChange: (type: 'rows' | 'cols', value: string) => void;
    handleInputBlur: () => void;
    handleInputFocus: () => void;
    setHoveredRow: React.Dispatch<React.SetStateAction<number>>;
    setHoveredCol: React.Dispatch<React.SetStateAction<number>>;
}