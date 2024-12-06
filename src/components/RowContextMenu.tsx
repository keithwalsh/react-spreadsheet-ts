import React from "react";
import { ListItemText, ListItemIcon, Menu, MenuItem, Divider } from "@mui/material";
import { 
    ArrowUpward, 
    ArrowDownward, 
    DeleteOutline 
} from "@mui/icons-material";
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
                <ListItemIcon>
                    <ArrowUpward fontSize="small" />
                </ListItemIcon>
                <ListItemText>
                    Add row above
                </ListItemText>
            </MenuItem>
            <MenuItem dense onClick={onAddBelow}>
                <ListItemIcon>
                    <ArrowDownward fontSize="small" />
                </ListItemIcon>
                <ListItemText>
                    Add row below
                </ListItemText>
            </MenuItem>
            <Divider />
            <MenuItem dense onClick={onRemove}>
                <ListItemIcon>
                    <DeleteOutline fontSize="small" />
                </ListItemIcon>
                <ListItemText>
                    Remove row
                </ListItemText>
            </MenuItem>
        </Menu>
    );
};

export default RowContextMenu;
