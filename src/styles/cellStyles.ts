/**
 * @fileoverview Provides styling utilities for spreadsheet cells, including
 * background colors, borders, and interactive states like selection and editing.
 */

import { CSSProperties } from "react";
import { CellContentStyleProps, CellStyleProps } from "../types";

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

export const getCellContentStyles = ({ isEditing, cellData, style }: CellContentStyleProps): CSSProperties => ({
    minWidth: "80px",
    outline: "none",
    cursor: isEditing ? "text" : "inherit",
    userSelect: isEditing ? "text" : "none",
    fontWeight: cellData.bold ? "bold" : "normal",
    fontStyle: cellData.italic ? "italic" : "normal",
    fontFamily: cellData.code ? "'Courier New', Consolas, monospace" : "inherit",
    textAlign: cellData.align || "left",
    ...style,
});

export const getLinkStyles = () => ({
    color: "inherit",
    cursor: "pointer",
    textDecoration: "underline",
    "&:hover": {
        textDecoration: "none",
    },
});
