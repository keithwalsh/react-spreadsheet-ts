/**
 * @fileoverview Toolbar button group component providing spreadsheet operation controls
 * like adding rows/columns, undo/redo, and formatting. Supports customizable button
 * visibility, orientation, icon sizing, and theming.
 */

import React, { useCallback } from "react";
import { IconButton, ButtonGroup as MuiButtonGroup, Tooltip, Divider, Paper } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { buttonConfig, buttonDefinitions, defaultVisibleButtons } from "../config";
import { createButtonGroupStyles } from "../styles";
import { ButtonGroupProps, HandlerMap, InsertPosition } from "../types";
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
    const styles = createButtonGroupStyles(isDark, config, iconMargin, dividerMargin);

    const handleClickMap: Record<string, () => void> = {
        onClickAddRow: () => handlers.onClickAddRow?.(InsertPosition.ROW_BELOW),
        onClickAddColumn: () => handlers.onClickAddColumn?.(InsertPosition.COL_RIGHT),
    };

    const renderButton = useCallback(
        (item: string, index: number) => {
            if (item === "divider") {
                return (
                    <Divider
                        key={`divider-${index}`}
                        orientation={orientation === "horizontal" ? "vertical" : "horizontal"}
                        flexItem
                        sx={styles.divider(orientation)}
                    />
                );
            }

            const btn = buttonDefinitions.find((b) => b.title === item);
            if (!btn) return null;

            const { title, icon: Icon, handlerKey } = btn;
            const handleClick = handleClickMap[handlerKey] || handlers[handlerKey as keyof HandlerMap];

            return (
                <Tooltip key={title} title={title} arrow={tooltipArrow} placement={tooltipPlacement}>
                    <IconButton onClick={handleClick} size="small" sx={styles.iconButton}>
                        <Icon size={iconSize} />
                    </IconButton>
                </Tooltip>
            );
        },
        [dividerMargin, handlers, iconMargin, iconSize, isDark, config, orientation, tooltipArrow, tooltipPlacement, handleClickMap, styles]
    );

    return (
        <Paper elevation={1} sx={styles.paper}>
            <MuiButtonGroup orientation={orientation} sx={styles.buttonGroup}>
                {visibleButtons.map(renderButton)}
            </MuiButtonGroup>
        </Paper>
    );
};

export default ButtonGroup;
