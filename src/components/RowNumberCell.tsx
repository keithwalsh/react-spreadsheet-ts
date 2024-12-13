/**
 * @fileoverview Row number cell implementation using the generic HeaderCell component.
 */

import { useMemo } from "react";
import { useAtom } from "jotai";
import { RowNumberCellProps } from "../types";
import { HeaderCell, RowContextMenu } from "./";
import { createMenuProps } from "../utils";

export const RowNumberCell = ({ atom, rowIndex, ...props }: RowNumberCellProps) => {
    const [state] = useAtom(atom);

    const isHighlighted = useMemo(
        () => state.selectedCell?.row === rowIndex || (state.selectedCells && state.selectedCells[rowIndex]?.some(Boolean)),
        [state.selectedCell, state.selectedCells, rowIndex]
    );

    const isSelected = useMemo(() => state.selectedRows.includes(rowIndex), [state.selectedRows, rowIndex]);

    const menuProps = createMenuProps({
        props: { ...props, atom, rowIndex },
        index: rowIndex,
        type: "row",
    });

    return (
        <HeaderCell<"row">
            type="row"
            atom={atom}
            index={rowIndex}
            isHighlighted={isHighlighted}
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

// Add both named and default exports
export default RowNumberCell;
