import * as React from "react";
import { TableContainer as TableContainerMui, Table as TableMui, Paper as PaperMui } from "@mui/material";
import { TableProps } from "../types";

const Table = React.forwardRef<HTMLTableElement, TableProps>(({ theme = "light", children, className, onPaste }, ref) => {
    const isLightTheme = theme === "light";

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
                component={isLightTheme ? PaperMui : "div"}
                sx={{
                    ...(isLightTheme ? lightThemeStyles : darkThemeStyles),
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
