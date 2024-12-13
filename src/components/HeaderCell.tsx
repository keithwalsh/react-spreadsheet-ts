/**
 * @fileoverview Generic header cell component for both row numbers and column headers,
 * providing context menu and drag-drop functionality.
 */

import { useState, MouseEvent } from "react";
import { TableCell } from "@mui/material";
import { useAtom } from "jotai";
import { HeaderCellProps, HeaderCellStylesParams, RowContextMenuProps, ColumnContextMenuProps } from "../types";
import { useHeaderCellStyles } from "../styles";

export function HeaderCell<T extends "row" | "column">({
    atom,
    index,
    isHighlighted,
    isSelected,
    onDragStart,
    onDragEnter,
    onDragEnd,
    ContextMenu,
    menuProps,
    renderContent,
}: HeaderCellProps<T>) {
    const [state] = useAtom(atom);
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [isHovered, setIsHovered] = useState(false);

    const styles = useHeaderCellStyles({
        isSelected: isSelected || state.selectAll,
        isHighlighted,
        isHovered,
    } as HeaderCellStylesParams);

    const handleContextMenu = (event: MouseEvent<HTMLTableCellElement>) => {
        event.preventDefault();
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => setAnchorEl(null);

    const MenuComponent = ContextMenu as (props: RowContextMenuProps | ColumnContextMenuProps) => JSX.Element;

    return (
        <>
            <TableCell
                sx={styles}
                onContextMenu={handleContextMenu}
                onMouseDown={(e) => {
                    e.preventDefault();
                    onDragStart(index);
                }}
                onMouseEnter={(e) => {
                    if (state.isDragging) {
                        e.preventDefault();
                        onDragEnter(index);
                    }
                    setIsHovered(true);
                }}
                onMouseLeave={() => setIsHovered(false)}
                onMouseUp={onDragEnd}
                draggable
            >
                {renderContent(index)}
            </TableCell>
            <MenuComponent anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu} {...menuProps} />
        </>
    );
}

export default HeaderCell;
