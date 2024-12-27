/**
 * @file src/styles/useHeaderCellStyles.ts
 * @fileoverview Provides styles for header cells based on theme mode and selection state.
 */

import { useTheme } from "@mui/material";
import { HeaderCellStylesParams } from "../types";
import { ThemeColors } from "../types/enums";

export function useHeaderCellStyles({ isSelected, isHighlighted = false, isHovered = false }: HeaderCellStylesParams) {
    const theme = useTheme();
    const isDarkMode = theme.palette.mode === "dark";

    const baseStyles = {
        cursor: "pointer",
        userSelect: "none",
        textAlign: "center",
        padding: "2px 2px",
        height: "1px",
        lineHeight: "1",
        fontSize: "0.8rem",
    };

    if (isDarkMode) {
        return {
            ...baseStyles,
            color: ThemeColors.DARK_TEXT,
            backgroundColor: isSelected || isHovered 
                ? ThemeColors.DARK_SELECTED 
                : isHighlighted 
                    ? ThemeColors.DARK_BORDER 
                    : ThemeColors.DARK_BACKGROUND,
            borderRight: `1px solid ${ThemeColors.DARK_BORDER}`,
            borderBottom: `1px solid ${ThemeColors.DARK_BORDER}`,
            "&:hover": { backgroundColor: ThemeColors.DARK_SELECTED },
        };
    }

    return {
        ...baseStyles,
        color: ThemeColors.LIGHT_TEXT,
        backgroundColor: isSelected || isHovered 
            ? ThemeColors.LIGHT_SELECTED 
            : isHighlighted 
                ? ThemeColors.LIGHT_SELECTED 
                : ThemeColors.LIGHT_BACKGROUND,
        borderRight: `1px solid ${ThemeColors.LIGHT_BORDER}`,
        "&:hover": { backgroundColor: ThemeColors.LIGHT_SELECTED },
    };
}
