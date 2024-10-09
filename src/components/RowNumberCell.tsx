import * as React from "react";
import { TableCell as TableCellMui } from "@mui/material";
import { RowNumberCellProps } from "../types";

const RowNumberCell: React.FC<RowNumberCellProps> = ({ theme = "light", children, className, onClick, selectedRows, rowIndex }) => {
    const isSelected = selectedRows?.has(rowIndex);
    const isLightTheme = theme === "light";

    const lightThemeStyles = {
        color: "rgba(0, 0, 0, 0.54)",
        backgroundColor: isSelected ? "#e0e0e0" : "#f0f0f0",
        borderRight: "1px solid #e0e0e0",
        "&:hover": { backgroundColor: "#e0e0e0" },
    };

    const darkThemeStyles = {
        color: "#BEBFC0",
        backgroundColor: isSelected ? "#686868" : "#414547",
        borderBottom: "1px solid #686868",
        borderRight: "1px solid #686868",
        "&:hover": { backgroundColor: "#686868" },
    };

    return (
        <TableCellMui
            sx={{
                ...(isLightTheme ? lightThemeStyles : darkThemeStyles),
                cursor: "pointer",
                userSelect: "none",
                textAlign: "center",
                padding: "2px",
                width: "1px",
            }}
            className={className}
            onClick={onClick}
        >
            {children}
        </TableCellMui>
    );
};

export default RowNumberCell;
