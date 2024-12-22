/**
 * @file src/utils/menuUtils.ts
 * @fileoverview Provides utility functions for creating consistent menu props across different header cell types.
 */

import { CreateMenuProps, MenuActionConfig } from "../types";

type ActionConfig = {
    key: string;
    method: string;
};

type MenuTypeConfig = {
    add: ActionConfig[];
    remove: ActionConfig;
};

type Direction = "Above" | "Below" | "Left" | "Right";
type BaseAction = "Add" | "Remove";

const createActionConfig = (base: BaseAction, direction?: Direction): ActionConfig => ({
    key: `on${base}${direction ?? ""}`,
    method: `on${base}${direction ? (base === "Add" ? `Column${direction}` : "Column") : ""}`,
});

const menuActions: Record<"row" | "column", MenuTypeConfig> = {
    row: {
        add: [createActionConfig("Add", "Above"), createActionConfig("Add", "Below")],
        remove: createActionConfig("Remove"),
    },
    column: {
        add: [createActionConfig("Add", "Left"), createActionConfig("Add", "Right")],
        remove: createActionConfig("Remove"),
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
