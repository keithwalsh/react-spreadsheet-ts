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
    const update = useStateUpdater(state, setState);
    const op = useOperationHandler<RowPosition>(state, addRow, update);

    const handleAddRow = useCallback((position: "above" | "below") => op(state.selectedCell?.row ?? state.data.length, position), [state, op]);

    const handleRemoveRow = useCallback(
        (index?: number) =>
            update(
                removeRow({
                    data: state.data,
                    selectedCells: state.selectedCells,
                    index: index ?? state.data.length - 1,
                }),
                { selectedCell: null, selectedRows: [] }
            ),
        [state, update]
    );

    const handleAddRowAbove = useCallback((i: number) => op(i, "above"), [op]);
    const handleAddRowBelow = useCallback((i: number) => op(i, "below"), [op]);

    return { handleAddRow, handleRemoveRow, handleAddRowAbove, handleAddRowBelow };
};

export const useColumnOperations = (atom: PrimitiveAtom<State>) => {
    const [state, setState] = useAtom(atom);
    const update = useStateUpdater(state, setState);
    const op = useOperationHandler<ColumnPosition>(state, addColumn, update);

    const handleAddColumn = useCallback((position: "left" | "right") => op(state.selectedCell?.col ?? state.data[0].length, position), [state, op]);

    const handleRemoveColumn = useCallback(
        (index?: number) =>
            update(
                removeColumn({
                    data: state.data,
                    selectedCells: state.selectedCells,
                    index: index ?? state.data[0].length - 1,
                }),
                { selectedCell: null, selectedColumns: [] }
            ),
        [state, update]
    );

    const handleAddColumnLeft = useCallback((i: number) => op(i, "left"), [op]);
    const handleAddColumnRight = useCallback((i: number) => op(i, "right"), [op]);

    return { handleAddColumn, handleRemoveColumn, handleAddColumnLeft, handleAddColumnRight };
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
