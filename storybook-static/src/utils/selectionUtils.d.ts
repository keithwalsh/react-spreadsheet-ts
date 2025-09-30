import { CellCoordinate, CellData, SpreadsheetState } from '../types';
export declare function isCellInSelection({ state, rowIndex, colIndex }: {
    state: SpreadsheetState;
    rowIndex: number;
    colIndex: number;
}): boolean;
export declare function createNewSelectionState(data: CellData[][], coordinate: CellCoordinate): boolean[][];
//# sourceMappingURL=selectionUtils.d.ts.map