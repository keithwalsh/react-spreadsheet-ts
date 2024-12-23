/**
 * @file src/hooks/useKeyboardNavigation.ts
 * @fileoverview Provides a hook for handling keyboard navigation within a spreadsheet,
 * allowing movement between cells using arrow keys and tab navigation.
 */

import { useCallback } from 'react';
import { CellCoordinate } from '../types';

export const useKeyboardNavigation = () => {
    const handleKeyNavigation = useCallback((
        e: React.KeyboardEvent,
        currentRowIndex: number,
        currentColIndex: number,
        maxRow: number,
        maxCol: number
    ): CellCoordinate | null => {
        let newRow = currentRowIndex;
        let newCol = currentColIndex;

        switch (e.key) {
            case "ArrowUp":
                newRow = Math.max(0, currentRowIndex - 1);
                break;
            case "ArrowDown":
                newRow = Math.min(maxRow, currentRowIndex + 1);
                break;
            case "ArrowLeft":
                newCol = Math.max(0, currentColIndex - 1);
                break;
            case "ArrowRight":
                newCol = Math.min(maxCol, currentColIndex + 1);
                break;
            case "Tab":
                e.preventDefault();
                if (e.shiftKey) {
                    if (currentColIndex > 0) {
                        newCol = currentColIndex - 1;
                    } else if (currentRowIndex > 0) {
                        newRow = currentRowIndex - 1;
                        newCol = maxCol;
                    }
                } else {
                    if (currentColIndex < maxCol) {
                        newCol = currentColIndex + 1;
                    } else if (currentRowIndex < maxRow) {
                        newRow = currentRowIndex + 1;
                        newCol = 0;
                    }
                }
                break;
            default:
                return null;
        }

        if (newRow === currentRowIndex && newCol === currentColIndex) {
            return null;
        }

        return {
            rowIndex: newRow,
            colIndex: newCol
        };
    }, []);

    return handleKeyNavigation;
};
