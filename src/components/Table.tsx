import * as React from "react";
import { TableContainer as TableContainerMui, Table as TableMui, Paper as PaperMui, TableHead, TableBody, useTheme, createTheme } from "@mui/material";
import { useAtom } from "jotai";
import { PrimitiveAtom } from "jotai";
import { State } from "../types";
import Row from "./Row";
import Cell from "./Cell";
import RowNumberCell from "./RowNumberCell";
import ColumnHeaderCell from "./ColumnHeaderCell";
import SelectAllCell from "./SelectAllCell";
import { useToolbar } from "./ToolbarProvider";

const defaultTheme = createTheme();

interface TableProps {
    atom: PrimitiveAtom<State>;
    onCellChange: (rowIndex: number, colIndex: number, value: string) => void;
    onDragStart: (row: number, col: number) => void;
    onDragEnter: (row: number, col: number) => void;
    onDragEnd: () => void;
    onAddColumnLeft: (index: number) => void;
    onAddColumnRight: (index: number) => void;
    onRemoveColumn: (index: number) => void;
    onAddRowAbove: (index: number) => void;
    onAddRowBelow: (index: number) => void;
    onRemoveRow: (index: number) => void;
    children?: React.ReactNode;
}

const Table = React.forwardRef<HTMLTableElement, TableProps>(
    (
        {
            atom,
            onCellChange,
            onDragStart,
            onDragEnter,
            onDragEnd,
            onAddColumnLeft,
            onAddColumnRight,
            onRemoveColumn,
            onAddRowAbove,
            onAddRowBelow,
            onRemoveRow,
            children,
        },
        ref
    ) => {
        const [state, setState] = useAtom(atom);

        const handlePasteEvent = React.useCallback(
            (event: React.ClipboardEvent<HTMLDivElement>) => {
                event.preventDefault();
                const clipboardText = event.clipboardData?.getData("text") || "";

                if (state.selectedCell) {
                    onCellChange(state.selectedCell.row, state.selectedCell.col, clipboardText);
                }
            },
            [state.selectedCell, onCellChange]
        );

        const theme = useTheme() || defaultTheme;
        const isDarkMode = theme?.palette?.mode === "dark" || false;

        const lightThemeStyles = {
            border: "1px solid #e0e0e0",
        };

        const darkThemeStyles = {
            border: "1px solid #686868",
        };

        const commonStyles = {
            mt: 0,
            width: "auto",
            display: "inline-block",
            backgroundColor: "transparent",
        };

        const tableStyles = {
            ...commonStyles,
            ...(isDarkMode ? darkThemeStyles : lightThemeStyles),
        };

        const handleRowDragStart = React.useCallback(
            (rowIndex: number) => {
                onDragStart(rowIndex, -1);
            },
            [onDragStart]
        );

        const handleRowDragEnter = React.useCallback(
            (rowIndex: number) => {
                onDragEnter(rowIndex, -1);
            },
            [onDragEnter]
        );

        const handleColumnDragStart = React.useCallback(
            (colIndex: number) => {
                onDragStart(-1, colIndex);
            },
            [onDragStart]
        );

        const handleColumnDragEnter = React.useCallback(
            (colIndex: number) => {
                onDragEnter(-1, colIndex);
            },
            [onDragEnter]
        );

        const handleToggleSelectAll = React.useCallback(() => {
            setState((prevState) => ({
                ...prevState,
                selectAll: !prevState.selectAll,
                // Clear other selections when toggling select all
                selectedCell: null,
                selectedCells: prevState.data.map((row) => Array(row.length).fill(false)),
                selectedRows: [],
                selectedColumns: [],
            }));
        }, [setState]);

        const handleCellMouseDown = React.useCallback(
            (rowIndex: number, colIndex: number, shiftKey: boolean, ctrlKey: boolean) => {
                if (shiftKey && state.selectedCell) {
                    // Handle range selection
                    const startRow = Math.min(state.selectedCell.row, rowIndex);
                    const endRow = Math.max(state.selectedCell.row, rowIndex);
                    const startCol = Math.min(state.selectedCell.col, colIndex);
                    const endCol = Math.max(state.selectedCell.col, colIndex);

                    const newSelectedCells = state.data.map((row, r) =>
                        row.map((_, c) => {
                            const isInRange = r >= startRow && r <= endRow && c >= startCol && c <= endCol;
                            return isInRange || (state.selectedCells[r] && state.selectedCells[r][c]);
                        })
                    );

                    setState((prev) => ({
                        ...prev,
                        selectedCells: newSelectedCells,
                        selectedCell: { row: rowIndex, col: colIndex },
                        selectAll: false,
                        selectedRows: [],
                        selectedColumns: [],
                    }));
                } else if (ctrlKey) {
                    // Handle non-contiguous selection
                    setState((prev) => {
                        const newSelectedCells = prev.selectedCells.map((row, r) =>
                            row.map((cell, c) => {
                                if (r === rowIndex && c === colIndex) {
                                    return !cell; // Toggle the selection
                                }
                                return cell;
                            })
                        );

                        return {
                            ...prev,
                            selectedCells: newSelectedCells,
                            selectedCell: { row: rowIndex, col: colIndex },
                            selectAll: false,
                            selectedRows: [],
                            selectedColumns: [],
                        };
                    });
                } else {
                    // Regular single cell selection
                    const newSelectedCells = state.data.map((row) => row.map(() => false));
                    newSelectedCells[rowIndex][colIndex] = true;

                    setState((prev) => ({
                        ...prev,
                        selectedCell: { row: rowIndex, col: colIndex },
                        selectedCells: newSelectedCells,
                        selectAll: false,
                        selectedRows: [],
                        selectedColumns: [],
                    }));
                }
            },
            [state, setState]
        );

        const toolbar = useToolbar();

        const handleKeyDown = React.useCallback(
            (event: React.KeyboardEvent) => {
                if (event.key === "Delete" && toolbar) {
                    toolbar.deleteSelected();
                }
            },
            [toolbar]
        );

        return (
            <div 
                onKeyDown={handleKeyDown} 
                tabIndex={0}
                style={{ outline: 'none' }}
            >
                <TableContainerMui component={!isDarkMode ? PaperMui : "div"} sx={tableStyles} onPaste={handlePasteEvent}>
                    <TableMui
                        ref={ref}
                        sx={{
                            "& .MuiTableCell-head": {
                                lineHeight: 0.05,
                            },
                        }}
                    >
                        <TableHead>
                            <Row>
                                <SelectAllCell selectAll={state.selectAll} toggleSelectAll={handleToggleSelectAll} />
                                {state.data[0].map((_, colIndex) => (
                                    <ColumnHeaderCell
                                        key={colIndex}
                                        atom={atom}
                                        index={colIndex}
                                        onDragStart={handleColumnDragStart}
                                        onDragEnter={handleColumnDragEnter}
                                        onDragEnd={onDragEnd}
                                        onAddColumnLeft={onAddColumnLeft}
                                        onAddColumnRight={onAddColumnRight}
                                        onRemoveColumn={onRemoveColumn}
                                    />
                                ))}
                            </Row>
                        </TableHead>
                        <TableBody>
                            {state.data.map((row, rowIndex) => (
                                <Row key={rowIndex}>
                                    <RowNumberCell
                                        atom={atom}
                                        rowIndex={rowIndex}
                                        onDragStart={handleRowDragStart}
                                        onDragEnter={handleRowDragEnter}
                                        onDragEnd={onDragEnd}
                                        onAddAbove={onAddRowAbove}
                                        onAddBelow={onAddRowBelow}
                                        onRemove={onRemoveRow}
                                    />
                                    {row.map((cellData, colIndex) => (
                                        <Cell
                                            key={colIndex}
                                            rowIndex={rowIndex}
                                            colIndex={colIndex}
                                            cellData={cellData}
                                            selectedCell={state.selectedCell}
                                            selectedCells={state.selectedCells}
                                            selectedColumns={state.selectedColumns}
                                            selectedRows={state.selectedRows}
                                            isDarkMode={theme.palette.mode === "dark"}
                                            selectAll={state.selectAll}
                                            onMouseDown={handleCellMouseDown}
                                            onMouseEnter={() => onDragEnter(rowIndex, colIndex)}
                                            onMouseUp={onDragEnd}
                                            onCellChange={onCellChange}
                                        />
                                    ))}
                                </Row>
                            ))}
                        </TableBody>
                    </TableMui>
                    {children}
                </TableContainerMui>
            </div>
        );
    }
);

Table.displayName = "Table";

export default Table;
