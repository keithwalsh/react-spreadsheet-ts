/**
 * @fileoverview Unified menu component handling both file and table operations including
 * size adjustment, CSV export, and table manipulations using mui-menubar.
 */

import React, { useContext, useCallback, useState } from "react"
import { MenuBar } from "mui-menubar"
import { createMenuConfig } from "../../config/menuConfig"
import TableSizeChooser from "./TableSizeChooser/TableSizeChooser"
import NewTableModal from "./NewTableModal/NewTableModal"
import { TableMenuProps } from "./types"
import { ToolbarContext } from "../ToolbarProvider/ToolbarProvider"

interface ToolbarContextType {
    currentRows: number
    currentCols: number
    setTableSize: (row: number, col: number) => void
    clearTable: () => void
    transposeTable: () => void
}

const defaultContext: ToolbarContextType = {
    currentRows: 0,
    currentCols: 0,
    setTableSize: () => {},
    clearTable: () => {},
    transposeTable: () => {}
}

export const TableMenu: React.FC<TableMenuProps> = ({ onCreateNewTable, onDownloadCSV }) => {
    const [isNewTableModalOpen, setNewTableModalOpen] = useState(false)
    const handlers = useContext(ToolbarContext) ?? defaultContext
    
    const { currentRows, currentCols } = handlers

    const handleSizeSelect = useCallback(
        (row: number, col: number) => {
            handlers.setTableSize(row, col)
        },
        [handlers]
    )

    const handleNewTable = () => setNewTableModalOpen(true)
    const handleModalClose = () => setNewTableModalOpen(false)
    
    const handleCreateNewTable = (rows: number, columns: number) => {
        onCreateNewTable(rows, columns)
        setNewTableModalOpen(false)
    }

    const menuConfig = createMenuConfig({
        handleNewTable,
        onDownloadCSV,
        handleSizeSelect,
        clearTable: handlers.clearTable,
        transposeTable: handlers.transposeTable,
        currentRows,
        currentCols,
        TableSizeChooser
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
