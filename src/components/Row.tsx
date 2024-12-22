/**
 * @file src/components/Row.tsx
 * @fileoverview Defines a Row component that applies conditional styling based on the theme mode.
 * Utilizes Material-UI's TableRow component and theme for styling.
 */

import React, { useMemo } from "react";
import { TableRow as TableRowMui, useTheme } from "@mui/material";
import { RowProps } from "../types";

/** Renders a table row with conditional styling based on the theme mode. */
const Row: React.FC<RowProps> = React.memo(({ children, className }) => {
    const theme = useTheme();
    const isDarkMode = theme.palette.mode === 'dark';

    const rowStyles = useMemo(
        () => ({
            "&:nth-of-type(odd)": {
                backgroundColor: isDarkMode ? "#222526" : "rgba(0, 0, 0, 0.04)",
            },
            "&:last-child td": {
                borderBottom: isDarkMode ? "1px solid #686868" : "1px solid #e0e0e0",
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

Row.displayName = "Row";

export default Row;
