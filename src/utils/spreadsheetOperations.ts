import { Alignment } from "../types";

type OperationParams = {
    data: string[][];
    alignments: Alignment[][];
    selectedCells: boolean[][];
    index?: number;
    position?: "left" | "right";
};

/**
 * Transposes a 2D array
 */
export function transpose<T>(matrix: T[][]): T[][] {
    return matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]))
}

/**
 * Helper function to splice a column from a 2D array
 */
function spliceColumn<T>(matrix: T[][], index: number, deleteCount: number, value?: T): T[][] {
    return matrix.map(row => {
        const newRow = [...row]
        newRow.splice(index, deleteCount, ...(value ? [value] : []))
        return newRow
    })
}

export const addRow = ({ data, alignments, selectedCells }: OperationParams) => {
    const newRow = Array(data[0].length).fill("");
    const newAlignmentRow = Array(alignments[0].length).fill("left" as Alignment);
    const newSelectedCellsRow = Array(selectedCells[0].length).fill(false);
    return {
        newData: [...data, newRow],
        newAlignments: [...alignments, newAlignmentRow],
        newSelectedCells: [...selectedCells, newSelectedCellsRow],
    };
};

export const removeRow = ({ data, alignments, selectedCells }: OperationParams) => {
    if (data.length > 1) {
        return {
            newData: data.slice(0, -1),
            newAlignments: alignments.slice(0, -1),
            newSelectedCells: selectedCells.slice(0, -1),
        };
    }
    return { newData: data, newAlignments: alignments, newSelectedCells: selectedCells };
};

export const addColumn = ({ data, alignments, selectedCells, index = 0, position = "right" }: OperationParams) => {
    const insertIndex = position === "left" ? index : index + 1;
    const newData = data.map((row) => {
        const newRow = [...row];
        newRow.splice(insertIndex, 0, "");
        return newRow;
    });
    const newAlignments = alignments.map((row) => {
        const newRow = [...row];
        newRow.splice(insertIndex, 0, "left" as Alignment);
        return newRow;
    });
    const newSelectedCells = selectedCells.map((row) => {
        const newRow = [...row];
        newRow.splice(insertIndex, 0, false);
        return newRow;
    });
    return { newData, newAlignments, newSelectedCells };
};

export const removeColumn = ({ data, alignments, selectedCells, index = 0 }: OperationParams) => {
    if (data[0].length > 1) {
        return {
            newData: spliceColumn(data, index, 1),
            newAlignments: spliceColumn(alignments, index, 1),
            newSelectedCells: spliceColumn(selectedCells, index, 1)
        }
    }
    return { newData: data, newAlignments: alignments, newSelectedCells: selectedCells }
}
