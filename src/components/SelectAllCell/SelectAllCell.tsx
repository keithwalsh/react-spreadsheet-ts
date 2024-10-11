import React from "react";
import { IconButton as IconButtonMui, TableCell as TableCellMui } from "@mui/material";
import { FaRegSquare, FaCheckSquare } from "react-icons/fa";
import { SelectAllCellProps } from "./types";

const SelectAllCell: React.FC<SelectAllCellProps> = ({ theme = "light", selectAll, toggleSelectAll, size = "small", sx = {} }) => {
    const isLightTheme = theme === "light";

    const tableCellStyles = {
        padding: "0px",
        color: isLightTheme ? "rgba(0, 0, 0, 0.54)" : "#BEBFC0",
        backgroundColor: selectAll ? (isLightTheme ? "#e0e0e0" : "#686868") : isLightTheme ? "#f0f0f0" : "#414547",
        borderRight: isLightTheme ? "1px solid #e0e0e0" : "1px solid #686868",
        borderBottom: isLightTheme ? "1px solid #e0e0e0" : "1px solid #686868",
        ...sx,
    };

    const iconButtonStyles = {
        color: isLightTheme ? "rgba(0, 0, 0, 0.54)" : "#BEBFC0",
        borderRadius: 0,
        "&:hover": { backgroundColor: isLightTheme ? "#e0e0e0" : "#686868" },
        "& .MuiTouchRipple-root .MuiTouchRipple-child": {
            borderRadius: 0,
        },
    };

    return (
        <TableCellMui size={size} sx={tableCellStyles}>
            <IconButtonMui onClick={toggleSelectAll} size="small" sx={iconButtonStyles}>
                {selectAll ? <FaCheckSquare size={10} /> : <FaRegSquare size={10} />}
            </IconButtonMui>
        </TableCellMui>
    );
};

export default SelectAllCell;
