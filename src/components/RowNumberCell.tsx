/**
 * @fileoverview Row number cell component for spreadsheet. Displays row numbers and
 * handles row selection through click and drag interactions.
 */

import React from "react";
import { TableCell } from "@mui/material";
import { useAtom } from "jotai";
import { PrimitiveAtom } from "jotai";
import { State, HeaderCellStylesParams } from "../types";
import { useHeaderCellStyles } from "../styles";
import RowContextMenu from "./RowContextMenu";

interface RowNumberCellProps {
    atom: PrimitiveAtom<State>;
    rowIndex: number;
    onDragStart: (event: React.DragEvent<HTMLDivElement>) => void;
    onDragEnter: (event: React.DragEvent<HTMLDivElement>) => void;
    onDragEnd: (event: React.DragEvent<HTMLDivElement>) => void;
    onAddAbove: () => void;
    onAddBelow: () => void;
    onRemove: () => void;
}

export function RowNumberCell({ atom, rowIndex, onDragStart, onDragEnter, onDragEnd, onAddAbove, onAddBelow, onRemove }: RowNumberCellProps) {
    const [state] = useAtom(atom);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const isHighlighted = React.useMemo(() => {
        return state.selectedCell?.row === rowIndex || (state.selectedCells && state.selectedCells[rowIndex]?.some((cell) => cell));
    }, [state.selectedCell, state.selectedCells, rowIndex]);

    const isSelected = React.useMemo(() => {
        return state.selectedRows.includes(rowIndex);
    }, [state.selectedRows, rowIndex]);

    const styles = useHeaderCellStyles({
        isSelected: isSelected || state.selectAll,
        isHighlighted,
        isHovered: false,
    } as HeaderCellStylesParams);

    const handleContextMenu = (event: React.MouseEvent<HTMLTableCellElement>) => {
        event.preventDefault();
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        const dragEvent = e.nativeEvent as unknown as React.DragEvent<HTMLDivElement>;
        onDragStart(dragEvent);
    };

    const handleMouseEnter = (e: React.MouseEvent) => {
        if (state.isDragging) {
            e.preventDefault();
            const dragEvent = e.nativeEvent as unknown as React.DragEvent<HTMLDivElement>;
            onDragEnter(dragEvent);
        }
    };

    const handleAddAboveClick = () => {
        onAddAbove();
        handleCloseMenu();
    };

    const handleAddBelowClick = () => {
        onAddBelow();
        handleCloseMenu();
    };

    const handleRemoveClick = () => {
        onRemove();
        handleCloseMenu();
    };

    return (
        <>
            <TableCell
                sx={styles}
                onContextMenu={handleContextMenu}
                onMouseDown={handleMouseDown}
                onMouseEnter={handleMouseEnter}
                onDragEnd={onDragEnd}
                draggable
            >
                {rowIndex + 1}
            </TableCell>
            <RowContextMenu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleCloseMenu}
                onAddAbove={handleAddAboveClick}
                onAddBelow={handleAddBelowClick}
                onRemove={handleRemoveClick}
            />
        </>
    );
}

export default RowNumberCell;
