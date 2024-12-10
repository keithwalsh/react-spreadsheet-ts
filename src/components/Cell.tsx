import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
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
        const [fontWeight, setFontWeight] = useState("normal");
        const [fontStyle, setFontStyle] = useState("normal");
        const [isFontCode, setIsFontCode] = useState(false);
        const cellRef = useRef<HTMLDivElement>(null);

        const isSingleCellSelected = selectedCell?.row === rowIndex && selectedCell?.col === colIndex;
        const isColumnSelected = selectedColumns?.includes(colIndex);
        const isRowSelected = selectedRows?.includes(rowIndex);
        const isMultiSelected = selectedCells[rowIndex]?.[colIndex];
        const isSelected = isSingleCellSelected || isColumnSelected || isRowSelected || isMultiSelected;

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

        const handleDocumentClick = useCallback(
            (e: MouseEvent) => {
                const target = e.target as Node;
                if (cellRef.current && !cellRef.current.contains(target)) {
                    const newValue = cellRef.current.textContent || "";
                    onCellChange?.(rowIndex, colIndex, newValue);
                    setIsEditing(false);
                    onCellBlur?.();
                }
            },
            [onCellBlur, onCellChange, rowIndex, colIndex]
        );

        useEffect(() => {
            if (isEditing) {
                document.addEventListener("mousedown", handleDocumentClick);
            }
            return () => {
                document.removeEventListener("mousedown", handleDocumentClick);
            };
        }, [isEditing, handleDocumentClick]);

        const handleMouseEvent = useCallback(
            (event: React.MouseEvent) => {
                if (event.type === "mousedown") {
                    onMouseDown?.(rowIndex, colIndex, event.shiftKey, event.ctrlKey);
                } else if (event.type === "mouseenter") {
                    onMouseEnter?.(rowIndex, colIndex);
                } else if (event.type === "mouseup") {
                    onMouseUp?.();
                }
            },
            [rowIndex, colIndex, onMouseDown, onMouseEnter, onMouseUp]
        );

        const handleDoubleClick = useCallback(() => {
            onDoubleClick?.(rowIndex, colIndex);
            enableEditMode();
        }, [rowIndex, colIndex, onDoubleClick, enableEditMode]);

        const handleKeyDown = useCallback(
            (event: React.KeyboardEvent) => {
                onCellKeyDown?.(event);
                if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    const newValue = cellRef.current?.textContent || "";
                    onCellChange?.(rowIndex, colIndex, newValue);
                    setIsEditing(false);
                }
            },
            [onCellKeyDown, onCellChange, rowIndex, colIndex]
        );

        const handleBlur = useCallback(() => {
            const newValue = cellRef.current?.textContent || "";
            onCellChange?.(rowIndex, colIndex, newValue);
            setIsEditing(false);
            onCellBlur?.();
        }, [onCellBlur, onCellChange, rowIndex, colIndex]);

        const cellStyles = useMemo(() => {
            const styleProps: CellStyleProps = {
                isDarkMode,
                theme,
                isEditing,
                isSelected,
                isMultiSelected,
                style,
            };
            return getCellStyles(styleProps);
        }, [isDarkMode, theme, isEditing, isSelected, isMultiSelected, style]);

        // Update text formatting based on cell content
        useEffect(() => {
            if (cellRef.current) {
                const content = cellData.value || "";
                const regexBold = /^\*\*(.+)\*\*$/;
                const regexItalic = /^\*?\*?_(.+)_\*?\*?$/;
                const regexCode = /^\*?\*?\_?\`(.+)\`\_?\*?\*?$/;

                setFontWeight(regexBold.test(content) ? "bold" : "normal");
                setFontStyle(regexItalic.test(content) ? "italic" : "normal");
                setIsFontCode(regexCode.test(content));
            }
        }, [cellData]);

        return (
            <TableCellMui
                ref={cellRef}
                contentEditable={isEditing}
                onMouseDown={handleMouseEvent}
                onMouseEnter={handleMouseEvent}
                onMouseUp={handleMouseEvent}
                onDoubleClick={handleDoubleClick}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                sx={cellStyles}
                suppressContentEditableWarning
            >
                <div
                    style={{
                        minWidth: "80px",
                        outline: "none",
                        cursor: "inherit",
                        userSelect: isEditing ? "text" : "none",
                        fontWeight,
                        fontStyle,
                        fontFamily: isFontCode ? "'Courier New', Consolas, monospace" : "inherit",
                        ...style,
                    }}
                >
                    {cellData.value}
                </div>
            </TableCellMui>
        );
    }
);

Cell.displayName = "Cell";

export default Cell;
