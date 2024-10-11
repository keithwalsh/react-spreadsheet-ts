import { Alignment } from "../store/types";

/**
 * Adds a new row to the data, alignments, and selectedCells arrays.
 */
export const addRow = (data: string[][], alignments: Alignment[][], selectedCells: boolean[][]) => {
    const newRow = Array(data[0].length).fill("");
    const newAlignmentRow = Array(alignments[0].length).fill("left" as Alignment);
    const newSelectedCellsRow = Array(selectedCells[0].length).fill(false);
    return {
        newData: [...data, newRow],
        newAlignments: [...alignments, newAlignmentRow],
        newSelectedCells: [...selectedCells, newSelectedCellsRow],
    };
};

/**
 * Removes the last row from the data, alignments, and selectedCells arrays.
 * Prevents removing all rows.
 */
export const removeRow = (data: string[][], alignments: Alignment[][], selectedCells: boolean[][]) => {
    if (data.length > 1) {
        return {
            newData: data.slice(0, -1),
            newAlignments: alignments.slice(0, -1),
            newSelectedCells: selectedCells.slice(0, -1),
        };
    }
    return { newData: data, newAlignments: alignments, newSelectedCells: selectedCells };
};

/**
 * Adds a new column to the data, alignments, and selectedCells arrays.
 */
export const addColumn = (data: string[][], alignments: Alignment[][], selectedCells: boolean[][]) => {
    const newData = data.map((row) => [...row, ""]);
    const newAlignments = alignments.map((row) => [...row, "left" as Alignment]);
    const newSelectedCells = selectedCells.map((row) => [...row, false]);
    return { newData, newAlignments, newSelectedCells };
};

/**
 * Removes the last column from the data, alignments, and selectedCells arrays.
 * Prevents removing all columns.
 */
export const removeColumn = (data: string[][], alignments: Alignment[][], selectedCells: boolean[][]) => {
    if (data[0].length > 1) {
        const newData = data.map((row) => row.slice(0, -1));
        const newAlignments = alignments.map((row) => row.slice(0, -1));
        const newSelectedCells = selectedCells.map((row) => row.slice(0, -1));
        return { newData, newAlignments, newSelectedCells };
    }
    return { newData: data, newAlignments: alignments, newSelectedCells: selectedCells };
};
