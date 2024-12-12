/**
 * @fileoverview Provides actions for manipulating spreadsheet state, including
 * text formatting operations like bold, italic, alignment, and links.
 */

// hooks/useSpreadsheetActions.ts
import { useCallback } from "react";
import { useAtom } from "jotai";
import { PrimitiveAtom } from "jotai";
import { Alignment, CellData, State, TextFormattingOperation } from "../types";

export const useSpreadsheetActions = (atom: PrimitiveAtom<State>) => {
    const [state, setState] = useAtom(atom);

    const applyTextFormatting = useCallback(
        (operation: TextFormattingOperation) => {
            const formatMap = {
                BOLD: (cell: CellData) => ({ ...cell, bold: !cell.bold }),
                ITALIC: (cell: CellData) => ({ ...cell, italic: !cell.italic }),
                CODE: (cell: CellData) => ({ ...cell, code: !cell.code }),
                LINK: (cell: CellData, payload?: string) => ({ ...cell, link: payload || "" }),
                ALIGN_LEFT: (cell: CellData) => ({ ...cell, align: "left" as const }),
                ALIGN_CENTER: (cell: CellData) => ({ ...cell, align: "center" as const }),
                ALIGN_RIGHT: (cell: CellData) => ({ ...cell, align: "right" as const }),
            };

            setState((prev: State) => ({
                ...prev,
                data: prev.data.map((row, rowIndex) =>
                    row.map((cell, colIndex) => {
                        const isSelected =
                            (prev.selectedCell?.row === rowIndex && prev.selectedCell?.col === colIndex) ||
                            prev.selectedCells[rowIndex][colIndex] ||
                            (prev.selectedRows.includes(rowIndex) && prev.selectedColumns.includes(colIndex));

                        if (!isSelected) return cell;

                        if (operation.operation === "LINK") {
                            return formatMap.LINK(cell, operation.payload);
                        }
                        return formatMap[operation.operation](cell);
                    })
                ),
            }));
        },
        [setState]
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
