/**
 * @fileoverview Column header cell implementation using the generic HeaderCell component.
 */

import { useAtom } from "jotai";
import { ColumnHeaderCellProps, DragHandlers } from "../types";
import { HeaderCell } from "./HeaderCell";
import ColumnContextMenu from "./ColumnContextMenu";
import { getColumnLabel } from "../utils/columnUtils";
import { createMenuProps } from "../utils/menuUtils";

export const ColumnHeaderCell = ({ atom, index, ...props }: ColumnHeaderCellProps & DragHandlers) => {
    const [state] = useAtom(atom);

    const isSelected = state.selectedColumns.includes(index) || state.selectedCell?.col === index || state.selectedCells.some((row: boolean[]) => row[index]);

    const menuProps = createMenuProps({
        props: { ...props, atom, index },
        index,
        type: "column",
    });

    return (
        <HeaderCell<"column">
            type="column"
            atom={atom}
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
