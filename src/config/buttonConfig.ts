// src/config/buttonConfig.ts

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
} from "react-icons/ri";
import { ButtonDefinition } from "../types";

export const buttonConfig = (theme: string) => ({
    borderColor: theme === "light" ? "divider" : "#686868",
    svgStyle: theme === "light" ? {} : { color: "#BEBFC0" },
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
    "divider",
    "Add Row",
    "Remove Row",
    "Add Column",
    "Remove Column",
];

export const buttonDefinitions: ButtonDefinition[] = [
    { title: "Undo", icon: LuUndo2, handlerKey: "onClickUndo" },
    { title: "Redo", icon: LuRedo2, handlerKey: "onClickRedo" },
    { title: "Align Left", icon: RiAlignLeft, handlerKey: "onClickAlignLeft" },
    { title: "Align Center", icon: RiAlignJustify, handlerKey: "onClickAlignCenter" },
    { title: "Align Right", icon: RiAlignRight, handlerKey: "onClickAlignRight" },
    { title: "Set Bold", icon: RiBold, handlerKey: "onClickSetBold" },
    { title: "Set Italic", icon: RiItalic, handlerKey: "onClickSetItalic" },
    { title: "Set Code", icon: RiCodeSSlashFill, handlerKey: "onClickSetCode" },
    { title: "Add Row", icon: RiInsertRowBottom, handlerKey: "onClickAddRow" },
    { title: "Remove Row", icon: RiDeleteRow, handlerKey: "onClickRemoveRow" },
    { title: "Add Column", icon: RiInsertColumnRight, handlerKey: "onClickAddColumn" },
    { title: "Remove Column", icon: RiDeleteColumn, handlerKey: "onClickRemoveColumn" },
];
