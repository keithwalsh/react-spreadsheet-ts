/**
 * @fileoverview Provides styling utilities for spreadsheet cells, including
 * background colors, borders, and interactive states like selection and editing.
 */

import { Theme } from "@mui/material";
import { CSSProperties } from "react";

export interface CellStyleProps {
    isDarkMode: boolean;
    theme: Theme;
    isEditing: boolean;
    isSelected: boolean;
    isMultiSelected?: boolean;
    style?: CSSProperties;
}

export const getThemeBorderColor = (isDarkMode: boolean) => (isDarkMode ? "#686868" : "#e0e0e0");

export const getSelectionBackground = (
    isDarkMode: boolean,
    isColumnSelected: boolean,
    isRowSelected: boolean,
    isMultiSelected: boolean,
    isSingleCellSelected: boolean
) => {
    if (isSingleCellSelected || isMultiSelected || isColumnSelected || isRowSelected) {
        return isDarkMode ? "rgba(25, 118, 210, 0.12)" : "rgba(227, 242, 253, 0.5)";
    }
    return "transparent";
};

export const getCellStyles = ({ isDarkMode, theme, isEditing, isSelected, isMultiSelected, style }: CellStyleProps) => ({
    height: "37.02px",
    cursor: isEditing ? "text" : "pointer",
    p: 1,
    backgroundColor: isMultiSelected ? getSelectionBackground(isDarkMode, false, false, true, false) : "transparent",
    borderRight: `1px solid ${getThemeBorderColor(isDarkMode)}`,
    borderBottom: `1px solid ${getThemeBorderColor(isDarkMode)}`,
    outline: isSelected ? `1px solid ${theme.palette.primary.main}` : "none",
    outlineOffset: isSelected ? "-1px" : "0",
    ...(isEditing && {
        boxShadow: "rgba(0, 0, 0, 0.2) 0px 3px 1px -2px, rgba(0, 0, 0, 0.14) 0px 2px 2px 0px, rgba(0, 0, 0, 0.12) 0px 1px 5px 0px",
        textIndent: "3px",
        zIndex: 1,
    }),
    "&:last-child": {
        borderRight: `1px solid ${getThemeBorderColor(isDarkMode)}`,
    },
    ...style,
});

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
