/**
 * @file src/components/HeaderCell.tsx
 * @fileoverview Provides a generic header cell component for row numbers and column headers,
 * including context menu and drag-and-drop functionality.
 */

import { useState, MouseEvent } from "react";
import { TableCell } from "@mui/material";
import { useAtom } from "jotai";
import { 
    HeaderCellProps, 
    HeaderCellStylesParams, 
    SpreadsheetDirection,
    WithDirectionalMenuProps
} from "../types";
import { useHeaderCellStyles } from "../styles";

export const HeaderCell = <T extends SpreadsheetDirection>({
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
}: HeaderCellProps<T>) => {
    const [state] = useAtom(atom);
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [isHovered, setIsHovered] = useState(false);

    const styles = useHeaderCellStyles({
        isSelected: isSelected || state.selection.isAllSelected,
        isHighlighted,
        isHovered,
    } as HeaderCellStylesParams);

    const handleContextMenu = (event: MouseEvent<HTMLTableCellElement>) => {
        event.preventDefault();
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => setAnchorEl(null);

    // Create menu props with proper typing
    const menuComponentProps = {
        ...menuProps,
        anchorEl,
        open: Boolean(anchorEl),
        onClose: handleCloseMenu,
    } as WithDirectionalMenuProps<T>;

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
                    if (state.selection.dragState?.isDragging) {
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
            {ContextMenu && (
                <ContextMenu {...(menuComponentProps as any)} />
            )}
        </>
    );
};

export default HeaderCell;
