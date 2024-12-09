import { Alignment, CellData } from "../types";

interface OperationParams {
    data: CellData[][];
    selectedCells: boolean[][];
    index?: number;
    position?: "left" | "right";
}

const spliceColumn = <T>(array: T[][], index: number, count: number): T[][] => {
    return array.map(row => {
        const newRow = [...row];
        newRow.splice(index, count);
        return newRow;
    });
};

export const addRow = ({ data, selectedCells, index = data.length }: OperationParams) => {
    const newRow = Array(data[0].length).fill(null).map(() => ({
        content: "",
        alignment: "left" as Alignment,
        bold: false,
        italic: false,
        code: false
    }));
    const newSelectedCellsRow = Array(selectedCells[0].length).fill(false);
    
    return {
        newData: [
            ...data.slice(0, index),
            newRow,
            ...data.slice(index)
        ],
        newSelectedCells: [
            ...selectedCells.slice(0, index),
            newSelectedCellsRow,
            ...selectedCells.slice(index)
        ],
    };
};

export const removeRow = ({ data, selectedCells, index = data.length - 1 }: OperationParams) => {
    return {
        newData: [
            ...data.slice(0, index),
            ...data.slice(index + 1)
        ],
        newSelectedCells: [
            ...selectedCells.slice(0, index),
            ...selectedCells.slice(index + 1)
        ],
    };
};

export const addColumn = ({ data, selectedCells, index = 0, position = "right" }: OperationParams) => {
    const columnIndex = position === "right" ? index + 1 : index;
    const newData = data.map(row => {
        const newRow = [...row];
        newRow.splice(columnIndex, 0, {
            content: "",
            alignment: "left" as Alignment,
            bold: false,
            italic: false,
            code: false
        });
        return newRow;
    });

    const newSelectedCells = selectedCells.map(row => {
        const newRow = [...row];
        newRow.splice(columnIndex, 0, false);
        return newRow;
    });

    return {
        newData,
        newSelectedCells,
    };
};

export const removeColumn = ({ data, selectedCells, index = 0 }: OperationParams) => {
    return {
        newData: spliceColumn(data, index, 1),
        newSelectedCells: spliceColumn(selectedCells, index, 1),
    };
};

export const transpose = ({ data, selectedCells }: OperationParams) => {
    const rows = data[0].length;
    const cols = data.length;
    const newData: CellData[][] = Array.from({ length: rows }, () =>
        Array(cols).fill(null).map(() => ({
            content: "",
            alignment: "left" as Alignment,
            bold: false,
            italic: false,
            code: false
        }))
    );

    // Transpose the data
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            newData[i][j] = { ...data[j][i] };
        }
    }

    // Transpose the selected cells
    const newSelectedCells = Array.from({ length: rows }, () => Array(cols).fill(false));
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            newSelectedCells[i][j] = selectedCells[j][i];
        }
    }

    return {
        newData,
        newSelectedCells,
    };
};
