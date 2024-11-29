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
} from "@mui/icons-material"
import { MenuConfig } from "mui-menubar"

interface TableSizeChooserProps {
  onSizeSelect: (row: number, col: number) => void
  currentRows: number
  currentCols: number
}

type MenuConfigParams = {
  handleNewTable: () => void
  onDownloadCSV: () => void
  handleSizeSelect: (row: number, col: number) => void
  clearTable: () => void
  transposeTable: () => void
  currentRows: number
  currentCols: number
  TableSizeChooser: React.ComponentType<TableSizeChooserProps>
}

export function createMenuConfig(params: MenuConfigParams): MenuConfig[] {
  const {
    handleNewTable,
    onDownloadCSV,
    handleSizeSelect,
    clearTable,
    transposeTable,
    currentRows,
    currentCols,
    TableSizeChooser
  } = params

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
      label: "Table",
      items: [
        {
          kind: "submenu",
          label: "Set size",
          items: [
            {
              kind: "component",
              component: React.createElement(TableSizeChooser, {
                onSizeSelect: handleSizeSelect,
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