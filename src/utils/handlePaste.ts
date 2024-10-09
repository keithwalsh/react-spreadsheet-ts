import { Alignment } from "../types";

/**
 * Handles pasting clipboard data into the table.
 * Adjusts the table size if necessary and updates data and alignments.
 */
export const handlePaste = (clipboardText: string, data: string[][], selectedCell: { row: number; col: number } | null, alignments: Alignment[][]) => {
    const rows = clipboardText.split(/\r?\n/).filter((row) => row.trim() !== "");
    const parsedData = rows.map((row) => row.split("\t"));

    if (parsedData.length === 0) return { newData: data, newAlignments: alignments };

    const startRow = selectedCell ? selectedCell.row : 0;
    const startCol = selectedCell ? selectedCell.col : 0;

    const requiredRows = startRow + parsedData.length;
    const requiredCols = startCol + Math.max(...parsedData.map((row) => row.length));

    let newData = [...data];
    let newAlignments = alignments.map((row) => [...row]);

    // Add new rows if necessary
    while (newData.length < requiredRows) {
        newData.push(Array(newData[0].length).fill(""));
        newAlignments.push(Array(newAlignments[0].length).fill("left" as Alignment));
    }

    // Add new columns if necessary
    if (requiredCols > newData[0].length) {
        const colsToAdd = requiredCols - newData[0].length;
        newData = newData.map((row) => [...row, ...Array(colsToAdd).fill("")]);
        newAlignments = newAlignments.map((row) => [...row, ...Array(colsToAdd).fill("left" as Alignment)]);
    }

    // Update data with pasted values
    parsedData.forEach((rowData, rIdx) => {
        rowData.forEach((cellData, cIdx) => {
            const targetRow = startRow + rIdx;
            const targetCol = startCol + cIdx;
            newData[targetRow][targetCol] = cellData;
        });
    });

    return { newData, newAlignments };
};
