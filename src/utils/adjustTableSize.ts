// src/utils/adjustTableSize.ts

import { Alignment } from "../store/types";

export const adjustTableSize = (
    existingData: string[][],
    existingAlignments: Alignment[][],
    newRows: number,
    newCols: number
): { data: string[][]; alignments: Alignment[][]; selectedCells: boolean[][] } => {
    const data: string[][] = [];
    const alignments: Alignment[][] = [];
    const selectedCells: boolean[][] = [];

    for (let rowIndex = 0; rowIndex < newRows; rowIndex++) {
        const rowData: string[] = [];
        const rowAlignments: Alignment[] = [];
        const rowSelectedCells: boolean[] = [];

        for (let colIndex = 0; colIndex < newCols; colIndex++) {
            // Data
            if (existingData[rowIndex] && existingData[rowIndex][colIndex] !== undefined) {
                rowData.push(existingData[rowIndex][colIndex]);
            } else {
                rowData.push("");
            }

            // Alignments
            if (
                existingAlignments[rowIndex] &&
                existingAlignments[rowIndex][colIndex] !== undefined &&
                ["left", "center", "right"].includes(existingAlignments[rowIndex][colIndex])
            ) {
                rowAlignments.push(existingAlignments[rowIndex][colIndex] as Alignment);
            } else {
                rowAlignments.push("left");
            }

            // Selected Cells
            rowSelectedCells.push(false);
        }

        data.push(rowData);
        alignments.push(rowAlignments);
        selectedCells.push(rowSelectedCells);
    }

    return { data, alignments, selectedCells };
};
