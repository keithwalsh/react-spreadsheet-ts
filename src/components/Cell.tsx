/**
 * @fileoverview Editable cell component for the spreadsheet. Handles cell selection,
 * editing, styling, and user interactions like mouse events and keyboard input.
 */

import React, { useState, useRef, useCallback, useMemo } from "react";
import { TableCell as TableCellMui, useTheme, Link } from "@mui/material";
import type { CellStyleProps, CellProps } from "../types";
import { getCellStyles, getCellContentStyles, getLinkStyles } from "../styles";

const Cell: React.FC<CellProps> = React.memo(
    ({
        rowIndex,
        colIndex,
        cellData,
        selectedCells,
        selectedCell,
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
        const isDarkMode = theme.palette.mode === "dark";
        const [isEditing, setIsEditing] = useState(false);
        const cellRef = useRef<HTMLDivElement>(null);

        const isSingleCellSelected = selectedCell?.row === rowIndex && selectedCell?.col === colIndex;
        const isColumnSelected = selectedColumns.includes(colIndex);
        const isRowSelected = selectedRows.includes(rowIndex);
        const isMultiSelected = !!selectedCells[rowIndex]?.[colIndex];
        const isSelected = isSingleCellSelected || isColumnSelected || isRowSelected || isMultiSelected;
        const multipleCellsSelected = useMemo(() => {
            return Object.values(selectedCells).reduce((count, row) => count + Object.values(row).filter(Boolean).length, 0) > 1;
        }, [selectedCells]);

        const enableEditMode = useCallback(() => {
            setIsEditing(true);
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
                onCellChange?.(rowIndex, colIndex, newValue);
            }
            setIsEditing(false);
            onCellBlur?.();
        }, [onCellChange, rowIndex, colIndex, onCellBlur]);

        const handleKeyDown = useCallback(
            (e: React.KeyboardEvent) => {
                if (isEditing) {
                    if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleBlur();
                    }
                } else if (isSingleCellSelected && !isMultiSelected && !isColumnSelected && !isRowSelected) {
                    // Handle arrow key navigation when not editing and only this cell is selected
                    switch (e.key) {
                        case "ArrowUp":
                        case "ArrowDown":
                        case "ArrowLeft":
                        case "ArrowRight":
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
            [handleBlur, onCellKeyDown, isEditing, isSingleCellSelected, isMultiSelected, isColumnSelected, isRowSelected]
        );

        const handleDoubleClick = useCallback(() => {
            onDoubleClick?.(rowIndex, colIndex);
            enableEditMode();
        }, [onDoubleClick, rowIndex, colIndex, enableEditMode]);

        const handleMouseDown = useCallback(
            ({ shiftKey, ctrlKey }: React.MouseEvent) => onMouseDown?.(rowIndex, colIndex, shiftKey, ctrlKey),
            [onMouseDown, rowIndex, colIndex]
        );

        const handleMouseEnter = useCallback(() => onMouseEnter?.(rowIndex, colIndex), [onMouseEnter, rowIndex, colIndex]);

        const cellStyleProps: CellStyleProps = {
            isDarkMode,
            isEditing,
            isSelected,
            selectedCells,
            rowIndex,
            colIndex,
            multipleCellsSelected,
            style,
            isColumnSelected,
            isRowSelected,
            isSelectAllSelected: selectAll,
            hasLink: Boolean(cellData.link),
        };

        return (
            <TableCellMui
                onMouseDown={handleMouseDown}
                onMouseEnter={handleMouseEnter}
                onMouseUp={onMouseUp}
                onDoubleClick={handleDoubleClick}
                onKeyDown={handleKeyDown}
                tabIndex={isSingleCellSelected ? 0 : -1}
                sx={getCellStyles(cellStyleProps)}
                data-row={rowIndex}
                data-col={colIndex}
            >
                {isEditing ? (
                    <div
                        ref={cellRef}
                        contentEditable
                        suppressContentEditableWarning
                        spellCheck={false}
                        onBlur={handleBlur}
                        onKeyDown={handleKeyDown}
                        style={getCellContentStyles({ isEditing, cellData, style })}
                    >
                        {cellData.value}
                    </div>
                ) : (
                    <div style={getCellContentStyles({ isEditing, cellData, style })}>
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
