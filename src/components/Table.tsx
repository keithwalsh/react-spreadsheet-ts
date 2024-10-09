import * as React from "react";
import { TableContainer as TableContainerMui, Table as TableMui, Paper as PaperMui } from "@mui/material";
import { TableProps } from "../types";

const Table = React.forwardRef<HTMLTableElement, TableProps>(({ theme = "light", children, className, onPaste }, ref) => {
    const isLightTheme = theme === "light";

    return (
        <div className={className}>
            <TableContainerMui
                component={isLightTheme ? PaperMui : "div"}
                sx={{
                    mt: 2,
                    width: "auto",
                    display: "inline-block",
                    border: `1px solid ${isLightTheme ? "#e0e0e0" : "#686868"}`,
                    backgroundColor: "transparent",
                    borderRight: "none",
                    borderBottom: "none",
                }}
                onPaste={onPaste}
            >
                <TableMui ref={ref} sx={{ "& .MuiTableCell-head": { lineHeight: 0.05 } }}>
                    {children}
                </TableMui>
            </TableContainerMui>
        </div>
    );
});

Table.displayName = "Table";

export default Table;
