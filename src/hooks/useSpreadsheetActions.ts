/**
 * @fileoverview Provides actions for manipulating spreadsheet state, including
 * text formatting operations like bold, italic, alignment, and links.
 */

// hooks/useSpreadsheetActions.ts
import { useCallback } from "react";
import { useAtom } from "jotai";
import { PrimitiveAtom } from "jotai";
import { Alignment, State, TextFormattingOperation } from "../types";

interface SpreadsheetActions {
    handleLink: (url: string | undefined, targetCell: NonNullable<State["selectedCell"]>) => void;
    handleTextFormatting: (format: "bold" | "italic" | "code") => void;
    handleSetAlignment: (alignment: Alignment) => void;
}

export const useSpreadsheetActions = (atom: PrimitiveAtom<State>): SpreadsheetActions => {
    const [state, setState] = useAtom(atom);

    const applyTextFormatting = useCallback(
        (operation: TextFormattingOperation, targetCell: NonNullable<State["selectedCell"]>) => {
            console.log("applyTextFormatting - targetCell:", targetCell);

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
                case "BOLD":
                case "ITALIC":
                case "CODE": {
                    const prop = operation.operation.toLowerCase();
                    newData[targetCell.row][targetCell.col] = {
                        ...cell,
                        [prop]: !cell[prop as keyof typeof cell],
                    };
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

    const handleLink = useCallback(
        (url: string | undefined, targetCell: NonNullable<State["selectedCell"]>) => {
            console.log("handleLink - targetCell:", targetCell);

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

    const handleTextFormatting = useCallback(
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

    const handleSetAlignment = useCallback(
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

    return {
        handleLink,
        handleTextFormatting,
        handleSetAlignment,
    };
};

export default useSpreadsheetActions;
