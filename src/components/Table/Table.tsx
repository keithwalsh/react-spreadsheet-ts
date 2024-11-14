import * as React from "react";
import { TableContainer as TableContainerMui, Table as TableMui, Paper as PaperMui, useTheme } from "@mui/material";
import { TableProps } from "./types";

const Table = React.forwardRef<HTMLTableElement, TableProps>(({ children, className, onPaste }, ref) => {
    const theme = useTheme();
    const isDarkMode = theme.palette.mode === 'dark';

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
        borderRight: "none",
        borderBottom: "none",
    };

    return (
        <div className={className}>
            <TableContainerMui
                component={!isDarkMode ? PaperMui : "div"}
                sx={{
                    ...(isDarkMode ? darkThemeStyles : lightThemeStyles),
                    ...commonStyles,
                }}
                onPaste={onPaste}
            >
                <TableMui
                    ref={ref}
                    sx={{
                        "& .MuiTableCell-head": {
                            lineHeight: 0.05,
                        },
                    }}
                >
                    {children}
                </TableMui>
            </TableContainerMui>
        </div>
    );
});

Table.displayName = "Table";

export default Table;
