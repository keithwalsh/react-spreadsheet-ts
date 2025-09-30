import { CellData, TableStructureModification, InsertPosition } from '../types';
type AddRowOptions = TableStructureModification & {
    position?: InsertPosition.ROW_ABOVE | InsertPosition.ROW_BELOW;
};
type AddColumnOptions = TableStructureModification & {
    position?: InsertPosition.COL_LEFT | InsertPosition.COL_RIGHT;
};
export declare function addRow({ data, selectedCells, targetIndex, position }: AddRowOptions): {
    newData: CellData[][];
    newSelectedCells: boolean[][];
};
export declare const removeRow: ({ data, selectedCells, targetIndex }: TableStructureModification) => {
    newData: CellData[][];
    newSelectedCells: boolean[][];
};
export declare function addColumn({ data, selectedCells, targetIndex, position }: AddColumnOptions): {
    newData: CellData[][];
    newSelectedCells: boolean[][];
};
export declare const removeColumn: ({ data, selectedCells, targetIndex }: TableStructureModification) => {
    newData: CellData[][];
    newSelectedCells: boolean[][];
};
export declare const transpose: ({ data, selectedCells }: Omit<TableStructureModification, "index">) => {
    newData: CellData[][];
    newSelectedCells: boolean[][];
};
export {};
//# sourceMappingURL=spreadsheetOperations.d.ts.map