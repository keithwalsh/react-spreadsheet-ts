/**
 * @file src/hooks/useTableActions.ts
 * @fileoverview Provides core hooks for spreadsheet text formatting and alignment operations.
 */

import { useCallback } from "react";
import { useAtom, PrimitiveAtom } from "jotai";
import { 
    Alignment, 
    SpreadsheetState, 
    CellData, 
    CellCoordinate,
    TextStyle 
} from "../types";
import { isCellInSelection } from "../utils/selectionUtils";

export const useTextFormatting = (atom: PrimitiveAtom<SpreadsheetState>) => {
    const [state, setState] = useAtom(atom);

    return useCallback(
        (format: keyof TextStyle) => {
            const { selection, data, past } = state;
            const { activeCell, cells: selectedCells, columns: selectedColumns, rows: selectedRows, isAllSelected } = selection;

            if (!activeCell && !selectedCells.some((row) => row.some(Boolean)) && !selectedColumns.length && !selectedRows.length && !isAllSelected) return;

            setState({
                ...state,
                data: data.map((row: CellData[], ri: number) =>
                    row.map((cell, ci) => {
                        if (isCellInSelection({ state, rowIndex: ri, colIndex: ci })) {
                            return { 
                                ...cell, 
                                style: { 
                                    ...cell.style, 
                                    [format]: !cell.style[format] 
                                } 
                            };
                        }
                        return cell;
                    })
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
        (url: string | undefined, { rowIndex, colIndex }: CellCoordinate) => {
            const newData = [...state.data];
            const cell = newData[rowIndex][colIndex];

            newData[rowIndex][colIndex] = url ? { ...cell, link: url } : (({ link, ...rest }) => rest)(cell);

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
    const [state, setState] = useAtom(atom);

    const handleLink = ({ url, activeCell }: { url: string | undefined, activeCell: CellCoordinate }) => {
        const newData = [...state.data];
        const cell = newData[activeCell.rowIndex][activeCell.colIndex];

        newData[activeCell.rowIndex][activeCell.colIndex] = url 
            ? { ...cell, link: url } 
            : (({ link, ...rest }) => rest)(cell);

        setState({
            ...state,
            data: newData,
            past: [...state.past, { ...state }],
            future: [],
        });
    };

    return {
        handleLink,
        handleTextFormatting: useTextFormatting(atom),
        handleSetAlignment: useAlignment(atom),
    };
};

export default useSpreadsheetActions;
