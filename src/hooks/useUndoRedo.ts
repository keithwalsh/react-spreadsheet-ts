/**
 * @fileoverview Hook managing undo/redo functionality for spreadsheet operations,
 * maintaining state history through Jotai atoms.
 */

import { useCallback } from "react";
import { PrimitiveAtom, useAtom } from "jotai";
import { State } from "../types";

export const useUndoRedo = (atom: PrimitiveAtom<State>) => {
    const [state, setState] = useAtom(atom);

    const handleUndo = useCallback(() => {
        if (state.past.length === 0) return;

        const previous = state.past[state.past.length - 1];
        const newPast = state.past.slice(0, -1);

        setState({
            ...state,
            data: previous.data,
            selectedCell: previous.selectedCell || null,
            selectedCells: previous.selectedCells || state.selectedCells,
            selectedRows: previous.selectedRows || [],
            selectedColumns: previous.selectedColumns || [],
            isDragging: previous.isDragging || false,
            selectAll: previous.selectAll || false,
            past: newPast,
            future: [
                {
                    data: state.data,
                    selectedCell: state.selectedCell,
                    selectedCells: state.selectedCells,
                    selectedRows: state.selectedRows,
                    selectedColumns: state.selectedColumns,
                    isDragging: state.isDragging,
                    selectAll: state.selectAll,
                },
                ...state.future,
            ],
        });
    }, [state, setState]);

    const handleRedo = useCallback(() => {
        if (state.future.length === 0) return;

        const next = state.future[0];
        const newFuture = state.future.slice(1);

        setState({
            ...state,
            data: next.data,
            selectedCell: next.selectedCell || null,
            selectedCells: next.selectedCells || state.selectedCells,
            selectedRows: next.selectedRows || [],
            selectedColumns: next.selectedColumns || [],
            isDragging: next.isDragging || false,
            selectAll: next.selectAll || false,
            past: [
                ...state.past,
                {
                    data: state.data,
                    selectedCell: state.selectedCell,
                    selectedCells: state.selectedCells,
                    selectedRows: state.selectedRows,
                    selectedColumns: state.selectedColumns,
                    isDragging: state.isDragging,
                    selectAll: state.selectAll,
                },
            ],
            future: newFuture,
        });
    }, [state, setState]);

    return { handleUndo, handleRedo };
};
