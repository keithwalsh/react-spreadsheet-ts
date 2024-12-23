/**
 * @file src/hooks/useTableStructure.ts
 * @fileoverview Exports hooks for managing table structure operations, including row and column management with history tracking.
 */

import { useCallback } from "react";
import { PrimitiveAtom, useAtom } from "jotai";
import { 
    ColumnOperation, 
    InsertPosition, 
    OperationResult, 
    RowOperation, 
    SpreadsheetDirection, 
    SpreadsheetState,
    AddStructurePayload 
} from "../types";
import { addRow, addColumn, createHistoryEntry, removeRow, removeColumn } from "../utils";

const useStateUpdater = (state: SpreadsheetState, setState: (state: SpreadsheetState) => void) => {
    return useCallback(
        (result: OperationResult, additionalState = {}) => {
            setState({
                ...state,
                data: result.newData,
                past: [...state.past, createHistoryEntry(state)],
                future: [],
                selection: {
                    ...state.selection,
                    cells: result.newSelectedCells,
                    ...additionalState
                },
            });
        },
        [state, setState]
    );
};

const useOperationHandler = <T extends SpreadsheetDirection>(
    state: SpreadsheetState,
    operation: T extends SpreadsheetDirection.ROW ? RowOperation : ColumnOperation,
    updateStateWithNewData: ReturnType<typeof useStateUpdater>
) => {
    return useCallback(
        (index: number, position: T extends SpreadsheetDirection.ROW 
            ? InsertPosition.ROW_ABOVE | InsertPosition.ROW_BELOW
            : InsertPosition.COL_LEFT | InsertPosition.COL_RIGHT
        ) => {
            const direction = position === InsertPosition.ROW_ABOVE || position === InsertPosition.ROW_BELOW
                ? SpreadsheetDirection.ROW
                : SpreadsheetDirection.COLUMN;

            const result = operation({
                data: state.data,
                selectedCells: state.selection.cells,
                targetIndex: index,
                position,
                direction
            } as AddStructurePayload);

            updateStateWithNewData(result);
        },
        [state, operation, updateStateWithNewData]
    );
};

export const useRowOperations = (atom: PrimitiveAtom<SpreadsheetState>) => {
    const [state, setState] = useAtom(atom);
    const update = useStateUpdater(state, setState);
    const op = useOperationHandler<SpreadsheetDirection.ROW>(state, addRow as RowOperation, update);

    const handleAddRow = useCallback(
        (position: InsertPosition.ROW_ABOVE | InsertPosition.ROW_BELOW) => {
            const index = state.selection.activeCell?.rowIndex ?? state.data.length;
            op(index, position);
        },
        [state, op]
    );

    const handleRemoveRow = useCallback(
        (index?: number) => {
            const targetIndex = index ?? state.data.length - 1;
            update(
                removeRow({
                    data: state.data,
                    selectedCells: state.selection.cells,
                    targetIndex,
                }),
                { activeCell: null, rows: [] }
            );
        },
        [state, update]
    );

    const handleAddRowAbove = useCallback(
        (index: number) => op(index, InsertPosition.ROW_ABOVE),
        [op]
    );
    
    const handleAddRowBelow = useCallback(
        (index: number) => op(index, InsertPosition.ROW_BELOW),
        [op]
    );

    return { handleAddRow, handleRemoveRow, handleAddRowAbove, handleAddRowBelow };
};

export const useColumnOperations = (atom: PrimitiveAtom<SpreadsheetState>) => {
    const [state, setState] = useAtom(atom);
    const update = useStateUpdater(state, setState);
    const op = useOperationHandler<SpreadsheetDirection.COLUMN>(state, addColumn as ColumnOperation, update);

    const handleAddColumn = useCallback(
        (position: InsertPosition.COL_LEFT | InsertPosition.COL_RIGHT) => 
            op(state.selection.activeCell?.colIndex ?? state.data[0].length, position),
        [state, op]
    );

    const handleRemoveColumn = useCallback(
        (index?: number) =>
            update(
                removeColumn({
                    data: state.data,
                    selectedCells: state.selection.cells,
                    targetIndex: index ?? state.data[0].length - 1,
                }),
                { activeCell: null, columns: [] }
            ),
        [state, update]
    );

    const handleAddColumnLeft = useCallback((i: number) => op(i, InsertPosition.COL_LEFT), [op]);
    const handleAddColumnRight = useCallback((i: number) => op(i, InsertPosition.COL_RIGHT), [op]);

    return { handleAddColumn, handleRemoveColumn, handleAddColumnLeft, handleAddColumnRight };
};

// Optional: Combine hooks if needed
export const useTableStructure = (atom: PrimitiveAtom<SpreadsheetState>) => {
    const rowOperations = useRowOperations(atom);
    const columnOperations = useColumnOperations(atom);

    return {
        ...rowOperations,
        ...columnOperations,
    };
};

export default useTableStructure;
