/**
 * @fileoverview Core hook exports for table structure operations. Separates
 * concerns for row and column management with history tracking support.
 */

import { useCallback } from "react";
import { PrimitiveAtom, useAtom } from "jotai";
import { State } from "../types";
import { addRow, addColumn, removeRow, removeColumn } from "../utils";
import { createHistoryEntry } from "../utils/historyUtils";

export const useRowOperations = (atom: PrimitiveAtom<State>) => {
    const [state, setState] = useAtom(atom);

    const updateStateWithNewData = useCallback(
        (result: { newData: State["data"]; newSelectedCells: State["selectedCells"] }) => {
            setState({
                ...state,
                data: result.newData,
                past: [...state.past, createHistoryEntry(state)],
                future: [],
                selectedCells: result.newSelectedCells,
            });
        },
        [state, setState]
    );

    const handleAddRow = useCallback(
        (position: "above" | "below") => {
            const result = addRow({
                data: state.data,
                selectedCells: state.selectedCells,
                index: state.selectedCell?.row ?? state.data.length,
                position,
            });
            updateStateWithNewData(result);
        },
        [state, updateStateWithNewData]
    );

    const handleAddRowAtIndex = useCallback(
        (index: number, position: "above" | "below") => {
            const result = addRow({
                data: state.data,
                selectedCells: state.selectedCells,
                index,
                position,
            });
            updateStateWithNewData(result);
        },
        [state, updateStateWithNewData]
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
                past: [...state.past, createHistoryEntry(state)],
                future: [],
                selectedCell: null,
                selectedCells: result.newSelectedCells,
                selectedRows: [],
            });
        },
        [state, setState]
    );

    const handleAddRowAbove = useCallback((index: number) => handleAddRowAtIndex(index, "above"), [handleAddRowAtIndex]);
    const handleAddRowBelow = useCallback((index: number) => handleAddRowAtIndex(index, "below"), [handleAddRowAtIndex]);

    return {
        handleAddRow,
        handleRemoveRow,
        handleAddRowAbove,
        handleAddRowBelow,
    };
};

export const useColumnOperations = (atom: PrimitiveAtom<State>) => {
    const [state, setState] = useAtom(atom);

    const updateStateWithNewData = useCallback(
        (result: { newData: State["data"]; newSelectedCells: State["selectedCells"] }) => {
            setState({
                ...state,
                data: result.newData,
                past: [...state.past, createHistoryEntry(state)],
                future: [],
                selectedCells: result.newSelectedCells,
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
            updateStateWithNewData(result);
        },
        [state, updateStateWithNewData]
    );

    const handleAddColumnAtIndex = useCallback(
        (index: number, position: "left" | "right") => {
            const result = addColumn({
                data: state.data,
                selectedCells: state.selectedCells,
                index,
                position,
            });
            updateStateWithNewData(result);
        },
        [state, updateStateWithNewData]
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
                past: [...state.past, createHistoryEntry(state)],
                future: [],
                selectedCell: null,
                selectedCells: result.newSelectedCells,
                selectedColumns: [],
            });
        },
        [state, setState]
    );

    const handleAddColumnLeft = useCallback((index: number) => handleAddColumnAtIndex(index, "left"), [handleAddColumnAtIndex]);
    const handleAddColumnRight = useCallback((index: number) => handleAddColumnAtIndex(index, "right"), [handleAddColumnAtIndex]);

    return {
        handleAddColumn,
        handleRemoveColumn,
        handleAddColumnLeft,
        handleAddColumnRight,
    };
};

// Optional: Combine hooks if needed
export const useTableStructure = (atom: PrimitiveAtom<State>) => {
    const rowOperations = useRowOperations(atom);
    const columnOperations = useColumnOperations(atom);

    return {
        ...rowOperations,
        ...columnOperations,
    };
};

export default useTableStructure;
