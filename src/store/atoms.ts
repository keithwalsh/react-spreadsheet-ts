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
    return atom<State>(baseState);
};

// Helper functions for state updates
export const updateData = (
    state: State,
    payload: { data: CellData[][]; selectedCell?: { row: number; col: number }; selectedCells?: boolean[][]; selectedRows?: number[]; selectedColumns?: number[]; isDragging?: boolean; selectAll?: boolean }
): State => {
    const {
        data,
        selectedCell = state.selectedCell,
        selectedCells = state.selectedCells,
        selectedRows = state.selectedRows,
        selectedColumns = state.selectedColumns,
        isDragging = state.isDragging,
        selectAll = state.selectAll
    } = payload

    const newState = { ...state }
    
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
        }]
        newState.future = []
    }

    newState.data = data
    newState.selectedCell = selectedCell === null ? null : selectedCell
    newState.selectedCells = selectedCells
    newState.selectedRows = selectedRows
    newState.selectedColumns = selectedColumns
    newState.isDragging = isDragging
    newState.selectAll = selectAll

    return newState
}

export const startDragUpdate = (
    state: State,
    payload: { row: number; col: number }
): State => {
    const { row, col } = payload
    if (state.isDragging) return state

    const newState = { ...state }
    newState.isDragging = true
    newState.dragStart = { row, col }
    
    // Clear previous selections
    newState.selectedCell = null
    newState.selectedColumns = []
    newState.selectedRows = []
    newState.selectedCells = state.selectedCells.map(row => row.map(() => false))
    newState.selectAll = false

    // Set new selection
    if (col === -1 && row >= 0) {
        newState.selectedRows = [row]
    } else if (row === -1 && col >= 0) {
        newState.selectedColumns = [col]
    } else if (row >= 0 && col >= 0) {
        newState.dragStartRow = row
        newState.dragStartColumn = col
        if (newState.selectedCells[row]) {
            newState.selectedCells[row][col] = true
        }
    }

    return newState
}

// Derived atoms for specific state slices
export const createSelectedCellAtom = (spreadsheetAtom: ReturnType<typeof createSpreadsheetAtom>) => 
    atom((get) => get(spreadsheetAtom).selectedCell)

export const createSelectedCellsAtom = (spreadsheetAtom: ReturnType<typeof createSpreadsheetAtom>) =>
    atom((get) => get(spreadsheetAtom).selectedCells)

export const createSelectedRowsAtom = (spreadsheetAtom: ReturnType<typeof createSpreadsheetAtom>) =>
    atom((get) => get(spreadsheetAtom).selectedRows)

export const createSelectedColumnsAtom = (spreadsheetAtom: ReturnType<typeof createSpreadsheetAtom>) =>
    atom((get) => get(spreadsheetAtom).selectedColumns)

export const createIsDraggingAtom = (spreadsheetAtom: ReturnType<typeof createSpreadsheetAtom>) =>
    atom((get) => get(spreadsheetAtom).isDragging)

export const createSelectAllAtom = (spreadsheetAtom: ReturnType<typeof createSpreadsheetAtom>) =>
    atom((get) => get(spreadsheetAtom).selectAll)

// Action atoms for state updates
export const createActionAtoms = (spreadsheetAtom: ReturnType<typeof createSpreadsheetAtom>) => ({
    setData: atom(
        null,
        (get, set, payload: { data: CellData[][]; selectedCell?: { row: number; col: number }; selectedCells?: boolean[][]; selectedRows?: number[]; selectedColumns?: number[]; isDragging?: boolean; selectAll?: boolean }) => {
            const currentState = get(spreadsheetAtom)
            set(spreadsheetAtom, updateData(currentState, payload))
        }
    )
});
