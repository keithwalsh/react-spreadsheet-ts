// src/components/ButtonGroup.tsx

import React, { createContext, useContext, useState } from "react";
import {
    Box as BoxMui,
    IconButton as IconButtonMui,
    ButtonGroup as ButtonGroupMui,
    Tooltip as TooltipMui,
    Divider as DividerMui,
    Paper as PaperMui,
    Menu as MenuMui,
    MenuItem as MenuItemMui,
} from "@mui/material";
import { buttonDefinitions, defaultVisibleButtons } from "../config";
import { ButtonGroupContextType, ButtonGroupProviderProps, ButtonGroupProps } from "../types";
import TableSizeChooser from "./TableSizeChooser"; // Import the TableSizeChooser component

/**
 * Context for ButtonGroup
 */
export const ButtonGroupContext = createContext<ButtonGroupContextType | undefined>(undefined);

/**
 * Provider for ButtonGroupContext
 */
export const ButtonGroupProvider: React.FC<ButtonGroupProviderProps> = ({ children, ...handlers }) => (
    <ButtonGroupContext.Provider value={handlers}>{children}</ButtonGroupContext.Provider>
);

/**
 * Main ButtonGroup component
 */
const ButtonGroup: React.FC<ButtonGroupProps> = ({
    theme = "light",
    visibleButtons,
    orientation = "horizontal",
    iconSize = 20,
    iconMargin = 0.25,
    dividerMargin = 0.5,
    tooltipArrow = true,
    tooltipPlacement = "top",
}) => {
    const handlers = useContext(ButtonGroupContext);

    if (!handlers) {
        throw new Error("ButtonGroup must be used within a ButtonGroupProvider");
    }

    // State variables for menu anchor elements
    const [tableMenuAnchorEl, setTableMenuAnchorEl] = useState<null | HTMLElement>(null);
    const [sizeChooserAnchorEl, setSizeChooserAnchorEl] = useState<null | HTMLElement>(null);

    // Boolean values indicating whether the menus are open
    const openTableMenu = Boolean(tableMenuAnchorEl);
    const openSizeChooser = Boolean(sizeChooserAnchorEl);

    const handleTableMenuClose = () => {
        setTableMenuAnchorEl(null);
        setSizeChooserAnchorEl(null); // Close the size chooser when the table menu closes
    };

    // Handlers for opening and closing the Size Chooser submenu
    const handleSizeChooserOpen = (event: React.MouseEvent<HTMLElement>) => {
        setSizeChooserAnchorEl(event.currentTarget);
    };

    const handleSizeChooserClose = () => {
        setSizeChooserAnchorEl(null);
    };

    const buttonsToRender = visibleButtons && visibleButtons.length > 0 ? visibleButtons : defaultVisibleButtons;

    const buttonConfig = (theme: string) => ({
        borderColor: theme === "light" ? "divider" : "#686868",
        svgStyle: theme === "light" ? {} : { color: "#BEBFC0" },
        hoverStyle: theme !== "light" ? { backgroundColor: "#2F353D" } : {},
    });

    const config = buttonConfig(theme);

    const renderButton = (item: string, index: number) => {
        if (item === "divider") {
            return <DividerMui key={`divider-${index}`} orientation={orientation === "horizontal" ? "vertical" : "horizontal"} flexItem />;
        }

        const btn = buttonDefinitions.find((btn) => btn.title === item);
        if (!btn) return null;

        const { title, icon: Icon, handlerKey } = btn;

        return (
            <TooltipMui key={title} title={title} placement={tooltipPlacement} arrow={tooltipArrow}>
                <IconButtonMui
                    onClick={handlers[handlerKey] || (() => console.warn(`Handler ${handlerKey} is not defined`))}
                    disabled={!handlers[handlerKey]}
                    sx={{
                        borderRadius: 0,
                        "&:hover": config.hoverStyle,
                        "& .MuiTouchRipple-root .MuiTouchRipple-child": {
                            borderRadius: 0,
                        },
                    }}
                >
                    <Icon size={iconSize} />
                </IconButtonMui>
            </TooltipMui>
        );
    };

    return (
        <BoxMui
            component={theme === "light" ? PaperMui : "div"}
            sx={{
                display: "flex",
                alignItems: "center",
                border: 1,
                borderRadius: 1,
                maxWidth: "max-content",
                marginTop: orientation === "horizontal" ? 3 : 2,
                ...(orientation === "vertical" && { marginRight: 2 }),
                borderColor: config.borderColor,
                "& svg": { m: iconMargin, ...config.svgStyle },
                "& .MuiDivider-root": {
                    borderColor: config.borderColor,
                    ...(orientation === "horizontal" ? { mx: dividerMargin } : { my: dividerMargin }),
                },
            }}
        >
            <ButtonGroupMui orientation={orientation}>{buttonsToRender.map(renderButton)}</ButtonGroupMui>

            {/* Table Menu */}
            <MenuMui
                anchorEl={tableMenuAnchorEl}
                open={openTableMenu}
                onClose={handleTableMenuClose}
                MenuListProps={{
                    "aria-labelledby": "table-menu-button",
                    onMouseLeave: handleTableMenuClose,
                }}
            >
                <MenuItemMui
                    onMouseEnter={handleSizeChooserOpen}
                    onMouseLeave={handleSizeChooserClose}
                    aria-haspopup="true"
                    aria-controls={openSizeChooser ? "size-chooser-menu" : undefined}
                    aria-expanded={openSizeChooser ? "true" : undefined}
                >
                    Set Size
                    {/* Nested Menu */}
                    <MenuMui
                        id="size-chooser-menu"
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
                        MenuListProps={{
                            onMouseEnter: handleSizeChooserOpen,
                            onMouseLeave: handleSizeChooserClose,
                        }}
                    >
                        <MenuItemMui disableRipple>
                            <TableSizeChooser
                                onSizeSelect={(row, col) => {
                                    // Call the handler from context
                                    handlers.setTableSize(row, col);
                                    handleSizeChooserClose();
                                    handleTableMenuClose();
                                }}
                            />
                        </MenuItemMui>
                    </MenuMui>
                </MenuItemMui>
                {/* You can add more menu items here if needed */}
            </MenuMui>
        </BoxMui>
    );
};

export default ButtonGroup;
