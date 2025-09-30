import { PrimitiveAtom } from 'jotai';
import { InsertPosition, SpreadsheetState } from '../types';
export declare const useRowOperations: (atom: PrimitiveAtom<SpreadsheetState>) => {
    handleAddRow: (position: InsertPosition.ROW_ABOVE | InsertPosition.ROW_BELOW) => void;
    handleRemoveRow: (index?: number) => void;
    handleAddRowAbove: (index: number) => void;
    handleAddRowBelow: (index: number) => void;
};
export declare const useColumnOperations: (atom: PrimitiveAtom<SpreadsheetState>) => {
    handleAddColumn: (position: InsertPosition.COL_LEFT | InsertPosition.COL_RIGHT) => void;
    handleRemoveColumn: (index?: number) => void;
    handleAddColumnLeft: (i: number) => void;
    handleAddColumnRight: (i: number) => void;
};
export declare const useTableStructure: (atom: PrimitiveAtom<SpreadsheetState>) => {
    handleAddColumn: (position: InsertPosition.COL_LEFT | InsertPosition.COL_RIGHT) => void;
    handleRemoveColumn: (index?: number) => void;
    handleAddColumnLeft: (i: number) => void;
    handleAddColumnRight: (i: number) => void;
    handleAddRow: (position: InsertPosition.ROW_ABOVE | InsertPosition.ROW_BELOW) => void;
    handleRemoveRow: (index?: number) => void;
    handleAddRowAbove: (index: number) => void;
    handleAddRowBelow: (index: number) => void;
};
export default useTableStructure;
//# sourceMappingURL=useTableStructure.d.ts.map