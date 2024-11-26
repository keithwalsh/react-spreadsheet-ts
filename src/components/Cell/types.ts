import { CSSProperties } from "react";

export type Alignment = 'left' | 'center' | 'right' | 'inherit' | 'justify'

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
