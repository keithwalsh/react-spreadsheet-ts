/**
 * @file src/utils/menuUtils.ts
 * @fileoverview Provides utility functions for creating consistent menu props across different header cell types.
 */

import { 
    CreateMenuProps,
    SpreadsheetDirection,
    DirectionalMenuHandlers,
    DirectionalHeaderCellProps
} from "../types";

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
