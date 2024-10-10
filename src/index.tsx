import React, { useReducer, useRef, useCallback, useEffect } from "react";
import { Box, CssBaseline, ThemeProvider, createTheme, TableBody, TableRow, TableHead } from "@mui/material";

// Internal Components
import { ButtonGroup, ButtonGroupProvider, Cell, ColumnHeaderCell, Row, RowNumberCell, SelectAllCell, Table, TableMenu } from "./components";

// Hooks, Utilities, and Types
import { useOutsideClick, useSpreadsheetActions } from "./hooks";
import { createInitialState, reducer, handlePaste } from "./utils";
import { SpreadsheetProps } from "./types";

const Spreadsheet: React.FC<SpreadsheetProps> = ({ theme = "light", toolbarOrientation = "horizontal", initialRows = 4, initialColumns = 5 }) => {
    // Lazy initialization function for useReducer
    const initializeState = useCallback(() => createInitialState(initialRows, initialColumns), [initialRows, initialColumns]);

    const [state, dispatch] = useReducer(reducer, undefined, initializeState);
    const tableRef = useRef<HTMLTableElement>(null);
    const buttonGroupRef = useRef<HTMLDivElement>(null);

    const setTableSize = (row: number, col: number) => {
        const minRows = 1;
        const minCols = 1;
        const newRows = Math.max(row, minRows);
        const newCols = Math.max(col, minCols);
        dispatch({ type: "SET_TABLE_SIZE", payload: { row: newRows, col: newCols } });
    };

    // Use custom hooks
    useOutsideClick([tableRef, buttonGroupRef], () => dispatch({ type: "CLEAR_SELECTION" }));
    const actions = useSpreadsheetActions(dispatch);

    // Handle cell changes
    const handleCellChange = useCallback(
        (rowIndex: number, colIndex: number, value: string) => {
            const newData = state.data.map((row, rIdx) => (rIdx === rowIndex ? row.map((cell, cIdx) => (cIdx === colIndex ? value : cell)) : row));
            dispatch({ type: "SET_DATA", payload: newData });
        },
        [state.data, dispatch]
    );

    // Handle paste events
    const handlePasteEvent = useCallback(
        (e: React.ClipboardEvent<HTMLDivElement>) => {
            e.preventDefault();
            if (!state.selectedCell) return;
            const clipboardText = e.clipboardData.getData("Text");
            const { newData, newAlignments } = handlePaste(clipboardText, state.data, state.selectedCell, state.alignments);
            dispatch({ type: "HANDLE_PASTE", payload: { newData, newAlignments } });
        },
        [state, dispatch]
    );

    // Selection handlers
    const selectCells = useCallback(
        (startRow: number, startCol: number, endRow: number, endCol: number) => {
            actions.clearSelection();
            const newSelection = state.data.map((_, i) =>
                state.data[0].map(
                    (_, j) =>
                        i >= Math.min(startRow, endRow) && i <= Math.max(startRow, endRow) && j >= Math.min(startCol, endCol) && j <= Math.max(startCol, endCol)
                )
            );
            dispatch({ type: "SET_SELECTED_CELLS", payload: newSelection });
        },
        [state.data, actions]
    );

    const toggleSelectAll = useCallback(() => {
        const newSelectAll = !state.selectAll;
        dispatch({ type: "SET_SELECT_ALL", payload: newSelectAll });
        const newSelectedCells = state.data.map((row) => row.map(() => newSelectAll));
        dispatch({ type: "SET_SELECTED_CELLS", payload: newSelectedCells });
        dispatch({ type: "SET_SELECTED_COLUMN", payload: null });
        dispatch({ type: "SET_SELECTED_ROW", payload: null });
        dispatch({ type: "SET_SELECTED_CELL", payload: null });
    }, [state.data, state.selectAll]);

    const handleRowSelection = useCallback(
        (rowIndex: number) => {
            actions.clearSelection();
            selectCells(rowIndex, 0, rowIndex, state.data[0].length - 1);
            dispatch({ type: "SET_SELECTED_ROW", payload: rowIndex });
        },
        [actions, selectCells, state.data]
    );

    const handleColumnSelection = useCallback(
        (colIndex: number) => {
            actions.clearSelection();
            selectCells(0, colIndex, state.data.length - 1, colIndex);
            dispatch({ type: "SET_SELECTED_COLUMN", payload: colIndex });
        },
        [actions, selectCells, state.data]
    );

    const handleCellSelection = useCallback(
        (rowIndex: number, colIndex: number) => {
            actions.clearSelection();
            selectCells(rowIndex, colIndex, rowIndex, colIndex);
            dispatch({
                type: "SET_SELECTED_CELL",
                payload: { row: rowIndex, col: colIndex },
            });
        },
        [actions, selectCells]
    );

    const themeMui = createTheme({
        palette: {
            mode: theme,
        },
    });

    // Mouse event handlers
    const handleMouseDown = useCallback(
        (row: number, col: number) => {
            dispatch({ type: "START_DRAG", payload: { row, col } });
        },
        [dispatch]
    );

    const handleMouseEnter = useCallback(
        (row: number, col: number) => {
            if (state.isDragging && state.dragStart) {
                dispatch({ type: "UPDATE_DRAG", payload: { row, col } });
            }
        },
        [state.isDragging, state.dragStart]
    );

    const handleMouseUp = useCallback(() => {
        if (state.isDragging) {
            dispatch({ type: "END_DRAG" });
        }
    }, [state.isDragging]);

    // Add global mouse up listener to handle cases where mouse is released outside the table
    useEffect(() => {
        const handleGlobalMouseUp = () => {
            if (state.isDragging) {
                dispatch({ type: "END_DRAG" });
            }
        };
        window.addEventListener("mouseup", handleGlobalMouseUp);
        return () => {
            window.removeEventListener("mouseup", handleGlobalMouseUp);
        };
    }, [state.isDragging]);

    const selectedRows = new Set<number>();
    const selectedColumns = new Set<number>();

    state.selectedCells.forEach((rowSelection, rowIndex) => {
        rowSelection.forEach((isSelected, colIndex) => {
            if (isSelected) {
                selectedRows.add(rowIndex);
                selectedColumns.add(colIndex);
            }
        });
    });

    return (
        <ThemeProvider theme={themeMui}>
            <CssBaseline />
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    ...(toolbarOrientation === "horizontal" ? { p: 0 } : { p: 0 }),
                }}
            >
                <ButtonGroupProvider
                    onClickUndo={actions.handleUndo}
                    onClickRedo={actions.handleRedo}
                    onClickAlignLeft={() => actions.setAlignment("left")}
                    onClickAlignCenter={() => actions.setAlignment("center")}
                    onClickAlignRight={() => actions.setAlignment("right")}
                    onClickAddRow={actions.handleAddRow}
                    onClickRemoveRow={actions.handleRemoveRow}
                    onClickAddColumn={actions.handleAddColumn}
                    onClickRemoveColumn={actions.handleRemoveColumn}
                    onClickSetBold={actions.handleSetBold}
                    onClickSetItalic={actions.handleSetItalic}
                    onClickSetCode={actions.handleSetCode}
                    setTableSize={setTableSize}
                >
                    <Box sx={{ display: "flex", alignItems: "center", mb: -2.75 }}>
                        <TableMenu />
                    </Box>
                    <div ref={buttonGroupRef}>
                        <ButtonGroup theme={theme} orientation={toolbarOrientation} />
                    </div>
                </ButtonGroupProvider>
                <Table theme={theme} onPaste={handlePasteEvent} ref={tableRef}>
                    <TableHead>
                        <TableRow>
                            <SelectAllCell theme={theme} selectAll={state.selectAll} toggleSelectAll={toggleSelectAll} />
                            {state.data[0].map((_, index) => (
                                <ColumnHeaderCell
                                    key={index}
                                    index={index}
                                    theme={theme}
                                    handleColumnSelection={handleColumnSelection}
                                    selectedColumns={selectedColumns}
                                />
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {state.data.map((row, rowIndex) => (
                            <Row theme={theme} key={rowIndex}>
                                <RowNumberCell theme={theme} onClick={() => handleRowSelection(rowIndex)} selectedRows={selectedRows} rowIndex={rowIndex}>
                                    {rowIndex + 1}
                                </RowNumberCell>
                                {row.map((cell, colIndex) => (
                                    <Cell
                                        theme={theme}
                                        key={colIndex}
                                        rowIndex={rowIndex}
                                        colIndex={colIndex}
                                        align={state.alignments[rowIndex][colIndex]}
                                        selectedCells={state.selectedCells}
                                        selectedCell={state.selectedCell}
                                        handleCellSelection={handleCellSelection}
                                        handleCellChange={handleCellChange}
                                        cellData={cell}
                                        onMouseDown={handleMouseDown}
                                        onMouseEnter={handleMouseEnter}
                                        onMouseUp={handleMouseUp}
                                    />
                                ))}
                            </Row>
                        ))}
                    </TableBody>
                </Table>
            </Box>
        </ThemeProvider>
    );
};

export default Spreadsheet;
