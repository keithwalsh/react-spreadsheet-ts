import * as React from "react";
import { TableContainer as TableContainerMUI, Table as TableMUI, Paper } from "@mui/material";

interface Props {
    children?: React.ReactNode;
    className?: string;
    onPaste?: (event: React.ClipboardEvent<HTMLDivElement>) => void;
}

const Table = React.forwardRef<HTMLTableElement, Props>(({ children, className, onPaste }, ref) => {
    return (
        <div className={className}>
            <TableContainerMUI
                component={Paper}
                sx={{
                    mt: 2,
                    width: "auto",
                    display: "inline-block",
                    border: "1px solid #e0e0e0",
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
