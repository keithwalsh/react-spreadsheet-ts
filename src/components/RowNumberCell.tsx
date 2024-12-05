/**
 * @fileoverview Row number cell component for spreadsheet. Displays row numbers and
 * handles row selection through click and drag interactions.
 */

import { TableCell as TableCellMui, useTheme } from "@mui/material"
import { RowNumberCellProps } from "../types"

export function RowNumberCell({ 
    children, 
    className, 
    onClick, 
    selectedRows, 
    rowIndex, 
    onDragStart, 
    onDragEnter, 
    onDragEnd 
}: RowNumberCellProps) {
    const theme = useTheme()
    const isDarkMode = theme.palette.mode === 'dark'
    const isSelected = selectedRows?.includes(rowIndex)

    const lightThemeStyles = {
        color: "rgba(0, 0, 0, 0.54)",
        backgroundColor: isSelected ? "#e0e0e0" : "#f0f0f0",
        borderRight: "1px solid #e0e0e0",
        "&:hover": { backgroundColor: "#e0e0e0" }
    }

    const darkThemeStyles = {
        color: "#BEBFC0",
        backgroundColor: isSelected ? "#686868" : "#414547",
        borderBottom: "1px solid #686868",
        borderRight: "1px solid #686868",
        "&:hover": { backgroundColor: "#686868" }
    }

    return (
        <TableCellMui
            sx={{
                ...(isDarkMode ? darkThemeStyles : lightThemeStyles),
                cursor: "pointer",
                userSelect: "none",
                textAlign: "center",
                padding: "2px",
                width: "1px"
            }}
            className={className}
            onClick={onClick}
            onMouseDown={() => onDragStart(rowIndex)}
            onMouseEnter={() => onDragEnter(rowIndex)}
            onMouseUp={onDragEnd}
        >
            {children}
        </TableCellMui>
    )
}

export default RowNumberCell
