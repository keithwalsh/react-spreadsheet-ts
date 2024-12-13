/**
 * @fileoverview Utility functions for creating consistent menu props across
 * different header cell types.
 */

import { CreateMenuProps, MenuActionConfig, MenuPropsMap, RowNumberCellProps, ColumnHeaderCellProps } from "../types";

export const createMenuProps = <T extends keyof MenuPropsMap>({ props, index, type }: CreateMenuProps<T>): MenuActionConfig[T]["props"] => {
    const typedProps = props as MenuPropsMap[T]["props"];

    if (type === "row") {
        const rowProps = typedProps as RowNumberCellProps;
        return {
            onAddAbove: () => rowProps.onAddAbove(index),
            onAddBelow: () => rowProps.onAddBelow(index),
            onRemove: () => rowProps.onRemove(index),
        } as MenuActionConfig[T]["props"];
    } else {
        const colProps = typedProps as ColumnHeaderCellProps;
        return {
            onAddLeft: () => colProps.onAddColumnLeft(index),
            onAddRight: () => colProps.onAddColumnRight(index),
            onRemove: () => colProps.onRemoveColumn(index),
        } as MenuActionConfig[T]["props"];
    }
};
