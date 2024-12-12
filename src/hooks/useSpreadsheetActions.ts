/**
 * @fileoverview Core hook exports for spreadsheet text formatting operations.
 * Separates concerns for link handling, text formatting, and alignment.
 */

import { useCallback } from "react";
import { useAtom, PrimitiveAtom } from "jotai";
import { Alignment, State, TextFormattingOperation } from "../types";

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
            if (
                !state.selectedCell &&
                !state.selectedCells.some((row) => row.some((cell) => cell)) &&
                state.selectedColumns.length === 0 &&
                state.selectedRows.length === 0 &&
                !state.selectAll
            ) {
                return;
            }

            const newData = state.data.map((row, rowIndex) =>
                row.map((cell, colIndex) => {
                    if (state.selectAll) {
                        return { ...cell, align: alignment };
                    }

                    const isInColumnSelection = state.selectedColumns.includes(colIndex);
                    const isInRowSelection = state.selectedRows.includes(rowIndex);
                    if (
                        (state.selectedCell?.row === rowIndex && state.selectedCell?.col === colIndex) ||
                        (state.selectedCells[rowIndex] && state.selectedCells[rowIndex][colIndex]) ||
                        isInColumnSelection ||
                        isInRowSelection
                    ) {
                        return { ...cell, align: alignment };
                    }
                    return cell;
                })
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

    const applyTextFormatting = useCallback(
        (operation: TextFormattingOperation, targetCell: NonNullable<State["selectedCell"]>) => {
            const newData = [...state.data];
            const cell = newData[targetCell.row][targetCell.col];

            switch (operation.operation) {
                case "LINK":
                    newData[targetCell.row][targetCell.col] = {
                        ...cell,
                        link: operation.payload,
                    };
                    break;
                case "REMOVE_LINK": {
                    const { link, ...rest } = cell;
                    newData[targetCell.row][targetCell.col] = rest;
                    break;
                }
            }

            setState({
                ...state,
                data: newData,
                past: [...state.past, { ...state }],
                future: [],
            });
        },
        [state, setState]
    );

    return useCallback(
        (url: string | undefined, targetCell: NonNullable<State["selectedCell"]>) => {
            applyTextFormatting(
                {
                    operation: url === undefined ? "REMOVE_LINK" : "LINK",
                    payload: url,
                },
                targetCell
            );
        },
        [applyTextFormatting]
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
