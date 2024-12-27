/**
 * @file src/components/Row.tsx
 * @fileoverview Defines a Row component that applies conditional styling based on the theme mode.
 * Utilizes Material-UI's TableRow component and theme for styling.
 */

import React, { useMemo } from "react";
import { TableRow as TableRowMui, useTheme } from "@mui/material";
import { RowProps } from "../types";
import { ThemeMode, ThemeColors } from "../types/enums";

/** Renders a table row with conditional styling based on the theme mode. */
const Row: React.FC<RowProps> = React.memo(({ children, className }) => {
    const theme = useTheme();
    const isDarkMode = theme.palette.mode.toUpperCase() === ThemeMode.DARK;

    const rowStyles = useMemo(
        () => ({
            "&:nth-of-type(odd)": {
                backgroundColor: isDarkMode ? ThemeColors.DARK_BACKGROUND : "rgba(0, 0, 0, 0.04)",
            },
            "&:last-child td": {
                borderBottom: isDarkMode 
                    ? `1px solid ${ThemeColors.DARK_BORDER}` 
                    : `1px solid ${ThemeColors.LIGHT_BORDER}`,
            },
        }),
        [isDarkMode]
    );

    return (
        <TableRowMui className={className} sx={rowStyles}>
            {children}
        </TableRowMui>
    );
});

export default Row;
