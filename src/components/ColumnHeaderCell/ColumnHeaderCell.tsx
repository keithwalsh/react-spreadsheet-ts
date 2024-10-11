import * as React from "react";
import { TableCell as TableCellMui } from "@mui/material";
import { ColumnHeaderCellProps } from "./types";

const ColumnHeaderCell: React.FC<ColumnHeaderCellProps> = ({ theme = "light", index, handleColumnSelection, selectedColumns }) => {
    const isSelected = selectedColumns?.has(index);

    const lightThemeStyles = {
        color: "rgba(0, 0, 0, 0.54)",
        backgroundColor: isSelected ? "#e0e0e0" : "#f0f0f0",
        borderRight: "1px solid #e0e0e0",
        "&:hover": { backgroundColor: "#e0e0e0" },
    };

    const darkThemeStyles = {
        color: "#BEBFC0",
        backgroundColor: isSelected ? "#686868" : "#414547",
        borderRight: "1px solid #686868",
        borderBottom: "1px solid #686868",
        "&:hover": { backgroundColor: "#686868" },
    };

    return (
        <TableCellMui
            sx={{
                ...(theme === "light" ? lightThemeStyles : darkThemeStyles),
                cursor: "pointer",
                userSelect: "none",
                textAlign: "center",
                padding: "2px 2px",
                height: "1px",
                lineHeight: "1",
                fontSize: "0.8rem",
            }}
            onClick={() => handleColumnSelection(index)}
        >
            {String.fromCharCode(65 + index)}
        </TableCellMui>
    );
};

export default ColumnHeaderCell;
