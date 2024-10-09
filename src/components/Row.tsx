import React from "react";
import { TableRow as TableRowMui } from "@mui/material";
import { RowProps } from "../types";

const Row: React.FC<RowProps> = ({ theme = "light", children, className, ref }) => {
    const rowStyles = {
        "&:nth-of-type(odd)": {
            backgroundColor: theme === "light" ? "rgba(0, 0, 0, 0.04)" : "#222526",
        },
        "&:last-child td": {
            borderBottom: theme === "light" ? "1px solid #e0e0e0" : "1px solid #686868",
        },
    };

    return (
        <TableRowMui className={className} ref={ref} sx={rowStyles}>
            {children}
        </TableRowMui>
    );
};

export default Row;
