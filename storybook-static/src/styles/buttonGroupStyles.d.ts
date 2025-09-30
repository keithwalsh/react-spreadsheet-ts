/**
 * @file src/styles/buttonGroupStyles.ts
 * @fileoverview Defines styles for the ButtonGroup component, supporting both light and dark themes.
 */
interface ButtonConfig {
    borderColor: string;
    svgStyle: {
        color?: string;
    };
    hoverStyle: {
        backgroundColor?: string;
    };
}
export declare const createButtonGroupStyles: (isDark: boolean, config: ButtonConfig, iconMargin: number, dividerMargin: number) => {
    paper: {
        display: string;
        padding: number;
        borderColor: string;
        backgroundColor: string | undefined;
    };
    buttonGroup: {
        "& .MuiDivider-root": {
            margin: number;
            borderColor: string;
        };
    };
    iconButton: {
        m: number;
        color: string | undefined;
        "&:hover": {
            backgroundColor: string | undefined;
        } | {
            backgroundColor?: undefined;
        };
    };
    divider: (orientation: "horizontal" | "vertical") => {
        height: string;
        margin: number;
        borderColor: string;
    } | {
        width: string;
        margin: number;
        borderColor: string;
    };
};
export {};
//# sourceMappingURL=buttonGroupStyles.d.ts.map