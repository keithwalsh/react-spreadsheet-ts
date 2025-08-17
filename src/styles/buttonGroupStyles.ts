/**
 * @file src/styles/buttonGroupStyles.ts
 * @fileoverview Defines styles for the ButtonGroup component, supporting both light and dark themes.
 */

interface ButtonConfig {
    borderColor: string;
    svgStyle: { color?: string };
    hoverStyle: { backgroundColor?: string };
}

export const createButtonGroupStyles = (isDark: boolean, config: ButtonConfig, iconMargin: number, dividerMargin: number) => ({
    paper: {
        display: "inline-flex",
        padding: 0.5,
        borderColor: config.borderColor,
        backgroundColor: isDark ? "#1e1e1e" : undefined,
    },
    buttonGroup: {
        "& .MuiDivider-root": {
            margin: dividerMargin,
            borderColor: config.borderColor,
        },
    },
    iconButton: {
        m: iconMargin,
        color: isDark ? config.svgStyle.color : undefined,
        "&:hover": isDark
            ? {
                  backgroundColor: config.hoverStyle.backgroundColor,
              }
            : {},
    },
    divider: (orientation: "horizontal" | "vertical") => ({
        margin: dividerMargin,
        borderColor: config.borderColor,
        ...(orientation === "vertical" ? { height: "auto" } : { width: "auto" }),
    }),
});
