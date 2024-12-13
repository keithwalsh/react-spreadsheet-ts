import { useMemo } from "react";
import { useAtom } from "jotai";
import { RowNumberCellProps } from "../types";
import { HeaderCell } from "./HeaderCell";
import RowContextMenu from "./RowContextMenu";

export function RowNumberCell({ atom, rowIndex, ...props }: RowNumberCellProps) {
    const [state] = useAtom(atom);

    const isHighlighted = useMemo(
        () => state.selectedCell?.row === rowIndex || (state.selectedCells && state.selectedCells[rowIndex]?.some(Boolean)),
        [state.selectedCell, state.selectedCells, rowIndex]
    );

    const isSelected = useMemo(() => state.selectedRows.includes(rowIndex), [state.selectedRows, rowIndex]);

    return (
        <HeaderCell<"row">
            type="row"
            atom={atom}
            index={rowIndex}
            isHighlighted={isHighlighted}
            isSelected={isSelected}
            ContextMenu={RowContextMenu}
            menuProps={{
                onAddAbove: () => props.onAddAbove(rowIndex),
                onAddBelow: () => props.onAddBelow(rowIndex),
                onRemove: () => props.onRemove(rowIndex),
            }}
            renderContent={(index) => index + 1}
            onDragStart={props.onDragStart}
            onDragEnter={props.onDragEnter}
            onDragEnd={props.onDragEnd}
        />
    );
}

export default RowNumberCell;
