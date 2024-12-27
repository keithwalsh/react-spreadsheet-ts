/**
 * @file src/styles/selectAllCellStyles.ts
 * @fileoverview Defines styles for the SelectAllCell component, covering table cell and icon button theming with support for dark mode.
 */

import { SxProps, Theme } from "@mui/material";
import { ThemeColors } from "../types/enums";

export const getTableCellStyles = (isDarkMode: boolean, selectAll: boolean, sx: SxProps<Theme> = {}) => {
    const backgroundColor = selectAll
        ? isDarkMode ? ThemeColors.DARK_SELECTED : ThemeColors.LIGHT_SELECTED
        : isDarkMode ? ThemeColors.DARK_BACKGROUND : ThemeColors.LIGHT_BACKGROUND;

    return {
        padding: "0px",
        color: isDarkMode ? ThemeColors.DARK_TEXT : ThemeColors.LIGHT_TEXT,
        backgroundColor,
        borderRight: `1px solid ${isDarkMode ? ThemeColors.DARK_BORDER : ThemeColors.LIGHT_BORDER}`,
        borderBottom: `1px solid ${isDarkMode ? ThemeColors.DARK_BORDER : ThemeColors.LIGHT_BORDER}`,
        ...sx,
    };
};

export const getIconButtonStyles = (isDarkMode: boolean): SxProps<Theme> => ({
    color: isDarkMode ? ThemeColors.DARK_TEXT : ThemeColors.LIGHT_TEXT,
    borderRadius: 0,
    "&:hover": { backgroundColor: isDarkMode ? ThemeColors.DARK_SELECTED : ThemeColors.LIGHT_SELECTED },
    "& .MuiTouchRipple-root .MuiTouchRipple-child": {
        borderRadius: 0,
    },
});
