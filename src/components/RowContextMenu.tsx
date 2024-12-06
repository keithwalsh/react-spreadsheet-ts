import React from "react";
import { Menu, MenuItem } from "@mui/material";
import { RowContextMenuProps } from "../types";

const RowContextMenu: React.FC<RowContextMenuProps> = ({ anchorEl, open, onClose, onAddAbove, onAddBelow, onRemove }) => {
    return (
        <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={onClose}
            anchorOrigin={{
                vertical: "center",
                horizontal: "right",
            }}
            transformOrigin={{
                vertical: "center",
                horizontal: "left",
            }}
        >
            <MenuItem dense onClick={onAddAbove}>
                Add row above
            </MenuItem>
            <MenuItem dense onClick={onAddBelow}>
                Add row below
            </MenuItem>
            <MenuItem dense onClick={onRemove}>
                Remove row
            </MenuItem>
        </Menu>
    );
};

export default RowContextMenu;
