import * as React from "react";
import { TableRow } from "@mui/material";

interface Props {
    children?: React.ReactNode;
    className?: string;
    ref?: React.Ref<HTMLTableRowElement> | null;
}

const Row: React.FC<Props> = ({ children, className, ref }) => {
    return (
        <TableRow
            className={className}
            ref={ref}
            sx={{
                "&:nth-of-type(odd)": {
                    backgroundColor: "rgba(0, 0, 0, 0.04)", // Light grey for odd rows
                },
                "&:last-child td": {
                    borderBottom: "1px solid #e0e0e0",
                },
            }}
        >
            {children}
        </TableRow>
    );
};

export default Row;
