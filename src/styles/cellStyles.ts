/**
 * @file src/styles/cellStyles.ts
 * @fileoverview Styling utilities for spreadsheet cells, covering background colors, borders, and interactive states such as selection and editing.
 */

import { CSSProperties } from "react";
import { Property } from "csstype";
import { CellContentStyleProps, CellStyleProps } from "../types";
import { ThemeColors } from "../types/enums";

export const getThemeBorderColor = (isDarkMode: boolean) => 
    isDarkMode ? ThemeColors.DARK_BORDER : ThemeColors.LIGHT_BORDER;

export const getSelectionBackground = (isDarkMode: boolean) => 
    isDarkMode ? "rgba(25, 118, 210, 0.08)" : "rgba(25, 118, 210, 0.12)";

export const getLinkColor = (isDarkMode: boolean) => 
    isDarkMode ? "#90caf9" : "#1976d2";

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
              borderRight: `1px solid ${ThemeColors.DARK_BORDER}`,
              borderBottom: `1px solid ${ThemeColors.DARK_BORDER}`,
              "&:last-child": {
                  borderRight: `1px solid ${ThemeColors.DARK_BORDER}`,
              },
          }
        : {
              borderRight: `1px solid ${ThemeColors.LIGHT_BORDER}`,
              borderBottom: `1px solid ${ThemeColors.LIGHT_BORDER}`,
              "&:last-child": {
                  borderRight: `1px solid ${ThemeColors.LIGHT_BORDER}`,
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
    fontWeight: cellData.style.BOLD ? "bold" : "normal",
    fontStyle: cellData.style.ITALIC ? "italic" : "normal",
    fontFamily: cellData.style.CODE ? "'Courier New', Consolas, monospace" : "inherit",
    textAlign: (cellData.align || "left") as Property.TextAlign,
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
