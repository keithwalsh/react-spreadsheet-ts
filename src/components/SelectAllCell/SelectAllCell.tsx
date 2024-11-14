import React from "react";
import { IconButton as IconButtonMui, TableCell as TableCellMui, useTheme } from "@mui/material";
import { FaRegSquare, FaCheckSquare } from "react-icons/fa";
import { SelectAllCellProps } from "./types";

const SelectAllCell: React.FC<SelectAllCellProps> = ({ selectAll, toggleSelectAll, size = "small", sx = {} }) => {
    const theme = useTheme();
    const isDarkMode = theme.palette.mode === 'dark';

    const tableCellStyles = {
        padding: "0px",
        color: isDarkMode ? "#BEBFC0" : "rgba(0, 0, 0, 0.54)",
        backgroundColor: selectAll ? (isDarkMode ? "#686868" : "#e0e0e0") : isDarkMode ? "#414547" : "#f0f0f0",
        borderRight: isDarkMode ? "1px solid #686868" : "1px solid #e0e0e0",
        borderBottom: isDarkMode ? "1px solid #686868" : "1px solid #e0e0e0",
        ...sx,
    };

    const iconButtonStyles = {
        color: isDarkMode ? "#BEBFC0" : "rgba(0, 0, 0, 0.54)",
        borderRadius: 0,
        "&:hover": { backgroundColor: isDarkMode ? "#686868" : "#e0e0e0" },
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
