/**
 * @fileoverview Core hook exports for spreadsheet text formatting operations.
 * Separates concerns for link handling, text formatting, and alignment.
 */

import { useCallback } from "react";
import { useAtom, PrimitiveAtom } from "jotai";
import { Alignment, State } from "../types";

export const useTextFormatting = (atom: PrimitiveAtom<State>) => {
    const [state, setState] = useAtom(atom);

    return useCallback(
        (format: "bold" | "italic" | "code") => {
            const { selectedCell, selectedCells, selectedColumns, selectedRows, selectAll, data, past } = state;

            if (!selectedCell && !selectedCells.some((row) => row.some(Boolean)) && !selectedColumns.length && !selectedRows.length && !selectAll) return;

            setState({
                ...state,
                data: data.map((row, ri) =>
                    row.map((cell, ci) =>
                        selectAll ||
                        (selectedCell?.row === ri && selectedCell?.col === ci) ||
                        selectedCells[ri]?.[ci] ||
                        selectedColumns.includes(ci) ||
                        selectedRows.includes(ri)
                            ? { ...cell, [format]: !cell[format] }
                            : cell
                    )
                ),
                past: [...past, { ...state }],
                future: [],
            });
        },
        [state, setState]
    );
};

export const useAlignment = (atom: PrimitiveAtom<State>) => {
    const [state, setState] = useAtom(atom);

    return useCallback(
        (alignment: Alignment) => {
            const hasSelection =
                state.selectedCell ||
                state.selectedCells.some((row) => row.some(Boolean)) ||
                state.selectedColumns.length > 0 ||
                state.selectedRows.length > 0 ||
                state.selectAll;

            if (!hasSelection) return;

            const newData = state.data.map((row, rowIndex) =>
                row.map((cell, colIndex) =>
                    state.selectAll ||
                    (state.selectedCell?.row === rowIndex && state.selectedCell?.col === colIndex) ||
                    state.selectedCells[rowIndex]?.[colIndex] ||
                    state.selectedColumns.includes(colIndex) ||
                    state.selectedRows.includes(rowIndex)
                        ? { ...cell, align: alignment }
                        : cell
                )
            );

            setState({
                ...state,
                data: newData,
                past: [...state.past, { ...state }],
                future: [],
            });
        },
        [state, setState]
    );
};

export const useLink = (atom: PrimitiveAtom<State>) => {
    const [state, setState] = useAtom(atom);

    return useCallback(
        (url: string | undefined, { row, col }: NonNullable<State["selectedCell"]>) => {
            const newData = [...state.data];
            const cell = newData[row][col];

            newData[row][col] = url ? { ...cell, link: url } : (({ link, ...rest }) => rest)(cell);

            setState({
                ...state,
                data: newData,
                past: [...state.past, { ...state }],
                future: [],
            });
        },
        [state, setState]
    );
};

// Optional: Combine hooks if needed
export const useSpreadsheetActions = (atom: PrimitiveAtom<State>) => {
    return {
        handleLink: useLink(atom),
        handleTextFormatting: useTextFormatting(atom),
        handleSetAlignment: useAlignment(atom),
    };
};

export default useSpreadsheetActions;
