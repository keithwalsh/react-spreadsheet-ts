/**
 * @fileoverview Jotai atoms for spreadsheet state management. Each spreadsheet instance
 * gets its own isolated state.
 */

import { atom } from 'jotai';
import { State, CellData } from '../types/index';
import { initialState } from './initialState';

// Create the main spreadsheet atom with initial state
export const createSpreadsheetAtom = (rows: number = 4, cols: number = 4) => {
    const baseState = initialState(rows, cols);
    return atom(baseState);
};

// Helper functions for state updates
export const updateData = (
    state: State,
    payload: { 
        data: CellData[][]; 
        selectedCell?: { row: number; col: number }; 
        selectedCells?: boolean[][]; 
        selectedRows?: number[]; 
        selectedColumns?: number[]; 
        isDragging?: boolean; 
        selectAll?: boolean 
    }
): State => {
    const {
        data,
        selectedCell = state.selectedCell,
        selectedCells = state.selectedCells,
        selectedRows = state.selectedRows,
        selectedColumns = state.selectedColumns,
        isDragging = state.isDragging,
        selectAll = state.selectAll
    } = payload;

    const newState = { ...state };
    
    // Only save state if data actually changed
    if (JSON.stringify(state.data) !== JSON.stringify(data)) {
        newState.past = [...state.past, {
            data: state.data,
            selectedCell: state.selectedCell,
            selectedCells: state.selectedCells,
            selectedRows: state.selectedRows,
            selectedColumns: state.selectedColumns,
            isDragging: state.isDragging,
            selectAll: state.selectAll
        }];
        newState.future = [];
    }

    newState.data = data;
    newState.selectedCell = selectedCell === null ? null : selectedCell;
    newState.selectedCells = selectedCells;
    newState.selectedRows = selectedRows;
    newState.selectedColumns = selectedColumns;
    newState.isDragging = isDragging;
    newState.selectAll = selectAll;

    return newState;
};
