import React, { useState, useEffect, useRef, useCallback } from "react";
import { TableCell } from "@mui/material";
import { CellProps } from "@types";

const Cell: React.FC<CellProps> = ({ rowIndex, colIndex, align, selectedCells, selectedCell, handleCellSelection, handleCellChange, style, cellData }) => {
    const [isEditing, setIsEditing] = useState(false);
    const cellRef = useRef<HTMLDivElement>(null);
    const isSelected = selectedCell !== null && selectedCell.row === rowIndex && selectedCell.col === colIndex;
    const multipleCellsSelected = selectedCells.flat().filter(Boolean).length > 1;

    useEffect(() => {
        if (cellRef.current) {
            cellRef.current.textContent = cellData || "";
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
            onClick={handleClick}
            onDoubleClick={handleDoubleClick}
            sx={{
                height: "37.02px",
                borderRight: "1px solid #e0e0e0",
                borderBottom: "1px solid #e0e0e0",
                "&:last-child": {
                    borderRight: "1px solid #e0e0e0",
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
                    ...style,
                }}
            />
        </TableCell>
    );
};

export default Cell;
