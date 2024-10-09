import React from "react";
import { IconButton as IconButtonMui, TableCell as TableCellMui } from "@mui/material";
import { FaRegSquare, FaCheckSquare } from "react-icons/fa";
import { SelectAllTableCellProps } from "../types";

const SelectAllCell: React.FC<SelectAllTableCellProps> = ({ theme = "light", selectAll, toggleSelectAll, size = "small", sx = {}, ...rest }) => {
    const isLightTheme = theme === "light";

    // Styles for TableCellMui based on the theme
    const lightThemeTableCellStyles = {
        padding: "0px",
        color: "rgba(0, 0, 0, 0.54)",
        backgroundColor: selectAll ? "#e0e0e0" : "#f0f0f0",
        borderRight: "1px solid #e0e0e0",
    };

    const darkThemeTableCellStyles = {
        padding: "0px",
        color: "#BEBFC0",
        backgroundColor: selectAll ? "#686868" : "#414547",
        borderBottom: "1px solid #686868",
        borderRight: "1px solid #686868",
    };

    // Styles for IconButtonMui based on the theme
    const lightThemeIconButtonStyles = {
        color: "rgba(0, 0, 0, 0.54)",
        borderRadius: 0,
        "&:hover": { backgroundColor: "#e0e0e0" },
        "& .MuiTouchRipple-root .MuiTouchRipple-child": {
            borderRadius: 0,
        },
    };

    const darkThemeIconButtonStyles = {
        color: "#BEBFC0",
        borderRadius: 0,
        "&:hover": { backgroundColor: "#686868" },
        "& .MuiTouchRipple-root .MuiTouchRipple-child": {
            borderRadius: 0,
        },
    };

    const tableCellStyles = isLightTheme ? lightThemeTableCellStyles : darkThemeTableCellStyles;
    const iconButtonStyles = isLightTheme ? lightThemeIconButtonStyles : darkThemeIconButtonStyles;

    return (
        <TableCellMui
            size={size}
            sx={{
                ...tableCellStyles,
                ...sx,
            }}
            {...rest}
        >
            <IconButtonMui
                onClick={toggleSelectAll}
                size="small"
                sx={{
                    ...iconButtonStyles,
                }}
            >
                {selectAll ? <FaCheckSquare size={10} /> : <FaRegSquare size={10} />}
            </IconButtonMui>
        </TableCellMui>
    );
};

export default SelectAllCell;
