import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { TableCell as TableCellMui, useTheme } from "@mui/material";
import { CellProps } from "../types";
import { getCellStyles, getSelectionBackground } from "../styles";

const Cell: React.FC<CellProps> = React.memo(
    ({
        rowIndex,
        colIndex,
        selectedCells,
        selectedCell,
        handleCellSelection,
        handleCellChange,
        style,
        cellData,
        onMouseDown,
        onMouseEnter,
        onMouseUp,
        selectedColumns,
        selectedRows,
    }) => {
        const theme = useTheme();
        const isDarkMode = theme.palette.mode === "dark";
        const [isEditing, setIsEditing] = useState(false);
        const cellRef = useRef<HTMLDivElement>(null);

        const isSingleCellSelected = selectedCell?.row === rowIndex && selectedCell?.col === colIndex;
        const isColumnSelected = selectedColumns?.includes(colIndex);
        const isRowSelected = selectedRows?.includes(rowIndex);
        const isMultiSelected = selectedCells[rowIndex]?.[colIndex];

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

        const handleMouseEvent = useCallback(
            ({
                event,
                shouldPreventDefault = false,
                shouldStopPropagation = false,
                handler,
            }: {
                event: React.MouseEvent;
                shouldPreventDefault?: boolean;
                shouldStopPropagation?: boolean;
                handler: () => void;
            }) => {
                if (shouldPreventDefault) event.preventDefault();
                if (shouldStopPropagation) event.stopPropagation();
                handler();
            },
            []
        );

        const createMouseEventHandler = useCallback(
            ({
                    shouldPreventDefault = false,
                    shouldStopPropagation = false,
                    handler,
                }: {
                    shouldPreventDefault?: boolean;
                    shouldStopPropagation?: boolean;
                    handler: () => void;
                }) =>
                (e: React.MouseEvent) => {
                    handleMouseEvent({
                        event: e,
                        shouldPreventDefault,
                        shouldStopPropagation,
                        handler,
                    });
                },
            [handleMouseEvent]
        );

        const handleMouseUpEvent = useCallback(
            createMouseEventHandler({
                shouldPreventDefault: true,
                handler: onMouseUp,
            }),
            [onMouseUp, createMouseEventHandler]
        );

        const handleDoubleClick = useCallback(
            createMouseEventHandler({
                shouldStopPropagation: true,
                handler: enableEditMode,
            }),
            [enableEditMode, createMouseEventHandler]
        );

        useEffect(() => {
            const handleDocumentClick = (e: MouseEvent) => {
                if (isEditing && cellRef.current && !cellRef.current.contains(e.target as Node)) {
                    const newValue = cellRef.current.textContent || "";
                    handleCellChange(rowIndex, colIndex, newValue);
                    setIsEditing(false);
                }
            };

            if (isEditing) {
                document.addEventListener("mousedown", handleDocumentClick);
            }

            return () => {
                document.removeEventListener("mousedown", handleDocumentClick);
            };
        }, [isEditing, handleCellChange, rowIndex, colIndex]);

        useEffect(() => {
            if (!isEditing && cellRef.current) {
                cellRef.current.textContent = cellData?.content || "";
            }
        }, [isEditing, cellData]);

        const backgroundColor = getSelectionBackground(isDarkMode, isColumnSelected, isRowSelected, isMultiSelected, isSingleCellSelected);

        const cellStyles = useMemo(
            () => ({
                ...getCellStyles({
                    isDarkMode,
                    theme,
                    isEditing,
                    isSelected: isSingleCellSelected,
                    style,
                }),
                backgroundColor,
            }),
            [isDarkMode, theme, isEditing, isSingleCellSelected, style, backgroundColor]
        );

        const handleBlur = useCallback(() => {
            if (isEditing) {
                const content = cellRef.current?.textContent || "";
                handleCellChange(rowIndex, colIndex, content);
                setIsEditing(false);
                // Refocus the container after a short delay to allow other events to process
                setTimeout(() => {
                    const container = document.querySelector('[data-spreadsheet-container="true"]') as HTMLDivElement;
                    container?.focus();
                }, 0);
            }
        }, [isEditing, handleCellChange, rowIndex, colIndex]);

        const handleClick = useCallback(
            (e: React.MouseEvent) => {
                e.stopPropagation();
                if (!isSingleCellSelected) {
                    handleCellSelection(rowIndex, colIndex);
                }
            },
            [isSingleCellSelected, handleCellSelection, rowIndex, colIndex]
        );

        const handleMouseDownEvent = useCallback(
            createMouseEventHandler({
                shouldPreventDefault: true,
                handler: () => {
                    onMouseDown(rowIndex, colIndex);
                },
            }),
            [onMouseDown, rowIndex, colIndex, createMouseEventHandler]
        );

        const handlePaste = useCallback(
            (e: React.ClipboardEvent<HTMLDivElement>) => {
                if (isEditing) {
                    // Allow default paste behavior when editing
                    return;
                }
                // Prevent default paste when not editing
                e.preventDefault();
                e.stopPropagation();
            },
            [isEditing]
        );

        return (
            <TableCellMui
                align={cellData?.alignment || "left"}
                onMouseUp={handleMouseUpEvent}
                onClick={handleClick}
                onMouseDown={handleMouseDownEvent}
                onMouseEnter={() => onMouseEnter(rowIndex, colIndex)}
                onDoubleClick={handleDoubleClick}
                sx={cellStyles}
            >
                <div
                    ref={cellRef}
                    contentEditable={isEditing}
                    suppressContentEditableWarning
                    spellCheck={false}
                    onBlur={handleBlur}
                    onPaste={handlePaste}
                    onMouseDown={(e) => {
                        if (isEditing) {
                            e.stopPropagation();
                            return;
                        }
                        handleMouseDownEvent(e);
                    }}
                    style={{
                        minWidth: "80px",
                        outline: "none",
                        cursor: isEditing ? "text" : (cellData?.link ? "pointer" : "inherit"),
                        userSelect: isEditing ? "text" : "none",
                        WebkitUserSelect: isEditing ? "text" : "none",
                        MozUserSelect: isEditing ? "text" : "none",
                        msUserSelect: isEditing ? "text" : "none",
                        fontWeight: cellData?.bold ? "bold" : "normal",
                        fontStyle: cellData?.italic ? "italic" : "normal",
                        fontFamily: cellData?.code ? "monospace" : "inherit",
                        textDecoration: cellData?.link ? "underline" : "none",
                        color: cellData?.link ? theme.palette.primary.main : "inherit",
                        ...style,
                    }}
                    onClick={(e) => {
                        if (!isEditing && cellData?.link) {
                            e.stopPropagation();
                            window.open(cellData.link, '_blank', 'noopener,noreferrer');
                        }
                    }}
                />
            </TableCellMui>
        );
    }
);

Cell.displayName = "Cell";

export default Cell;
