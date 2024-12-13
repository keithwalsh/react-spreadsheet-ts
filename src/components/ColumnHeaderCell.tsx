/**
 * @fileoverview Column header cell implementation using the generic HeaderCell component.
 */

import { useAtom } from "jotai";
import { ColumnHeaderCellProps, DragHandlers } from "../types";
import { HeaderCell } from "./HeaderCell";
import ColumnContextMenu from "./ColumnContextMenu";
import { getColumnLabel } from "../utils/columnUtils";

export function ColumnHeaderCell({ atom, index, ...props }: ColumnHeaderCellProps & DragHandlers) {
    const [state] = useAtom(atom);

    const isSelected = state.selectedColumns.includes(index) || state.selectedCell?.col === index || state.selectedCells.some((row: boolean[]) => row[index]);

    return (
        <HeaderCell<"column">
            type="column"
            atom={atom}
            index={index}
            isHighlighted={false}
            isSelected={isSelected}
            ContextMenu={ColumnContextMenu}
            menuProps={{
                onAddLeft: () => props.onAddColumnLeft(index),
                onAddRight: () => props.onAddColumnRight(index),
                onRemove: () => props.onRemoveColumn(index),
            }}
            renderContent={getColumnLabel}
            onDragStart={props.onDragStart}
            onDragEnter={props.onDragEnter}
            onDragEnd={props.onDragEnd}
        />
    );
}
