import { Alignment, PasteOperationResult } from "../types";

/**
 * Handles pasting clipboard data into the table.
 * Adjusts the table size if necessary and updates data and alignments.
 */
export const handlePaste = (
    clipboardText: string,
    data: string[][],
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
            dimensions: {
                rows: data.length,
                cols: data[0].length
            }
        };
    }

    const startRow = selectedCell?.row ?? 0;
    const startCol = selectedCell?.col ?? 0;

    // Calculate required dimensions
    const requiredRows = Math.max(data.length, startRow + parsedData.length);
    const requiredCols = Math.max(
        data[0]?.length ?? 0,
        startCol + Math.max(...parsedData.map(row => row.length))
    );

    // Create new arrays with required dimensions
    const newData = Array.from({ length: requiredRows }, (_, rowIndex) => {
        if (rowIndex < data.length) {
            // Existing row: copy and extend if needed
            const existingRow = [...data[rowIndex]];
            while (existingRow.length < requiredCols) {
                existingRow.push("");
            }
            return existingRow;
        }
        // New row: create with empty strings
        return Array(requiredCols).fill("");
    });

    const newAlignments = Array.from({ length: requiredRows }, (_, rowIndex) => {
        if (rowIndex < alignments.length) {
            // Existing row: copy and extend if needed
            const existingRow = [...alignments[rowIndex]];
            while (existingRow.length < requiredCols) {
                existingRow.push("left" as Alignment);
            }
            return existingRow;
        }
        // New row: create with default left alignment
        return Array(requiredCols).fill("left" as Alignment);
    });

    // Create new formatting arrays with required dimensions
    const newBold = Array.from({ length: requiredRows }, (_, rowIndex) => {
        if (rowIndex < bold.length) {
            // Existing row: copy and extend if needed
            const existingRow = [...bold[rowIndex]];
            while (existingRow.length < requiredCols) {
                existingRow.push(false);
            }
            return existingRow;
        }
        // New row: create with default false values
        return Array(requiredCols).fill(false);
    });

    const newItalic = Array.from({ length: requiredRows }, (_, rowIndex) => {
        if (rowIndex < italic.length) {
            // Existing row: copy and extend if needed
            const existingRow = [...italic[rowIndex]];
            while (existingRow.length < requiredCols) {
                existingRow.push(false);
            }
            return existingRow;
        }
        // New row: create with default false values
        return Array(requiredCols).fill(false);
    });

    const newCode = Array.from({ length: requiredRows }, (_, rowIndex) => {
        if (rowIndex < code.length) {
            // Existing row: copy and extend if needed
            const existingRow = [...code[rowIndex]];
            while (existingRow.length < requiredCols) {
                existingRow.push(false);
            }
            return existingRow;
        }
        // New row: create with default false values
        return Array(requiredCols).fill(false);
    });

    // Update data with pasted values
    parsedData.forEach((rowData, rIdx) => {
        rowData.forEach((cellData, cIdx) => {
            const targetRow = startRow + rIdx;
            const targetCol = startCol + cIdx;
            if (targetRow < newData.length && targetCol < newData[0].length) {
                newData[targetRow][targetCol] = cellData;
            }
        });
    });

    return {
        newData,
        newAlignments,
        newBold,
        newItalic,
        newCode,
        dimensions: {
            rows: requiredRows,
            cols: requiredCols
        }
    };
};
