/**
 * @fileoverview Toolbar button group component providing spreadsheet operation controls
 * like adding rows/columns, undo/redo, and formatting.
 */

import React, { useCallback } from "react";
import { IconButton, ButtonGroup as MuiButtonGroup, Tooltip, Divider, Paper } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { buttonConfig, buttonDefinitions, defaultVisibleButtons } from "../config";
import { createButtonGroupStyles } from "../styles";
import { ButtonGroupProps, Orientation, TooltipPlacement, InsertPosition, ToolbarContextType } from "../types";
import { useToolbar } from "./ToolbarProvider";

const ButtonGroup: React.FC<ButtonGroupProps> = ({
    visibleButtons = defaultVisibleButtons,
    orientation = Orientation.HORIZONTAL,
    iconSize = 20,
    iconMargin = 0.25,
    dividerMargin = 0.5,
    tooltipArrow = true,
    tooltipPlacement = TooltipPlacement.TOP,
}) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    const handlers = useToolbar();
    const config = buttonConfig(isDark ? "dark" : "light");
    const styles = createButtonGroupStyles(isDark, config, iconMargin, dividerMargin);

    // Map button clicks to their corresponding handlers
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
                        orientation={orientation === Orientation.HORIZONTAL ? "vertical" : "horizontal"}
                        flexItem
                        sx={styles.divider(orientation.toLowerCase() as "horizontal" | "vertical")}
                    />
                );
            }

            const btn = buttonDefinitions.find((b) => b.title === item);
            if (!btn) return null;

            const { title, icon: Icon, handlerKey } = btn;
            const handleClick = () => {
                const handler = handleClickMap[handlerKey] || handlers[handlerKey as keyof ToolbarContextType];
                if (typeof handler === 'function') {
                    handler();
                }
            };

            return (
                <Tooltip 
                    key={title} 
                    title={title} 
                    arrow={tooltipArrow} 
                    placement={tooltipPlacement.toLowerCase() as "top" | "bottom" | "left" | "right"}
                >
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
            <MuiButtonGroup 
                orientation={orientation === Orientation.HORIZONTAL ? "horizontal" : "vertical"} 
                sx={styles.buttonGroup}
            >
                {visibleButtons.map(renderButton)}
            </MuiButtonGroup>
        </Paper>
    );
};

export default ButtonGroup;
