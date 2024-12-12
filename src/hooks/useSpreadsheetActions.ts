/**
 * @fileoverview Provides actions for manipulating spreadsheet state, including
 * text formatting operations like bold, italic, alignment, and links.
 */

// hooks/useSpreadsheetActions.ts
import { useCallback } from "react";
import { useAtom } from "jotai";
import { PrimitiveAtom } from "jotai";
import { State } from "../types";
import { TextFormattingOperation } from "../types";

export const useSpreadsheetActions = (atom: PrimitiveAtom<State>) => {
    const [state, setState] = useAtom(atom);

    const applyTextFormatting = useCallback(
        (operation: TextFormattingOperation) => {
            const newData = state.data.map((row, rowIndex) => {
                return row.map((cell, colIndex) => {
                    const shouldFormat =
                        (state.selectedCell?.row === rowIndex && state.selectedCell?.col === colIndex) ||
                        state.selectedCells[rowIndex][colIndex] ||
                        (state.selectedRows.includes(rowIndex) && state.selectedColumns.includes(colIndex));

                    if (!shouldFormat) return cell;

                    switch (operation.operation) {
                        case "BOLD":
                            return { ...cell, bold: !cell.bold };
                        case "ITALIC":
                            return { ...cell, italic: !cell.italic };
                        case "CODE":
                            return { ...cell, code: !cell.code };
                        case "LINK":
                            return { ...cell, link: operation.payload || "" };
                        case "ALIGN_LEFT":
                            return { ...cell, alignment: "left" };
                        case "ALIGN_CENTER":
                            return { ...cell, alignment: "center" };
                        case "ALIGN_RIGHT":
                            return { ...cell, alignment: "right" };
                        default:
                            return cell;
                    }
                });
            });

            setState({
                ...state,
                data: newData,
            });
        },
        [state, setState]
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
        (alignment: "left" | "center" | "right") => {
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
                future: [],
            });
        },
        [state, setState]
    );

    return {
        applyTextFormatting,
        handleTextFormatting,
        handleSetAlignment,
    };
};

export default useSpreadsheetActions;
