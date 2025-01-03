/**
 * @file src/utils/adjustTableSize.ts
 * @fileoverview Provides a utility function to adjust the size of spreadsheet data and initialize selected cells.
 */

import { CellData, Alignment } from "../types";

export const adjustTableSize = (
    existingData: CellData[][],
    newRows: number,
    newCols: number
): { data: CellData[][]; selectedCells: boolean[][] } => {
    const data: CellData[][] = [];
    const selectedCells: boolean[][] = [];

    for (let rowIndex = 0; rowIndex < newRows; rowIndex++) {
        const rowData: CellData[] = [];
        const rowSelectedCells: boolean[] = [];

        for (let colIndex = 0; colIndex < newCols; colIndex++) {
            // Data
            if (existingData[rowIndex] && existingData[rowIndex][colIndex] !== undefined) {
                rowData.push({ ...existingData[rowIndex][colIndex] });
            } else {
                const newCell: CellData = {
                    value: "",
                    align: Alignment.LEFT,
                    style: {
                        bold: false,
                        italic: false,
                        code: false
                    }
                };
                rowData.push(newCell);
            }

            // Selected Cells
            rowSelectedCells.push(false);
        }

        data.push(rowData);
        selectedCells.push(rowSelectedCells);
    }

    return { data, selectedCells };
};
