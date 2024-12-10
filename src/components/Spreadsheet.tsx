/**
 * @fileoverview Core spreadsheet component managing state and user interactions
 * through a combination of Jotai atoms and React hooks.
 */

import React, { useCallback, useRef, useEffect } from "react";
import { useAtom } from "jotai";
import { PrimitiveAtom } from "jotai";
import { State } from "../types";
import { Box } from "@mui/material";
import Table from "./Table";
import ButtonGroup from "./ButtonGroup";
import { useDragSelection } from "../hooks";
import { addRow, removeRow, addColumn, removeColumn } from "../utils/spreadsheetOperations";
import { ToolbarProvider } from "./ToolbarProvider";
import { initialState } from "../store/initialState";

interface SpreadsheetProps {
    atom: PrimitiveAtom<State>;
}

const Spreadsheet: React.FC<SpreadsheetProps> = ({ atom }) => {
    const [state, setState] = useAtom(atom);
    const { handleDragStart, handleDragEnter, handleDragEnd } = useDragSelection(atom);

    const containerRef = useRef<HTMLDivElement>(null);
    const tableRef = useRef<HTMLTableElement>(null);

    const handleCellChange = useCallback(
        (rowIndex: number, colIndex: number, value: string) => {
            const newData = state.data.map((row, i) => (i === rowIndex ? row.map((cell, j) => (j === colIndex ? { ...cell, value } : cell)) : row));

            setState({
                ...state,
                data: newData,
            });
        },
        [state, setState]
    );

    const handleAddRow = useCallback(() => {
        const result = addRow({
            data: state.data,
            selectedCells: state.selectedCells,
        });
        setState({
            ...state,
            data: result.newData,
            selectedCells: result.newSelectedCells,
        });
    }, [state, setState]);

    const handleRemoveRow = useCallback(() => {
        const result = removeRow({
            data: state.data,
            selectedCells: state.selectedCells,
        });
        setState({
            ...state,
            data: result.newData,
            selectedCells: result.newSelectedCells,
        });
    }, [state, setState]);

    const handleAddColumn = useCallback(() => {
        const result = addColumn({
            data: state.data,
            selectedCells: state.selectedCells,
        });
        setState({
            ...state,
            data: result.newData,
            selectedCells: result.newSelectedCells,
        });
    }, [state, setState]);

    const handleRemoveColumn = useCallback(() => {
        const result = removeColumn({
            data: state.data,
            selectedCells: state.selectedCells,
        });
        setState({
            ...state,
            data: result.newData,
            selectedCells: result.newSelectedCells,
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

        setState({
            ...state,
            data: newData,
        });
    }, [state, setState]);

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

    // Toolbar action handlers
    const handleUndo = useCallback(() => {
        if (state.past.length === 0) return;
        const previous = state.past[state.past.length - 1];
        const newPast = state.past.slice(0, -1);

        setState({
            ...state,
            data: previous.data,
            selectedCell: previous.selectedCell ?? null,
            selectedCells: previous.selectedCells ?? state.selectedCells,
            selectedRows: previous.selectedRows ?? [],
            selectedColumns: previous.selectedColumns ?? [],
            past: newPast,
            future: [
                {
                    data: state.data,
                    selectedCell: state.selectedCell,
                    selectedCells: state.selectedCells,
                    selectedRows: state.selectedRows,
                    selectedColumns: state.selectedColumns,
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
            selectedCell: next.selectedCell ?? null,
            selectedCells: next.selectedCells ?? state.selectedCells,
            past: [
                ...state.past,
                {
                    data: state.data,
                    selectedCell: state.selectedCell,
                    selectedCells: state.selectedCells,
                    selectedRows: state.selectedRows,
                    selectedColumns: state.selectedColumns,
                },
            ],
            future: newFuture,
        });
    }, [state, setState]);

    const handleSetAlignment = useCallback(
        (alignment: "left" | "center" | "right") => {
            const newData = state.data.map((row, rowIndex) =>
                row.map((cell, colIndex) => {
                    if ((state.selectedCell?.row === rowIndex && state.selectedCell?.col === colIndex) || state.selectedCells[rowIndex]?.[colIndex]) {
                        return { ...cell, align: alignment };
                    }
                    return cell;
                })
            );

            setState({ ...state, data: newData });
        },
        [state, setState]
    );

    const handleTextFormatting = useCallback(
        (format: "bold" | "italic" | "code") => {
            const newData = state.data.map((row, rowIndex) =>
                row.map((cell, colIndex) => {
                    if ((state.selectedCell?.row === rowIndex && state.selectedCell?.col === colIndex) || state.selectedCells[rowIndex]?.[colIndex]) {
                        return { ...cell, [format]: !cell[format] };
                    }
                    return cell;
                })
            );

            setState({ ...state, data: newData });
        },
        [state, setState]
    );

    const toolbarHandlers = {
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
        currentRows: state.data.length,
        currentCols: state.data[0]?.length || 0,
        clearTable: () =>
            setState({
                ...state,
                data: initialState(state.data.length, state.data[0].length).data,
            }),
        deleteSelected: handleDeleteSelected,
        transposeTable: () => {
            /* Implement transpose */
        },
    };

    return (
        <ToolbarProvider {...toolbarHandlers} spreadsheetAtom={atom as PrimitiveAtom<State> & { init: State }}>
            <div className="spreadsheet" ref={containerRef} tabIndex={0}>
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
                            "Remove Column"
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
