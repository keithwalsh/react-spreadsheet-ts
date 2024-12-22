/**
 * @fileoverview Hook to manage drag selection state and actions for spreadsheet
 * rows and columns.
 */

import { useCallback } from "react";
import { useAtom } from "jotai";
import { PrimitiveAtom } from "jotai";
import { SpreadsheetState } from "../types";

export const useDragSelection = (atom: PrimitiveAtom<SpreadsheetState>) => {
    const [state, setState] = useAtom(atom);

    const handleDragStart = useCallback(
        (row: number, col: number) => {
            const newState = { ...state };
            // Update drag state with correct property names
            newState.selection.dragState = {
                isDragging: true,
                start: { rowIndex: row, colIndex: col }
            };

            // Clear previous selections
            newState.selection.activeCell = null;
            newState.selection.columns = [];
            newState.selection.rows = [];
            newState.selection.cells = state.selection.cells.map((row) => row.map(() => false));
            newState.selection.isAllSelected = false;

            // Set new selection
            if (col === -1 && row >= 0) {
                newState.selection.rows = [row];
            } else if (row === -1 && col >= 0) {
                newState.selection.columns = [col];
            } else if (row >= 0 && col >= 0) {
                if (newState.selection.cells[row]) {
                    newState.selection.cells[row][col] = true;
                }
            }

            setState(newState);
        },
        [state, setState]
    );

    const handleDragEnter = useCallback(
        (row: number, col: number) => {
            if (!state.selection.dragState?.isDragging || !state.selection.dragState.start) return;

            const { rowIndex: startRow, colIndex: startCol } = state.selection.dragState.start;

            // Helper function to generate range array
            const getRange = (start: number, end: number) => 
                Array.from({ length: Math.abs(end - start) + 1 }, (_, i) => Math.min(start, end) + i);

            const newState = { ...state };
            
            if (startCol === -1 && row >= 0) {
                newState.selection.rows = getRange(startRow, row);
            } else if (startRow === -1 && col >= 0) {
                newState.selection.columns = getRange(startCol, col);
            } else if (row >= 0 && col >= 0) {
                const [minRow, maxRow] = [Math.min(startRow, row), Math.max(startRow, row)];
                const [minCol, maxCol] = [Math.min(startCol, col), Math.max(startCol, col)];
                
                newState.selection.cells = state.selection.cells.map((rowCells, rowIndex) =>
                    rowCells.map((_, colIndex) => 
                        rowIndex >= minRow && rowIndex <= maxRow && 
                        colIndex >= minCol && colIndex <= maxCol
                    )
                );
            }

            setState(newState);
        },
        [state, setState]
    );

    const handleDragEnd = useCallback(() => {
        setState({
            ...state,
            selection: {
                ...state.selection,
                dragState: { isDragging: false, start: null }
            }
        });
    }, [state, setState]);

    return {
        handleDragStart,
        handleDragEnter,
        handleDragEnd,
    };
};

export default useDragSelection;
