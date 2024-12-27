/**
 * @file src/config/buttonConfig.ts
 * @fileoverview Defines button configurations and groupings for the spreadsheet toolbar
 */

import { LuUndo2, LuRedo2 } from "react-icons/lu";
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
    RiLinkM,
} from "react-icons/ri";
import { ButtonDefinition } from "../types";
import { ButtonType, ThemeColors } from "../types/enums";

export const buttonConfig = (theme: string) => ({
    borderColor: theme === "light" ? ThemeColors.LIGHT_BORDER : ThemeColors.DARK_BORDER,
    svgStyle: theme === "light" ? {} : { color: ThemeColors.DARK_TEXT },
    hoverStyle: theme !== "light" ? { backgroundColor: "#2F353D" } : {},
});

export const defaultVisibleButtons: (string | "divider")[] = [
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
    "Set Link",
    "divider",
    "Add Row",
    "Remove Last Row",
    "Add Column",
    "Remove Last Column",
];

export const buttonDefinitions: ButtonDefinition[] = [
    // History buttons
    { title: "Undo", icon: LuUndo2, buttonType: ButtonType.HISTORY, handlerKey: "onClickUndo" },
    { title: "Redo", icon: LuRedo2, buttonType: ButtonType.HISTORY, handlerKey: "onClickRedo" },
    
    // Alignment buttons
    { title: "Align Left", icon: RiAlignLeft, buttonType: ButtonType.ALIGNMENT, handlerKey: "onClickAlignLeft" },
    { title: "Align Center", icon: RiAlignJustify, buttonType: ButtonType.ALIGNMENT, handlerKey: "onClickAlignCenter" },
    { title: "Align Right", icon: RiAlignRight, buttonType: ButtonType.ALIGNMENT, handlerKey: "onClickAlignRight" },
    
    // Text formatting buttons
    { title: "Set Bold", icon: RiBold, buttonType: ButtonType.TEXT_FORMATTING, handlerKey: "onClickSetBold" },
    { title: "Set Italic", icon: RiItalic, buttonType: ButtonType.TEXT_FORMATTING, handlerKey: "onClickSetItalic" },
    { title: "Set Code", icon: RiCodeSSlashFill, buttonType: ButtonType.TEXT_FORMATTING, handlerKey: "onClickSetCode" },
    { title: "Set Link", icon: RiLinkM, buttonType: ButtonType.TEXT_FORMATTING, handlerKey: "onClickSetLink" },
    
    // Table structure buttons
    { title: "Add Row", icon: RiInsertRowBottom, buttonType: ButtonType.TABLE_STRUCTURE, handlerKey: "onClickAddRow" },
    { title: "Remove Last Row", icon: RiDeleteRow, buttonType: ButtonType.TABLE_STRUCTURE, handlerKey: "onClickRemoveRow" },
    { title: "Add Column", icon: RiInsertColumnRight, buttonType: ButtonType.TABLE_STRUCTURE, handlerKey: "onClickAddColumn" },
    { title: "Remove Last Column", icon: RiDeleteColumn, buttonType: ButtonType.TABLE_STRUCTURE, handlerKey: "onClickRemoveColumn" },
];
