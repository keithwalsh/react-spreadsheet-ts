/**
 * @fileoverview Utility functions for creating consistent menu props across
 * different header cell types.
 */

import { CreateMenuProps, MenuActionConfig, RowNumberCellProps, ColumnHeaderCellProps } from "../types";

export const createMenuProps = <T extends "row" | "column">({
    props,
    index,
    type,
}: CreateMenuProps<T>): T extends "row" ? MenuActionConfig["row"]["props"] : MenuActionConfig["column"]["props"] => {
    if (type === "row") {
        const rowProps = props as RowNumberCellProps;
        return {
            onAddAbove: () => rowProps.onAddAbove(index),
            onAddBelow: () => rowProps.onAddBelow(index),
            onRemove: () => rowProps.onRemove(index),
        } as T extends "row" ? MenuActionConfig["row"]["props"] : MenuActionConfig["column"]["props"];
    } else {
        const colProps = props as ColumnHeaderCellProps;
        return {
            onAddLeft: () => colProps.onAddColumnLeft(index),
            onAddRight: () => colProps.onAddColumnRight(index),
            onRemove: () => colProps.onRemoveColumn(index),
        } as T extends "row" ? MenuActionConfig["row"]["props"] : MenuActionConfig["column"]["props"];
    }
};
