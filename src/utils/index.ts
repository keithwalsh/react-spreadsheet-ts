/**
 * @file src/utils/index.ts
 * @fileoverview Exports utility functions for spreadsheet operations, including data manipulation,
 * selection management, CSV conversion, and history tracking.
 */

import { addRow, removeRow, addColumn, removeColumn, transpose } from "./spreadsheetOperations";
import { handlePaste } from "./handlePaste";
import { markSelectedCells } from "./markSelectedCells";
import { adjustTableSize } from "./adjustTableSize";
import { convertToCSV, downloadCSV } from "./csvConversion";
import { isCellSelected, createSelectionMatrix, createNewSelectionState } from "./selectionUtils";
import { createHistoryEntry } from "./historyUtils";
import { createMenuProps } from "./menuUtils";
import { getColumnLabel } from "./columnUtils";

export {
    addRow,
    removeRow,
    createSelectionMatrix,
    addColumn,
    removeColumn,
    transpose,
    handlePaste,
    markSelectedCells,
    adjustTableSize,
    convertToCSV,
    downloadCSV,
    isCellSelected,
    createHistoryEntry,
    createMenuProps,
    getColumnLabel,
    createNewSelectionState
};
