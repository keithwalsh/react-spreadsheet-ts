import * as React from "react";
import { TableCell as TableCellMui, useTheme } from "@mui/material";
import ColumnContextMenu from "./ColumnContextMenu";
import { ColumnHeaderCellProps } from "../types";

const ColumnHeaderCell: React.FC<ColumnHeaderCellProps> = ({
    index,
    handleColumnSelection,
    selectedColumns,
    onAddColumnLeft,
    onAddColumnRight,
    onRemoveColumn,
    onDragStart,
    onDragEnter,
    onDragEnd,
}) => {
    const theme = useTheme();
    const isDarkMode = theme.palette.mode === 'dark';
    const isSelected = selectedColumns?.has(index);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [isHovered, setIsHovered] = React.useState(false);

    const lightThemeStyles = {
        color: "rgba(0, 0, 0, 0.54)",
        backgroundColor: isSelected ? "#e0e0e0" : isHovered ? "#f5f5f5" : "#f0f0f0",
        borderRight: "1px solid #e0e0e0",
        "&:hover": { backgroundColor: "#e0e0e0" },
    };

    const darkThemeStyles = {
        color: "#BEBFC0",
        backgroundColor: isSelected ? "#686868" : isHovered ? "#515151" : "#414547",
        borderRight: "1px solid #686868",
        borderBottom: "1px solid #686868",
        "&:hover": { backgroundColor: "#686868" },
    };

    const handleContextMenu = (event: React.MouseEvent<HTMLTableCellElement>) => {
        event.preventDefault();
        setAnchorEl(event.currentTarget);
        handleColumnSelection(index);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const handleAddLeft = () => {
        onAddColumnLeft(index);
        handleCloseMenu();
    };

    const handleAddRight = () => {
        onAddColumnRight(index);
        handleCloseMenu();
    };

    const handleRemove = () => {
        onRemoveColumn(index);
        handleCloseMenu();
    };

    return (
        <>
            <TableCellMui
                sx={{
                    ...(isDarkMode ? darkThemeStyles : lightThemeStyles),
                    cursor: "pointer",
                    userSelect: "none",
                    textAlign: "center",
                    padding: "2px 2px",
                    height: "1px",
                    lineHeight: "1",
                    fontSize: "0.8rem",
                }}
                onClick={() => handleColumnSelection(index)}
                onContextMenu={handleContextMenu}
                onMouseEnter={() => {
                    setIsHovered(true);
                    onDragEnter(index);
                }}
                onMouseLeave={() => setIsHovered(false)}
                onMouseDown={() => onDragStart(index)}
                onMouseUp={onDragEnd}
            >
                {String.fromCharCode(65 + index)}
            </TableCellMui>
            <ColumnContextMenu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleCloseMenu}
                onAddLeft={handleAddLeft}
                onAddRight={handleAddRight}
                onRemove={handleRemove}
            />
        </>
    );
};

export default ColumnHeaderCell;
