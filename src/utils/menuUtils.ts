/**
 * @fileoverview Utility functions for creating consistent menu props across
 * different header cell types.
 */

import { CreateMenuProps, MenuActionConfig, MenuPropsMap } from "../types";

export const createMenuProps = <T extends keyof MenuPropsMap>({ props, index, type }: CreateMenuProps<T>): MenuActionConfig[T]["props"] => {
    const typedProps = props as MenuPropsMap[T]["props"];

    const menuActions = {
        row: {
            add: [
                { key: "onAddAbove", method: "onAddAbove" },
                { key: "onAddBelow", method: "onAddBelow" },
            ],
            remove: { key: "onRemove", method: "onRemove" },
        },
        column: {
            add: [
                { key: "onAddLeft", method: "onAddColumnLeft" },
                { key: "onAddRight", method: "onAddColumnRight" },
            ],
            remove: { key: "onRemove", method: "onRemoveColumn" },
        },
    };

    const actions = type === "row" ? menuActions.row : menuActions.column;

    return {
        ...Object.fromEntries(actions.add.map(({ key, method }) => [key, () => (typedProps as any)[method](index)])),
        onRemove: () => (typedProps as any)[actions.remove.method](index),
    } as MenuActionConfig[T]["props"];
};
