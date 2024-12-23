/**
 * @file src/utils/handlePaste.ts
 * @fileoverview Manages pasting operations in the spreadsheet, adjusting table size and updating cell data and formatting.
 */

import { Alignment, CellData, PasteOperationResult } from "../types/index";

/** Handles pasting clipboard data into the table, adjusting table size and updating data and alignments. */
const createFormattingArray = <T>(sourceArray: T[][], rowIndex: number, requiredCols: number, defaultValue: T): T[] => {
    if (rowIndex < sourceArray.length) {
        // Existing row: copy and extend if needed
        const existingRow = [...sourceArray[rowIndex]];
        while (existingRow.length < requiredCols) {
            existingRow.push(defaultValue);
        }
        return existingRow;
    }
    // New row: create with default values
    return Array(requiredCols).fill(defaultValue);
};

export const handlePaste = (
    clipboardText: string,
    data: CellData[][],
    selectedCell: { row: number; col: number } | null,
    alignments: Alignment[][],
    bold: boolean[][] = [],
    italic: boolean[][] = [],
    code: boolean[][] = []
): PasteOperationResult => {
    const rows = clipboardText.split(/\r?\n/).filter((row) => row.trim() !== "");
    const parsedData = rows.map((row) => row.split("\t"));

    if (parsedData.length === 0) {
        return {
            newData: data,
            newAlignments: alignments,
            newBold: bold,
            newItalic: italic,
            newCode: code,
            newSelectedCells: Array.from({ length: data.length }, () => Array(data[0].length).fill(false)),
            dimensions: {
                rows: data.length,
                cols: data[0].length,
            },
        };
    }

    const startRow = selectedCell?.row ?? 0;
    const startCol = selectedCell?.col ?? 0;

    // Calculate required dimensions
    const requiredRows = Math.max(data.length, startRow + parsedData.length);
    const requiredCols = Math.max(data[0]?.length ?? 0, startCol + Math.max(...parsedData.map((row) => row.length)));

    // Create new array with required dimensions
    const newData = Array.from({ length: requiredRows }, (_, rowIndex) => {
        if (rowIndex < data.length) {
            const existingRow = [...data[rowIndex]];
            while (existingRow.length < requiredCols) {
                existingRow.push({
                    value: "",
                    align: Alignment.LEFT,
                    style: {
                        bold: false,
                        italic: false,
                        code: false
                    }
                });
            }
            return existingRow;
        }
        return Array(requiredCols)
            .fill(null)
            .map(() => ({
                value: "",
                align: Alignment.LEFT,
                style: {
                    bold: false,
                    italic: false,
                    code: false
                }
            }));
    });

    // Create new formatting arrays with required dimensions
    const newAlignments = Array.from({ length: requiredRows }, (_, rowIndex) => {
        if (rowIndex < alignments.length) {
            // Existing row: copy and extend if needed
            const existingRow = [...alignments[rowIndex]];
            while (existingRow.length < requiredCols) {
                existingRow.push(Alignment.LEFT);
            }
            return existingRow;
        }
        // New row: create with default left alignment
        return Array(requiredCols).fill(Alignment.LEFT);
    });

    const newBold = Array.from({ length: requiredRows }, (_, rowIndex) => createFormattingArray(bold, rowIndex, requiredCols, false));

    const newItalic = Array.from({ length: requiredRows }, (_, rowIndex) => createFormattingArray(italic, rowIndex, requiredCols, false));

    const newCode = Array.from({ length: requiredRows }, (_, rowIndex) => createFormattingArray(code, rowIndex, requiredCols, false));

    // Create a new array for selected cells
    const newSelectedCells = Array.from({ length: requiredRows }, () => Array(requiredCols).fill(false));

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
        dimensions: {
            rows: requiredRows,
            cols: requiredCols,
        },
    };
};
