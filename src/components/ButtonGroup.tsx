// src/components/toolbar/ButtonGroup.tsx

import React, { createContext, useContext } from "react";
import { Box, IconButton, ButtonGroup as MUIButtonGroup, Tooltip, Divider } from "@mui/material";
import {
    RiAlignLeft,
    RiAlignJustify,
    RiAlignRight,
    RiBold,
    RiItalic,
    RiCodeSSlashFill,
    RiInsertColumnRight,
    RiDeleteColumn,
    RiInsertRowBottom,
    RiDeleteRow,
} from "react-icons/ri";
import { LuUndo2, LuRedo2 } from "react-icons/lu";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { ButtonGroupContextType } from "@types";

// Create the context using the ButtonGroupContextType
const ButtonGroupContext = createContext<ButtonGroupContextType | undefined>(undefined);

// Create a provider for the ButtonGroupContext
interface ButtonGroupProviderProps extends ButtonGroupContextType {
    children: React.ReactNode;
}

export const ButtonGroupProvider: React.FC<ButtonGroupProviderProps> = ({ children, ...handlers }) => (
    <ButtonGroupContext.Provider value={handlers}>{children}</ButtonGroupContext.Provider>
);

interface ButtonGroupProps {
    palletteMode?: "light" | "dark";
    visibleButtons?: (string | "divider")[];
    orientation?: "horizontal" | "vertical";
    marginTop?: number;
    iconSize?: number;
    iconMargin?: number;
    dividerMargin?: number;
    tooltipArrow?: boolean;
    tooltipPlacement?:
        | "bottom-end"
        | "bottom-start"
        | "bottom"
        | "left-end"
        | "left-start"
        | "left"
        | "right-end"
        | "right-start"
        | "right"
        | "top-end"
        | "top-start"
        | "top";
}

const defaultVisibleButtons: (string | "divider")[] = [
    "Undo",
    "Redo",
    "divider",
    "Align Left",
    "Align Center",
    "Align Right",
    "divider",
    "Set Bold",
    "Set Italic",
    "Set Code",
    "divider",
    "Add Row",
    "Remove Row",
    "Add Column",
    "Remove Column",
];

const ButtonGroup: React.FC<ButtonGroupProps> = ({
    palletteMode = "light",
    visibleButtons,
    orientation = "horizontal",
    marginTop = 3,
    iconSize = 20,
    iconMargin = 0.3,
    dividerMargin = 0.5,
    tooltipArrow = true,
    tooltipPlacement = "top",
}) => {
    const theme = createTheme({
        palette: {
            mode: palletteMode,
        },
    });
    const handlers = useContext(ButtonGroupContext);

    if (!handlers) {
        throw new Error("ButtonGroup must be used within a ButtonGroupProvider");
    }

    const allButtons = [
        { title: "Undo", icon: LuUndo2, onClick: handlers.onClickUndo },
        { title: "Redo", icon: LuRedo2, onClick: handlers.onClickRedo },
        { title: "Align Left", icon: RiAlignLeft, onClick: handlers.onClickAlignLeft },
        { title: "Align Center", icon: RiAlignJustify, onClick: handlers.onClickAlignCenter },
        { title: "Align Right", icon: RiAlignRight, onClick: handlers.onClickAlignRight },
        { title: "Set Bold", icon: RiBold, onClick: handlers.onClickSetBold },
        { title: "Set Italic", icon: RiItalic, onClick: handlers.onClickSetItalic },
        { title: "Set Code", icon: RiCodeSSlashFill, onClick: handlers.onClickSetCode },
        { title: "Add Row", icon: RiInsertRowBottom, onClick: handlers.onClickAddRow },
        { title: "Remove Row", icon: RiDeleteRow, onClick: handlers.onClickRemoveRow },
        { title: "Add Column", icon: RiInsertColumnRight, onClick: handlers.onClickAddColumn },
        { title: "Remove Column", icon: RiDeleteColumn, onClick: handlers.onClickRemoveColumn },
    ];

    const buttonsToRender = visibleButtons && visibleButtons.length > 0 ? visibleButtons : defaultVisibleButtons;

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    border: 1,
                    borderColor: "divider",
                    marginTop: marginTop,
                    borderRadius: 1,
                    maxWidth: "max-content",
                    "& svg": { m: iconMargin },
                    "& .MuiDivider-root": {
                        ...(orientation === "horizontal" ? { mx: dividerMargin } : { my: dividerMargin }),
                    },
                }}
            >
                <MUIButtonGroup orientation={orientation}>
                    {buttonsToRender.map((buttonOrDivider, index) => {
                        if (buttonOrDivider === "divider") {
                            return <Divider key={`divider-${index}`} orientation={orientation === "horizontal" ? "vertical" : "horizontal"} flexItem />;
                        } else {
                            const button = allButtons.find((b) => b.title === buttonOrDivider);
                            if (!button) return null;
                            return (
                                <Tooltip key={button.title} title={button.title} placement={tooltipPlacement} arrow={tooltipArrow}>
                                    <IconButton
                                        onClick={button.onClick}
                                        sx={{
                                            borderRadius: 0,
                                            "& .MuiTouchRipple-root .MuiTouchRipple-child": {
                                                borderRadius: 0,
                                            },
                                        }}
                                    >
                                        <button.icon size={iconSize} />
                                    </IconButton>
                                </Tooltip>
                            );
                        }
                    })}
                </MUIButtonGroup>
            </Box>
        </ThemeProvider>
    );
};

export default ButtonGroup;
