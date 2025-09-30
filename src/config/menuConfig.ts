/**
 * @file src/config/menuConfig.ts
 * @fileoverview Defines the menu configuration for the spreadsheet application,
 * including structure and default options for file and table operations.
 */

import React from "react";
import { BorderAll, ClearAll, SwapVert, Save, FolderOpen, Undo, Redo, Delete } from "@mui/icons-material";
import { type MenuConfig } from "mui-menubar";
import { MenuConfigParams } from "../types";

const MENU_TEMPLATE = [
    {
        label: "File",
        items: [
            {
                kind: "action" as const,
                id: "handleNewTable",
                label: "New table",
                icon: React.createElement(FolderOpen),
                shortcut: "Ctrl+N",
            },
            {
                kind: "action" as const,
                id: "onDownloadCSV",
                label: "Download as CSV",
                icon: React.createElement(Save),
                shortcut: "Ctrl+S",
            },
        ],
    },
    {
        label: "Edit",
        items: [
            {
                kind: "action" as const,
                id: "onClickUndo",
                label: "Undo",
                icon: React.createElement(Undo),
                shortcut: "Ctrl+Z",
            },
            {
                kind: "action" as const,
                id: "onClickRedo",
                label: "Redo",
                icon: React.createElement(Redo),
                shortcut: "Ctrl+Y",
            },
            { kind: "divider" as const },
            {
                kind: "action" as const,
                id: "deleteSelected",
                label: "Delete selected",
                icon: React.createElement(Delete),
                shortcut: "Delete",
            },
        ],
    },
    {
        label: "Table",
        items: [
            {
                kind: "submenu" as const,
                id: "setTableSize",
                label: "Set size",
                icon: React.createElement(BorderAll),
                items: [{ kind: "custom" as const }],
            },
            { kind: "divider" as const },
            {
                kind: "action" as const,
                id: "clearTable",
                label: "Clear table",
                icon: React.createElement(ClearAll),
            },
            {
                kind: "action" as const,
                id: "transposeTable",
                label: "Transpose table",
                icon: React.createElement(SwapVert),
            },
        ],
    },
];

export function createMenuConfig({
    handleNewTable,
    onDownloadCSV,
    TableSizeChooser,
    toolbarContext: { deleteSelected, transposeTable, currentRows, currentCols, setTableSize, onClickUndo, onClickRedo, clearTable },
}: MenuConfigParams): MenuConfig[] {
    const handlers = {
        handleNewTable,
        onDownloadCSV,
        onClickUndo,
        onClickRedo,
        deleteSelected,
        clearTable,
        transposeTable,
    } as const;

    const handleSizeSelect = (rows: number, cols: number) => {
        setTableSize({ rows, cols });
    };

    return MENU_TEMPLATE.map((menu) => ({
        ...menu,
        items: menu.items.map((item) =>
            item.kind === "divider"
                ? item
                : item.id === "setTableSize"
                ? {
                      ...item,
                      items: [
                          {
                              kind: "custom" as const,
                              component: React.createElement(TableSizeChooser, {
                                  onSizeSelect: handleSizeSelect,
                                  currentRows,
                                  currentCols,
                              }),
                          },
                      ],
                  }
                : {
                      ...item,
                      action: handlers[item.id as keyof typeof handlers],
                  }
        ),
    })) as MenuConfig[];
}
