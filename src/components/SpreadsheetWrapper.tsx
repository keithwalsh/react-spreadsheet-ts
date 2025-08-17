/**
 * @file src/components/SpreadsheetWrapper.tsx
 * @fileoverview Provides a wrapper component for the Spreadsheet, integrating
 * Jotai for state management and Material-UI for theming.
 */

import React from "react";
import { Provider } from "jotai";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { createSpreadsheetAtom } from "../store/atoms";
import { Spreadsheet } from "./";
import { SpreadsheetWrapperProps } from "../types";
import { TableDimensionLimits } from "../types/enums";

/** Sets up theme and state management for the Spreadsheet component. */
export const SpreadsheetWrapper: React.FC<SpreadsheetWrapperProps> = ({ 
    rows = TableDimensionLimits.MIN_ROWS, 
    cols = TableDimensionLimits.MIN_COLUMNS, 
    darkMode = false 
}) => {
    const spreadsheetAtom = React.useMemo(() => createSpreadsheetAtom(rows, cols), [rows, cols]);

    const theme = React.useMemo(
        () =>
            createTheme({
                palette: {
                    mode: darkMode ? "dark" : "light",
                },
            }),
        [darkMode]
    );

    return (
        <Provider>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Spreadsheet atom={spreadsheetAtom} />
            </ThemeProvider>
        </Provider>
    );
};

export default SpreadsheetWrapper;
