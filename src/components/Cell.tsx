import React, { useState, useEffect, useRef, useCallback } from "react";
import { TableCell } from "@mui/material";
import { CellProps } from "@types";

const Cell: React.FC<CellProps> = ({
    theme = "light",
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
    const [isEditing, setIsEditing] = useState(false);
    const [fontWeight, setFontWeight] = useState("normal");
    const [fontStyle, setFontStyle] = useState("normal");
    const [isFontCode, setIsFontCode] = useState(false);
    const cellRef = useRef<HTMLDivElement>(null);
    const isSelected = selectedCell !== null && selectedCell.row === rowIndex && selectedCell.col === colIndex;
    const multipleCellsSelected = selectedCells.flat().filter(Boolean).length > 1;

    const handleMouseDownEvent = (e: React.MouseEvent) => {
        e.preventDefault();
        onMouseDown(rowIndex, colIndex);
        handleCellSelection(rowIndex, colIndex);
    };

    const handleMouseEnterEvent = (e: React.MouseEvent) => {
        e.preventDefault();
        onMouseEnter(rowIndex, colIndex);
    };

    const handleMouseUpEvent = (e: React.MouseEvent) => {
        e.preventDefault();
        onMouseUp();
    };

    useEffect(() => {
        if (cellRef.current) {
            cellRef.current.textContent = cellData || "";
            // Regex to match content starting and ending with "**"
            const regexBold = /^\*\*(.+)\*\*$/;
            const regexItalic = /^\*?\*?_(.+)_\*?\*?$/;
            const regexCode = /^\*?\*?\_?\`(.+)\`\_?\*?\*?$/;

            if (regexBold.test(cellData || "")) {
                setFontWeight("bold");
            } else {
                setFontWeight("normal");
            }

            if (regexItalic.test(cellData || "")) {
                setFontStyle("italic");
            } else {
                setFontStyle("normal");
            }

            if (regexCode.test(cellData || "")) {
                setIsFontCode(true);
            } else {
                setIsFontCode(false);
            }
        }
    }, [cellData]);

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

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        handleCellSelection(rowIndex, colIndex);
    };

    const handleDoubleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        enableEditMode();
    };

    const handleBlur = () => {
        setIsEditing(false);
        if (cellRef.current) {
            handleCellChange(rowIndex, colIndex, cellRef.current.textContent || "");
        }
    };

    return (
        <TableCell
            align={align}
            onMouseDown={handleMouseDownEvent}
            onMouseEnter={handleMouseEnterEvent}
            onMouseUp={handleMouseUpEvent}
            onClick={handleClick}
            onDoubleClick={handleDoubleClick}
            sx={{
                height: "37.02px",
                ...(theme === "light" ? { borderRight: "1px solid #e0e0e0" } : { borderRight: "1px solid #686868" }),
                ...(theme === "light" ? { borderBottom: "1px solid #e0e0e0" } : { borderBottom: "1px solid #686868" }),
                "&:last-child": {
                    ...(theme === "light" ? { borderRight: "1px solid #e0e0e0" } : { borderRight: "1px solid #686868" }),
                },
                cursor: isEditing ? "text" : "pointer",
                backgroundColor: selectedCells[rowIndex]?.[colIndex] && multipleCellsSelected ? "rgba(25, 118, 210, 0.12)" : "transparent",
                p: 1,
                ...(isSelected ? { outline: "#1976d2 solid 1px", outlineOffset: "-1px" } : {}),
                ...(isEditing
                    ? {
                          boxShadow: "rgba(0, 0, 0, 0.2) 0px 3px 1px -2px, rgba(0, 0, 0, 0.14) 0px 2px 2px 0px, rgba(0, 0, 0, 0.12) 0px 1px 5px 0px",
                          textIndent: "3px",
                          zIndex: 1,
                      }
                    : {}),
            }}
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
        </TableCell>
    );
};

export default Cell;
