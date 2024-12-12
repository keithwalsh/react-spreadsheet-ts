/**
 * @fileoverview Renders a column header cell with context menu and drag-and-drop support.
 */

import React from "react";
import TableCell from "@mui/material/TableCell";
import { useAtom } from "jotai";
import { ColumnHeaderCellProps, DragHandlers } from "../types";
import { useHeaderCellStyles } from "../styles";
import { getColumnLabel } from "../utils/columnUtils";
import ColumnContextMenu from "./ColumnContextMenu";

export function ColumnHeaderCell({
    atom,
    index,
    onDragStart,
    onDragEnter,
    onDragEnd,
    onAddColumnLeft,
    onAddColumnRight,
    onRemoveColumn,
}: ColumnHeaderCellProps & DragHandlers) {
    const [state] = useAtom(atom);
    const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
    const [isHovered, setIsHovered] = React.useState(false);

    const isSelected = state.selectedColumns.includes(index) || state.selectedCell?.col === index || state.selectedCells.some((row: boolean[]) => row[index]);

    const styles = useHeaderCellStyles({
        isSelected: isSelected || state.selectAll,
        isHighlighted: false,
        isHovered,
    });

    const closeMenu = () => setAnchorEl(null);

    return (
        <>
            <TableCell
                sx={styles}
                onContextMenu={(e) => {
                    e.preventDefault();
                    setAnchorEl(e.currentTarget);
                }}
                onMouseDown={(e) => {
                    e.preventDefault();
                    onDragStart(index);
                }}
                onMouseEnter={(e) => {
                    if (state.isDragging) {
                        e.preventDefault();
                        onDragEnter(index);
                    }
                }}
                onMouseUp={onDragEnd}
                onMouseLeave={() => setIsHovered(false)}
                draggable
            >
                {getColumnLabel(index)}
            </TableCell>
            <ColumnContextMenu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={closeMenu}
                onAddLeft={() => {
                    onAddColumnLeft(index);
                    closeMenu();
                }}
                onAddRight={() => {
                    onAddColumnRight(index);
                    closeMenu();
                }}
                onRemove={() => {
                    onRemoveColumn(index);
                    closeMenu();
                }}
            />
        </>
    );
}

export default ColumnHeaderCell;
