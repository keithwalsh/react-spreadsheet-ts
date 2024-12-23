/**
 * @file src/components/ColumnHeaderCell.tsx
 * @fileoverview Implements the column header cell using the generic HeaderCell component.
 */

import { useAtom } from "jotai";
import { ColumnHeaderCellProps, DragHandlers } from "../types";
import { createMenuProps, getColumnLabel } from "../utils";
import { ColumnContextMenu, HeaderCell } from "./";

export const ColumnHeaderCell = ({ spreadsheetAtom, index, ...props }: ColumnHeaderCellProps & DragHandlers) => {
    const [state] = useAtom(spreadsheetAtom);

    const isSelected = state.selection.columns.includes(index) || 
                      state.selection.activeCell?.colIndex === index || 
                      state.selection.cells.some((row: boolean[]) => row[index]);

    const menuProps = createMenuProps({
        props: { ...props, spreadsheetAtom, index },
        index,
        type: "column",
    });

    return (
        <HeaderCell<"column">
            type="column"
            atom={spreadsheetAtom}
            index={index}
            isHighlighted={false}
            isSelected={isSelected}
            ContextMenu={ColumnContextMenu}
            menuProps={menuProps}
            renderContent={getColumnLabel}
            onDragStart={props.onDragStart}
            onDragEnter={props.onDragEnter}
            onDragEnd={props.onDragEnd}
        />
    );
};

export default ColumnHeaderCell;
