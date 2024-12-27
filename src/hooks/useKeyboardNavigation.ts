/**
 * @file src/hooks/useKeyboardNavigation.ts
 * @fileoverview Provides a hook for handling keyboard navigation within a spreadsheet,
 * allowing movement between cells using arrow keys and tab navigation.
 */

import { NavigationKey } from '../types/enums';
import { CellCoordinate } from '../types';

export const useKeyboardNavigation = () => {
    return (
        key: NavigationKey,
        currentRow: number,
        currentCol: number,
        maxRow: number,
        maxCol: number
    ): CellCoordinate | null => {
        switch (key) {
            case NavigationKey.UP:
                return currentRow > 0 
                    ? { rowIndex: currentRow - 1, colIndex: currentCol }
                    : null;
            case NavigationKey.DOWN:
                return currentRow < maxRow 
                    ? { rowIndex: currentRow + 1, colIndex: currentCol }
                    : null;
            case NavigationKey.LEFT:
                return currentCol > 0 
                    ? { rowIndex: currentRow, colIndex: currentCol - 1 }
                    : null;
            case NavigationKey.RIGHT:
                return currentCol < maxCol 
                    ? { rowIndex: currentRow, colIndex: currentCol + 1 }
                    : null;
            case NavigationKey.ENTER:
                return currentRow < maxRow 
                    ? { rowIndex: currentRow + 1, colIndex: currentCol }
                    : null;
            default:
                return null;
        }
    };
};
