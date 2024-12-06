/**
 * @fileoverview Menu configuration for the spreadsheet application, defining
 * structure and default options for file and table operations.
 */

import React from "react"
import {
  BorderAll,
  ClearAll,
  SwapVert,
  Save,
  FolderOpen,
  Undo,
  Redo,
} from "@mui/icons-material"
import { MenuConfig } from "mui-menubar"
import { ToolbarContextType } from "src/types"

interface TableSizeChooserProps {
  onSizeSelect: (row: number, col: number) => void
  currentRows: number
  currentCols: number
}

interface MenuConfigParams extends ToolbarContextType {
  handleNewTable: () => void
  onDownloadCSV: () => void
  TableSizeChooser: React.ComponentType<TableSizeChooserProps>
  toolbarContext: ToolbarContextType
}

export function createMenuConfig(params: MenuConfigParams): MenuConfig[] {
  const {
        handleNewTable,
        onDownloadCSV,
        TableSizeChooser,
        toolbarContext
  } = params

  const {
    onClickUndo,
    onClickRedo,
    clearTable,
    transposeTable,
    currentRows,
    currentCols,
    setTableSize
} = toolbarContext

  return [
    {
      label: "File",
      items: [
        {
          kind: "action",
          label: "New table...",
          action: handleNewTable,
          icon: React.createElement(FolderOpen)
        },
        {
          kind: "action",
          label: "Download as CSV",
          action: onDownloadCSV,
          icon: React.createElement(Save)
        }
      ]
    },
    {
      label: "Edit",
      items: [
        {
          kind: "action",
          label: "Undo",
          action: onClickUndo,
          icon: React.createElement(Undo),
          shortcut: "Ctrl+Z"
        },
        {
          kind: "action",
          label: "Redo",
          action: onClickRedo,
          icon: React.createElement(Redo),
          shortcut: "Ctrl+Y"
        }
      ]
    },
    {
      label: "Table",
      items: [
        {
          kind: "submenu",
          label: "Set size",
          items: [
            {
              kind: "custom",
              component: React.createElement(TableSizeChooser, {
                onSizeSelect: setTableSize,
                currentRows,
                currentCols
              })
            }
          ],
          icon: React.createElement(BorderAll)
        },
        { kind: "divider" },
        {
          kind: "action",
          label: "Clear table",
          action: clearTable,
          icon: React.createElement(ClearAll)
        },
        {
          kind: "action",
          label: "Transpose table",
          action: transposeTable,
          icon: React.createElement(SwapVert)
        }
      ]
    }
  ]
} 