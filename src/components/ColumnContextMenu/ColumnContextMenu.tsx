import React from "react";
import { Menu, MenuItem } from "@mui/material";
import { ColumnContextMenuProps } from "./types";

const ColumnContextMenu: React.FC<ColumnContextMenuProps> = ({ anchorEl, open, onClose, onAddLeft, onAddRight, onRemove }) => {
    return (
        <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={onClose}
            anchorOrigin={{
                vertical: "bottom",
                horizontal: "center",
            }}
            transformOrigin={{
                vertical: "top",
                horizontal: "center",
            }}
        >
            <MenuItem dense onClick={onAddLeft}>
                Add column to the left
            </MenuItem>
            <MenuItem dense onClick={onAddRight}>
                Add column to the right
            </MenuItem>
            <MenuItem dense onClick={onRemove}>
                Remove column
            </MenuItem>
        </Menu>
    );
};

export default ColumnContextMenu;
