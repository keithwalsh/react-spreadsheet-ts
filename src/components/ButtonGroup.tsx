/**
 * @fileoverview Configurable button group component for toolbar actions with
 * support for horizontal/vertical orientation and theme-aware styling.
 */

import React, { useCallback } from "react";
import {
    IconButton as IconButtonMui,
    ButtonGroup as ButtonGroupMui,
    Tooltip as TooltipMui,
    Divider as DividerMui,
    Paper as PaperMui,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { buttonConfig, buttonDefinitions, defaultVisibleButtons } from "../config";
import { ButtonGroupProps, ToolbarContextType } from "../types";
import { useToolbar } from "./ToolbarProvider";

const ButtonGroup: React.FC<ButtonGroupProps> = ({
    visibleButtons = defaultVisibleButtons,
    orientation = "horizontal",
    iconSize = 20,
    iconMargin = 0.25,
    dividerMargin = 0.5,
    tooltipArrow = true,
    tooltipPlacement = "top",
}) => {
    const theme = useTheme();
    const isDarkMode = theme.palette.mode === "dark";
    const handlers = useToolbar();

    const themeConfig = buttonConfig(isDarkMode ? "dark" : "light");

    const renderButton = useCallback(
        (item: string, index: number) => {
            if (item === "divider") {
                return <DividerMui key={`divider-${index}`} orientation={orientation === "horizontal" ? "vertical" : "horizontal"} flexItem />;
            }

            const btn = buttonDefinitions.find((btn) => btn.title === item);
            if (!btn) return null;

            const { title, icon: Icon, handlerKey } = btn;
            const handler = handlers[handlerKey as keyof ToolbarContextType];

            const handleClick = () => {
                if (!handler) {
                    console.error(`No handler found for ${handlerKey}`);
                    return;
                }
                if (handlerKey === "onClickAddRow") {
                    (handler as (position: "above" | "below") => void)("below");
                } else if (handlerKey === "onClickAddColumn") {
                    (handler as (position: "left" | "right") => void)("right");
                } else {
                    (handler as () => void)();
                }
            };

            return (
                <TooltipMui key={title} title={title} arrow={tooltipArrow} placement={tooltipPlacement}>
                    <IconButtonMui
                        onClick={handleClick}
                        size="small"
                        sx={{
                            m: iconMargin,
                            ...(isDarkMode ? {
                                color: themeConfig.svgStyle.color,
                                "&:hover": {
                                    backgroundColor: themeConfig.hoverStyle.backgroundColor,
                                }
                            } : {})
                        }}
                    >
                        <Icon size={iconSize} />
                    </IconButtonMui>
                </TooltipMui>
            );
        },
        [handlers, iconMargin, iconSize, themeConfig, tooltipArrow, tooltipPlacement, isDarkMode]
    );

    return (
        <PaperMui
            elevation={1}
            sx={{
                display: "inline-flex",
                padding: 0.5,
                borderColor: themeConfig.borderColor,
                backgroundColor: isDarkMode ? "#1e1e1e" : undefined
            }}
        >
            <ButtonGroupMui
                orientation={orientation}
                sx={{
                    "& .MuiDivider-root": {
                        margin: dividerMargin,
                        borderColor: themeConfig.borderColor
                    },
                }}
            >
                {visibleButtons.map(renderButton)}
            </ButtonGroupMui>
        </PaperMui>
    );
};

export default ButtonGroup;
