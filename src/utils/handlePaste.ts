/**
 * @file src/utils/handlePaste.ts
 * @fileoverview Manages pasting operations in the spreadsheet, adjusting table size and updating cell data and formatting.
 */

import { 
    Alignment, 
    CellData, 
    CellCoordinate, 
    PasteOperationResult, 
    TextStyle,
    Dimensions 
} from "../types";

/** Creates a formatting array for text styles or alignments */
const createFormattingArray = <T>(
    sourceArray: T[][], 
    rowIndex: number, 
    requiredCols: number, 
    defaultValue: T
): T[] => {
    if (rowIndex < sourceArray.length) {
        const existingRow = [...sourceArray[rowIndex]];
        while (existingRow.length < requiredCols) {
            existingRow.push(defaultValue);
        }
        return existingRow;
    }
    return Array(requiredCols).fill(defaultValue);
};

export const handlePaste = (
    clipboardText: string,
    data: CellData[][],
    selectedCell: CellCoordinate | null,
    alignments: Alignment[][],
    bold: boolean[][] = [],
    italic: boolean[][] = [],
    code: boolean[][] = []
): PasteOperationResult => {
    const rows = clipboardText.split(/\r?\n/).filter((row) => row.trim() !== "");
    const parsedData = rows.map((row) => row.split("\t"));

    if (parsedData.length === 0) {
        const dimensions: Dimensions = {
            rows: data.length,
            cols: data[0].length
        };

        return {
            newData: data,
            newAlignments: alignments,
            newBold: bold,
            newItalic: italic,
            newCode: code,
            newSelectedCells: Array.from({ length: dimensions.rows }, () => 
                Array(dimensions.cols).fill(false)
            ),
            dimensions
        };
    }

    const startRow = selectedCell?.rowIndex ?? 0;
    const startCol = selectedCell?.colIndex ?? 0;

    // Calculate required dimensions
    const dimensions: Dimensions = {
        rows: Math.max(data.length, startRow + parsedData.length),
        cols: Math.max(
            data[0]?.length ?? 0, 
            startCol + Math.max(...parsedData.map((row) => row.length))
        )
    };

    // Create new arrays with required dimensions
    const newData = Array.from({ length: dimensions.rows }, (_, rowIndex) => {
        if (rowIndex < data.length) {
            const existingRow = [...data[rowIndex]];
            while (existingRow.length < dimensions.cols) {
                existingRow.push({
                    value: "",
                    align: Alignment.LEFT,
                    style: {
                        bold: false,
                        italic: false,
                        code: false
                    } as TextStyle
                });
            }
            return existingRow;
        }
        return Array(dimensions.cols).fill(null).map(() => ({
            value: "",
            align: Alignment.LEFT,
            style: {
                bold: false,
                italic: false,
                code: false
            } as TextStyle
        }));
    });

    // Create new formatting arrays with required dimensions
    const newAlignments = Array.from({ length: dimensions.rows }, (_, rowIndex) => {
        if (rowIndex < alignments.length) {
            // Existing row: copy and extend if needed
            const existingRow = [...alignments[rowIndex]];
            while (existingRow.length < dimensions.cols) {
                existingRow.push(Alignment.LEFT);
            }
            return existingRow;
        }
        // New row: create with default left alignment
        return Array(dimensions.cols).fill(Alignment.LEFT);
    });

    const newBold = Array.from({ length: dimensions.rows }, (_, rowIndex) => createFormattingArray(bold, rowIndex, dimensions.cols, false));

    const newItalic = Array.from({ length: dimensions.rows }, (_, rowIndex) => createFormattingArray(italic, rowIndex, dimensions.cols, false));

    const newCode = Array.from({ length: dimensions.rows }, (_, rowIndex) => createFormattingArray(code, rowIndex, dimensions.cols, false));

    // Create a new array for selected cells
    const newSelectedCells = Array.from({ length: dimensions.rows }, () => Array(dimensions.cols).fill(false));

    // Mark the target cells as selected
    if (startRow !== null && startCol !== null) {
        for (let i = 0; i < parsedData.length; i++) {
            for (let j = 0; j < parsedData[i].length; j++) {
                if (startRow + i < newSelectedCells.length && startCol + j < newSelectedCells[0].length) {
                    newSelectedCells[startRow + i][startCol + j] = true;
                }
            }
        }
    }

    // Update data with pasted values
    parsedData.forEach((rowData, rIdx) => {
        rowData.forEach((cellData, cIdx) => {
            const targetRow = startRow + rIdx;
            const targetCol = startCol + cIdx;
            if (targetRow < newData.length && targetCol < newData[0].length) {
                newData[targetRow][targetCol] = {
                    ...newData[targetRow][targetCol],
                    value: cellData,
                    style: {
                        ...newData[targetRow][targetCol].style,
                        bold: newBold[targetRow][targetCol],
                        italic: newItalic[targetRow][targetCol],
                        code: newCode[targetRow][targetCol]
                    }
                };
            }
        });
    });

    return {
        newData,
        newAlignments,
        newBold,
        newItalic,
        newCode,
        newSelectedCells,
        dimensions
    };
};
