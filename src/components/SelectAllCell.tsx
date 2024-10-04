import React from "react";
import { IconButton as IconButtonMui, TableCell as TableCellMui } from "@mui/material";
import { FaRegSquare, FaCheckSquare } from "react-icons/fa";
import { SelectAllTableCellProps } from "@types";

const SelectAllCell: React.FC<SelectAllTableCellProps> = ({
    theme = "light",
    selectAll,
    toggleSelectAll,
    size = "small",
    sx = {
        padding: "0px 1px",
        color: theme === "light" ? "rgba(0, 0, 0, 0.54)" : "#BEBFC0",
        backgroundColor: theme === "light" ? "#f0f0f0" : "#414547",
        borderRight: theme === "light" ? "1px solid #e0e0e0" : "1px solid #686868",
    },
    ...rest
}) => (
    <TableCellMui size={size} sx={sx} {...rest}>
        <IconButtonMui
            onClick={toggleSelectAll}
            size="small"
            sx={{
                color: theme === "light" ? "rgba(0, 0, 0, 0.54)" : "#BEBFC0",
                borderRadius: 0,
                "& .MuiTouchRipple-root .MuiTouchRipple-child": {
                    borderRadius: 0,
                },
            }}
        >
            {selectAll ? <FaCheckSquare size={10} /> : <FaRegSquare size={10} />}
        </IconButtonMui>
    </TableCellMui>
);

export default SelectAllCell;
