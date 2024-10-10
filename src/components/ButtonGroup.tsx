// src/components/ButtonGroup.tsx

import React, { useContext, useCallback } from "react";
import {
    Box as BoxMui,
    IconButton as IconButtonMui,
    ButtonGroup as ButtonGroupMui,
    Tooltip as TooltipMui,
    Divider as DividerMui,
    Paper as PaperMui,
} from "@mui/material";
import { buttonConfig, buttonDefinitions, defaultVisibleButtons } from "../config";
import { ButtonGroupProps } from "../types";
import { ToolbarContext } from "./ToolbarProvider";

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
    const handlers = useContext(ToolbarContext);

    if (!handlers) {
        throw new Error("ButtonGroup must be used within a ToolbarProvider");
    }

    const buttonsToRender = visibleButtons && visibleButtons.length > 0 ? visibleButtons : defaultVisibleButtons;

    const config = buttonConfig(theme);

    const renderButton = useCallback(
        (item: string, index: number) => {
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
        },
        [orientation, tooltipPlacement, tooltipArrow, handlers, config.hoverStyle, iconSize]
    );

    return (
        <BoxMui
            component={theme === "light" ? PaperMui : "div"}
            sx={{
                display: "flex",
                alignItems: "center",
                border: 1,
                borderRadius: 1,
                maxWidth: "max-content",
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
        </BoxMui>
    );
};

export default ButtonGroup;
