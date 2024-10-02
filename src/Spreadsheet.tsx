import React, { useReducer, useRef, useEffect } from "react";
import { Box, CssBaseline, ThemeProvider, createTheme, TableBody, TableRow, TableHead } from "@mui/material";
import { ButtonGroup, ButtonGroupProvider, Cell, ColumnHeaderCell, Row, RowNumberCell, SelectAllCell, Table } from "@components";
import { reducer, handlePaste } from "@utils";
import { initialState, Alignment, SpreadsheetProps } from "@types";

export const Spreadsheet: React.FC<SpreadsheetProps> = ({ theme = "light" }) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const tableRef = useRef<HTMLTableElement>(null);
    const buttonGroupRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                tableRef.current &&
                !tableRef.current.contains(event.target as Node) &&
                buttonGroupRef.current &&
                !buttonGroupRef.current.contains(event.target as Node)
            ) {
                dispatch({ type: "CLEAR_SELECTION" });
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleUndo = () => {
        dispatch({ type: "UNDO" });
    };
    const handleRedo = () => {
        dispatch({ type: "REDO" });
    };
    const handleSetBold = () => {
        dispatch({ type: "SET_BOLD" });
    };
    const handleSetItalic = () => {
        dispatch({ type: "SET_ITALIC" });
    };
    const handleSetCode = () => {
        dispatch({ type: "SET_CODE" });
    };
    const handleAddRow = () => {
        dispatch({ type: "ADD_ROW" });
    };
    const handleRemoveRow = () => {
        dispatch({ type: "REMOVE_ROW" });
    };
    const handleAddColumn = () => {
        dispatch({ type: "ADD_COLUMN" });
    };
    const handleRemoveColumn = () => {
        dispatch({ type: "REMOVE_COLUMN" });
    };
    const clearSelection = () => {
        dispatch({ type: "CLEAR_SELECTION" });
    };
    const setAlignment = (alignment: Alignment) => {
        dispatch({ type: "SET_ALIGNMENT", payload: alignment });
    };
    const handleCellChange = (rowIndex: number, colIndex: number, value: string) => {
        const newData = [...state.data];
        newData[rowIndex] = [...newData[rowIndex]];
        newData[rowIndex][colIndex] = value;
        dispatch({ type: "SET_DATA", payload: newData });
    };

    const handlePasteEvent = (e: React.ClipboardEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (!state.selectedCell) return;
        const clipboardText = e.clipboardData.getData("Text");
        const { newData, newAlignments } = handlePaste(clipboardText, state.data, state.selectedCell, state.alignments);
        dispatch({ type: "HANDLE_PASTE", payload: { newData, newAlignments } });
    };

    const selectCells = (startRow: number, startCol: number, endRow: number, endCol: number) => {
        clearSelection();
        const newSelection = Array.from({ length: state.data.length }, () => Array(state.data[0].length).fill(false));
        for (let i = Math.min(startRow, endRow); i <= Math.max(startRow, endRow); i++) {
            for (let j = Math.min(startCol, endCol); j <= Math.max(startCol, endCol); j++) {
                newSelection[i][j] = true;
            }
        }
        dispatch({ type: "SET_SELECTED_CELLS", payload: newSelection });
    };

    const toggleSelectAll = () => {
        const newSelectAll = !state.selectAll;
        dispatch({ type: "SET_SELECT_ALL", payload: newSelectAll });
        const newSelectedCells = Array.from({ length: state.data.length }, () => Array(state.data[0].length).fill(newSelectAll));
        dispatch({ type: "SET_SELECTED_CELLS", payload: newSelectedCells });
        dispatch({ type: "SET_SELECTED_COLUMN", payload: null });
        dispatch({ type: "SET_SELECTED_ROW", payload: null });
        dispatch({ type: "SET_SELECTED_CELL", payload: null });
    };

    const handleRowSelection = (rowIndex: number) => {
        clearSelection();
        selectCells(rowIndex, 0, rowIndex, state.data[0].length - 1);
        dispatch({ type: "SET_SELECTED_ROW", payload: rowIndex });
    };

    const handleColumnSelection = (colIndex: number) => {
        clearSelection();
        selectCells(0, colIndex, state.data.length - 1, colIndex);
        dispatch({ type: "SET_SELECTED_COLUMN", payload: colIndex });
    };

    const handleCellSelection = (rowIndex: number, colIndex: number) => {
        clearSelection();
        selectCells(rowIndex, colIndex, rowIndex, colIndex);
        dispatch({ type: "SET_SELECTED_CELL", payload: { row: rowIndex, col: colIndex } });
    };

    const themeMui = createTheme({
        palette: {
            mode: theme,
        },
    });

    return (
        <ThemeProvider theme={themeMui}>
            <CssBaseline />
            <Box sx={{ p: 2 }}>
                <ButtonGroupProvider
                    onClickUndo={handleUndo}
                    onClickRedo={handleRedo}
                    onClickAlignLeft={() => setAlignment("left")}
                    onClickAlignCenter={() => setAlignment("center")}
                    onClickAlignRight={() => setAlignment("right")}
                    onClickAddRow={handleAddRow}
                    onClickRemoveRow={handleRemoveRow}
                    onClickAddColumn={handleAddColumn}
                    onClickRemoveColumn={handleRemoveColumn}
                    onClickSetBold={handleSetBold}
                    onClickSetItalic={handleSetItalic}
                    onClickSetCode={handleSetCode}
                >
                    <div ref={buttonGroupRef}>
                        <ButtonGroup theme={theme} />
                    </div>
                </ButtonGroupProvider>
                <Table theme={theme} onPaste={handlePasteEvent} ref={tableRef}>
                    <TableHead>
                        <TableRow>
                            <SelectAllCell theme={theme} selectAll={state.selectAll} toggleSelectAll={toggleSelectAll} />
                            {state.data[0].map((_, index) => (
                                <ColumnHeaderCell key={index} index={index} theme={theme} handleColumnSelection={handleColumnSelection} />
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {state.data.map((row, rowIndex) => (
                            <Row theme={theme} key={rowIndex}>
                                <RowNumberCell theme={theme} onClick={() => handleRowSelection(rowIndex)}>
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
                                    ></Cell>
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
