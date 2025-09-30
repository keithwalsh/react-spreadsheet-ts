import { PrimitiveAtom } from 'jotai';
import { Alignment, SpreadsheetState, CellCoordinate, TextStyle } from '../types';
export declare const useTextFormatting: (atom: PrimitiveAtom<SpreadsheetState>) => (format: keyof TextStyle) => void;
export declare const useAlignment: (atom: PrimitiveAtom<SpreadsheetState>) => (alignment: Alignment) => void;
export declare const useSpreadsheetActions: (atom: PrimitiveAtom<SpreadsheetState>) => {
    handleLink: ({ url, activeCell }: {
        url: string | undefined;
        activeCell: CellCoordinate;
    }) => void;
    handleTextFormatting: (format: keyof TextStyle) => void;
    handleSetAlignment: (alignment: Alignment) => void;
};
export default useSpreadsheetActions;
//# sourceMappingURL=useTableActions.d.ts.map