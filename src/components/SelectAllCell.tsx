import React from "react";
import { IconButton, TableCell } from "@mui/material";
import { FaRegSquare, FaCheckSquare } from "react-icons/fa";
import { SelectAllTableCellProps } from "@types";

const SelectAllCell: React.FC<SelectAllTableCellProps> = ({
    theme = "light",
    selectAll,
    toggleSelectAll,
    size = "small",
    sx = {
        padding: "0px 1px",
        ...(theme === "light" ? { color: "rgba(0, 0, 0, 0.54)" } : { color: "#BEBFC0" }),
        ...(theme === "light" ? { backgroundColor: "#f0f0f0" } : { backgroundColor: "#414547" }),
        ...(theme === "light" ? { borderRight: "1px solid #e0e0e0" } : { borderRight: "1px solid #686868" }),
    },
    ...rest
}) => {
    return (
        <TableCell size={size} sx={sx} {...rest}>
            <IconButton
                onClick={toggleSelectAll}
                size="small"
                sx={{
                    ...(theme === "light" ? { color: "rgba(0, 0, 0, 0.54)" } : { color: "#BEBFC0" }),
                    borderRadius: 0,
                    "& .MuiTouchRipple-root .MuiTouchRipple-child": {
                        borderRadius: 0,
                    },
                }}
            >
                {selectAll ? <FaCheckSquare size={10} /> : <FaRegSquare size={10} />}
            </IconButton>
        </TableCell>
    );
};

export default SelectAllCell;
