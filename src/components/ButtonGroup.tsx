// src/components/toolbar/ButtonGroup.tsx

import React, { createContext, useContext } from "react";
import { Box, IconButton, ButtonGroup as MUIButtonGroup, Tooltip, Divider, Paper } from "@mui/material";
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
import { ButtonGroupContextType, ButtonGroupProviderProps, ButtonGroupProps } from "@types";

const ButtonGroupContext = createContext<ButtonGroupContextType | undefined>(undefined);

export const ButtonGroupProvider: React.FC<ButtonGroupProviderProps> = ({ children, ...handlers }) => (
    <ButtonGroupContext.Provider value={handlers}>{children}</ButtonGroupContext.Provider>
);

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
    theme = "light",
    visibleButtons,
    orientation = "horizontal",
    iconSize = 20,
    iconMargin = 0.25,
    dividerMargin = 0.5,
    tooltipArrow = true,
    tooltipPlacement = "top",
}) => {
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
        <Box
            component={theme === "light" ? Paper : "div"}
            sx={{
                display: "flex",
                alignItems: "center",
                border: 1,
                borderRadius: 1,
                maxWidth: "max-content",
                ...(orientation === "horizontal"
                    ? {
                          marginTop: 3,
                      }
                    : {
                          marginTop: 2,
                          marginRight: 2,
                      }),
                ...(theme === "light"
                    ? {
                          borderColor: "divider",
                          "& svg": { m: iconMargin },
                          "& .MuiDivider-root": {
                              ...(orientation === "horizontal" ? { mx: dividerMargin } : { my: dividerMargin }),
                          },
                      }
                    : {
                          borderColor: "#686868",
                          "& svg": { m: iconMargin, color: "#BEBFC0" },
                          "& .MuiDivider-root": {
                              borderColor: "#686868",
                              ...(orientation === "horizontal" ? { mx: dividerMargin } : { my: dividerMargin }),
                          },
                      }),
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
                                        ...(theme === "light"
                                            ? {
                                                  borderRadius: 0,
                                                  "& .MuiTouchRipple-root .MuiTouchRipple-child": {
                                                      borderRadius: 0,
                                                  },
                                              }
                                            : {
                                                  borderRadius: 0,
                                                  "&:hover": { backgroundColor: "#2F353D" },
                                                  "& .MuiTouchRipple-root .MuiTouchRipple-child": {
                                                      borderRadius: 0,
                                                  },
                                              }),
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
    );
};

export default ButtonGroup;
