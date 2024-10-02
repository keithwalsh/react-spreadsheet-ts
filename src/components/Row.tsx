import * as React from "react";
import { TableRow } from "@mui/material";
import { RowProps } from "@types";

const Row: React.FC<RowProps> = ({ theme = "light", children, className, ref }) => {
    return (
        <TableRow
            className={className}
            ref={ref}
            sx={{
                "&:nth-of-type(odd)": {
                    ...(theme === "light" ? { backgroundColor: "rgba(0, 0, 0, 0.04)" } : { backgroundColor: "#222526" }),
                },
                "&:last-child td": {
                    ...(theme === "light" ? { borderBottom: "1px solid #e0e0e0" } : { borderBottom: "1px solid #686868" }),
                },
            }}
        >
            {children}
        </TableRow>
    );
};
export default Row;
