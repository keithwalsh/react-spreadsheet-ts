/**
 * @file src/utils/spreadsheetOperations.ts
 * @fileoverview Provides functions for modifying spreadsheet data structures,
 * including adding and removing rows and columns, and transposing data.
 */

import { CellData, Alignment, TableStructureModification, InsertPosition } from "../types";

type AddRowOptions = TableStructureModification & {
    position?: InsertPosition.ROW_ABOVE | InsertPosition.ROW_BELOW;
};

type AddColumnOptions = TableStructureModification & {
    position?: InsertPosition.COL_LEFT | InsertPosition.COL_RIGHT;
};

const spliceColumn = <T>(array: T[][], index: number, count: number): T[][] => {
    return array.map((row: T[]) => {
        const newRow = [...row];
        newRow.splice(index, count);
        return newRow;
    });
};

export function addRow({ data, selectedCells, targetIndex = data.length, position = InsertPosition.ROW_BELOW }: AddRowOptions) {
    const newRow = Array(data[0].length).fill({
        value: "",
        style: { bold: false, italic: false, code: false },
        align: Alignment.LEFT
    });
    const newSelectedRow = Array(data[0].length).fill(false);
    const insertIndex = position === InsertPosition.ROW_ABOVE ? targetIndex : targetIndex + 1;

    const newData = [...data];
    newData.splice(insertIndex, 0, newRow);

    const newSelectedCells = [...selectedCells];
    newSelectedCells.splice(insertIndex, 0, newSelectedRow);

    return { newData, newSelectedCells };
}

export const removeRow = ({ data, selectedCells, targetIndex = data.length - 1 }: TableStructureModification) => {
    if (data.length <= 1) return { newData: data, newSelectedCells: selectedCells };

    return {
        newData: [...data.slice(0, targetIndex), ...data.slice(targetIndex + 1)],
        newSelectedCells: [...selectedCells.slice(0, targetIndex), ...selectedCells.slice(targetIndex + 1)],
    };
};

export function addColumn({ data, selectedCells, targetIndex = 0, position = InsertPosition.COL_RIGHT }: AddColumnOptions) {
    const newData = data.map((row: CellData[]) => {
        const newRow = [...row];
        const insertIndex = position === InsertPosition.COL_LEFT ? targetIndex : targetIndex + 1;
        newRow.splice(insertIndex, 0, {
            value: "",
            style: { bold: false, italic: false, code: false },
            align: Alignment.LEFT
        });
        return newRow;
    });

    const newSelectedCells = selectedCells.map((row: boolean[]) => {
        const newRow = [...row];
        const insertIndex = position === InsertPosition.COL_LEFT ? targetIndex : targetIndex + 1;
        newRow.splice(insertIndex, 0, false);
        return newRow;
    });

    return { newData, newSelectedCells };
}

export const removeColumn = ({ data, selectedCells, targetIndex = 0 }: TableStructureModification) => {
    if (data[0].length <= 1) return { newData: data, newSelectedCells: selectedCells };

    return {
        newData: spliceColumn(data, targetIndex, 1),
        newSelectedCells: spliceColumn(selectedCells, targetIndex, 1),
    };
};

export const transpose = ({ data, selectedCells }: Omit<TableStructureModification, "index">) => {
    const rows = data.length;
    const cols = data[0].length;

    const newData: CellData[][] = Array(cols)
        .fill(null)
        .map(() => Array(rows).fill(null));

    const newSelectedCells: boolean[][] = Array(cols)
        .fill(null)
        .map(() => Array(rows).fill(false));

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            newData[j][i] = { ...data[i][j] };
            newSelectedCells[j][i] = selectedCells[i][j];
        }
    }

    return {
        newData,
        newSelectedCells,
    };
};
