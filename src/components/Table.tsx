/**
 * @file src/components/Table.tsx
 * @fileoverview Table component for rendering the spreadsheet, handling cell interactions,
 * and managing selection state using Jotai and Material-UI.
 */

import React, { useCallback } from "react";
import { TableContainer as TableContainerMui, Table as TableMui, Paper as PaperMui, TableHead, TableBody, useTheme } from "@mui/material";
import { useAtom } from "jotai";
import { TableProps, SpreadsheetState, CellData, SpreadsheetDirection, SelectionType, DragType, CellCoordinate } from "../types";
import { Cell, ColumnHeaderCell, Row, RowNumberCell, SelectAllCell, useToolbar } from "./";
import { useKeyboardNavigation } from "../hooks";
import { createNewSelectionState } from "../utils";
import { getTableContainerStyles, tableStyles } from "../styles";
import { ColumnContextMenu } from "./";

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
            (rowIndex: number, colIndex: number, shiftKey: boolean, ctrlKey: boolean) => {
                setDragState({ type: DragType.CELL, isActive: true });
                setLastCell({ rowIndex, colIndex });
                onDragStart(rowIndex, colIndex);

                setState((prev: SpreadsheetState) => {
                    let selectionType: SelectionType;
                    let newSelectedCells: boolean[][];

                    if (shiftKey && prev.selection.activeCell) {
                        selectionType = SelectionType.MULTI_CELL;
                        const startRow = Math.min(prev.selection.activeCell.rowIndex, rowIndex);
                        const endRow = Math.max(prev.selection.activeCell.rowIndex, rowIndex);
                        const startCol = Math.min(prev.selection.activeCell.colIndex, colIndex);
                        const endCol = Math.max(prev.selection.activeCell.colIndex, colIndex);

                        newSelectedCells = prev.data.map((row: CellData[], r: number) =>
                            row.map((_: CellData, c: number) => {
                                const isInRange = r >= startRow && r <= endRow && c >= startCol && c <= endCol;
                                return isInRange || (prev.selection.cells[r] && prev.selection.cells[r][c]);
                            })
                        );
                    } else if (ctrlKey) {
                        selectionType = SelectionType.MULTI_CELL;
                        newSelectedCells = prev.selection.cells.map((row: boolean[], r: number) =>
                            row.map((cell: boolean, c: number) => {
                                if (r === rowIndex && c === colIndex) {
                                    return !cell;
                                }
                                return cell;
                            })
                        );
                    } else {
                        selectionType = SelectionType.SINGLE_CELL;
                        newSelectedCells = prev.data.map((row) => row.map(() => false));
                        newSelectedCells[rowIndex][colIndex] = true;
                    }

                    return {
                        ...prev,
                        selection: {
                            ...prev.selection,
                            type: selectionType,
                            cells: newSelectedCells,
                            activeCell: { rowIndex, colIndex },
                            isAllSelected: false,
                            rows: [],
                            columns: []
                        }
                    };
                });
            },
            [state, setState, onDragStart]
        );

        const toolbar = useToolbar();
        const handleKeyNavigation = useKeyboardNavigation();

        const handleCellKeyDown = useCallback(
            (e: React.KeyboardEvent) => {
                if (e.key === "Delete") {
                    toolbar?.deleteSelected?.();
                    return;
                }

                if (!state.selection.activeCell) return;

                const { rowIndex, colIndex } = state.selection.activeCell;
                const result = handleKeyNavigation(e, rowIndex, colIndex, state.data.length - 1, state.data[0].length - 1);

                if (result) {
                    const newSelectedCells = createNewSelectionState(state.data, result);

                    setState((prev: SpreadsheetState) => ({
                        ...prev,
                        selection: {
                            ...prev.selection,
                            activeCell: { rowIndex: result.rowIndex, colIndex: result.colIndex },
                            cells: newSelectedCells,
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
                            <Row>
                                <SelectAllCell 
                                    selectAll={state.selection.isAllSelected} 
                                    toggleSelectAll={handleToggleSelectAll} 
                                />
                                {state.data[0].map((_: CellData, colIndex: number) => (
                                    <ColumnHeaderCell
                                        key={colIndex}
                                        atom={atom}
                                        type={SpreadsheetDirection.COLUMN}
                                        index={colIndex}
                                        isHighlighted={false}
                                        isSelected={state.selection.columns.includes(colIndex)}
                                        onDragStart={handleColumnDragStart}
                                        onDragEnter={handleColumnDragEnter}
                                        onDragEnd={onDragEnd}
                                        ContextMenu={ColumnContextMenu}
                                        menuProps={{
                                            onAddLeft: () => onAddColumnLeft(colIndex),
                                            onAddRight: () => onAddColumnRight(colIndex),
                                            onRemove: () => onRemoveColumn(colIndex)
                                        }}
                                        renderContent={(index) => `${String.fromCharCode(65 + index)}`}
                                    />
                                ))}
                            </Row>
                        </TableHead>
                        <TableBody>
                            {state.data.map((row: CellData[], rowIndex: number) => (
                                <Row key={rowIndex}>
                                    <RowNumberCell
                                        atom={atom}
                                        spreadsheetAtom={atom}
                                        rowIndex={rowIndex}
                                        onDragStart={handleRowDragStart}
                                        onDragEnter={handleRowDragEnter}
                                        onDragEnd={onDragEnd}
                                        onAddAbove={onAddRowAbove}
                                        onAddBelow={onAddRowBelow}
                                        onRemove={onRemoveRow}
                                    />
                                    {row.map((cellData: CellData, colIndex: number) => (
                                        <Cell
                                            key={colIndex}
                                            rowIndex={rowIndex}
                                            colIndex={colIndex}
                                            cellData={cellData}
                                            activeCell={state.selection.activeCell}
                                            selectedCells={state.selection.cells}
                                            selectedColumns={state.selection.columns}
                                            selectedRows={state.selection.rows}
                                            isDarkMode={theme.palette.mode === "dark"}
                                            selectAll={state.selection.isAllSelected}
                                            onMouseDown={handleCellMouseDown}
                                            onMouseEnter={() => onDragEnter(rowIndex, colIndex)}
                                            onMouseUp={onDragEnd}
                                            onCellChange={onCellChange}
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
