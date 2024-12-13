/**
 * @fileoverview Generic context menu component supporting both row and column
 * operations with configurable icons and actions.
 */

import React from "react";
import { ListItemText, ListItemIcon, Menu, MenuItem, Divider, PopoverOrigin } from "@mui/material";
import { ArrowUpward, ArrowDownward, ArrowBack, ArrowForward, DeleteOutline } from "@mui/icons-material";
import { BaseContextMenuProps, MenuDirection } from "../types";

interface DirectionalContextMenuProps extends BaseContextMenuProps {
    direction: MenuDirection;
    onAddBefore: () => void;
    onAddAfter: () => void;
    onRemove: () => void;
}

interface MenuPositionConfig {
    anchorOrigin: PopoverOrigin;
    transformOrigin: PopoverOrigin;
    beforeIcon: typeof ArrowUpward | typeof ArrowBack;
    afterIcon: typeof ArrowDownward | typeof ArrowForward;
    beforeText: string;
    afterText: string;
}

const DirectionalContextMenu: React.FC<DirectionalContextMenuProps> = ({ direction, anchorEl, open, onClose, onAddBefore, onAddAfter, onRemove }) => {
    const isRow = direction === "row";
    const menuConfig: MenuPositionConfig = {
        anchorOrigin: {
            vertical: isRow ? "center" : "bottom",
            horizontal: isRow ? "right" : "center",
        },
        transformOrigin: {
            vertical: isRow ? "center" : "top",
            horizontal: isRow ? "left" : "center",
        },
        beforeIcon: isRow ? ArrowUpward : ArrowBack,
        afterIcon: isRow ? ArrowDownward : ArrowForward,
        beforeText: isRow ? "Add row above" : "Add column to the left",
        afterText: isRow ? "Add row below" : "Add column to the right",
    };

    const handleAction = (action: () => void) => {
        action();
        onClose();
    };

    return (
        <Menu anchorEl={anchorEl} open={open} onClose={onClose} anchorOrigin={menuConfig.anchorOrigin} transformOrigin={menuConfig.transformOrigin}>
            <MenuItem dense onClick={() => handleAction(onAddBefore)}>
                <ListItemIcon>
                    <menuConfig.beforeIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>{menuConfig.beforeText}</ListItemText>
            </MenuItem>
            <MenuItem dense onClick={() => handleAction(onAddAfter)}>
                <ListItemIcon>
                    <menuConfig.afterIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>{menuConfig.afterText}</ListItemText>
            </MenuItem>
            <Divider />
            <MenuItem dense onClick={() => handleAction(onRemove)}>
                <ListItemIcon>
                    <DeleteOutline fontSize="small" />
                </ListItemIcon>
                <ListItemText>Remove {direction}</ListItemText>
            </MenuItem>
        </Menu>
    );
};

export default DirectionalContextMenu;
