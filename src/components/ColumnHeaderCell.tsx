/**
 * @fileoverview Renders a column header cell with context menu and drag-and-drop support.
 */

import React from "react";
import TableCell from "@mui/material/TableCell";
import { useAtom } from "jotai";
import { ColumnHeaderCellProps } from "../types";
import { useHeaderCellStyles } from "../styles";
import { getColumnLabel } from "../utils/columnUtils";
import ColumnContextMenu from "./ColumnContextMenu";

interface DragHandlers {
    onDragStart: (event: React.DragEvent<HTMLTableCellElement>) => void;
    onDragEnter: (event: React.DragEvent<HTMLTableCellElement>) => void;
    onDragEnd: (event: React.DragEvent<HTMLTableCellElement>) => void;
}

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
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [isHovered, setIsHovered] = React.useState(false);

    const isSelected = React.useMemo(() => {
        if (state.selectedColumns.includes(index)) return true;
        if (state.selectedCell?.col === index) return true;
        return state.selectedCells.some((row: boolean[]) => row[index]);
    }, [state.selectedColumns, state.selectedCell, state.selectedCells, index]);

    const styles = useHeaderCellStyles({
        isSelected: isSelected || state.selectAll,
        isHighlighted: false,
        isHovered,
    });

    const handleContextMenu = (event: React.MouseEvent<HTMLTableCellElement>) => {
        event.preventDefault();
        setAnchorEl(event.currentTarget);
    };

    const handleDragStart = (e: React.MouseEvent<HTMLTableCellElement>) => {
        e.preventDefault();
        const dragEvent = new DragEvent("dragstart", { bubbles: true });
        onDragStart(dragEvent as unknown as React.DragEvent<HTMLTableCellElement>);
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
            <TableCell
                sx={styles}
                onContextMenu={handleContextMenu}
                onMouseDown={handleDragStart}
                onDragEnter={onDragEnter}
                onMouseLeave={() => setIsHovered(false)}
                onDragEnd={onDragEnd}
                draggable
            >
                {getColumnLabel(index)}
            </TableCell>
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
}

export default ColumnHeaderCell;
