import React from "react";
import { IconButton, TableCell, TableCellProps } from "@mui/material";
import { FaRegSquare, FaCheckSquare } from "react-icons/fa";

interface SelectAllTableCellProps extends TableCellProps {
    selectAll: boolean;
    toggleSelectAll: () => void;
    iconSize?: number;
}

const SelectAllCell: React.FC<SelectAllTableCellProps> = ({
    selectAll,
    toggleSelectAll,
    size = "small",
    sx = { padding: "0px 1px", borderRight: "1px solid #e0e0e0", backgroundColor: "#f0f0f0" },
    ...rest
}) => {
    return (
        <TableCell size={size} sx={sx} {...rest}>
            <IconButton
                onClick={toggleSelectAll}
                size="small"
                sx={{
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
