/**
 * @file src/utils/menuUtils.ts
 * @fileoverview Provides utility functions for creating consistent menu props across different header cell types.
 */

import { 
    ActionConfig, 
    BaseMenuAction,
    CreateMenuProps,
    InsertPosition, 
    ActionType, 
    SpreadsheetDirection,
    DirectionalMenuHandlers,
    DirectionalHeaderCellProps
} from "../types";

/** Configuration for a menu action's key and method names */
export const createActionConfig = (base: BaseMenuAction, position?: InsertPosition): ActionConfig => {
    const actionName = base === ActionType.ADD_ROW || base === ActionType.ADD_COLUMN ? "Add" : "Remove";
    return {
        key: `on${actionName}${position ? position.charAt(0).toUpperCase() + position.slice(1).toLowerCase() : ""}`,
        method: `on${actionName}${position ? (actionName === "Add" ? `Column${position.charAt(0).toUpperCase() + position.slice(1).toLowerCase()}` : "Column") : ""}`,
    };
};

export const createMenuProps = <T extends SpreadsheetDirection>({ 
    props, 
    index, 
    type 
}: CreateMenuProps<T>): DirectionalMenuHandlers<T> => {
    if (type === SpreadsheetDirection.ROW) {
        const rowProps = props as unknown as DirectionalHeaderCellProps<SpreadsheetDirection.ROW>;
        return {
            onAddAbove: () => {
                if (typeof rowProps.onAddAbove === 'function') {
                    rowProps.onAddAbove(index);
                }
            },
            onAddBelow: () => {
                if (typeof rowProps.onAddBelow === 'function') {
                    rowProps.onAddBelow(index);
                }
            },
            onRemove: () => {
                if (typeof rowProps.onRemove === 'function') {
                    rowProps.onRemove(index);
                }
            }
        } as DirectionalMenuHandlers<T>;
    }

    const colProps = props as unknown as DirectionalHeaderCellProps<SpreadsheetDirection.COLUMN>;
    return {
        onAddLeft: () => {
            if (typeof colProps.onAddColumnLeft === 'function') {
                colProps.onAddColumnLeft(index);
            }
        },
        onAddRight: () => {
            if (typeof colProps.onAddColumnRight === 'function') {
                colProps.onAddColumnRight(index);
            }
        },
        onRemove: () => {
            if (typeof colProps.onRemoveColumn === 'function') {
                colProps.onRemoveColumn(index);
            }
        }
    } as DirectionalMenuHandlers<T>;
};
