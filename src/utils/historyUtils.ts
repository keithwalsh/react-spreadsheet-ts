/**
 * @fileoverview Utility functions for managing spreadsheet history state and
 * operations.
 */

import { DataPayload, State } from "../types";

export const createHistoryEntry = (state: State): DataPayload => ({
    data: state.data,
    selectedCell: state.selectedCell,
    selectedCells: state.selectedCells,
    selectedRows: state.selectedRows,
    selectedColumns: state.selectedColumns,
    isDragging: state.isDragging,
    selectAll: state.selectAll,
});
