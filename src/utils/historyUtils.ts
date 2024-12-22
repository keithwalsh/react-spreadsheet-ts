/**
 * @file src/utils/historyUtils.ts
 * @fileoverview Provides utility functions for managing spreadsheet history state and operations.
 */

import { DataPayload, SpreadsheetState } from "../types";

export const createHistoryEntry = (state: SpreadsheetState): DataPayload => ({
    data: state.data,
    activeCell: state.selection.activeCell,
    selectedCells: state.selection.cells,
    selectedRows: state.selection.rows,
    selectedColumns: state.selection.columns,
    isDragging: state.selection.dragState?.isDragging,
    isAllSelected: state.selection.isAllSelected,
});
