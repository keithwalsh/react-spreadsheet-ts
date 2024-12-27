/**
 * @file src/styles/tableStyles.ts
 * @fileoverview Defines styles for the Table component, supporting both light and dark themes.
 */

import { SxProps, Theme } from "@mui/material";
import { ThemeColors } from "../types/enums";

export const getTableContainerStyles = (isDarkMode: boolean): SxProps<Theme> => {
    const lightThemeStyles = {
        border: `1px solid ${ThemeColors.LIGHT_BORDER}`,
    };

    const darkThemeStyles = {
        border: `1px solid ${ThemeColors.DARK_BORDER}`,
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
