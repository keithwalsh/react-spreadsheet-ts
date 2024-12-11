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
    onDragStart: (rowIndex: number) => void;
    onDragEnter: (rowIndex: number) => void;
    onDragEnd: () => void;
    onAddAbove: (index: number) => void;
    onAddBelow: (index: number) => void;
    onRemove: (index: number) => void;
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
        onDragStart(rowIndex);
    };

    const handleMouseEnter = (e: React.MouseEvent) => {
        if (state.isDragging) {
            e.preventDefault();
            onDragEnter(rowIndex);
        }
    };

    const handleAddAboveClick = () => {
        onAddAbove(rowIndex);
        handleCloseMenu();
    };

    const handleAddBelowClick = () => {
        onAddBelow(rowIndex);
        handleCloseMenu();
    };

    const handleRemoveClick = () => {
        onRemove(rowIndex);
        handleCloseMenu();
    };

    return (
        <>
            <TableCell
                sx={styles}
                onContextMenu={handleContextMenu}
                onMouseDown={handleMouseDown}
                onMouseEnter={handleMouseEnter}
                onMouseUp={onDragEnd}
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
