/**
 * @fileoverview Utility functions for managing spreadsheet history state and
 * operations.
 */

import { DataPayload, State } from "../types";

export const createHistoryEntry = (state: State): DataPayload => ({
    data: state.data,
    activeCell: state.selectedCell,
    selectedCells: state.selectedCells,
    selectedRows: state.selectedRows,
    selectedColumns: state.selectedColumns,
    isDragging: state.isDragging,
    isAllSelected: state.selectAll,
});
