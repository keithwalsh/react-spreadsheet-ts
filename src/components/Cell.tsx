import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { TableCell as TableCellMui, useTheme } from "@mui/material";
import { CellProps } from "../types";

const Cell: React.FC<CellProps> = React.memo(
    ({
        rowIndex,
        colIndex,
        align,
        selectedCells,
        selectedCell,
        handleCellSelection,
        handleCellChange,
        style,
        cellData,
        onMouseDown,
        onMouseEnter,
        onMouseUp,
    }) => {
        const theme = useTheme();
        const isDarkMode = theme.palette.mode === 'dark';
        const [isEditing, setIsEditing] = useState(false);
        const [fontWeight, setFontWeight] = useState("normal");
        const [fontStyle, setFontStyle] = useState("normal");
        const [isFontCode, setIsFontCode] = useState(false);
        const cellRef = useRef<HTMLDivElement>(null);

        const isSelected = selectedCell && selectedCell.row === rowIndex && selectedCell.col === colIndex;
        const multipleCellsSelected = useMemo(() => selectedCells.flat().filter(Boolean).length > 1, [selectedCells]);

        const enableEditMode = useCallback(() => {
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
        }, []);

        const handleMouseEvent = useCallback(
            ({ 
                event, 
                shouldPreventDefault = false, 
                shouldStopPropagation = false,
                handler
            }: {
                event: React.MouseEvent
                shouldPreventDefault?: boolean
                shouldStopPropagation?: boolean
                handler: () => void
            }) => {
                if (shouldPreventDefault) event.preventDefault()
                if (shouldStopPropagation) event.stopPropagation()
                handler()
            },
            []
        )

        const createMouseEventHandler = useCallback(
            ({ shouldPreventDefault = false, shouldStopPropagation = false, handler }: {
                shouldPreventDefault?: boolean
                shouldStopPropagation?: boolean
                handler: () => void
            }) => (e: React.MouseEvent) => {
                handleMouseEvent({
                    event: e,
                    shouldPreventDefault,
                    shouldStopPropagation,
                    handler
                })
            },
            [handleMouseEvent]
        )

        const handleMouseUpEvent = useCallback(
            createMouseEventHandler({
                shouldPreventDefault: true,
                handler: onMouseUp
            }),
            [onMouseUp, createMouseEventHandler]
        )

        const handleDoubleClick = useCallback(
            createMouseEventHandler({
                shouldStopPropagation: true,
                handler: enableEditMode
            }),
            [enableEditMode, createMouseEventHandler]
        )

        useEffect(() => {
            if (cellRef.current) {
                cellRef.current.textContent = cellData || "";

                const regexBold = /^\*\*(.+)\*\*$/;
                const regexItalic = /^\*?\*?_(.+)_\*?\*?$/;
                const regexCode = /^\*?\*?\_?\`(.+)\`\_?\*?\*?$/;

                setFontWeight(regexBold.test(cellData || "") ? "bold" : "normal");
                setFontStyle(regexItalic.test(cellData || "") ? "italic" : "normal");
                setIsFontCode(regexCode.test(cellData || ""));
            }
        }, [cellData]);

        const handleMouseDownEvent = useCallback(
            (e: React.MouseEvent) => {
                if (isEditing) {
                    return;
                }
                e.preventDefault();
                onMouseDown(rowIndex, colIndex);
                handleCellSelection(rowIndex, colIndex);
            },
            [rowIndex, colIndex, onMouseDown, handleCellSelection, isEditing]
        );

        const handleMouseEnterEvent = useCallback(
            (e: React.MouseEvent) => {
                e.preventDefault();
                onMouseEnter(rowIndex, colIndex);
            },
            [rowIndex, colIndex, onMouseEnter]
        );

        const handleClick = useCallback(
            (e: React.MouseEvent) => {
                e.stopPropagation();
                if (!isEditing) {
                    handleCellSelection(rowIndex, colIndex);
                }
            },
            [rowIndex, colIndex, handleCellSelection, isEditing]
        );

        const handleBlur = useCallback(() => {
            setIsEditing(false);
            if (cellRef.current) {
                handleCellChange(rowIndex, colIndex, cellRef.current.textContent || "");
            }
        }, [rowIndex, colIndex, handleCellChange]);

        useEffect(() => {
            if (!isSelected && isEditing) {
                handleBlur();
            }
        }, [isSelected, isEditing, handleBlur]);

        const cellStyles = useMemo(() => {
            const themeStyles = isDarkMode
                ? {
                      borderRight: "1px solid #686868",
                      borderBottom: "1px solid #686868",
                      "&:last-child": {
                          borderRight: "1px solid #686868",
                      },
                  }
                : {
                      borderRight: "1px solid #e0e0e0",
                      borderBottom: "1px solid #e0e0e0",
                      "&:last-child": {
                          borderRight: "1px solid #e0e0e0",
                      },
                  };

            return {
                ...themeStyles,
                height: "37.02px",
                cursor: isEditing ? "text" : "pointer",
                backgroundColor: selectedCells[rowIndex]?.[colIndex] && multipleCellsSelected ? "rgba(25, 118, 210, 0.12)" : "transparent",
                p: 1,
                outline: isSelected ? "#1976d2 solid 1px" : "none",
                outlineOffset: isSelected ? "-1px" : "0",
                ...(isEditing && {
                    boxShadow: "rgba(0, 0, 0, 0.2) 0px 3px 1px -2px, rgba(0, 0, 0, 0.14) 0px 2px 2px 0px, rgba(0, 0, 0, 0.12) 0px 1px 5px 0px",
                    textIndent: "3px",
                    zIndex: 1,
                }),
            };
        }, [isDarkMode, isEditing, selectedCells, rowIndex, colIndex, multipleCellsSelected, isSelected]);

        return (
            <TableCellMui
                align={align}
                onMouseDown={handleMouseDownEvent}
                onMouseEnter={handleMouseEnterEvent}
                onMouseUp={handleMouseUpEvent}
                onClick={handleClick}
                onDoubleClick={handleDoubleClick}
                sx={cellStyles}
            >
                <div
                    ref={cellRef}
                    contentEditable={isEditing}
                    suppressContentEditableWarning
                    spellCheck={false}
                    onBlur={handleBlur}
                    style={{
                        minWidth: "80px",
                        outline: "none",
                        cursor: "inherit",
                        userSelect: isEditing ? "text" : "none",
                        fontWeight: fontWeight,
                        fontStyle: fontStyle,
                        fontFamily: isFontCode ? "'Courier New', Consolas, monospace" : "inherit",
                        ...style,
                    }}
                />
            </TableCellMui>
        );
    }
);

Cell.displayName = "Cell";

export default Cell;
