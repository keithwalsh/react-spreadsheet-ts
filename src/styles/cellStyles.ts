/**
 * @fileoverview Provides styling utilities for spreadsheet cells, including
 * background colors, borders, and interactive states like selection and editing.
 */

import { CSSProperties } from "react";

export interface CellStyleProps {
    isDarkMode: boolean;
    isEditing: boolean;
    isSelected: boolean;
    selectedCells: Record<number, Record<number, boolean>>;
    rowIndex: number;
    colIndex: number;
    multipleCellsSelected: boolean;
    style?: CSSProperties;
}

export const getThemeBorderColor = (isDarkMode: boolean) => (isDarkMode ? "#686868" : "#e0e0e0");

export const getSelectionBackground = (isDarkMode: boolean) => (isDarkMode ? "rgba(25, 118, 210, 0.08)" : "rgba(25, 118, 210, 0.12)");

export const getCellStyles = ({ isDarkMode, isEditing, isSelected, selectedCells, rowIndex, colIndex, multipleCellsSelected }: CellStyleProps) => {
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
        backgroundColor: isEditing ? "transparent" : selectedCells[rowIndex]?.[colIndex] && multipleCellsSelected ? "rgba(25, 118, 210, 0.12)" : "transparent",
        p: 1,
        outline: isSelected ? "#1976d2 solid 1px" : "none",
        outlineOffset: isSelected ? "-1px" : "0",
        ...(isEditing && {
            boxShadow: "rgba(0, 0, 0, 0.2) 0px 3px 1px -2px, rgba(0, 0, 0, 0.14) 0px 2px 2px 0px, rgba(0, 0, 0, 0.12) 0px 1px 5px 0px",
            textIndent: "3px",
            zIndex: 1,
        }),
    };
};

export interface CellContentStyleProps {
    isEditing: boolean;
    fontWeight: string;
    fontStyle: string;
    isFontCode: boolean;
    style?: CSSProperties;
}

export const getCellContentStyles = ({ isEditing, fontWeight, fontStyle, isFontCode, style }: CellContentStyleProps): CSSProperties => ({
    minWidth: "80px",
    outline: "none",
    cursor: "inherit",
    userSelect: isEditing ? "text" : "none",
    fontWeight,
    fontStyle,
    fontFamily: isFontCode ? "'Courier New', Consolas, monospace" : "inherit",
    ...style,
});
