/**
 * @file src/hooks/useUndoRedo.ts
 * @fileoverview Manages undo/redo functionality for spreadsheet operations,
 * maintaining state history using Jotai atoms.
 */

import { useCallback } from "react";
import { PrimitiveAtom, useAtom } from "jotai";
import { SpreadsheetState } from "../types";

export const useUndoRedo = (atom: PrimitiveAtom<SpreadsheetState>) => {
    const [state, setState] = useAtom(atom);

    const handleUndo = useCallback(() => {
        if (!state.past.length) return;

        const previous = state.past.at(-1)!;
        setState({
            ...state,
            ...previous,
            past: state.past.slice(0, -1),
            future: [{ ...state }, ...state.future],
        });
    }, [state, setState]);

    const handleRedo = useCallback(() => {
        if (!state.future.length) return;

        const next = state.future[0];
        setState({
            ...state,
            ...next,
            past: [...state.past, { ...state }],
            future: state.future.slice(1),
        });
    }, [state, setState]);

    return { handleUndo, handleRedo };
};
