/**
 * @fileoverview Styles for the SelectAllCell component, including table cell and
 * icon button theming with dark mode support.
 */

import { SxProps, Theme } from "@mui/material";

const COLORS = {
    dark: {
        text: "#BEBFC0",
        border: "#686868",
        background: "#414547",
        selected: "#686868",
    },
    light: {
        text: "rgba(0, 0, 0, 0.54)",
        border: "#e0e0e0",
        background: "#f0f0f0",
        selected: "#e0e0e0",
    },
} as const;

export const getTableCellStyles = (isDarkMode: boolean, selectAll: boolean, sx: SxProps<Theme> = {}) => {
    const theme = isDarkMode ? COLORS.dark : COLORS.light;
    const backgroundColor = selectAll ? theme.selected : theme.background;

    return {
        padding: "0px",
        color: theme.text,
        backgroundColor,
        borderRight: `1px solid ${theme.border}`,
        borderBottom: `1px solid ${theme.border}`,
        ...sx,
    };
};

export const getIconButtonStyles = (isDarkMode: boolean): SxProps<Theme> => ({
    color: isDarkMode ? "#BEBFC0" : "rgba(0, 0, 0, 0.54)",
    borderRadius: 0,
    "&:hover": { backgroundColor: isDarkMode ? "#686868" : "#e0e0e0" },
    "& .MuiTouchRipple-root .MuiTouchRipple-child": {
        borderRadius: 0,
    },
});
