/**
 * @fileoverview Context menu for spreadsheet column operations, providing options
 * to add columns to either side or remove the current column. Triggered by
 * right-clicking column headers.
 */

import React from "react";
import { Divider, ListItemIcon, ListItemText, Menu, MenuItem } from "@mui/material";
import { ArrowBack, ArrowForward, DeleteOutline } from "@mui/icons-material";
import { ColumnContextMenuProps } from "../types";

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
                <ListItemIcon>
                    <ArrowBack fontSize="small" />
                </ListItemIcon>
                <ListItemText>Add column to the left</ListItemText>
            </MenuItem>
            <MenuItem dense onClick={onAddRight}>
                <ListItemIcon>
                    <ArrowForward fontSize="small" />
                </ListItemIcon>
                <ListItemText>Add column to the right</ListItemText>
            </MenuItem>
            <Divider />
            <MenuItem dense onClick={onRemove}>
                <ListItemIcon>
                    <DeleteOutline fontSize="small" />
                </ListItemIcon>
                <ListItemText>Remove column</ListItemText>
            </MenuItem>
        </Menu>
    );
};

export default ColumnContextMenu;
