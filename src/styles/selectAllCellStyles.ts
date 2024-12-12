/**
 * @fileoverview Styles for the SelectAllCell component, including table cell and
 * icon button theming with dark mode support.
 */

import { SxProps, Theme } from "@mui/material";

export const getTableCellStyles = (isDarkMode: boolean, selectAll: boolean, sx: SxProps<Theme> = {}) => ({
    padding: "0px",
    color: isDarkMode ? "#BEBFC0" : "rgba(0, 0, 0, 0.54)",
    backgroundColor: selectAll ? (isDarkMode ? "#686868" : "#e0e0e0") : isDarkMode ? "#414547" : "#f0f0f0",
    borderRight: isDarkMode ? "1px solid #686868" : "1px solid #e0e0e0",
    borderBottom: isDarkMode ? "1px solid #686868" : "1px solid #e0e0e0",
    ...sx,
});

export const getIconButtonStyles = (isDarkMode: boolean): SxProps<Theme> => ({
    color: isDarkMode ? "#BEBFC0" : "rgba(0, 0, 0, 0.54)",
    borderRadius: 0,
    "&:hover": { backgroundColor: isDarkMode ? "#686868" : "#e0e0e0" },
    "& .MuiTouchRipple-root .MuiTouchRipple-child": {
        borderRadius: 0,
    },
});
