/**
 * @fileoverview Generic context menu component for row and column operations with
 * pre-configured exports for common use cases.
 */

import React from "react";
import { ListItemText, ListItemIcon, Menu, MenuItem, Divider } from "@mui/material";
import { ArrowUpward, ArrowDownward, ArrowBack, ArrowForward, DeleteOutline } from "@mui/icons-material";
import { ActionMenuItemProps, DirectionalContextMenuProps, MenuPositionConfig, BaseContextMenuProps, DirectionalMenuActions, MenuDirection } from "../types";

const ActionMenuItem: React.FC<ActionMenuItemProps> = ({ icon: Icon, text, onClick, ...props }) => (
    <MenuItem dense onClick={onClick} {...props}>
        <ListItemIcon>
            <Icon fontSize="small" />
        </ListItemIcon>
        <ListItemText>{text}</ListItemText>
    </MenuItem>
);

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
            <ActionMenuItem icon={menuConfig.beforeIcon} text={menuConfig.beforeText} onClick={() => handleAction(onAddBefore)} />
            <ActionMenuItem icon={menuConfig.afterIcon} text={menuConfig.afterText} onClick={() => handleAction(onAddAfter)} />
            <Divider />
            <ActionMenuItem icon={DeleteOutline} text={`Remove ${direction}`} onClick={() => handleAction(onRemove)} />
        </Menu>
    );
};

type WithDirectionalMenuProps<T extends MenuDirection> = BaseContextMenuProps & DirectionalMenuActions<T>;

const createDirectionalMenu = <T extends MenuDirection>(direction: T) => {
    return (props: WithDirectionalMenuProps<T>) => {
        const { anchorEl, open, onClose } = props;

        const menuProps = {
            onAddBefore: direction === "row" ? (props as WithDirectionalMenuProps<"row">).onAddAbove : (props as WithDirectionalMenuProps<"column">).onAddLeft,
            onAddAfter: direction === "row" ? (props as WithDirectionalMenuProps<"row">).onAddBelow : (props as WithDirectionalMenuProps<"column">).onAddRight,
            onRemove: props.onRemove,
        };

        return <DirectionalContextMenu direction={direction} anchorEl={anchorEl} open={open} onClose={onClose} {...menuProps} />;
    };
};

export const RowContextMenu = createDirectionalMenu("row");
export const ColumnContextMenu = createDirectionalMenu("column");
export default DirectionalContextMenu;
