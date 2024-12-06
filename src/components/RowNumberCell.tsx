/**
 * @fileoverview Row number cell component for spreadsheet. Displays row numbers and
 * handles row selection through click and drag interactions.
 */

import { TableCell as TableCellMui, useTheme } from "@mui/material"
import { RowNumberCellProps } from "../types"
import { useHeaderCellStyles } from "../styles"
import { useState } from "react"
import RowContextMenu from "./RowContextMenu"

export function RowNumberCell({
    children,
    selectedRows,
    rowIndex,
    onDragStart,
    onDragEnter,
    onDragEnd,
    onAddAbove,
    onAddBelow,
    onRemove,
}: RowNumberCellProps) {
    const isSelected = selectedRows?.includes(rowIndex) ?? false
    const [isHovered, setIsHovered] = useState(false)
    const [isMouseDown, setIsMouseDown] = useState(false)
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

    const theme = useTheme()
    const isDarkMode = theme.palette.mode === 'dark'
    const styles = useHeaderCellStyles({ isSelected, isHovered })

    const handleContextMenu = (event: React.MouseEvent<HTMLTableCellElement>) => {
        event.preventDefault()
        setAnchorEl(event.currentTarget)
    }

    const handleCloseMenu = () => {
        setAnchorEl(null)
    }

    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault()
        setIsMouseDown(true)
        onDragStart(rowIndex)
    }

    const handleMouseEnter = () => {
        setIsHovered(true)
        if (isMouseDown) {
            onDragEnter(rowIndex)
        }
    }

    const handleMouseUp = () => {
        if (isMouseDown) {
            setIsMouseDown(false)
            onDragEnd()
        }
    }

    const handleAddAbove = () => {
        onAddAbove()
        handleCloseMenu()
    }

    const handleAddBelow = () => {
        onAddBelow()
        handleCloseMenu()
    }

    const handleRemove = () => {
        onRemove()
        handleCloseMenu()
    }

    return (
        <>
            <TableCellMui
                sx={{
                    ...styles,
                    textAlign: "center",
                    width: "1px",
                    padding: "2px 2px",
                    color: isDarkMode ? "#BEBFC0" : "rgba(0, 0, 0, 0.54)",
                    cursor: "pointer",
                }}
                onMouseDown={handleMouseDown}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={() => setIsHovered(false)}
                onMouseUp={handleMouseUp}
                onContextMenu={handleContextMenu}
            >
                {children}
            </TableCellMui>
            <RowContextMenu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleCloseMenu}
                onAddAbove={handleAddAbove}
                onAddBelow={handleAddBelow}
                onRemove={handleRemove}
            />
        </>
    )
}

export default RowNumberCell
