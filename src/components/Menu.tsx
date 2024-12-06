/**
 * @fileoverview Unified menu component handling both file and table operations including
 * size adjustment, CSV export, and table manipulations using mui-menubar.
 */

import React, { useContext, useState } from "react"
import { MenuBar } from "mui-menubar"
import { createMenuConfig } from "../config/menuConfig"
import TableSizeChooser from "./TableSizeChooser"
import NewTableModal from "./NewTableModal"
import { TableMenuProps } from "../types"
import { ToolbarContext } from "./ToolbarProvider"

interface ToolbarContextType {
    currentRows: number
    currentCols: number
    setTableSize: (row: number, col: number) => void
    clearTable: () => void
    transposeTable: () => void
    onClickUndo: () => void
    onClickRedo: () => void
    onClickAlignLeft: () => void
    onClickAlignCenter: () => void
    onClickAlignRight: () => void
    onClickAddRow: () => void
    onClickRemoveRow: () => void
    onClickAddColumn: () => void
    onClickRemoveColumn: () => void
    onClickSetBold: () => void
    onClickSetItalic: () => void
    onClickSetCode: () => void
    clearSelected: () => void
}

const defaultContext: ToolbarContextType = {
    currentRows: 0,
    currentCols: 0,
    setTableSize: () => {},
    clearTable: () => {},
    transposeTable: () => {},
    onClickUndo: () => {},
    onClickRedo: () => {},
    onClickAlignLeft: () => {},
    onClickAlignCenter: () => {},
    onClickAlignRight: () => {},
    onClickAddRow: () => {},
    onClickRemoveRow: () => {},
    onClickAddColumn: () => {},
    onClickRemoveColumn: () => {},
    onClickSetBold: () => {},
    onClickSetItalic: () => {},
    onClickSetCode: () => {},
    clearSelected: () => {}
}

export const TableMenu: React.FC<TableMenuProps> = ({ onCreateNewTable, onDownloadCSV }) => {
    const [isNewTableModalOpen, setNewTableModalOpen] = useState(false)
    const handlers = useContext(ToolbarContext) ?? defaultContext
    
    const handleNewTable = () => setNewTableModalOpen(true)
    const handleModalClose = () => setNewTableModalOpen(false)
    
    const handleCreateNewTable = (rows: number, columns: number) => {
        onCreateNewTable(rows, columns)
        setNewTableModalOpen(false)
    }

    const menuConfig = createMenuConfig({
        handleNewTable,
        onDownloadCSV,
        TableSizeChooser,
        toolbarContext: handlers,
        ...handlers
    })

    return (
        <>
            <MenuBar config={menuConfig} />
            <NewTableModal
                open={isNewTableModalOpen}
                onClose={handleModalClose}
                onCreateNewTable={handleCreateNewTable}
            />
        </>
    )
}

export default TableMenu