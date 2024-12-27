/**
 * @file src/components/ButtonGroup.tsx
 * @fileoverview Provides toolbar button group for spreadsheet operations like adding rows/columns, undo/redo, and formatting.
 */

import React, { useCallback } from "react";
import { ButtonGroup as MuiButtonGroup, Divider, IconButton, Paper, Tooltip } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { buttonConfig, buttonDefinitions, defaultVisibleButtons } from "../config";
import { createButtonGroupStyles } from "../styles";
import { ButtonGroupProps, ButtonType, InsertPosition, Orientation, TooltipPlacement } from "../types";
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
    const isDarkMode = theme.palette.mode === "dark";
    const handlers = useToolbar();
    const config = buttonConfig(isDarkMode ? "dark" : "light");
    const styles = createButtonGroupStyles(isDarkMode, config, iconMargin, dividerMargin);

    const handleClickMap: Record<ButtonType, () => Record<string, () => void>> = {
        [ButtonType.TABLE_STRUCTURE]: () => ({
            onClickAddRow: () => handlers.onClickAddRow?.(InsertPosition.ROW_BELOW),
            onClickAddColumn: () => handlers.onClickAddColumn?.(InsertPosition.COL_RIGHT),
            onClickRemoveRow: () => handlers.onClickRemoveRow?.(),
            onClickRemoveColumn: () => handlers.onClickRemoveColumn?.(),
        }),
        [ButtonType.HISTORY]: () => ({
            onClickUndo: () => handlers.onClickUndo?.(),
            onClickRedo: () => handlers.onClickRedo?.(),
        }),
        [ButtonType.ALIGNMENT]: () => ({
            onClickAlignLeft: () => handlers.onClickAlignLeft?.(),
            onClickAlignCenter: () => handlers.onClickAlignCenter?.(),
            onClickAlignRight: () => handlers.onClickAlignRight?.(),
        }),
        [ButtonType.TEXT_FORMATTING]: () => ({
            onClickBold: () => handlers.onClickBold?.(),
            onClickItalic: () => handlers.onClickItalic?.(),
            onClickCode: () => handlers.onClickCode?.(),
            onClickLink: () => handlers.onClickLink?.(),
        }),
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

            const { title, icon: Icon, buttonType, handlerKey } = btn;
            const handleClick = () => {
                const categoryHandlers = handleClickMap[buttonType]();
                const handler = categoryHandlers[handlerKey];
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
        [orientation, tooltipArrow, tooltipPlacement, handleClickMap, styles, iconSize]
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
