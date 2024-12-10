/**
 * @fileoverview Provides styles for header cells based on theme mode and selection state.
 */

import { useTheme } from "@mui/material";
import { HeaderCellStylesParams } from "../types";

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
            color: "#BEBFC0",
            backgroundColor: isSelected || isHovered ? "#686868" : isHighlighted ? "#515151" : "#414547",
            borderRight: "1px solid #686868",
            borderBottom: "1px solid #686868",
            "&:hover": { backgroundColor: "#686868" },
        };
    }

    return {
        ...baseStyles,
        color: "rgba(0, 0, 0, 0.54)",
        backgroundColor: isSelected || isHovered ? "#e0e0e0" : isHighlighted ? "#e0e0e0" : "#f0f0f0",
        borderRight: "1px solid #e0e0e0",
        "&:hover": { backgroundColor: "#e0e0e0" },
    };
}
