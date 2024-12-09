/**
 * @fileoverview Row number cell component for spreadsheet. Displays row numbers and
 * handles row selection through click and drag interactions.
 */

import { TableCell as TableCellMui } from "@mui/material";
import { RowNumberCellProps } from "../types";
import { useHeaderCellStyles } from "../styles";
import { useState } from "react";
import RowContextMenu from "./RowContextMenu";
import { useAppSelector } from "../store/hooks";
import { RootState } from "../store";

export function RowNumberCell({ children, selectedRows, rowIndex, onDragStart, onDragEnter, onAddAbove, onAddBelow, onRemove }: RowNumberCellProps) {
    const isSelected = selectedRows?.includes(rowIndex) ?? false;
    const [isHovered, setIsHovered] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const { selectAll, selectedCell, selectedCells, isDragging } = useAppSelector((state: RootState) => state.spreadsheet);

    // Check if any cell in this row is selected
    const isHighlighted = selectedCell?.row === rowIndex || (selectedCells && selectedCells[rowIndex]?.some((cell) => cell));

    const styles = useHeaderCellStyles({
        isSelected: isSelected || selectAll,
        isHovered,
        isHighlighted,
    });

    const handleContextMenu = (event: React.MouseEvent<HTMLTableCellElement>) => {
        event.preventDefault();
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        onDragStart(rowIndex);
    };

    const handleMouseEnter = (e: React.MouseEvent) => {
        setIsHovered(true);
        if (isDragging) {
            e.preventDefault();
            onDragEnter(rowIndex);
        }
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    const handleAddAbove = () => {
        onAddAbove();
        handleCloseMenu();
    };

    const handleAddBelow = () => {
        onAddBelow();
        handleCloseMenu();
    };

    const handleRemove = () => {
        onRemove();
        handleCloseMenu();
    };

    return (
        <>
            <TableCellMui
                sx={styles}
                onMouseDown={handleMouseDown}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
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
    );
}

export default RowNumberCell;
