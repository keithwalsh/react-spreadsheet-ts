import { default as React } from '../../node_modules/react';
import { DirectionalContextMenuProps, BaseMenuProps, DirectionalMenuActions, SpreadsheetDirection } from '../types';
declare const DirectionalContextMenu: React.FC<DirectionalContextMenuProps>;
type WithDirectionalMenuProps<T extends SpreadsheetDirection> = BaseMenuProps & DirectionalMenuActions<T>;
export declare const RowContextMenu: (props: WithDirectionalMenuProps<SpreadsheetDirection.ROW>) => import("react/jsx-runtime").JSX.Element;
export declare const ColumnContextMenu: (props: WithDirectionalMenuProps<SpreadsheetDirection.COLUMN>) => import("react/jsx-runtime").JSX.Element;
export default DirectionalContextMenu;
//# sourceMappingURL=DirectionalContextMenu.d.ts.map