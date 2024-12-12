/**
 * Configurable toolbar button group with orientation and theme support.
 */

import React, { useCallback } from "react";
import { IconButton, ButtonGroup as MuiButtonGroup, Tooltip, Divider, Paper } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { buttonConfig, buttonDefinitions, defaultVisibleButtons } from "../config";
import { ButtonGroupProps, HandlerMap } from "../types";
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
    const isDark = theme.palette.mode === "dark";
    const handlers = useToolbar();
    const config = buttonConfig(isDark ? "dark" : "light");

    const handleClickMap: Record<string, () => void> = {
        onClickAddRow: () => handlers.onClickAddRow?.("below"),
        onClickAddColumn: () => handlers.onClickAddColumn?.("right"),
    };

    const renderButton = useCallback(
        (item: string, index: number) => {
            if (item === "divider") {
                return (
                    <Divider
                        key={`divider-${index}`}
                        orientation={orientation === "horizontal" ? "vertical" : "horizontal"}
                        flexItem
                        sx={{ margin: dividerMargin, borderColor: config.borderColor }}
                    />
                );
            }

            const btn = buttonDefinitions.find((b) => b.title === item);
            if (!btn) return null;

            const { title, icon: Icon, handlerKey } = btn;
            const handleClick = handleClickMap[handlerKey] || handlers[handlerKey as keyof HandlerMap];

            return (
                <Tooltip key={title} title={title} arrow={tooltipArrow} placement={tooltipPlacement}>
                    <IconButton
                        onClick={handleClick}
                        size="small"
                        sx={{
                            m: iconMargin,
                            color: isDark ? config.svgStyle.color : undefined,
                            "&:hover": isDark ? { backgroundColor: config.hoverStyle.backgroundColor } : {},
                        }}
                    >
                        <Icon size={iconSize} />
                    </IconButton>
                </Tooltip>
            );
        },
        [dividerMargin, handlers, iconMargin, iconSize, isDark, config, orientation, tooltipArrow, tooltipPlacement, handleClickMap]
    );

    return (
        <Paper
            elevation={1}
            sx={{
                display: "inline-flex",
                padding: 0.5,
                borderColor: config.borderColor,
                backgroundColor: isDark ? "#1e1e1e" : undefined,
            }}
        >
            <MuiButtonGroup
                orientation={orientation}
                sx={{
                    "& .MuiDivider-root": { margin: dividerMargin, borderColor: config.borderColor },
                }}
            >
                {visibleButtons.map(renderButton)}
            </MuiButtonGroup>
        </Paper>
    );
};

export default ButtonGroup;
