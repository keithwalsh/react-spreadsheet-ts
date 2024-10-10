// src/components/TableMenu.tsx

import React, { useState, useContext } from "react";
import { Button, MenuItem, Divider } from "@mui/material";
import Menu, { MenuProps } from "@mui/material/Menu";
import { styled, alpha } from "@mui/material/styles";
import { KeyboardArrowDown, BorderAll } from "@mui/icons-material";
import { ButtonGroupContext } from "./ButtonGroup";
import TableSizeChooser from "./TableSizeChooser";

// Styled Menu component
const StyledMenu = styled((props: MenuProps) => (
    <Menu
        elevation={0}
        anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
        }}
        transformOrigin={{
            vertical: "top",
            horizontal: "right",
        }}
        {...props}
    />
))(({ theme }) => ({
    "& .MuiPaper-root": {
        borderRadius: 6,
        marginTop: theme.spacing(1),
        minWidth: 180,
        color: theme.palette.mode === "light" ? "rgb(55, 65, 81)" : theme.palette.grey[300],
        boxShadow:
            "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
        "& .MuiMenu-list": {
            padding: "4px 0",
        },
        "& .MuiMenuItem-root": {
            "& .MuiSvgIcon-root": {
                fontSize: 18,
                color: theme.palette.text.secondary,
                marginRight: theme.spacing(1.5),
            },
            "&:active": {
                backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
            },
        },
    },
}));

const TableMenu: React.FC = () => {
    const handlers = useContext(ButtonGroupContext);

    if (!handlers) {
        throw new Error("TableMenu must be used within a ButtonGroupProvider");
    }

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [sizeChooserAnchorEl, setSizeChooserAnchorEl] = useState<null | HTMLElement>(null);

    const open = Boolean(anchorEl);
    const openSizeChooser = Boolean(sizeChooserAnchorEl);

    const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSizeChooserAnchorEl(null);
    };

    const handleSizeChooserClick = (event: React.MouseEvent<HTMLElement>) => {
        setSizeChooserAnchorEl(event.currentTarget);
    };

    const handleSizeChooserClose = () => {
        setSizeChooserAnchorEl(null);
    };

    return (
        <>
            <Button
                onClick={handleMenuClick}
                size="large"
                endIcon={<KeyboardArrowDown sx={{ marginLeft: -0.8 }} />}
                sx={{ textTransform: "none", py: 0.5, color: "rgba(0, 0, 0, 0.7);", "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.04);" } }}
            >
                Table
            </Button>

            <StyledMenu anchorEl={anchorEl} open={open} onClose={handleMenuClose} MenuListProps={{ "aria-labelledby": "table-menu-button" }}>
                <MenuItem onClick={handleSizeChooserClick} disableRipple>
                    <BorderAll fontSize="small" />
                    Set Size
                </MenuItem>
                <Divider />
            </StyledMenu>

            {/* Table Size Chooser Menu */}
            <StyledMenu
                anchorEl={sizeChooserAnchorEl}
                open={openSizeChooser}
                onClose={handleSizeChooserClose}
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                }}
            >
                <MenuItem disableRipple>
                    <TableSizeChooser
                        onSizeSelect={(row, col) => {
                            handlers.setTableSize(row, col);
                            handleSizeChooserClose();
                            handleMenuClose();
                        }}
                    />
                </MenuItem>
            </StyledMenu>
        </>
    );
};

export default TableMenu;
