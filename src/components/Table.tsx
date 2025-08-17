/**
 * @file src/components/Table.tsx
 * @fileoverview Table component for rendering the spreadsheet, handling cell interactions,
 * and managing selection state using Jotai and Material-UI.
 */

import React, { useCallback } from "react";
import { TableContainer as TableContainerMui, Table as TableMui, Paper as PaperMui, TableHead, TableBody, useTheme } from "@mui/material";
import { useAtom } from "jotai";
import { TableProps, SpreadsheetState, CellData, SpreadsheetDirection, SelectionType, DragType, CellCoordinate, NavigationKey } from "../types";
import { Cell, ColumnHeaderCell, Row, RowNumberCell, SelectAllCell } from "./";
import { useToolbar } from "../contexts";
import { useKeyboardNavigation } from "../hooks";
import { createNewSelectionState } from "../utils";
import { getTableContainerStyles, tableStyles } from "../styles";
import { ColumnContextMenu } from "./";

// Add type for the drag event handlers
type TableDragHandler = (
    event: React.DragEvent<HTMLElement> | number
) => void;

/** Renders the spreadsheet table. */
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
        },
        ref
    ) => {
        const [state, setState] = useAtom(atom);
        const [dragState, setDragState] = React.useState<{ type: DragType; isActive: boolean }>({
            type: DragType.NONE,
            isActive: false
        });
        const [lastCell, setLastCell] = React.useState<CellCoordinate | null>(null);

        // Add document-level mouse event handlers
        React.useEffect(() => {
            const handleMouseMove = (e: MouseEvent) => {
                if (!dragState.isActive || !lastCell) return;
                const cell = document.elementFromPoint(e.clientX, e.clientY)?.closest("[data-row]");
                if (!cell) return;

                const row = parseInt(cell.getAttribute("data-row") || "-1", 10);
                const col = parseInt(cell.getAttribute("data-col") || "-1", 10);

                if (row >= 0 && col >= 0 && (row !== lastCell.rowIndex || col !== lastCell.colIndex)) {
                    onDragEnter(row, col);
                    setLastCell({ rowIndex: row, colIndex: col });
                }
            };

            const handleMouseUp = () => dragState.isActive && (setDragState({ type: DragType.NONE, isActive: false }), onDragEnd());

            if (dragState.isActive) {
                document.addEventListener("mousemove", handleMouseMove);
                document.addEventListener("mouseup", handleMouseUp);
            }

            return () => {
                document.removeEventListener("mousemove", handleMouseMove);
                document.removeEventListener("mouseup", handleMouseUp);
            };
        }, [dragState.isActive, lastCell, onDragEnter, onDragEnd]);

        const handlePasteEvent = React.useCallback(
            (event: React.ClipboardEvent<HTMLDivElement>) => {
                event.preventDefault();
                const clipboardText = event.clipboardData?.getData("text") || "";

                if (state.selection.activeCell) {
                    onCellChange(state.selection.activeCell.rowIndex, state.selection.activeCell.colIndex, clipboardText);
                }
            },
            [state.selection.activeCell, onCellChange]
        );

        const theme = useTheme();
        const isDarkMode = theme?.palette?.mode === "dark" || false;

        const handleRowDragStart: TableDragHandler = useCallback((event) => {
            const rowIndex = typeof event === 'number' 
                ? event 
                : parseInt(event.currentTarget.getAttribute('data-row') || '-1', 10);
            onDragStart(rowIndex, -1);
        }, [onDragStart]);

        const handleRowDragEnter: TableDragHandler = useCallback((event) => {
            const rowIndex = typeof event === 'number' 
                ? event 
                : parseInt(event.currentTarget.getAttribute('data-row') || '-1', 10);
            onDragEnter(rowIndex, -1);
        }, [onDragEnter]);

        const handleColumnDragStart: TableDragHandler = useCallback((event) => {
            const index = typeof event === 'number' ? event : parseInt(event.currentTarget.getAttribute('data-col') || '-1', 10);
            onDragStart(-1, index);
        }, [onDragStart]);

        const handleColumnDragEnter: TableDragHandler = useCallback((event) => {
            const index = typeof event === 'number' ? event : parseInt(event.currentTarget.getAttribute('data-col') || '-1', 10);
            onDragEnter(-1, index);
        }, [onDragEnter]);

        const handleToggleSelectAll = React.useCallback(() => {
            setState((prevState: SpreadsheetState) => ({
                ...prevState,
                selection: {
                    ...prevState.selection,
                    type: prevState.selection.isAllSelected ? SelectionType.NONE : SelectionType.SELECT_ALL,
                    isAllSelected: !prevState.selection.isAllSelected,
                    activeCell: null,
                    cells: prevState.data.map((row) => Array(row.length).fill(false)),
                    rows: [],
                    columns: [],
                }
            }));
        }, [setState]);

        const handleCellMouseDown = React.useCallback(
            (coordinate: CellCoordinate, shiftKey: boolean, ctrlKey: boolean) => {
                setDragState({ type: DragType.CELL, isActive: true });
                setLastCell(coordinate);
                onDragStart(coordinate.rowIndex, coordinate.colIndex);

                setState((prev: SpreadsheetState) => {
                    let newSelectedCells: boolean[][];

                    if (shiftKey && prev.selection.activeCell) {
                        const startRow = Math.min(prev.selection.activeCell.rowIndex, coordinate.rowIndex);
                        const endRow = Math.max(prev.selection.activeCell.rowIndex, coordinate.rowIndex);
                        const startCol = Math.min(prev.selection.activeCell.colIndex, coordinate.colIndex);
                        const endCol = Math.max(prev.selection.activeCell.colIndex, coordinate.colIndex);

                        newSelectedCells = prev.data.map((row: CellData[], r: number) =>
                            row.map((_: CellData, c: number) => {
                                const isInRange = r >= startRow && r <= endRow && c >= startCol && c <= endCol;
                                return isInRange || (prev.selection.cells[r] && prev.selection.cells[r][c]);
                            })
                        );
                    } else if (ctrlKey) {
                        newSelectedCells = prev.selection.cells.map((row: boolean[], r: number) =>
                            row.map((cell: boolean, c: number) => {
                                if (r === coordinate.rowIndex && c === coordinate.colIndex) {
                                    return !cell;
                                }
                                return cell;
                            })
                        );
                    } else {
                        newSelectedCells = prev.data.map((row) => row.map(() => false));
                        newSelectedCells[coordinate.rowIndex][coordinate.colIndex] = true;
                    }

                    return {
                        ...prev,
                        selection: {
                            ...prev.selection,
                            activeCell: coordinate,
                            cells: newSelectedCells,
                            isAllSelected: false,
                            rows: [],
                            columns: []
                        }
                    };
                });
            },
            [setState, onDragStart, setDragState, setLastCell]
        );

        const toolbar = useToolbar();
        const handleKeyNavigation = useKeyboardNavigation();

        const handleCellKeyDown = React.useCallback(
            (e: React.KeyboardEvent) => {
                if (e.key === "Delete") {
                    toolbar?.deleteSelected?.();
                    return;
                }

                if (!state.selection.activeCell) return;

                const { rowIndex, colIndex } = state.selection.activeCell;
                const result = handleKeyNavigation(
                    e.key.toUpperCase() as NavigationKey,
                    rowIndex,
                    colIndex,
                    state.data.length - 1,
                    state.data[0].length - 1
                );

                if (result) {
                    setState((prev: SpreadsheetState) => ({
                        ...prev,
                        selection: {
                            ...prev.selection,
                            activeCell: result,
                            cells: createNewSelectionState(state.data, result),
                            isAllSelected: false,
                            rows: [],
                            columns: []
                        }
                    }));
                }
            },
            [state, setState, handleKeyNavigation, toolbar]
        );

        return (
            <div style={{ outline: "none" }}>
                <TableContainerMui component={!isDarkMode ? PaperMui : "div"} sx={getTableContainerStyles(isDarkMode)} onPaste={handlePasteEvent}>
                    <TableMui ref={ref} sx={tableStyles}>
                        <TableHead>
                            <Row
                                rowIndex={-1}
                                onDragStart={() => {}}
                                onDragEnter={() => {}}
                                onDragEnd={() => {}}
                                onAddAbove={() => {}}
                                onAddBelow={() => {}}
                                onRemove={() => {}}
                            >
                                <SelectAllCell 
                                    selectAll={state.selection.isAllSelected} 
                                    toggleSelectAll={handleToggleSelectAll} 
                                />
                                {state.data[0].map((_: CellData, colIndex: number) => (
                                    <ColumnHeaderCell
                                        key={colIndex}
                                        type={SpreadsheetDirection.COLUMN}
                                        index={colIndex}
                                        isHighlighted={false}
                                        isSelected={state.selection.columns.includes(colIndex)}
                                        onDragStart={(event) => handleColumnDragStart(event as React.DragEvent<HTMLElement>)}
                                        onDragEnter={(event) => handleColumnDragEnter(event as React.DragEvent<HTMLElement>)}
                                        onDragEnd={onDragEnd}
                                        ContextMenu={ColumnContextMenu}
                                        menuProps={{
                                            onAddLeft: () => onAddColumnLeft(colIndex),
                                            onAddRight: () => onAddColumnRight(colIndex),
                                            onRemove: () => onRemoveColumn(colIndex)
                                        }}
                                        renderContent={(index) => String.fromCharCode(65 + index)}
                                        atom={atom}
                                    />
                                ))}
                            </Row>
                        </TableHead>
                        <TableBody>
                            {state.data.map((row: CellData[], rowIndex: number) => (
                                <Row
                                    key={rowIndex}
                                    rowIndex={rowIndex}
                                    onDragStart={(event) => handleRowDragStart(event as React.DragEvent<HTMLElement>)}
                                    onDragEnter={(event) => handleRowDragEnter(event as React.DragEvent<HTMLElement>)}
                                    onDragEnd={onDragEnd}
                                    onAddAbove={onAddRowAbove}
                                    onAddBelow={onAddRowBelow}
                                    onRemove={onRemoveRow}
                                >
                                    <RowNumberCell
                                        atom={atom}
                                        spreadsheetAtom={atom}
                                        rowIndex={rowIndex}
                                        onDragStart={(event) => handleRowDragStart(event as React.DragEvent<HTMLElement>)}
                                        onDragEnter={(event) => handleRowDragEnter(event as React.DragEvent<HTMLElement>)}
                                        onDragEnd={onDragEnd}
                                        onAddAbove={onAddRowAbove}
                                        onAddBelow={onAddRowBelow}
                                        onRemove={onRemoveRow}
                                    />
                                    {row.map((cell: CellData, colIndex: number) => (
                                        <Cell
                                            key={`${rowIndex}-${colIndex}`}
                                            rowIndex={rowIndex}
                                            colIndex={colIndex}
                                            cellData={cell}
                                            activeCell={state.selection.activeCell}
                                            selectedCells={state.selection.cells}
                                            selectedRows={state.selection.rows}
                                            selectedColumns={state.selection.columns}
                                            selectAll={state.selection.isAllSelected}
                                            isDarkMode={isDarkMode}
                                            onMouseDown={(coordinate: CellCoordinate) => handleCellMouseDown(coordinate, false, false)}
                                            onMouseEnter={() => onDragEnter(rowIndex, colIndex)}
                                            onMouseUp={onDragEnd}
                                            onCellChange={(coordinate: CellCoordinate, value: string) => onCellChange(coordinate.rowIndex, coordinate.colIndex, value)}
                                            onCellKeyDown={handleCellKeyDown}
                                        />
                                    ))}
                                </Row>
                            ))}
                        </TableBody>
                    </TableMui>
                </TableContainerMui>
            </div>
        );
    }
);

export default Table;
