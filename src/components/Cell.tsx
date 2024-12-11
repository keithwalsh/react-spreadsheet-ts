import React, { useState, useRef, useCallback, useMemo, useEffect } from "react";
import { TableCell as TableCellMui, useTheme, createTheme } from "@mui/material";
import type { CellProps } from "../types";
import { getCellStyles, CellStyleProps } from "../styles/cellStyles";

const defaultTheme = createTheme();

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
        const theme = useTheme() || defaultTheme;
        const isDarkMode = theme?.palette?.mode === "dark" || false;
        const [isEditing, setIsEditing] = useState(false);
        const cellRef = useRef<HTMLDivElement>(null);

        const isSingleCellSelected = selectedCell?.row === rowIndex && selectedCell?.col === colIndex;
        const isColumnSelected = selectedColumns?.includes(colIndex);
        const isRowSelected = selectedRows?.includes(rowIndex);
        const isMultiSelected = selectedCells[rowIndex]?.[colIndex];
        const isSelected = isSingleCellSelected || isColumnSelected || isRowSelected || isMultiSelected;
        const multipleCellsSelected = useMemo(() => {
            // Count total selected cells
            const selectedCount = Object.values(selectedCells).reduce(
                (total: number, row: Record<number, boolean>) =>
                    total + Object.values(row).reduce((rowTotal: number, cell: boolean) => rowTotal + (cell ? 1 : 0), 0),
                0
            );
            return selectedCount > 1;
        }, [selectedCells]);

        useEffect(() => {
            if (cellRef.current) {
                cellRef.current.textContent = cellData.value || "";
            }
        }, [cellData.value]);

        const enableEditMode = useCallback(() => {
            if (cellRef.current) {
                setIsEditing(true);
                requestAnimationFrame(() => {
                    if (cellRef.current) {
                        cellRef.current.focus();
                        const range = document.createRange();
                        const sel = window.getSelection();
                        range.selectNodeContents(cellRef.current);
                        range.collapse(false);
                        sel?.removeAllRanges();
                        sel?.addRange(range);
                    }
                });
            }
        }, []);

        const handleBlur = useCallback(() => {
            setIsEditing(false);
            if (onCellBlur) {
                onCellBlur();
            }
        }, [onCellBlur]);

        const handleKeyDown = useCallback(
            (event: React.KeyboardEvent) => {
                if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    if (onCellKeyDown) {
                        onCellKeyDown(event);
                    }
                    handleBlur();
                }
            },
            [onCellKeyDown, handleBlur]
        );

        const handleDoubleClick = useCallback(() => {
            if (onDoubleClick) {
                onDoubleClick(rowIndex, colIndex);
            }
            enableEditMode();
        }, [onDoubleClick, rowIndex, colIndex, enableEditMode]);

        const handleMouseDown = useCallback(
            (event: React.MouseEvent) => {
                if (onMouseDown) {
                    onMouseDown(rowIndex, colIndex, event.shiftKey, event.metaKey || event.ctrlKey);
                }
            },
            [onMouseDown, rowIndex, colIndex]
        );

        const handleMouseEnter = useCallback(() => {
            if (onMouseEnter) {
                onMouseEnter(rowIndex, colIndex);
            }
        }, [onMouseEnter, rowIndex, colIndex]);

        const handleContentChange = useCallback(() => {
            if (cellRef.current && onCellChange) {
                onCellChange(rowIndex, colIndex, cellRef.current.textContent || "");
            }
        }, [onCellChange, rowIndex, colIndex]);

        const cellStyleProps: CellStyleProps = useMemo(
            () => ({
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
            }),
            [isDarkMode, isEditing, isSelected, selectedCells, rowIndex, colIndex, multipleCellsSelected, style, isColumnSelected, isRowSelected, selectAll]
        );

        return (
            <TableCellMui
                onMouseDown={handleMouseDown}
                onMouseEnter={handleMouseEnter}
                onMouseUp={onMouseUp}
                onDoubleClick={handleDoubleClick}
                sx={getCellStyles(cellStyleProps)}
            >
                <div
                    ref={cellRef}
                    contentEditable={isEditing}
                    suppressContentEditableWarning
                    spellCheck={false}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    onInput={handleContentChange}
                    style={{
                        minWidth: "80px",
                        outline: "none",
                        cursor: "inherit",
                        userSelect: isEditing ? "text" : "none",
                        fontWeight: cellData.bold ? "bold" : "normal",
                        fontStyle: cellData.italic ? "italic" : "normal",
                        fontFamily: cellData.code ? "'Courier New', Consolas, monospace" : "inherit",
                        textAlign: cellData.align || "left",
                        ...style,
                    }}
                />
            </TableCellMui>
        );
    }
);

Cell.displayName = "Cell";

export default Cell;
