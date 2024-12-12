/**
 * @fileoverview Hook to manage drag selection state and actions for spreadsheet
 * rows and columns.
 */

import { useCallback } from "react";
import { useAtom } from "jotai";
import { PrimitiveAtom } from "jotai";
import { State } from "../types";

export const useDragSelection = (atom: PrimitiveAtom<State>) => {
    const [state, setState] = useAtom(atom);

    const handleDragStart = useCallback(
        (row: number, col: number) => {
            const newState = { ...state };
            newState.isDragging = true;
            newState.dragStart = { row, col };

            // Clear previous selections
            newState.selectedCell = null;
            newState.selectedColumns = [];
            newState.selectedRows = [];
            newState.selectedCells = state.selectedCells.map((row) => row.map(() => false));
            newState.selectAll = false;

            // Set new selection
            if (col === -1 && row >= 0) {
                newState.selectedRows = [row];
            } else if (row === -1 && col >= 0) {
                newState.selectedColumns = [col];
            } else if (row >= 0 && col >= 0) {
                newState.dragStartRow = row;
                newState.dragStartColumn = col;
                if (newState.selectedCells[row]) {
                    newState.selectedCells[row][col] = true;
                }
            }

            setState(newState);
        },
        [state, setState]
    );

    const handleDragEnter = useCallback(
        (row: number, col: number) => {
            if (!state.isDragging || !state.dragStart) return;

            const { row: startRow, col: startCol } = state.dragStart;

            // Helper function to generate range array
            const getRange = (start: number, end: number) => Array.from({ length: Math.abs(end - start) + 1 }, (_, i) => Math.min(start, end) + i);

            setState({
                ...state,
                ...(startCol === -1 &&
                    row >= 0 && {
                        selectedRows: getRange(startRow, row),
                    }),
                ...(startRow === -1 &&
                    col >= 0 && {
                        selectedColumns: getRange(startCol, col),
                    }),
                ...(row >= 0 &&
                    col >= 0 && {
                        selectedCells: state.selectedCells.map((rowCells, rowIndex) =>
                            rowCells.map((_, colIndex) => {
                                const [minRow, maxRow] = [Math.min(state.dragStartRow!, row), Math.max(state.dragStartRow!, row)];
                                const [minCol, maxCol] = [Math.min(state.dragStartColumn!, col), Math.max(state.dragStartColumn!, col)];
                                return rowIndex >= minRow && rowIndex <= maxRow && colIndex >= minCol && colIndex <= maxCol;
                            })
                        ),
                    }),
            });
        },
        [state, setState]
    );

    const handleDragEnd = useCallback(() => {
        setState({ ...state, isDragging: false });
    }, [state, setState]);

    return {
        handleDragStart,
        handleDragEnter,
        handleDragEnd,
    };
};

export default useDragSelection;
