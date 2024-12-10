import { CellData } from "../types/index";

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
        value: "",
        align: "left" as const,
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
        ]
    };
};

export const removeRow = ({ data, selectedCells, index = data.length - 1 }: OperationParams) => {
    if (data.length <= 1) return { newData: data, newSelectedCells: selectedCells };
    
    return {
        newData: [
            ...data.slice(0, index),
            ...data.slice(index + 1)
        ],
        newSelectedCells: [
            ...selectedCells.slice(0, index),
            ...selectedCells.slice(index + 1)
        ]
    };
};

export const addColumn = ({ data, selectedCells, index = 0, position = "right" }: OperationParams) => {
    const actualIndex = position === "right" ? index + 1 : index;
    
    const newData = data.map(row => {
        const newRow = [...row];
        newRow.splice(actualIndex, 0, {
            value: "",
            align: "left" as const,
            bold: false,
            italic: false,
            code: false
        });
        return newRow;
    });
    
    const newSelectedCells = selectedCells.map(row => {
        const newRow = [...row];
        newRow.splice(actualIndex, 0, false);
        return newRow;
    });
    
    return {
        newData,
        newSelectedCells
    };
};

export const removeColumn = ({ data, selectedCells, index = 0 }: OperationParams) => {
    if (data[0].length <= 1) return { newData: data, newSelectedCells: selectedCells };
    
    return {
        newData: spliceColumn(data, index, 1),
        newSelectedCells: spliceColumn(selectedCells, index, 1)
    };
};

export const transpose = ({ data, selectedCells }: OperationParams) => {
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
        newSelectedCells
    };
};
