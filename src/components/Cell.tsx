/**
 * @fileoverview Editable cell component for the spreadsheet. Handles cell selection,
 * editing, styling, and user interactions like mouse events and keyboard input.
 */

import React, { useState, useRef, useCallback, useMemo } from "react";
import { TableCell as TableCellMui, useTheme, Link } from "@mui/material";
import type { CellStyleProps, CellProps, CellCoordinate } from "../types";
import { getCellStyles, getCellContentStyles, getLinkStyles } from "../styles";
import {
    CellState,
    SelectionType,
    ThemeMode,
    NavigationKey
} from "../types";

const Cell: React.FC<CellProps> = React.memo(
    ({
        rowIndex,
        colIndex,
        cellData,
        selectedCells,
        activeCell,
        selectedColumns = [],
        selectedRows = [],
        style,
        selectAll = false,
        onMouseDown,
        onMouseEnter,
        onMouseUp,
        onDoubleClick,
        onCellBlur,
        onCellKeyDown,
        onCellChange,
    }) => {
        const theme = useTheme();
        const isDarkMode = theme.palette.mode === ThemeMode.DARK.toLowerCase();
        const [cellState, setCellState] = useState<CellState>(CellState.DEFAULT);
        const cellRef = useRef<HTMLDivElement>(null);

        // Determine selection type
        const selectionType = useMemo(() => {
            if (activeCell?.rowIndex === rowIndex && activeCell?.colIndex === colIndex) {
                return SelectionType.SINGLE_CELL;
            }
            if (selectedColumns.includes(colIndex)) {
                return SelectionType.COLUMN;
            }
            if (selectedRows.includes(rowIndex)) {
                return SelectionType.ROW;
            }
            if (selectedCells[rowIndex]?.[colIndex]) {
                return SelectionType.MULTI_CELL;
            }
            if (selectAll) {
                return SelectionType.SELECT_ALL;
            }
            return SelectionType.NONE;
        }, [activeCell, selectedColumns, selectedRows, selectedCells, selectAll, rowIndex, colIndex]);

        const isSelected = selectionType !== SelectionType.NONE;
        const multipleCellsSelected = useMemo(() => {
            return Object.values(selectedCells).reduce((count, row) => count + Object.values(row).filter(Boolean).length, 0) > 1;
        }, [selectedCells]);

        const enableEditMode = useCallback(() => {
            setCellState(CellState.EDITING);
            requestAnimationFrame(() => {
                if (!cellRef.current) return;
                cellRef.current.focus();
                const range = document.createRange();
                range.selectNodeContents(cellRef.current);
                range.collapse(false);
                const sel = window.getSelection();
                sel?.removeAllRanges();
                sel?.addRange(range);
            });
        }, []);

        const handleBlur = useCallback(() => {
            if (cellRef.current) {
                const newValue = cellRef.current.textContent || "";
                onCellChange?.({ rowIndex, colIndex } as CellCoordinate, newValue);
            }
            setCellState(CellState.DEFAULT);
            onCellBlur?.();
        }, [onCellChange, rowIndex, colIndex, onCellBlur]);

        const handleKeyDown = useCallback(
            (e: React.KeyboardEvent) => {
                if (cellState === CellState.EDITING) {
                    if (e.key === NavigationKey.ENTER.toLowerCase() && !e.shiftKey) {
                        e.preventDefault();
                        handleBlur();
                    }
                } else if (selectionType === SelectionType.SINGLE_CELL) {
                    // Handle arrow key navigation when not editing and only this cell is selected
                    switch (e.key) {
                        case NavigationKey.UP.toLowerCase():
                        case NavigationKey.DOWN.toLowerCase():
                        case NavigationKey.LEFT.toLowerCase():
                        case NavigationKey.RIGHT.toLowerCase():
                            e.preventDefault();
                            onCellKeyDown?.(e);
                            break;
                        default:
                            onCellKeyDown?.(e);
                    }
                } else {
                    onCellKeyDown?.(e);
                }
            },
            [handleBlur, onCellKeyDown, cellState, selectionType]
        );

        const handleDoubleClick = useCallback(() => {
            if (onDoubleClick) {
                onDoubleClick({ rowIndex, colIndex } as CellCoordinate);
            }
            enableEditMode();
        }, [onDoubleClick, rowIndex, colIndex, enableEditMode]);

        const handleMouseDown = useCallback(
            (e: React.MouseEvent) => {
                if (onMouseDown) {
                    onMouseDown({ rowIndex, colIndex } as CellCoordinate, e.shiftKey, e.ctrlKey);
                }
            },
            [onMouseDown, rowIndex, colIndex]
        );

        const handleMouseEnter = useCallback(() => {
            if (onMouseEnter) {
                onMouseEnter({ rowIndex, colIndex } as CellCoordinate);
            }
        }, [onMouseEnter, rowIndex, colIndex]);

        const handleMouseUp = useCallback(() => {
            if (onMouseUp) {
                onMouseUp();
            }
        }, [onMouseUp]);

        const cellStyleProps: CellStyleProps = {
            isDarkMode,
            isEditing: cellState === CellState.EDITING,
            isSelected,
            selectedCells,
            rowIndex,
            colIndex,
            multipleCellsSelected,
            style,
            isColumnSelected: selectionType === SelectionType.COLUMN,
            isRowSelected: selectionType === SelectionType.ROW,
            isSelectAllSelected: selectionType === SelectionType.SELECT_ALL,
            hasLink: Boolean(cellData.link),
        };

        return (
            <TableCellMui
                onMouseDown={handleMouseDown}
                onMouseEnter={handleMouseEnter}
                onMouseUp={handleMouseUp}
                onDoubleClick={handleDoubleClick}
                onKeyDown={handleKeyDown}
                tabIndex={selectionType === SelectionType.SINGLE_CELL ? 0 : -1}
                sx={getCellStyles(cellStyleProps)}
                data-row={rowIndex}
                data-col={colIndex}
            >
                {cellState === CellState.EDITING ? (
                    <div
                        ref={cellRef}
                        contentEditable
                        suppressContentEditableWarning
                        spellCheck={false}
                        onBlur={handleBlur}
                        onKeyDown={handleKeyDown}
                        style={getCellContentStyles({ isEditing: true, cellData, style })}
                    >
                        {cellData.value}
                    </div>
                ) : (
                    <div style={getCellContentStyles({ isEditing: false, cellData, style })}>
                        {cellData.link ? (
                            <Link
                                href={cellData.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                underline="hover"
                                onClick={(e) => e.stopPropagation()}
                                sx={getLinkStyles()}
                            >
                                {cellData.value}
                            </Link>
                        ) : (
                            cellData.value
                        )}
                    </div>
                )}
            </TableCellMui>
        );
    }
);

Cell.displayName = "Cell";

export default Cell;
