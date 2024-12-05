import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { TableCell as TableCellMui, useTheme } from "@mui/material";
import { CellProps } from "../types";
import { useAppSelector } from '../store/hooks'

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
        selectedColumns,
        selectedRows,
    }) => {
        const { bold, italic, code } = useAppSelector(state => state.spreadsheet)
        const theme = useTheme();
        const isDarkMode = theme.palette.mode === 'dark';
        const [isEditing, setIsEditing] = useState(false);
        const [fontWeight, setFontWeight] = useState("normal");
        const [fontStyle, setFontStyle] = useState("normal");
        const [isFontCode, setIsFontCode] = useState(false);
        const cellRef = useRef<HTMLDivElement>(null);

        const isSingleCellSelected = selectedCell?.row === rowIndex && selectedCell?.col === colIndex;
        const isColumnSelected = selectedColumns?.includes(colIndex);
        const isRowSelected = selectedRows?.includes(rowIndex);
        const isMultiSelected = selectedCells[rowIndex]?.[colIndex];

        const multipleCellsSelected = useMemo(() => selectedCells.flat().filter(Boolean).length > 1, [selectedCells]);

        const enableEditMode = useCallback(() => {
            if (cellRef.current) {
                setIsEditing(true)
                requestAnimationFrame(() => {
                    if (cellRef.current) {
                        cellRef.current.focus()
                        const range = document.createRange()
                        const sel = window.getSelection()
                        range.selectNodeContents(cellRef.current)
                        range.collapse(false)
                        sel?.removeAllRanges()
                        sel?.addRange(range)
                    }
                })
            }
        }, [])

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
                const currentContent = cellRef.current.textContent
                if (currentContent !== cellData) {
                    cellRef.current.textContent = cellData || ""
                }
                setFontWeight(bold[rowIndex][colIndex] ? "bold" : "normal")
                setFontStyle(italic[rowIndex][colIndex] ? "italic" : "normal")
                setIsFontCode(code[rowIndex][colIndex])
            }
        }, [cellData, bold, italic, code, rowIndex, colIndex])

        const handleBlur = useCallback(() => {
            if (cellRef.current) {
                const newContent = cellRef.current.textContent || ""
                if (newContent !== cellData) {
                    handleCellChange(rowIndex, colIndex, newContent)
                }
            }
            setIsEditing(false)
        }, [rowIndex, colIndex, handleCellChange, cellData])

        useEffect(() => {
            if (!isSingleCellSelected && isEditing) {
                handleBlur()
            }
        }, [isSingleCellSelected, isEditing, handleBlur])

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
                  }

            const getBackgroundColor = () => {
                if (isMultiSelected && multipleCellsSelected) {
                    return "rgba(25, 118, 210, 0.12)"
                }
                if (isColumnSelected || isRowSelected) {
                    return "rgba(25, 118, 210, 0.08)"
                }
                return "transparent"
            }

            const outlineStyle = isSingleCellSelected ? {
                outline: "#1976d2 solid 1px",
                outlineOffset: "-1px"
            } : {
                outline: "none",
                outlineOffset: "0"
            }

            return {
                ...themeStyles,
                ...outlineStyle,
                height: "37.02px",
                cursor: isEditing ? "text" : "pointer",
                backgroundColor: getBackgroundColor(),
                p: 1,
                ...(isEditing && {
                    boxShadow: "rgba(0, 0, 0, 0.2) 0px 3px 1px -2px, rgba(0, 0, 0, 0.14) 0px 2px 2px 0px, rgba(0, 0, 0, 0.12) 0px 1px 5px 0px",
                    textIndent: "3px",
                    zIndex: 1,
                }),
            }
        }, [
            isDarkMode, 
            isEditing, 
            isMultiSelected,
            isColumnSelected,
            isRowSelected,
            isSingleCellSelected,
            multipleCellsSelected
        ])

        const handleClick = useCallback((e: React.MouseEvent) => {
            if (isSingleCellSelected) {
                e.preventDefault()
                e.stopPropagation()
                return
            }
            
            e.stopPropagation()
            handleCellSelection(rowIndex, colIndex)
        }, [isSingleCellSelected, handleCellSelection, rowIndex, colIndex])

        const handleMouseDownEvent = useCallback(
            (e: React.MouseEvent) => {
                if (isSingleCellSelected) {
                    e.preventDefault()
                    e.stopPropagation()
                    return
                }
                
                if (isEditing) {
                    return
                }
                e.preventDefault()
                onMouseDown(rowIndex, colIndex)
            },
            [isSingleCellSelected, rowIndex, colIndex, onMouseDown, isEditing]
        )

        return (
            <TableCellMui
                align={align}
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
