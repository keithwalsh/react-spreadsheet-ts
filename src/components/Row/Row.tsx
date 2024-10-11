import React, { useMemo } from "react";
import { TableRow as TableRowMui } from "@mui/material";
import { RowProps } from "./types";

const Row: React.FC<RowProps> = React.memo(({ theme = "light", children, className }) => {
    const rowStyles = useMemo(
        () => ({
            "&:nth-of-type(odd)": {
                backgroundColor: theme === "light" ? "rgba(0, 0, 0, 0.04)" : "#222526",
            },
            "&:last-child td": {
                borderBottom: theme === "light" ? "1px solid #e0e0e0" : "1px solid #686868",
            },
        }),
        [theme]
    );

    return (
        <TableRowMui className={className} sx={rowStyles}>
            {children}
        </TableRowMui>
    );
});

Row.displayName = "Row";

export default Row;
