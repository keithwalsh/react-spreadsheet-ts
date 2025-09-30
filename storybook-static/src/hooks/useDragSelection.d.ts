import { PrimitiveAtom } from 'jotai';
import { SpreadsheetState } from '../types';
export declare const useDragSelection: (atom: PrimitiveAtom<SpreadsheetState>) => {
    handleDragStart: (row: number, col: number) => void;
    handleDragEnter: (row: number, col: number) => void;
    handleDragEnd: () => void;
};
export default useDragSelection;
//# sourceMappingURL=useDragSelection.d.ts.map