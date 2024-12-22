/**
 * @file src/hooks/useTableActions.ts
 * @fileoverview Provides core hooks for spreadsheet text formatting and alignment operations.
 * Includes hooks for handling text formatting (bold, italic, code) and cell alignment.
 */

import { useCallback } from "react";
import { useAtom, PrimitiveAtom } from "jotai";
import { 
    Alignment, 
    SpreadsheetState, 
    CellData, 
    CellCoordinate 
} from "../types";
import { isCellInSelection } from "../utils/selectionUtils";

export const useTextFormatting = (atom: PrimitiveAtom<SpreadsheetState>) => {
    const [state, setState] = useAtom(atom);

    return useCallback(
        (format: "bold" | "italic" | "code") => {
            const { selection, data, past } = state;
            const { activeCell, cells: selectedCells, columns: selectedColumns, rows: selectedRows, isAllSelected } = selection;

            if (!activeCell && !selectedCells.some((row) => row.some(Boolean)) && !selectedColumns.length && !selectedRows.length && !isAllSelected) return;

            setState({
                ...state,
                data: data.map((row: CellData[], ri: number) =>
                    row.map((cell, ci) => (isCellInSelection({ state, rowIndex: ri, colIndex: ci }) ? { ...cell, [format]: !cell[format] } : cell))
                ),
                past: [...past, { ...state }],
                future: [],
            });
        },
        [state, setState]
    );
};

export const useAlignment = (atom: PrimitiveAtom<SpreadsheetState>) => {
    const [state, setState] = useAtom(atom);

    return useCallback(
        (alignment: Alignment) => {
            const { data, past, selection } = state;
            const { activeCell, cells: selectedCells, columns: selectedColumns, rows: selectedRows, isAllSelected } = selection;

            const hasSelection =
                isAllSelected || !!activeCell || selectedCells.some((row) => row.some(Boolean)) || selectedColumns.length > 0 || selectedRows.length > 0;

            if (!hasSelection) return;

            const newData = data.map((row: CellData[], r: number) =>
                row.map((cell, c) => (isCellInSelection({ state, rowIndex: r, colIndex: c }) ? { ...cell, align: alignment } : cell))
            );

            setState({ ...state, data: newData, past: [...past, state], future: [] });
        },
        [state, setState]
    );
};

export const useLink = (atom: PrimitiveAtom<SpreadsheetState>) => {
    const [state, setState] = useAtom(atom);

    return useCallback(
        (url: string | undefined, { row, col }: CellCoordinate) => {
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
export const useSpreadsheetActions = (atom: PrimitiveAtom<SpreadsheetState>) => {
    return {
        handleLink: useLink(atom),
        handleTextFormatting: useTextFormatting(atom),
        handleSetAlignment: useAlignment(atom),
    };
};

export default useSpreadsheetActions;
