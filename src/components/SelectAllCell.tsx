/**
 * @file src/components/SelectAllCell.tsx
 * @fileoverview Cell component for selecting all cells in the spreadsheet,
 * featuring a checkbox that toggles selection state.
 */

import React from "react";
import { IconButton as IconButtonMui, TableCell as TableCellMui, useTheme, SxProps, Theme } from "@mui/material";
import { FaRegSquare, FaCheckSquare } from "react-icons/fa";
import { SelectAllCellProps } from "../types";
import { getTableCellStyles, getIconButtonStyles } from "../styles";

const SelectAllCell: React.FC<SelectAllCellProps> = ({ selectAll, toggleSelectAll, size = "small", sx = {} }) => {
    const theme = useTheme();
    const isDarkMode = theme.palette.mode === "dark";

    return (
        <TableCellMui size={size} sx={getTableCellStyles(isDarkMode, selectAll, sx as SxProps<Theme>)}>
            <IconButtonMui onClick={toggleSelectAll} size="small" sx={getIconButtonStyles(isDarkMode)}>
                {selectAll ? <FaCheckSquare size={10} /> : <FaRegSquare size={10} />}
            </IconButtonMui>
        </TableCellMui>
    );
};

export default SelectAllCell;
