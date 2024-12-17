import { useCallback } from 'react';

interface KeyboardNavigationResult {
    row: number;
    col: number;
}

export const useKeyboardNavigation = () => {
    const handleKeyNavigation = useCallback((
        e: React.KeyboardEvent,
        currentRow: number,
        currentCol: number,
        maxRow: number,
        maxCol: number
    ): KeyboardNavigationResult | null => {
        let newRow = currentRow;
        let newCol = currentCol;

        switch (e.key) {
            case "ArrowUp":
                newRow = Math.max(0, currentRow - 1);
                break;
            case "ArrowDown":
                newRow = Math.min(maxRow, currentRow + 1);
                break;
            case "ArrowLeft":
                newCol = Math.max(0, currentCol - 1);
                break;
            case "ArrowRight":
                newCol = Math.min(maxCol, currentCol + 1);
                break;
            case "Tab":
                e.preventDefault();
                if (e.shiftKey) {
                    if (currentCol > 0) {
                        newCol = currentCol - 1;
                    } else if (currentRow > 0) {
                        newRow = currentRow - 1;
                        newCol = maxCol;
                    }
                } else {
                    if (currentCol < maxCol) {
                        newCol = currentCol + 1;
                    } else if (currentRow < maxRow) {
                        newRow = currentRow + 1;
                        newCol = 0;
                    }
                }
                break;
            default:
                return null;
        }

        if (newRow === currentRow && newCol === currentCol) {
            return null;
        }

        return { row: newRow, col: newCol };
    }, []);

    return handleKeyNavigation;
};
