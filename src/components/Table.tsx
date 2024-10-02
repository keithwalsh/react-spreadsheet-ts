import * as React from "react";
import { TableContainer as TableContainerMUI, Table as TableMUI, Paper } from "@mui/material";
import { TableProps } from "@types";

const Table = React.forwardRef<HTMLTableElement, TableProps>(({ theme = "light", children, className, onPaste }, ref) => {
    return (
        <div className={className}>
            <TableContainerMUI
                component={theme === "light" ? Paper : "div"}
                sx={{
                    mt: 2,
                    width: "auto",
                    display: "inline-block",
                    ...(theme === "light"
                        ? {
                              border: "1px solid #e0e0e0",
                              backgroundColor: "transparent",
                          }
                        : {
                              border: "1px solid #686868",
                              backgroundColor: "transparent",
                          }),
                    borderRight: "none",
                    borderBottom: "none",
                }}
                onPaste={onPaste}
            >
                <TableMUI ref={ref} sx={{ "& .MuiTableCell-head": { lineHeight: 0.05 } }}>
                    {children}
                </TableMUI>
            </TableContainerMUI>
        </div>
    );
});

Table.displayName = "Table";

export default Table;
