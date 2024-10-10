import React, { useState, useContext, useRef } from "react";
import { Button, Menu, MenuItem, ListItemIcon, ListItemText } from "@mui/material";
import { KeyboardArrowDown, BorderAll, KeyboardArrowRight, ClearAll } from "@mui/icons-material";
import { ButtonGroupContext } from "./ButtonGroup";
import TableSizeChooser from "./TableSizeChooser";

const TableMenu: React.FC = () => {
    const handlers = useContext(ButtonGroupContext);
    if (!handlers) {
        throw new Error("TableMenu must be used within a ButtonGroupProvider");
    }

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [subMenuOpen, setSubMenuOpen] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const setSizeRef = useRef<HTMLLIElement>(null);

    const open = Boolean(anchorEl);

    // Get current table size from context
    const { currentRows, currentCols } = handlers;

    const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSubMenuOpen(false);
    };

    const handleSetSizeHover = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setSubMenuOpen(true);
    };

    const handleMenuMouseLeave = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
            setSubMenuOpen(false);
        }, 100);
    };

    const handleSubMenuMouseEnter = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    };

    const handleSizeSelect = (row: number, col: number) => {
        handlers.setTableSize(row, col);
        handleMenuClose();
    };

    const handleClearTable = () => {
        handlers.clearTable();
        handleMenuClose();
    };

    return (
        <>
            <Button
                onClick={handleMenuClick}
                size="large"
                endIcon={<KeyboardArrowDown sx={{ marginLeft: -0.8 }} />}
                sx={{
                    textTransform: "none",
                    py: 0.5,
                    color: "rgb(55, 65, 81)",
                    "&:hover": {
                        backgroundColor: "rgba(0, 0, 0, 0.04);",
                    },
                }}
            >
                Table
            </Button>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
                MenuListProps={{
                    onMouseLeave: handleMenuMouseLeave,
                }}
            >
                <MenuItem
                    disableRipple
                    dense
                    ref={setSizeRef}
                    onMouseEnter={handleSetSizeHover}
                    sx={{
                        "&:hover": {
                            backgroundColor: "action.hover",
                        },
                    }}
                >
                    <ListItemIcon>
                        <BorderAll fontSize="small" sx={{ marginLeft: -0.75 }} />
                    </ListItemIcon>
                    <ListItemText sx={{ paddingRight: 2, marginLeft: -1.75 }}>Set Size</ListItemText>
                    <KeyboardArrowRight fontSize="small" sx={{ marginRight: -1.5 }} />
                </MenuItem>
                <MenuItem
                    onClick={handleClearTable}
                    disableRipple
                    dense
                    sx={{
                        "&:hover": {
                            backgroundColor: "action.hover",
                        },
                    }}
                >
                    <ListItemIcon>
                        <ClearAll fontSize="small" sx={{ marginLeft: -0.75 }} />
                    </ListItemIcon>
                    <ListItemText sx={{ paddingRight: 2, marginLeft: -1.75 }}>Clear table</ListItemText>
                </MenuItem>
            </Menu>
            <Menu
                open={open && subMenuOpen}
                anchorEl={setSizeRef.current}
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                }}
                onClose={() => setSubMenuOpen(false)}
                MenuListProps={{
                    onMouseEnter: handleSubMenuMouseEnter,
                    onMouseLeave: handleMenuMouseLeave,
                }}
                sx={{
                    pointerEvents: "none",
                    "& .MuiPaper-root": {
                        pointerEvents: "auto",
                        marginLeft: "-2px",
                        marginTop: "-8px",
                    },
                    "& .MuiMenu-list": {
                        padding: "0",
                    },
                    "& .MuiButtonBase-root": {
                        padding: "0",
                    },
                }}
                slotProps={{
                    paper: {
                        elevation: 4,
                        sx: {
                            overflow: "visible",
                            "&:before": {
                                content: '""',
                                display: "block",
                                position: "absolute",
                                top: 0,
                                left: -10,
                                width: 10,
                                height: "100%",
                            },
                        },
                    },
                }}
            >
                <MenuItem
                    disableRipple
                    sx={{
                        "&:hover": {
                            backgroundColor: "action.hover",
                        },
                    }}
                >
                    <TableSizeChooser onSizeSelect={handleSizeSelect} currentRows={currentRows} currentCols={currentCols} />
                </MenuItem>
            </Menu>
        </>
    );
};

export default TableMenu;
