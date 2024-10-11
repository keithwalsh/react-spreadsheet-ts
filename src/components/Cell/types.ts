import { CSSProperties } from "react";

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
