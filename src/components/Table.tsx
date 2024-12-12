import React, { useCallback } from "react";
import { TableContainer as TableContainerMui, Table as TableMui, Paper as PaperMui, TableHead, TableBody, useTheme } from "@mui/material";
import { useAtom } from "jotai";
import { TableProps } from "../types";
import { Cell, ColumnHeaderCell, Row, RowNumberCell, SelectAllCell, useToolbar } from "./";

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
        const [isDragging, setIsDragging] = React.useState(false);
        const [lastCell, setLastCell] = React.useState<{ row: number; col: number } | null>(null);

        // Add document-level mouse event handlers
        React.useEffect(() => {
            const handleMouseMove = (e: MouseEvent) => {
                if (!isDragging || !lastCell) return;

                // Find the cell element under the cursor
                const element = document.elementFromPoint(e.clientX, e.clientY);
                if (!element) return;

                // Find the closest cell element
                const cellElement = element.closest("[data-row]");
                if (cellElement) {
                    const row = parseInt(cellElement.getAttribute("data-row") || "-1");
                    const col = parseInt(cellElement.getAttribute("data-col") || "-1");
                    if (row >= 0 && col >= 0 && (row !== lastCell.row || col !== lastCell.col)) {
                        onDragEnter(row, col);
                        setLastCell({ row, col });
                    }
                }
            };

            const handleMouseUp = () => isDragging && (setIsDragging(false), onDragEnd());

            if (isDragging) {
                document.addEventListener("mousemove", handleMouseMove);
                document.addEventListener("mouseup", handleMouseUp);
            }

            return () => {
                document.removeEventListener("mousemove", handleMouseMove);
                document.removeEventListener("mouseup", handleMouseUp);
            };
        }, [isDragging, lastCell, onDragEnter, onDragEnd]);

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

        const theme = useTheme();
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
                selectedCell: null,
                selectedCells: prevState.data.map((row) => Array(row.length).fill(false)),
                selectedRows: [],
                selectedColumns: [],
            }));
        }, [setState]);

        const handleCellMouseDown = React.useCallback(
            (rowIndex: number, colIndex: number, shiftKey: boolean, ctrlKey: boolean) => {
                setIsDragging(true);
                setLastCell({ row: rowIndex, col: colIndex });
                onDragStart(rowIndex, colIndex);
                if (shiftKey && state.selectedCell) {
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
            [state, setState, onDragStart]
        );

        const toolbar = useToolbar();

        const handleKeyDown = useCallback(({ key }: React.KeyboardEvent) => key === "Delete" && toolbar?.deleteSelected?.(), [toolbar]);

        return (
            <div onKeyDown={handleKeyDown} tabIndex={0} style={{ outline: "none" }}>
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

export default Table;
