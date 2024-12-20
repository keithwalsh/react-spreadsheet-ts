/**
 * @fileoverview Core spreadsheet component managing state and user interactions
 * through a combination of Jotai atoms and React hooks.
 */

import React, { useCallback, useRef, useEffect, useMemo, useState } from "react";
import { PrimitiveAtom, useAtom } from "jotai";
import { Box } from "@mui/material";
import { defaultVisibleButtons } from "../config";
import { useDragSelection, useOutsideClick, useTableActions, useTableStructure, useUndoRedo, useKeyboardNavigation } from "../hooks";
import { initialState } from "../store";
import { Alignment, CellData, State } from "../types";
import { createHistoryEntry, downloadCSV, handlePaste, createNewSelectionState } from "../utils";
import { ButtonGroup, Menu, NewTableModal, Table, ToolbarProvider, TableSizeChooser } from "./";

interface SpreadsheetProps {
    atom: PrimitiveAtom<State>;
}

const Spreadsheet: React.FC<SpreadsheetProps> = ({ atom }) => {
    const [state, setState] = useAtom(atom);
    const {
        handleAddRow,
        handleRemoveRow,
        handleAddColumn,
        handleRemoveColumn,
        handleAddColumnLeft,
        handleAddColumnRight,
        handleAddRowAbove,
        handleAddRowBelow,
    } = useTableStructure(atom);
    const { handleDragStart, handleDragEnter, handleDragEnd } = useDragSelection(atom);
    const [isNewTableModalOpen, setIsNewTableModalOpen] = useState(false);
    const { handleTextFormatting, handleSetAlignment } = useTableActions(atom);
    const { handleUndo, handleRedo } = useUndoRedo(atom);
    const handleKeyNavigation = useKeyboardNavigation();

    const containerRef = useRef<HTMLDivElement>(null);
    const tableRef = useRef<HTMLTableElement>(null);

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.focus();
        }
    }, []);

    useOutsideClick([containerRef, tableRef], atom);

    const saveToHistory = useCallback(
        (newData: CellData[][]) => {
            setState({
                ...state,
                data: newData,
                past: [...state.past, createHistoryEntry(state)],
                future: [],
            });
        },
        [state, setState]
    );

    const handleCellChange = useCallback(
        (rowIndex: number, colIndex: number, value: string) => {
            const newData = state.data.map((row, i) => (i === rowIndex ? row.map((cell, j) => (j === colIndex ? { ...cell, value } : cell)) : row));
            saveToHistory(newData);
        },
        [state, saveToHistory]
    );

    const handleDeleteSelected = useCallback(() => {
        if (!state.selectedCell && !state.selectedCells.some((row) => row.some((cell) => cell))) {
            return;
        }

        const newData = state.data.map((dataRow, rowIndex) => {
            return dataRow.map((cell, colIndex) => {
                const shouldClear =
                    (state.selectedCell?.row === rowIndex && state.selectedCell?.col === colIndex) ||
                    (state.selectedCells[rowIndex] && state.selectedCells[rowIndex][colIndex]);

                return shouldClear ? { ...cell, value: "" } : cell;
            });
        });

        saveToHistory(newData);
    }, [state, saveToHistory]);

    const handleCreateNewTable = useCallback(
        (rows: number, cols: number) => {
            setState({
                ...state,
                data: initialState(rows, cols).data,
                selectedCells: Array(rows).fill(Array(cols).fill(false)),
                selectedCell: null,
                selectedRows: [],
                selectedColumns: [],
                selectAll: false,
            });
            setIsNewTableModalOpen(false);
        },
        [state, setState]
    );

    const handleOpenNewTableModal = useCallback(() => setIsNewTableModalOpen(true), []);

    const handleCloseNewTableModal = useCallback(() => setIsNewTableModalOpen(false), []);

    const handleDownloadCSV = useCallback(() => downloadCSV(state.data, "spreadsheet.csv"), [state.data]);

    const handleGlobalPaste = useCallback(
        (event: ClipboardEvent) => {
            event.preventDefault();
            const pasteData = event.clipboardData?.getData("text");
            if (!pasteData || !state.selectedCell) return;

            const result = handlePaste(
                pasteData,
                state.data,
                state.selectedCell,
                state.data.map((row) => row.map((cell) => cell.align as Alignment)),
                state.data.map((row) => row.map((cell) => cell.bold as boolean)),
                state.data.map((row) => row.map((cell) => cell.italic as boolean)),
                state.data.map((row) => row.map((cell) => cell.code as boolean))
            );

            setState({
                ...state,
                data: result.newData,
                selectedCells: result.newSelectedCells,
            });
        },
        [state, setState]
    );

    useEffect(() => {
        document.addEventListener("paste", handleGlobalPaste);
        return () => document.removeEventListener("paste", handleGlobalPaste);
    }, [handleGlobalPaste]);

    const toolbarHandlers = useMemo(
        () => ({
            onClickUndo: handleUndo,
            onClickRedo: handleRedo,
            onClickAlignLeft: () => handleSetAlignment("left"),
            onClickAlignCenter: () => handleSetAlignment("center"),
            onClickAlignRight: () => handleSetAlignment("right"),
            onClickAddRow: (position: "above" | "below") => handleAddRow(position),
            onClickRemoveRow: handleRemoveRow,
            onClickAddColumn: (position: "left" | "right") => handleAddColumn(position),
            onClickRemoveColumn: handleRemoveColumn,
            onClickSetBold: () => handleTextFormatting("bold"),
            onClickSetItalic: () => handleTextFormatting("italic"),
            onClickSetCode: () => handleTextFormatting("code"),
            setTableSize: (rows: number, cols: number) => {
                setState({
                    ...state,
                    data: initialState(rows, cols).data,
                    selectedCells: Array(rows).fill(Array(cols).fill(false)),
                    selectedCell: null,
                    selectedRows: [],
                    selectedColumns: [],
                    selectAll: false,
                    past: [...state.past, createHistoryEntry(state)],
                    future: [],
                });
            },
            currentRows: state.data.length,
            currentCols: state.data[0]?.length || 0,
            clearTable: () => {
                setState({
                    ...state,
                    data: initialState(state.data.length, state.data[0].length).data,
                    past: [...state.past, createHistoryEntry(state)],
                    future: [],
                });
            },
            deleteSelected: handleDeleteSelected,
            transposeTable: () => {
                const transposedData = state.data[0].map((_, colIndex) => state.data.map((row) => ({ ...row[colIndex] })));

                setState({
                    ...state,
                    data: transposedData,
                    past: [...state.past, createHistoryEntry(state)],
                    future: [],
                    selectedCells: Array(transposedData.length).fill(Array(transposedData[0].length).fill(false)),
                    selectedCell: null,
                    selectedRows: [],
                    selectedColumns: [],
                    selectAll: false,
                });
            },
        }),
        [
            handleUndo,
            handleRedo,
            handleSetAlignment,
            handleAddRow,
            handleRemoveRow,
            handleAddColumn,
            handleRemoveColumn,
            handleTextFormatting,
            handleDeleteSelected,
            state,
            setState,
        ]
    );

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            if (!state.selectedCell || state.selectedCells.some(row => row.some(cell => cell))) {
                return;
            }

            const { row, col } = state.selectedCell;
            const result = handleKeyNavigation(e, row, col, state.data.length - 1, state.data[0].length - 1);
            
            if (result) {
                setState((prev) => ({
                    ...prev,
                    selectedCells: createNewSelectionState(state.data, result),
                    selectedCell: { row: result.row, col: result.col },
                    selectAll: false,
                    selectedRows: [],
                    selectedColumns: [],
                }));
            }
        },
        [state, setState, handleKeyNavigation]
    );

    return (
        <ToolbarProvider spreadsheetAtom={atom} {...toolbarHandlers}>
            <div 
                className="spreadsheet" 
                ref={containerRef} 
                tabIndex={-1}
                onKeyDown={handleKeyDown}
                style={{ outline: 'none' }}
            >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Menu handleNewTable={handleOpenNewTableModal} onDownloadCSV={handleDownloadCSV} TableSizeChooser={TableSizeChooser} />
                </Box>
                <Box sx={{ mb: 2 }}>
                    <ButtonGroup visibleButtons={defaultVisibleButtons} />
                </Box>
                <Table
                    atom={atom}
                    onCellChange={handleCellChange}
                    onDragStart={handleDragStart}
                    onDragEnter={handleDragEnter}
                    onDragEnd={handleDragEnd}
                    onAddColumnLeft={handleAddColumnLeft}
                    onAddColumnRight={handleAddColumnRight}
                    onRemoveColumn={handleRemoveColumn}
                    onAddRowAbove={handleAddRowAbove}
                    onAddRowBelow={handleAddRowBelow}
                    onRemoveRow={handleRemoveRow}
                    ref={tableRef}
                />
                <NewTableModal open={isNewTableModalOpen} onClose={handleCloseNewTableModal} onCreateNewTable={handleCreateNewTable} />
            </div>
        </ToolbarProvider>
    );
};

export default Spreadsheet;
