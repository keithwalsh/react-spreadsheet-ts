import { CellData } from "../types/index";
import { TableStructureModification, AddColumnOptions, AddRowOptions } from "../types/interactionTypes";

const spliceColumn = <T>(array: T[][], index: number, count: number): T[][] => {
    return array.map((row) => {
        const newRow = [...row];
        newRow.splice(index, count);
        return newRow;
    });
};

export function addRow({ data, selectedCells, index = data.length, position = "below" }: AddRowOptions) {
    const newRow = Array(data[0].length).fill({ value: "", bold: false, italic: false, code: false, align: "left" });
    const newSelectedRow = Array(data[0].length).fill(false);
    const insertIndex = position === "above" ? index : index + 1;

    const newData = [...data];
    newData.splice(insertIndex, 0, newRow);

    const newSelectedCells = [...selectedCells];
    newSelectedCells.splice(insertIndex, 0, newSelectedRow);

    return { newData, newSelectedCells };
}

export const removeRow = ({ data, selectedCells, index = data.length - 1 }: TableStructureModification) => {
    if (data.length <= 1) return { newData: data, newSelectedCells: selectedCells };

    return {
        newData: [...data.slice(0, index), ...data.slice(index + 1)],
        newSelectedCells: [...selectedCells.slice(0, index), ...selectedCells.slice(index + 1)],
    };
};

export function addColumn({ data, selectedCells, index = 0, position = "right" }: AddColumnOptions) {
    const newData = data.map((row) => {
        const newRow = [...row];
        const insertIndex = position === "left" ? index : index + 1;
        newRow.splice(insertIndex, 0, { value: "", bold: false, italic: false, code: false, align: "left" });
        return newRow;
    });

    const newSelectedCells = selectedCells.map((row) => {
        const newRow = [...row];
        const insertIndex = position === "left" ? index : index + 1;
        newRow.splice(insertIndex, 0, false);
        return newRow;
    });

    return { newData, newSelectedCells };
}

export const removeColumn = ({ data, selectedCells, index = 0 }: TableStructureModification) => {
    if (data[0].length <= 1) return { newData: data, newSelectedCells: selectedCells };

    return {
        newData: spliceColumn(data, index, 1),
        newSelectedCells: spliceColumn(selectedCells, index, 1),
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
