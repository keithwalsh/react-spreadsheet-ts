/**
 * @fileoverview Styles for the Table component, including theme-specific styles for
 * light and dark modes.
 */

import { SxProps, Theme } from "@mui/material";

export const getTableContainerStyles = (isDarkMode: boolean): SxProps<Theme> => {
    const lightThemeStyles = {
        border: "1px solid #e0e0e0",
    };

    const darkThemeStyles = {
        border: "1px solid #686868",
    };

    const commonStyles = {
        mt: 0,
        width: "auto",
        display: "inline-block",
        backgroundColor: "transparent",
    };

    return {
        ...commonStyles,
        ...(isDarkMode ? darkThemeStyles : lightThemeStyles),
    };
};

export const tableStyles = {
    "& .MuiTableCell-head": {
        lineHeight: 0.05,
    },
};
