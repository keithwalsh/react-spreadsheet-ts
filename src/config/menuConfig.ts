/**
 * @fileoverview Menu configuration for the spreadsheet application, defining
 * structure and default options for file and table operations.
 */

import React from "react";
import { BorderAll, ClearAll, SwapVert, Save, FolderOpen, Undo, Redo, Delete } from "@mui/icons-material";
import { MenuConfig } from "mui-menubar";
import { MenuConfigParams } from "../types";

const MENU_TEMPLATE = [
    {
        label: "File",
        items: [
            {
                kind: "action",
                id: "newTable",
                label: "New table",
                icon: React.createElement(FolderOpen),
                shortcut: "Ctrl+N",
            },
            {
                kind: "action",
                id: "downloadCsv",
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
                kind: "action",
                id: "undo",
                label: "Undo",
                icon: React.createElement(Undo),
                shortcut: "Ctrl+Z",
            },
            {
                kind: "action",
                id: "redo",
                label: "Redo",
                icon: React.createElement(Redo),
                shortcut: "Ctrl+Y",
            },
            { kind: "divider" },
            {
                kind: "action",
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
                kind: "submenu",
                id: "setSize",
                label: "Set size",
                icon: React.createElement(BorderAll),
                items: [{ kind: "custom" }],
            },
            { kind: "divider" },
            {
                kind: "action",
                id: "clearTable",
                label: "Clear table",
                icon: React.createElement(ClearAll),
            },
            {
                kind: "action",
                id: "transposeTable",
                label: "Transpose table",
                icon: React.createElement(SwapVert),
            },
        ],
    },
] as const;

export function createMenuConfig(params: MenuConfigParams): MenuConfig[] {
    const { handleNewTable, onDownloadCSV, TableSizeChooser, toolbarContext } = params;
    const { deleteSelected, transposeTable, currentRows, currentCols, setTableSize, onClickUndo, onClickRedo, clearTable } = toolbarContext;

    const actionMap = {
        newTable: handleNewTable,
        downloadCsv: onDownloadCSV,
        undo: onClickUndo,
        redo: onClickRedo,
        deleteSelected: deleteSelected,
        clearTable: clearTable,
        transposeTable: transposeTable,
    };

    return MENU_TEMPLATE.map((menu) => ({
        ...menu,
        items: menu.items.map((item) => {
            if (item.kind === "divider") return item;

            if (item.id === "setSize") {
                return {
                    ...item,
                    items: [
                        {
                            kind: "custom",
                            component: React.createElement(TableSizeChooser, {
                                onSizeSelect: setTableSize,
                                currentRows,
                                currentCols,
                            }),
                        },
                    ],
                };
            }

            return {
                ...item,
                action: actionMap[item.id as keyof typeof actionMap],
            };
        }),
    }));
}
