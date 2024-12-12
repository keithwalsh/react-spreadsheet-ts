/**
 * @fileoverview Core spreadsheet component managing state and user interactions
 * through a combination of Jotai atoms and React hooks.
 */

import React, { useCallback, useRef, useEffect, useMemo, useState } from "react";
import { PrimitiveAtom, useAtom } from "jotai";
import { Box } from "@mui/material";
import { useDragSelection, useOutsideClick, useSpreadsheetActions } from "../hooks";
import { initialState } from "../store";
import { CellData, DataPayload, State } from "../types";
import { addColumn, addRow, downloadCSV, removeColumn, removeRow } from "../utils";
import Table from "./Table";
import ButtonGroup from "./ButtonGroup";
import { ToolbarProvider } from "./ToolbarProvider";
import Menu from "./Menu";
import TableSizeChooser from "./TableSizeChooser";
import NewTableModal from "./NewTableModal";

interface SpreadsheetProps {
    atom: PrimitiveAtom<State>;
}

const Spreadsheet: React.FC<SpreadsheetProps> = ({ atom }) => {
    const [state, setState] = useAtom(atom);
    const { handleDragStart, handleDragEnter, handleDragEnd } = useDragSelection(atom);
    const [isNewTableModalOpen, setIsNewTableModalOpen] = useState(false);
    const { handleTextFormatting, handleSetAlignment } = useSpreadsheetActions(atom);

    const containerRef = useRef<HTMLDivElement>(null);
    const tableRef = useRef<HTMLTableElement>(null);

    useOutsideClick([containerRef, tableRef], atom);

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

    const handleAddRow = useCallback(
        (position: "above" | "below") => {
            const result = addRow({
                data: state.data,
                selectedCells: state.selectedCells,
                index: state.selectedCell?.row ?? state.data.length,
                position,
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
        },
        [state, setState]
    );

    const handleRemoveRow = useCallback(
        (index?: number) => {
            // If index is provided (from context menu), use it
            // Otherwise, remove the last row (toolbar button)
            const rowIndex = typeof index === "number" ? index : state.data.length - 1;

            const result = removeRow({
                data: state.data,
                selectedCells: state.selectedCells,
                index: rowIndex,
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
        },
        [state, setState]
    );

    const handleAddColumn = useCallback(
        (position: "left" | "right") => {
            const result = addColumn({
                data: state.data,
                selectedCells: state.selectedCells,
                index: state.selectedCell?.col ?? state.data[0].length,
                position,
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
        },
        [state, setState]
    );

    const handleRemoveColumn = useCallback(
        (index?: number) => {
            // If index is provided (from context menu), use it
            // Otherwise, remove the last column (toolbar button)
            const colIndex = typeof index === "number" ? index : state.data[0].length - 1;

            const result = removeColumn({
                data: state.data,
                selectedCells: state.selectedCells,
                index: colIndex,
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
        },
        [state, setState]
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

    const handleOpenNewTableModal = useCallback(() => {
        setIsNewTableModalOpen(true);
    }, []);

    const handleCloseNewTableModal = useCallback(() => {
        setIsNewTableModalOpen(false);
    }, []);

    const handleDownloadCSV = useCallback(() => {
        downloadCSV(state.data, "spreadsheet.csv");
    }, [state.data]);

    const handleAddColumnLeft = useCallback(
        (index: number) => {
            const result = addColumn({
                data: state.data,
                selectedCells: state.selectedCells,
                index,
                position: "left",
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
        },
        [state, setState]
    );

    const handleAddColumnRight = useCallback(
        (index: number) => {
            const result = addColumn({
                data: state.data,
                selectedCells: state.selectedCells,
                index,
                position: "right",
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
        },
        [state, setState]
    );

    const handleAddRowAbove = useCallback(
        (index: number) => {
            const result = addRow({
                data: state.data,
                selectedCells: state.selectedCells,
                index,
                position: "above",
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
        },
        [state, setState]
    );

    const handleAddRowBelow = useCallback(
        (index: number) => {
            const result = addRow({
                data: state.data,
                selectedCells: state.selectedCells,
                index,
                position: "below",
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
        },
        [state, setState]
    );

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

    return (
        <ToolbarProvider spreadsheetAtom={atom} {...toolbarHandlers}>
            <div className="spreadsheet" ref={containerRef} tabIndex={0}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Menu handleNewTable={handleOpenNewTableModal} onDownloadCSV={handleDownloadCSV} TableSizeChooser={TableSizeChooser} />
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
                            "Remove Last Row",
                            "Add Column",
                            "Remove Last Column",
                        ]}
                    />
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
