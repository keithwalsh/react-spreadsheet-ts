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
    isColumnSelected: boolean;
    isRowSelected: boolean;
    isSelectAllSelected: boolean;
    hasLink?: boolean;
}

export const getThemeBorderColor = (isDarkMode: boolean) => (isDarkMode ? "#686868" : "#e0e0e0");

export const getSelectionBackground = (isDarkMode: boolean) => (isDarkMode ? "rgba(25, 118, 210, 0.08)" : "rgba(25, 118, 210, 0.12)");

export const getLinkColor = (isDarkMode: boolean) => (isDarkMode ? "#90caf9" : "#1976d2");

export const getCellStyles = ({
    isDarkMode,
    isEditing,
    isSelected,
    multipleCellsSelected,
    isColumnSelected,
    isRowSelected,
    isSelectAllSelected,
    hasLink,
    style,
}: CellStyleProps) => {
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

    const isAnySelected = isSelected || isColumnSelected || isRowSelected || isSelectAllSelected;
    const shouldHighlight = isAnySelected;

    return {
        ...themeStyles,
        height: "37.02px",
        cursor: isEditing ? "text" : "pointer",
        backgroundColor: isEditing ? "transparent" : shouldHighlight ? getSelectionBackground(isDarkMode) : "transparent",
        p: 1,
        outline: isSelected && !(multipleCellsSelected || isColumnSelected || isRowSelected || isSelectAllSelected) ? "#1976d2 solid 1px" : "none",
        outlineOffset: isSelected && !(multipleCellsSelected || isColumnSelected || isRowSelected || isSelectAllSelected) ? "-1px" : "0",
        ...(isEditing && {
            boxShadow: "rgba(0, 0, 0, 0.2) 0px 3px 1px -2px, rgba(0, 0, 0, 0.14) 0px 2px 2px 0px, rgba(0, 0, 0, 0.12) 0px 1px 5px 0px",
            textIndent: "3px",
            zIndex: 1,
        }),
        ...(hasLink && {
            "& a": {
                color: getLinkColor(isDarkMode),
                textDecoration: "none",
                position: "relative",
                "&::after": {
                    content: '""',
                    position: "absolute",
                    width: "100%",
                    height: "1px",
                    bottom: 0,
                    left: 0,
                    backgroundColor: "currentColor",
                    opacity: 0.4,
                    transition: "opacity 0.2s ease-in-out",
                },
                "&:hover::after": {
                    opacity: 0.7,
                },
                "&:hover": {
                    textDecoration: "none",
                },
            },
        }),
        ...style,
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
