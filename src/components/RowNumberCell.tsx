import * as React from "react";
import { TableCell as TableCellMui } from "@mui/material";
import { RowNumberCellProps } from "@types";

const RowNumberCell: React.FC<RowNumberCellProps> = ({ theme = "light", children, className, onClick, ref }) => {
    const isLightTheme = theme === "light";

    return (
        <TableCellMui
            sx={{
                color: isLightTheme ? "rgba(0, 0, 0, 0.54)" : "#BEBFC0",
                backgroundColor: isLightTheme ? "#f0f0f0" : "#414547",
                borderRight: isLightTheme ? "1px solid #e0e0e0" : "1px solid #686868",
                cursor: "pointer",
                userSelect: "none",
                fontWeight: "normal",
                textAlign: "center",
                padding: "2px",
                width: "1px",
                "&:hover": {
                    backgroundColor: isLightTheme ? "#e0e0e0" : "#686868",
                },
            }}
            className={className}
            ref={ref}
            onClick={onClick}
        >
            {children}
        </TableCellMui>
    );
};

export default RowNumberCell;
