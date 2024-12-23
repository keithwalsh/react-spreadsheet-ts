/**
 * @file src/components/ColumnHeaderCell.tsx
 * @fileoverview Implements the column header cell using the generic HeaderCell component.
 */

import { useAtom } from "jotai";
import { 
    HeaderCellProps,
    DragHandlers, 
    SpreadsheetDirection,
    ColumnMenuProps 
} from "../types";
import { createMenuProps, getColumnLabel } from "../utils";
import { ColumnContextMenu, HeaderCell } from "./";

export const ColumnHeaderCell = ({ 
    atom: spreadsheetAtom, 
    index, 
    ...props 
}: HeaderCellProps<SpreadsheetDirection.COLUMN> & DragHandlers) => {
    const [state] = useAtom(spreadsheetAtom);

    const isSelected = state.selection.columns.includes(index) || 
                      state.selection.activeCell?.colIndex === index || 
                      state.selection.cells.some((row: boolean[]) => row[index]);

    const menuProps = createMenuProps({
        props: { ...props, atom: spreadsheetAtom, index },
        index,
        type: SpreadsheetDirection.COLUMN,
    });

    return (
        <HeaderCell<SpreadsheetDirection.COLUMN>
            type={SpreadsheetDirection.COLUMN}
            atom={spreadsheetAtom}
            index={index}
            isHighlighted={false}
            isSelected={isSelected}
            ContextMenu={ColumnContextMenu}
            menuProps={menuProps as ColumnMenuProps}
            renderContent={getColumnLabel}
            onDragStart={props.onDragStart}
            onDragEnter={props.onDragEnter}
            onDragEnd={props.onDragEnd}
        />
    );
};

export default ColumnHeaderCell;
