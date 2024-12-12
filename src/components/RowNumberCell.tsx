import { useState, useMemo, MouseEvent } from "react";
import { TableCell } from "@mui/material";
import { useAtom } from "jotai";
import { HeaderCellStylesParams, RowNumberCellProps } from "../types";
import { useHeaderCellStyles } from "../styles";
import RowContextMenu from "./RowContextMenu";

export function RowNumberCell({ atom, rowIndex, onDragStart, onDragEnter, onDragEnd, onAddAbove, onAddBelow, onRemove }: RowNumberCellProps) {
    const [state] = useAtom(atom);
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    const isHighlighted = useMemo(
        () => state.selectedCell?.row === rowIndex || (state.selectedCells && state.selectedCells[rowIndex]?.some(Boolean)),
        [state.selectedCell, state.selectedCells, rowIndex]
    );

    const isSelected = useMemo(() => state.selectedRows.includes(rowIndex), [state.selectedRows, rowIndex]);

    const styles = useHeaderCellStyles({
        isSelected: isSelected || state.selectAll,
        isHighlighted,
        isHovered: false,
    } as HeaderCellStylesParams);

    const handleContextMenu = (event: MouseEvent<HTMLTableCellElement>) => {
        event.preventDefault();
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => setAnchorEl(null);

    return (
        <>
            <TableCell
                sx={styles}
                onContextMenu={handleContextMenu}
                onMouseDown={(e) => {
                    e.preventDefault();
                    onDragStart(rowIndex);
                }}
                onMouseEnter={(e) => {
                    if (state.isDragging) {
                        e.preventDefault();
                        onDragEnter(rowIndex);
                    }
                }}
                onMouseUp={onDragEnd}
                draggable
            >
                {rowIndex + 1}
            </TableCell>
            <RowContextMenu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleCloseMenu}
                onAddAbove={() => {
                    onAddAbove(rowIndex);
                    handleCloseMenu();
                }}
                onAddBelow={() => {
                    onAddBelow(rowIndex);
                    handleCloseMenu();
                }}
                onRemove={() => {
                    onRemove(rowIndex);
                    handleCloseMenu();
                }}
            />
        </>
    );
}

export default RowNumberCell;
