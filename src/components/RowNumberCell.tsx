import * as React from "react";
import { TableCell } from "@mui/material";
import { RowNumberCellProps } from "@types";

const RowNumberCell: React.FC<RowNumberCellProps> = ({ theme = "light", children, className, onClick, ref }) => {
    return (
        <TableCell
            sx={{
                ...(theme === "light" ? { color: "rgba(0, 0, 0, 0.54)" } : { color: "#BEBFC0" }),
                cursor: "pointer",
                userSelect: "none",
                ...(theme === "light" ? { backgroundColor: "#f0f0f0" } : { backgroundColor: "#414547" }),
                fontWeight: "normal",
                textAlign: "center",
                padding: "2px 2px",
                width: "1px",
                ...(theme === "light" ? { borderRight: "1px solid #e0e0e0" } : { borderRight: "1px solid #686868" }),
                "&:hover": {
                    ...(theme === "light" ? { backgroundColor: "#e0e0e0" } : { backgroundColor: "#686868" }),
                },
            }}
            className={className}
            ref={ref}
            onClick={onClick}
        >
            {children}
        </TableCell>
    );
};

export default RowNumberCell;
