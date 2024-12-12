/**
 * @fileoverview Hook managing table structure operations like adding/removing
 * rows and columns, with history tracking support.
 */

import { useCallback } from "react";
import { PrimitiveAtom, useAtom } from "jotai";
import { State, DataPayload } from "../types";
import { addRow, addColumn, removeRow, removeColumn } from "../utils";

export const useTableStructure = (atom: PrimitiveAtom<State>) => {
    const [state, setState] = useAtom(atom);

    const createHistoryEntry = (): DataPayload => ({
        data: state.data,
        selectedCell: state.selectedCell,
        selectedCells: state.selectedCells,
        selectedRows: state.selectedRows,
        selectedColumns: state.selectedColumns,
        isDragging: state.isDragging,
        selectAll: state.selectAll,
    });

    const handleAddRow = useCallback(
        (position: "above" | "below") => {
            const result = addRow({
                data: state.data,
                selectedCells: state.selectedCells,
                index: state.selectedCell?.row ?? state.data.length,
                position,
            });

            setState({
                ...state,
                data: result.newData,
                past: [...state.past, createHistoryEntry()],
                future: [],
                selectedCells: result.newSelectedCells,
            });
        },
        [state, setState]
    );

    const handleRemoveRow = useCallback(
        (index?: number) => {
            const rowIndex = typeof index === "number" ? index : state.data.length - 1;

            const result = removeRow({
                data: state.data,
                selectedCells: state.selectedCells,
                index: rowIndex,
            });

            setState({
                ...state,
                data: result.newData,
                past: [...state.past, createHistoryEntry()],
                future: [],
                selectedCell: null,
                selectedCells: result.newSelectedCells,
                selectedRows: [],
            });
        },
        [state, setState]
    );

    const handleAddColumn = useCallback(
        (position: "left" | "right") => {
            const result = addColumn({
                data: state.data,
                selectedCells: state.selectedCells,
                index: state.selectedCell?.col ?? state.data[0].length,
                position,
            });

            setState({
                ...state,
                data: result.newData,
                past: [...state.past, createHistoryEntry()],
                future: [],
                selectedCells: result.newSelectedCells,
            });
        },
        [state, setState]
    );

    const handleRemoveColumn = useCallback(
        (index?: number) => {
            const colIndex = typeof index === "number" ? index : state.data[0].length - 1;

            const result = removeColumn({
                data: state.data,
                selectedCells: state.selectedCells,
                index: colIndex,
            });

            setState({
                ...state,
                data: result.newData,
                past: [...state.past, createHistoryEntry()],
                future: [],
                selectedCell: null,
                selectedCells: result.newSelectedCells,
                selectedColumns: [],
            });
        },
        [state, setState]
    );

    const handleAddColumnLeft = useCallback(
        (index: number) => {
            const result = addColumn({
                data: state.data,
                selectedCells: state.selectedCells,
                index,
                position: "left",
            });

            setState({
                ...state,
                data: result.newData,
                past: [...state.past, createHistoryEntry()],
                future: [],
                selectedCells: result.newSelectedCells,
            });
        },
        [state, setState]
    );

    const handleAddColumnRight = useCallback(
        (index: number) => {
            const result = addColumn({
                data: state.data,
                selectedCells: state.selectedCells,
                index,
                position: "right",
            });

            setState({
                ...state,
                data: result.newData,
                past: [...state.past, createHistoryEntry()],
                future: [],
                selectedCells: result.newSelectedCells,
            });
        },
        [state, setState]
    );

    const handleAddRowAbove = useCallback(
        (index: number) => {
            const result = addRow({
                data: state.data,
                selectedCells: state.selectedCells,
                index,
                position: "above",
            });

            setState({
                ...state,
                data: result.newData,
                past: [...state.past, createHistoryEntry()],
                future: [],
                selectedCells: result.newSelectedCells,
            });
        },
        [state, setState]
    );

    const handleAddRowBelow = useCallback(
        (index: number) => {
            const result = addRow({
                data: state.data,
                selectedCells: state.selectedCells,
                index,
                position: "below",
            });

            setState({
                ...state,
                data: result.newData,
                past: [...state.past, createHistoryEntry()],
                future: [],
                selectedCells: result.newSelectedCells,
            });
        },
        [state, setState]
    );

    return {
        handleAddRow,
        handleRemoveRow,
        handleAddColumn,
        handleRemoveColumn,
        handleAddColumnLeft,
        handleAddColumnRight,
        handleAddRowAbove,
        handleAddRowBelow,
    };
};
