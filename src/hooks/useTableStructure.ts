/**
 * @fileoverview Core hook exports for table structure operations. Separates
 * concerns for row and column management with history tracking support.
 */

import { useCallback } from "react";
import { PrimitiveAtom, useAtom } from "jotai";
import { State, AddRowOptions, AddColumnOptions, CellData } from "../types";
import { addRow, addColumn, removeRow, removeColumn } from "../utils";
import { createHistoryEntry } from "../utils/historyUtils";

type OperationResult = {
    newData: CellData[][];
    newSelectedCells: boolean[][];
};

type RowPosition = "above" | "below";
type ColumnPosition = "left" | "right";

type RowOperation = (options: AddRowOptions) => OperationResult;
type ColumnOperation = (options: AddColumnOptions) => OperationResult;

const useStateUpdater = (state: State, setState: (state: State) => void) => {
    return useCallback(
        (result: OperationResult, additionalState = {}) => {
            setState({
                ...state,
                data: result.newData,
                past: [...state.past, createHistoryEntry(state)],
                future: [],
                selectedCells: result.newSelectedCells,
                ...additionalState,
            });
        },
        [state, setState]
    );
};

const useOperationHandler = <T extends RowPosition | ColumnPosition>(
    state: State,
    operation: RowOperation | ColumnOperation,
    updateStateWithNewData: ReturnType<typeof useStateUpdater>
) => {
    return useCallback(
        (index: number, position: T) => {
            const result = operation({
                data: state.data,
                selectedCells: state.selectedCells,
                index,
                position,
            } as any); // Using 'any' here because we know the operation matches the position type

            updateStateWithNewData(result);
        },
        [state, operation, updateStateWithNewData]
    );
};

export const useRowOperations = (atom: PrimitiveAtom<State>) => {
    const [state, setState] = useAtom(atom);
    const updateStateWithNewData = useStateUpdater(state, setState);
    const handleAddRowAtIndex = useOperationHandler<RowPosition>(state, addRow, updateStateWithNewData);

    const handleAddRow = useCallback(
        (position: "above" | "below") => {
            handleAddRowAtIndex(state.selectedCell?.row ?? state.data.length, position);
        },
        [state, handleAddRowAtIndex]
    );

    const handleRemoveRow = useCallback(
        (index?: number) => {
            const rowIndex = typeof index === "number" ? index : state.data.length - 1;
            const result = removeRow({
                data: state.data,
                selectedCells: state.selectedCells,
                index: rowIndex,
            });
            updateStateWithNewData(result, {
                selectedCell: null,
                selectedRows: [],
            });
        },
        [state, updateStateWithNewData]
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
    const updateStateWithNewData = useStateUpdater(state, setState);
    const handleAddColumnAtIndex = useOperationHandler<ColumnPosition>(state, addColumn, updateStateWithNewData);

    const handleAddColumn = useCallback(
        (position: "left" | "right") => {
            handleAddColumnAtIndex(state.selectedCell?.col ?? state.data[0].length, position);
        },
        [state, handleAddColumnAtIndex]
    );

    const handleRemoveColumn = useCallback(
        (index?: number) => {
            const colIndex = typeof index === "number" ? index : state.data[0].length - 1;
            const result = removeColumn({
                data: state.data,
                selectedCells: state.selectedCells,
                index: colIndex,
            });
            updateStateWithNewData(result, {
                selectedCell: null,
                selectedColumns: [],
            });
        },
        [state, updateStateWithNewData]
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
