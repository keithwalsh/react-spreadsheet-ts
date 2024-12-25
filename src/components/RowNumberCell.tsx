/**
 * @file src/components/RowNumberCell.tsx
 * @fileoverview Implements a row number cell using the generic HeaderCell component.
 */

import { useAtom } from "jotai";
import { 
    RowNumberCellProps, 
    DragHandlers, 
    SpreadsheetDirection,
    DirectionalMenuProps
} from "../types";
import { HeaderCell, RowContextMenu } from "./";
import { useState } from "react";

export const RowNumberCell = ({ atom: spreadsheetAtom, rowIndex: index, onAddAbove, onAddBelow, onRemove, ...props }: RowNumberCellProps & DragHandlers) => {
    const [state] = useAtom(spreadsheetAtom);
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    const isSelected = state.selection.rows.includes(index) || 
                      state.selection.activeCell?.rowIndex === index || 
                      (state.selection.cells && state.selection.cells[index]?.some(Boolean));

    const menuProps: DirectionalMenuProps<SpreadsheetDirection.ROW> = {
        anchorEl,
        open: Boolean(anchorEl),
        onClose: () => setAnchorEl(null),
        onAddAbove: () => onAddAbove(index),
        onAddBelow: () => onAddBelow(index),
        onRemove: () => onRemove(index)
    };

    return (
        <HeaderCell<SpreadsheetDirection.ROW>
            type={SpreadsheetDirection.ROW}
            atom={spreadsheetAtom}
            index={index}
            isHighlighted={false}
            isSelected={isSelected}
            ContextMenu={RowContextMenu}
            menuProps={menuProps}
            renderContent={(index) => index + 1}
            onDragStart={props.onDragStart}
            onDragEnter={props.onDragEnter}
            onDragEnd={props.onDragEnd}
        />
    );
};

export default RowNumberCell;
