import React, { useReducer, useRef, useCallback, useEffect, useState, useMemo } from "react";
import {
    Box,
    Snackbar,
    TableBody,
    TableRow,
    TableHead,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button,
} from "@mui/material";
import { useTheme } from '@mui/material/styles'
import { CellFormat } from "./types"

// Internal Components
import { ButtonGroup, ToolbarProvider, Cell, ColumnHeaderCell, Row, RowNumberCell, SelectAllCell, Table, TableMenu } from "./components";

// Hooks, Utilities, Store and Types
import { useOutsideClick, useSpreadsheetActions } from "./hooks";
import { handlePaste, downloadCSV } from "./utils";
import { initialState, reducer } from "./store";
import { SpreadsheetProps } from "./types";

const ROW_HEIGHT = 37;
const BUFFER_SIZE = 10;

export const Spreadsheet: React.FC<SpreadsheetProps> = ({
    toolbarOrientation = 'horizontal',
    initialRows = 4,
    initialColumns = 10,
    tableHeight = '250px',
    value,
    onChange,
    onFormatChange,
}) => {
    const theme = useTheme()
    const isDarkMode = theme.palette.mode === 'dark'

    const initializeState = useCallback(() => {
        if (value) {
            // Use provided value for controlled component
            return {
                ...initialState(value.length, value[0]?.length || 0),
                data: value
            }
        }
        // Use default initialization for uncontrolled component
        return initialState(initialRows, initialColumns)
    }, [value, initialRows, initialColumns])

    const [state, dispatch] = useReducer(reducer, undefined, initializeState)

    // Sync with external value prop if provided
    useEffect(() => {
        if (value && JSON.stringify(value) !== JSON.stringify(state.data)) {
            dispatch({ type: 'SET_DATA', payload: value })
        }
    }, [value])

    // Notify parent of changes
    useEffect(() => {
        onChange?.(state.data)
    }, [state.data, onChange])

    const [scrollTop, setScrollTop] = useState(0);
    const [containerHeight, setContainerHeight] = useState(0);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [confirmDialogAction, setConfirmDialogAction] = useState<(() => void) | null>(null);

    const handleFormatChange = useCallback(
        (operation: string, row: number, col: number) => {
            if (!onFormatChange) return

            const currentCell = state.data[row]?.[col]
            if (currentCell === undefined) return

            const format: CellFormat = {
                bold: operation === 'BOLD' ? !state.bold[row]?.[col] : !!state.bold[row]?.[col],
                italic: operation === 'ITALIC' ? !state.italic[row]?.[col] : !!state.italic[row]?.[col],
                code: operation === 'CODE' ? !state.code[row]?.[col] : !!state.code[row]?.[col],
                alignment: state.alignments[row]?.[col] || 'none'
            }

            onFormatChange(row, col, format)
        },
        [onFormatChange, state.bold, state.italic, state.code, state.alignments]
    )

    const handleTextFormatting = useCallback((operation: 'BOLD' | 'ITALIC' | 'CODE') => {
        dispatch({ type: "APPLY_TEXT_FORMATTING", payload: { operation } })
        if (state.selectedCell) {
            handleFormatChange(operation, state.selectedCell.row, state.selectedCell.col)
        }
    }, [dispatch, state.selectedCell, handleFormatChange])

    const handleSetBold = useCallback(() => handleTextFormatting('BOLD'), [handleTextFormatting])
    const handleSetItalic = useCallback(() => handleTextFormatting('ITALIC'), [handleTextFormatting])
    const handleSetCode = useCallback(() => handleTextFormatting('CODE'), [handleTextFormatting])

    const tableRef = useRef<HTMLTableElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const buttonGroupRef = useRef<HTMLDivElement>(null);

    const selectedRows = new Set<number>();
    const selectedColumns = new Set<number>();

    const setTableSize = useCallback(
        (row: number, col: number) => {
            const minRows = 1;
            const minCols = 1;
            const newRows = Math.max(row, minRows);
            const newCols = Math.max(col, minCols);
            dispatch({ type: "SET_TABLE_SIZE", payload: { row: newRows, col: newCols } });
        },
        [dispatch]
    );

    useOutsideClick([tableRef, buttonGroupRef], () => dispatch({ type: "CLEAR_SELECTION" }));
    const actions = useSpreadsheetActions(dispatch, handleFormatChange)

    const handleDownloadCSV = useCallback(() => {
        try {
            downloadCSV(state.data);
            setSnackbarMessage("Table.csv has been downloaded successfully.");
            setSnackbarOpen(true);
        } catch (error) {
            console.error("Failed to download CSV:", error);
            setSnackbarMessage("Failed to download CSV. Please try again.");
            setSnackbarOpen(true);
        }
    }, [state.data]);

    const handleSnackbarClose = useCallback(() => {
        setSnackbarOpen(false);
    }, []);

    const handleCellChange = useCallback(
        (rowIndex: number, colIndex: number, value: string) => {
            const newData = state.data.map((row, rIdx) => (rIdx === rowIndex ? row.map((cell, cIdx) => (cIdx === colIndex ? value : cell)) : row));
            dispatch({ type: "SET_DATA", payload: newData });
        },
        [state.data, dispatch]
    );

    const handlePasteEvent = useCallback(
        (e: React.ClipboardEvent<HTMLDivElement> | ClipboardEvent) => {
            e.preventDefault();
            if (!state.selectedCell) {
                dispatch({
                    type: "SET_SELECTED_CELL",
                    payload: { row: 0, col: 0 },
                });
            }
            const clipboardText = (e as ClipboardEvent).clipboardData?.getData("Text") || 
                                (e as React.ClipboardEvent<HTMLDivElement>).clipboardData.getData("Text");
            const result = handlePaste(clipboardText, state.data, state.selectedCell || { row: 0, col: 0 }, state.alignments);
            dispatch({ type: "HANDLE_PASTE", payload: result });
        },
        [state.data, state.selectedCell, state.alignments, dispatch]
    );

    const handleAddColumnLeft = useCallback(
        (index: number) => {
            dispatch({ type: "ADD_COLUMN", payload: { index, position: "left" } });
            setSnackbarMessage("Column added successfully.");
            setSnackbarOpen(true);
        },
        [dispatch]
    );

    const handleAddColumnRight = useCallback(
        (index: number) => {
            dispatch({ type: "ADD_COLUMN", payload: { index, position: "right" } });
            setSnackbarMessage("Column added successfully.");
            setSnackbarOpen(true);
        },
        [dispatch]
    );

    const handleRemoveColumn = useCallback(
        (index: number) => {
            setConfirmDialogAction(() => () => {
                dispatch({ type: "REMOVE_COLUMN", payload: { index } });
                setSnackbarMessage("Column removed successfully.");
                setSnackbarOpen(true);
            });
            setConfirmDialogOpen(true);
        },
        [dispatch]
    );

    const handleConfirmDialogClose = useCallback(
        (confirmed: boolean) => {
            setConfirmDialogOpen(false);
            if (confirmed && confirmDialogAction) {
                confirmDialogAction();
            }
        },
        [confirmDialogAction]
    );

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
    }, [state.selectAll]);

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

    const transposeTable = useCallback(() => {
        dispatch({ type: "TRANSPOSE_TABLE" });
    }, [dispatch]);

    const handleMouseUp = useCallback(() => {
        if (state.isDragging) {
            dispatch({ type: "END_DRAG" });
        }
    }, [state.isDragging]);

    const clearTable = useCallback(() => {
        dispatch({ type: "CLEAR_TABLE" });
    }, [dispatch]);

    const handleCreateNewTable = useCallback(
        (rows: number, columns: number) => {
            setTableSize(rows, columns);
            clearTable();
        },
        [setTableSize, clearTable]
    );

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

    useEffect(() => {
        const updateContainerHeight = () => {
            if (containerRef.current) {
                setContainerHeight(containerRef.current.clientHeight);
            }
        };

        updateContainerHeight();
        window.addEventListener("resize", updateContainerHeight);

        return () => {
            window.removeEventListener("resize", updateContainerHeight);
        };
    }, []);

    const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
        setScrollTop(e.currentTarget.scrollTop);
    }, []);

    const { visibleRows, startIndex, offsetY } = useMemo(() => {
        const visibleRowsCount = Math.ceil(containerHeight / ROW_HEIGHT) + BUFFER_SIZE * 2;
        const startIndex = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - BUFFER_SIZE);
        const endIndex = Math.min(startIndex + visibleRowsCount, state.data.length);
        const visibleRows = state.data.slice(startIndex, endIndex);
        const offsetY = startIndex * ROW_HEIGHT;

        return { visibleRows, startIndex, offsetY };
    }, [containerHeight, scrollTop, state.data]);

    const totalHeight = state.data.length * ROW_HEIGHT;

    state.selectedCells.forEach((rowSelection, rowIndex) => {
        rowSelection.forEach((isSelected, colIndex) => {
            if (isSelected) {
                selectedRows.add(rowIndex);
                selectedColumns.add(colIndex);
            }
        });
    });

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Delete' && state.selectedCells) {
                const newData = state.data.map((row, rowIndex) =>
                    row.map((cell, colIndex) =>
                        state.selectedCells[rowIndex]?.[colIndex] ? '' : cell
                    )
                )
                dispatch({ type: 'SET_DATA', payload: newData })
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [state.data, state.selectedCells, dispatch])

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.focus();
        }
    }, []);

    useEffect(() => {
        const handleGlobalPaste = (e: ClipboardEvent) => {
            if (document.activeElement === containerRef.current || 
                containerRef.current?.contains(document.activeElement)) {
                handlePasteEvent(e);
            }
        };

        document.addEventListener('paste', handleGlobalPaste);
        return () => {
            document.removeEventListener('paste', handleGlobalPaste);
        };
    }, [handlePasteEvent]);

    const handleRowDragStart = useCallback((rowIndex: number) => {
        dispatch({ type: "START_ROW_SELECTION", payload: rowIndex });
    }, [dispatch]);

    const handleRowDragEnter = useCallback((rowIndex: number) => {
        if (state.dragStartRow !== null) {
            dispatch({ type: "UPDATE_ROW_SELECTION", payload: rowIndex });
        }
    }, [state.dragStartRow, dispatch]);

    const handleRowDragEnd = useCallback(() => {
        if (state.dragStartRow !== null) {
            dispatch({ type: "END_ROW_SELECTION" });
        }
    }, [state.dragStartRow, dispatch]);

    const handleColumnDragStart = useCallback((colIndex: number) => {
        dispatch({ type: "START_COLUMN_SELECTION", payload: colIndex });
    }, [dispatch]);

    const handleColumnDragEnter = useCallback((colIndex: number) => {
        if (state.dragStartColumn !== null) {
            dispatch({ type: "UPDATE_COLUMN_SELECTION", payload: colIndex });
        }
    }, [state.dragStartColumn, dispatch]);

    const handleColumnDragEnd = useCallback(() => {
        if (state.dragStartColumn !== null) {
            dispatch({ type: "END_COLUMN_SELECTION" });
        }
    }, [state.dragStartColumn, dispatch]);

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                ...(toolbarOrientation === "horizontal" ? { p: 0 } : { p: 0 }),
                height: "100%",
            }}
        >
            <ToolbarProvider
                onClickUndo={actions.handleUndo}
                onClickRedo={actions.handleRedo}
                onClickAlignLeft={() => actions.setAlignment("left")}
                onClickAlignCenter={() => actions.setAlignment("center")}
                onClickAlignRight={() => actions.setAlignment("right")}
                onClickAddRow={actions.handleAddRow}
                onClickRemoveRow={actions.handleRemoveRow}
                onClickAddColumn={actions.handleAddColumn}
                onClickRemoveColumn={actions.handleRemoveColumn}
                onClickSetBold={handleSetBold}
                onClickSetItalic={handleSetItalic}
                onClickSetCode={handleSetCode}
                setTableSize={setTableSize}
                currentRows={state.data.length}
                currentCols={state.data[0].length}
                clearTable={clearTable}
                transposeTable={transposeTable}
            >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <TableMenu 
                        onCreateNewTable={handleCreateNewTable} 
                        onDownloadCSV={handleDownloadCSV}
                    />
                </Box>
                <div ref={buttonGroupRef}>
                    <ButtonGroup orientation={toolbarOrientation} />
                </div>
            </ToolbarProvider>
            <div
                ref={containerRef}
                style={{
                    height: tableHeight,
                    maxHeight: "100%",
                    overflowY: "auto",
                    position: "relative",
                    outline: "none",
                }}
                onScroll={handleScroll}
                tabIndex={0}
                onPaste={handlePasteEvent}
            >
                <div style={{ height: Math.max(totalHeight, parseFloat(tableHeight)) + "px", position: "relative" }}>
                    <Table
                        onPaste={handlePasteEvent}
                        ref={tableRef}
                        style={{
                            position: "absolute",
                            top: offsetY,
                            left: 0,
                            right: 0,
                        }}
                    >
                        <TableHead style={{ position: "sticky", top: 0, zIndex: 1, backgroundColor: isDarkMode ? "#424242" : "#fff" }}>
                            <TableRow>
                                <SelectAllCell selectAll={state.selectAll} toggleSelectAll={toggleSelectAll} />
                                {state.data[0].map((_, index) => (
                                    <ColumnHeaderCell
                                        key={index}
                                        index={index}
                                        handleColumnSelection={handleColumnSelection}
                                        selectedColumns={selectedColumns}
                                        onAddColumnLeft={handleAddColumnLeft}
                                        onAddColumnRight={handleAddColumnRight}
                                        onRemoveColumn={handleRemoveColumn}
                                        onDragStart={handleColumnDragStart}
                                        onDragEnter={handleColumnDragEnter}
                                        onDragEnd={handleColumnDragEnd}
                                    />
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {visibleRows.map((row, index) => {
                                const rowIndex = startIndex + index;
                                return (
                                    <Row key={rowIndex}>
                                        <RowNumberCell
                                            onClick={() => handleRowSelection(rowIndex)}
                                            selectedRows={selectedRows}
                                            rowIndex={rowIndex}
                                            onDragStart={handleRowDragStart}
                                            onDragEnter={handleRowDragEnter}
                                            onDragEnd={handleRowDragEnd}
                                        >
                                            {rowIndex + 1}
                                        </RowNumberCell>
                                        {row.map((cell, colIndex) => (
                                            <Cell
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
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>
            </div>
            <Snackbar
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={handleSnackbarClose}
                message={snackbarMessage}
            />
            <Dialog
                open={confirmDialogOpen}
                onClose={() => handleConfirmDialogClose(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Confirm Column Removal"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to remove this column? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleConfirmDialogClose(false)}>Cancel</Button>
                    <Button onClick={() => handleConfirmDialogClose(true)} autoFocus>
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Spreadsheet;