/**
 * @fileoverview Configurable button group component for toolbar actions with
 * support for horizontal/vertical orientation and theme-aware styling.
 */

import React, { useContext, useCallback } from "react";
import {
    Box as BoxMui,
    IconButton as IconButtonMui,
    ButtonGroup as ButtonGroupMui,
    Tooltip as TooltipMui,
    Divider as DividerMui,
    Paper as PaperMui,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { buttonConfig, buttonDefinitions, defaultVisibleButtons } from "../config";
import { ButtonGroupProps } from "../types";
import { ToolbarContext } from "./ToolbarProvider";

const ButtonGroup: React.FC<ButtonGroupProps> = ({
    visibleButtons,
    orientation = "horizontal",
    iconSize = 20,
    iconMargin = 0.25,
    dividerMargin = 0.5,
    tooltipArrow = true,
    tooltipPlacement = "top",
}) => {
    const theme = useTheme();
    const isDarkMode = theme.palette.mode === "dark";
    const handlers = useContext(ToolbarContext);

    if (!handlers) {
        throw new Error("ButtonGroup must be used within a ToolbarProvider");
    }

    const themeConfig = buttonConfig(isDarkMode ? "dark" : "light");

    const renderButton = useCallback(
        (item: string, index: number) => {
            if (item === "divider") {
                return <DividerMui key={`divider-${index}`} orientation={orientation === "horizontal" ? "vertical" : "horizontal"} flexItem />;
            }

            const btn = buttonDefinitions.find((btn) => btn.title === item);
            if (!btn) return null;

            const { title, icon: Icon, handlerKey } = btn;

            const handleClick = () => {
                if (title === "Set Bold") {
                    handlers.onClickSetBold();
                } else if (title === "Set Italic") {
                    handlers.onClickSetItalic();
                } else if (title === "Set Code") {
                    handlers.onClickSetCode();
                } else {
                    handlers[handlerKey]?.();
                }
            };

            return (
                <TooltipMui key={title} title={title} placement={tooltipPlacement} arrow={tooltipArrow}>
                    <IconButtonMui
                        onClick={handleClick}
                        disabled={!handlers[handlerKey] && !["Set Bold", "Set Italic", "Set Code"].includes(title)}
                        sx={{
                            borderRadius: 0,
                            "&:hover": themeConfig.hoverStyle,
                            "& .MuiTouchRipple-root .MuiTouchRipple-child": {
                                borderRadius: 0,
                            },
                        }}
                    >
                        <Icon size={iconSize} />
                    </IconButtonMui>
                </TooltipMui>
            );
        },
        [orientation, tooltipPlacement, tooltipArrow, handlers, themeConfig.hoverStyle, iconSize]
    );

    const buttonsToRender = visibleButtons && visibleButtons.length > 0 ? visibleButtons : defaultVisibleButtons;

    return (
        <BoxMui
            component={isDarkMode ? PaperMui : "div"}
            sx={{
                display: "flex",
                alignItems: "center",
                border: 1,
                borderRadius: 1,
                maxWidth: "max-content",
                ...(orientation === "vertical" ? { marginRight: 2 } : { marginBottom: 2 }),
                borderColor: themeConfig.borderColor,
                "& svg": {
                    m: iconMargin,
                    ...themeConfig.svgStyle,
                },
                "& .MuiDivider-root": {
                    borderColor: themeConfig.borderColor,
                    ...(orientation === "horizontal" ? { mx: dividerMargin } : { my: dividerMargin }),
                },
            }}
        >
            <ButtonGroupMui orientation={orientation}>{buttonsToRender.map(renderButton)}</ButtonGroupMui>
        </BoxMui>
    );
};

export default ButtonGroup;
