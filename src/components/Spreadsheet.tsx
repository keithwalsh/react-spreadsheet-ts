/**
 * @fileoverview Core spreadsheet component managing state and user interactions
 * through a combination of Jotai atoms and React hooks.
 */

import React, { useCallback, useRef, useEffect, useMemo } from "react";
import { useAtom } from "jotai";
import { PrimitiveAtom } from "jotai";
import { State, CellData, DataPayload } from "../types";
import { Box } from "@mui/material";
import Table from "./Table";
import ButtonGroup from "./ButtonGroup";
import { useDragSelection } from "../hooks";
import { addRow, removeRow, addColumn, removeColumn } from "../utils/spreadsheetOperations";
import { ToolbarProvider } from "./ToolbarProvider";
import { initialState } from "../store/initialState";
import Menu from "./Menu";
import TableSizeChooser from "./TableSizeChooser";
import { downloadCSV } from "../utils";

interface SpreadsheetProps {
    atom: PrimitiveAtom<State>;
}

const Spreadsheet: React.FC<SpreadsheetProps> = ({ atom }) => {
    const [state, setState] = useAtom(atom);
    const { handleDragStart, handleDragEnter, handleDragEnd } = useDragSelection(atom);

    const containerRef = useRef<HTMLDivElement>(null);
    const tableRef = useRef<HTMLTableElement>(null);

    const saveToHistory = useCallback(
        (newData: CellData[][]) => {
            const historyEntry: DataPayload = {
                data: state.data,
                selectedCell: state.selectedCell,
                selectedCells: state.selectedCells,
                selectedRows: state.selectedRows,
                selectedColumns: state.selectedColumns,
                isDragging: state.isDragging,
                selectAll: state.selectAll,
            };

            setState({
                ...state,
                data: newData,
                past: [...state.past, historyEntry],
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

    const handleUndo = useCallback(() => {
        if (state.past.length === 0) return;

        const previous = state.past[state.past.length - 1];
        const newPast = state.past.slice(0, -1);

        setState({
            ...state,
            data: previous.data,
            selectedCell: previous.selectedCell || null,
            selectedCells: previous.selectedCells || state.selectedCells,
            selectedRows: previous.selectedRows || [],
            selectedColumns: previous.selectedColumns || [],
            isDragging: previous.isDragging || false,
            selectAll: previous.selectAll || false,
            past: newPast,
            future: [
                {
                    data: state.data,
                    selectedCell: state.selectedCell,
                    selectedCells: state.selectedCells,
                    selectedRows: state.selectedRows,
                    selectedColumns: state.selectedColumns,
                    isDragging: state.isDragging,
                    selectAll: state.selectAll,
                },
                ...state.future,
            ],
        });
    }, [state, setState]);

    const handleRedo = useCallback(() => {
        if (state.future.length === 0) return;

        const next = state.future[0];
        const newFuture = state.future.slice(1);

        setState({
            ...state,
            data: next.data,
            selectedCell: next.selectedCell || null,
            selectedCells: next.selectedCells || state.selectedCells,
            selectedRows: next.selectedRows || [],
            selectedColumns: next.selectedColumns || [],
            isDragging: next.isDragging || false,
            selectAll: next.selectAll || false,
            past: [
                ...state.past,
                {
                    data: state.data,
                    selectedCell: state.selectedCell,
                    selectedCells: state.selectedCells,
                    selectedRows: state.selectedRows,
                    selectedColumns: state.selectedColumns,
                    isDragging: state.isDragging,
                    selectAll: state.selectAll,
                },
            ],
            future: newFuture,
        });
    }, [state, setState]);

    const handleAddRow = useCallback(() => {
        const result = addRow({
            data: state.data,
            selectedCells: state.selectedCells,
            index: state.selectedCell?.row ?? state.data.length
        });

        setState({
            ...state,
            data: result.newData,
            past: [
                ...state.past,
                {
                    data: state.data,
                    selectedCell: state.selectedCell,
                    selectedCells: state.selectedCells,
                    selectedRows: state.selectedRows,
                    selectedColumns: state.selectedColumns,
                    isDragging: state.isDragging,
                    selectAll: state.selectAll,
                },
            ],
            future: [],
            selectedCells: result.newSelectedCells,
        });
    }, [state, setState]);

    const handleRemoveRow = useCallback(() => {
        // Return if no cell or row is selected
        if (state.selectedCell === null && state.selectedRows.length === 0 && !state.selectedCells.some((row) => row.some((cell) => cell))) return;

        // Get the index from either the selected cell or the first selected row
        const index = state.selectedCell?.row ?? state.selectedRows[0];
        const result = removeRow({
            data: state.data,
            selectedCells: state.selectedCells,
            index
        });

        setState({
            ...state,
            data: result.newData,
            past: [
                ...state.past,
                {
                    data: state.data,
                    selectedCell: state.selectedCell,
                    selectedCells: state.selectedCells,
                    selectedRows: state.selectedRows,
                    selectedColumns: state.selectedColumns,
                    isDragging: state.isDragging,
                    selectAll: state.selectAll,
                },
            ],
            future: [],
            selectedCell: null,
            selectedCells: result.newSelectedCells,
            selectedRows: [], // Clear selected rows after removal
        });
    }, [state, setState]);

    const handleAddColumn = useCallback(() => {
        const result = addColumn({
            data: state.data,
            selectedCells: state.selectedCells,
            index: state.selectedCell?.col ?? state.data[0].length,
            position: "right"
        });

        setState({
            ...state,
            data: result.newData,
            past: [
                ...state.past,
                {
                    data: state.data,
                    selectedCell: state.selectedCell,
                    selectedCells: state.selectedCells,
                    selectedRows: state.selectedRows,
                    selectedColumns: state.selectedColumns,
                    isDragging: state.isDragging,
                    selectAll: state.selectAll,
                },
            ],
            future: [],
            selectedCells: result.newSelectedCells,
        });
    }, [state, setState]);

    const handleRemoveColumn = useCallback(() => {
        // Return if no cell or column is selected
        if (state.selectedCell === null && state.selectedColumns.length === 0 && !state.selectedCells.some((row) => row.some((cell) => cell))) return;

        // Get the index from either the selected cell or the first selected column
        const index = state.selectedCell?.col ?? state.selectedColumns[0];
        const result = removeColumn({
            data: state.data,
            selectedCells: state.selectedCells,
            index
        });

        setState({
            ...state,
            data: result.newData,
            past: [
                ...state.past,
                {
                    data: state.data,
                    selectedCell: state.selectedCell,
                    selectedCells: state.selectedCells,
                    selectedRows: state.selectedRows,
                    selectedColumns: state.selectedColumns,
                    isDragging: state.isDragging,
                    selectAll: state.selectAll,
                },
            ],
            future: [],
            selectedCell: null,
            selectedCells: result.newSelectedCells,
            selectedColumns: [], // Clear selected columns after removal
        });
    }, [state, setState]);

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

    const handleTextFormatting = useCallback(
        (format: "bold" | "italic" | "code") => {
            if (!state.selectedCell && 
                !state.selectedCells.some(row => row.some(cell => cell)) && 
                state.selectedColumns.length === 0 && 
                state.selectedRows.length === 0 &&
                !state.selectAll
            ) {
                return;
            }

            const newData = state.data.map((row, rowIndex) =>
                row.map((cell, colIndex) => {
                    if (state.selectAll) {
                        return { ...cell, [format]: !cell[format] };
                    }
                    
                    const isInColumnSelection = state.selectedColumns.includes(colIndex);
                    const isInRowSelection = state.selectedRows.includes(rowIndex);
                    if (
                        (state.selectedCell?.row === rowIndex && state.selectedCell?.col === colIndex) ||
                        (state.selectedCells[rowIndex] && state.selectedCells[rowIndex][colIndex]) ||
                        isInColumnSelection ||
                        isInRowSelection
                    ) {
                        return { ...cell, [format]: !cell[format] };
                    }
                    return cell;
                })
            );

            setState({
                ...state,
                data: newData,
                past: [
                    ...state.past,
                    {
                        data: state.data,
                        selectedCell: state.selectedCell,
                        selectedCells: state.selectedCells,
                        selectedRows: state.selectedRows,
                        selectedColumns: state.selectedColumns,
                        isDragging: state.isDragging,
                        selectAll: state.selectAll,
                    },
                ],
                future: [],
            });
        },
        [state, setState]
    );

    const handleSetAlignment = useCallback(
        (alignment: "left" | "center" | "right") => {
            if (!state.selectedCell && 
                !state.selectedCells.some(row => row.some(cell => cell)) && 
                state.selectedColumns.length === 0 && 
                state.selectedRows.length === 0 &&
                !state.selectAll
            ) {
                return;
            }

            const newData = state.data.map((row, rowIndex) =>
                row.map((cell, colIndex) => {
                    if (state.selectAll) {
                        return { ...cell, align: alignment };
                    }

                    const isInColumnSelection = state.selectedColumns.includes(colIndex);
                    const isInRowSelection = state.selectedRows.includes(rowIndex);
                    if (
                        (state.selectedCell?.row === rowIndex && state.selectedCell?.col === colIndex) ||
                        (state.selectedCells[rowIndex] && state.selectedCells[rowIndex][colIndex]) ||
                        isInColumnSelection ||
                        isInRowSelection
                    ) {
                        return { ...cell, align: alignment };
                    }
                    return cell;
                })
            );

            setState({
                ...state,
                data: newData,
                past: [
                    ...state.past,
                    {
                        data: state.data,
                        selectedCell: state.selectedCell,
                        selectedCells: state.selectedCells,
                        selectedRows: state.selectedRows,
                        selectedColumns: state.selectedColumns,
                        isDragging: state.isDragging,
                        selectAll: state.selectAll,
                    },
                ],
                future: [],
            });
        },
        [state, setState]
    );

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
        },
        [state, setState]
    );

    const handleDownloadCSV = useCallback(() => {
        downloadCSV(state.data, "spreadsheet.csv");
    }, [state.data]);

    // Add global paste handler
    const handleGlobalPaste = useCallback(
        (event: ClipboardEvent) => {
            event.preventDefault();
            const pasteData = event.clipboardData?.getData("text");
            if (!pasteData || !state.selectedCell) return;

            const rows = pasteData.split("\n");
            const newData = [...state.data];

            rows.forEach((row, rowOffset) => {
                const cells = row.split("\t");
                cells.forEach((cell, colOffset) => {
                    const targetRow = state.selectedCell!.row + rowOffset;
                    const targetCol = state.selectedCell!.col + colOffset;

                    if (targetRow < newData.length && targetCol < newData[0].length) {
                        newData[targetRow][targetCol] = {
                            ...newData[targetRow][targetCol],
                            value: cell.trim(),
                        };
                    }
                });
            });

            setState({
                ...state,
                data: newData,
            });
        },
        [state, setState]
    );

    useEffect(() => {
        document.addEventListener("paste", handleGlobalPaste);
        return () => document.removeEventListener("paste", handleGlobalPaste);
    }, [handleGlobalPaste]);

    const toolbarHandlers = useMemo(() => ({
        onClickUndo: handleUndo,
        onClickRedo: handleRedo,
        onClickAlignLeft: () => handleSetAlignment("left"),
        onClickAlignCenter: () => handleSetAlignment("center"),
        onClickAlignRight: () => handleSetAlignment("right"),
        onClickAddRow: handleAddRow,
        onClickRemoveRow: handleRemoveRow,
        onClickAddColumn: handleAddColumn,
        onClickRemoveColumn: handleRemoveColumn,
        onClickSetBold: () => handleTextFormatting("bold"),
        onClickSetItalic: () => handleTextFormatting("italic"),
        onClickSetCode: () => handleTextFormatting("code"),
        setTableSize: (rows: number, cols: number) => {
            const historyEntry: DataPayload = {
                data: state.data,
                selectedCell: state.selectedCell,
                selectedCells: state.selectedCells,
                selectedRows: state.selectedRows,
                selectedColumns: state.selectedColumns,
                isDragging: state.isDragging,
                selectAll: state.selectAll,
            };

            setState({
                ...state,
                data: initialState(rows, cols).data,
                selectedCells: Array(rows).fill(Array(cols).fill(false)),
                selectedCell: null,
                selectedRows: [],
                selectedColumns: [],
                selectAll: false,
                past: [...state.past, historyEntry],
                future: [],
            });
        },
        currentRows: state.data.length,
        currentCols: state.data[0]?.length || 0,
        clearTable: () => {
            const historyEntry: DataPayload = {
                data: state.data,
                selectedCell: state.selectedCell,
                selectedCells: state.selectedCells,
                selectedRows: state.selectedRows,
                selectedColumns: state.selectedColumns,
                isDragging: state.isDragging,
                selectAll: state.selectAll,
            };

            setState({
                ...state,
                data: initialState(state.data.length, state.data[0].length).data,
                past: [...state.past, historyEntry],
                future: [],
            });
        },
        deleteSelected: handleDeleteSelected,
        transposeTable: () => {
            const transposedData = state.data[0].map((_, colIndex) => state.data.map((row) => ({ ...row[colIndex] })));
            const historyEntry: DataPayload = {
                data: state.data,
                selectedCell: state.selectedCell,
                selectedCells: state.selectedCells,
                selectedRows: state.selectedRows,
                selectedColumns: state.selectedColumns,
                isDragging: state.isDragging,
                selectAll: state.selectAll,
            };

            setState({
                ...state,
                data: transposedData,
                past: [...state.past, historyEntry],
                future: [],
                selectedCells: Array(transposedData.length).fill(Array(transposedData[0].length).fill(false)),
                selectedCell: null,
                selectedRows: [],
                selectedColumns: [],
                selectAll: false,
            });
        },
    }), [
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
    ]);

    return (
        <ToolbarProvider
            spreadsheetAtom={atom}
            {...toolbarHandlers}
        >
            <div className="spreadsheet" ref={containerRef} tabIndex={0}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Menu 
                        handleNewTable={handleCreateNewTable} 
                        onDownloadCSV={handleDownloadCSV}
                        TableSizeChooser={TableSizeChooser}
                    />
                </Box>
                <Box sx={{ mb: 2 }}>
                    <ButtonGroup
                        visibleButtons={[
                            "Undo",
                            "Redo",
                            "divider",
                            "Set Bold",
                            "Set Italic",
                            "Set Code",
                            "divider",
                            "Align Left",
                            "Align Center",
                            "Align Right",
                            "divider",
                            "Add Row",
                            "Remove Row",
                            "Add Column",
                            "Remove Column",
                        ]}
                    />
                </Box>
                <Table
                    atom={atom}
                    onCellChange={handleCellChange}
                    onDragStart={handleDragStart}
                    onDragEnter={handleDragEnter}
                    onDragEnd={handleDragEnd}
                    ref={tableRef}
                />
            </div>
        </ToolbarProvider>
    );
};

export default Spreadsheet;
