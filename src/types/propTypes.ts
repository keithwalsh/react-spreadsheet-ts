// src/types/propTypes.ts
/**
 * @fileoverview Component prop type definitions for all React components in the
 * spreadsheet, ensuring type safety across the component hierarchy.
 */

import { TableCellProps } from "@mui/material";
import { IconBaseProps } from "react-icons";
import { PrimitiveAtom } from "jotai";
import { CellData, State } from "./dataTypes";
import { ToolbarContextType } from "./interactionTypes";

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
