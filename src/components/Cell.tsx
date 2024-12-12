/**
 * @fileoverview Editable cell component for the spreadsheet. Handles cell selection,
 * editing, styling, and user interactions like mouse events and keyboard input.
 */

import React, { useState, useRef, useCallback, useMemo, useEffect } from "react";
import { TableCell as TableCellMui, useTheme } from "@mui/material";
import type { CellProps } from "../types";
import { getCellStyles, CellStyleProps } from "../styles/cellStyles";

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

        useEffect(() => {
            if (cellRef.current) cellRef.current.textContent = cellData.value ?? "";
        }, [cellData.value]);

        const enableEditMode = useCallback(() => {
            if (!cellRef.current) return;
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

        const handleBlur = () => (setIsEditing(false), onCellBlur?.());

        const handleKeyDown = useCallback(
            (e: React.KeyboardEvent) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), onCellKeyDown?.(e), handleBlur()),
            [onCellKeyDown, handleBlur]
        );

        const handleDoubleClick = useCallback(
            () => (onDoubleClick?.(rowIndex, colIndex), enableEditMode()),
            [onDoubleClick, rowIndex, colIndex, enableEditMode]
        );

        const handleMouseDown = useCallback(
            ({ shiftKey, ctrlKey }: React.MouseEvent) => onMouseDown?.(rowIndex, colIndex, shiftKey, ctrlKey),
            [onMouseDown, rowIndex, colIndex]
        );

        const handleMouseEnter = useCallback(() => onMouseEnter?.(rowIndex, colIndex), [onMouseEnter, rowIndex, colIndex]);

        const handleContentChange = () => cellRef.current && onCellChange?.(rowIndex, colIndex, cellRef.current.textContent || "");

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
                data-row={rowIndex}
                data-col={colIndex}
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

export default Cell;
