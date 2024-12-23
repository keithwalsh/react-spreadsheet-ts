/**
 * @file src/utils/menuUtils.ts
 * @fileoverview Provides utility functions for creating consistent menu props across different header cell types.
 */

import { ActionConfig, BaseMenuAction, CreateMenuProps, MenuActionConfig, MenuTypeConfig, Position, ActionType } from "../types";

const createActionConfig = (base: BaseMenuAction, position?: Position): ActionConfig => {
    const actionName = base === ActionType.ADD_ROW || base === ActionType.ADD_COLUMN ? "Add" : "Remove";
    return {
        key: `on${actionName}${position ? position.charAt(0).toUpperCase() + position.slice(1).toLowerCase() : ""}`,
        method: `on${actionName}${position ? (actionName === "Add" ? `Column${position.charAt(0).toUpperCase() + position.slice(1).toLowerCase()}` : "Column") : ""}`,
    };
};

const menuActions: Record<"row" | "column", MenuTypeConfig> = {
    row: {
        add: [createActionConfig(ActionType.ADD_ROW, Position.ROW_ABOVE), createActionConfig(ActionType.ADD_ROW, Position.ROW_BELOW)],
        remove: createActionConfig(ActionType.REMOVE_ROW),
    },
    column: {
        add: [createActionConfig(ActionType.ADD_COLUMN, Position.COL_LEFT), createActionConfig(ActionType.ADD_COLUMN, Position.COL_RIGHT)],
        remove: createActionConfig(ActionType.REMOVE_COLUMN),
    },
} as const;

export const createMenuProps = <T extends keyof MenuActionConfig>({ props, index, type }: CreateMenuProps<T>) => {
    const actions = menuActions[type];

    return {
        ...Object.fromEntries(
            actions.add.map(({ key, method }) => [
                key,
                () => {
                    const methodFn = props[method as keyof typeof props];
                    if (typeof methodFn === "function") {
                        methodFn(index);
                    }
                },
            ])
        ),
        onRemove: () => {
            const removeFn = props[actions.remove.method as keyof typeof props];
            if (typeof removeFn === "function") {
                removeFn(index);
            }
        },
    } as MenuActionConfig[T]["props"];
};
