/**
 * @fileoverview Column context menu wrapper using the shared DirectionalContextMenu
 * component.
 */

import React from "react";
import DirectionalContextMenu from "./DirectionalContextMenu";
import { ColumnContextMenuProps } from "../types";

const ColumnContextMenu: React.FC<ColumnContextMenuProps> = ({ anchorEl, open, onClose, onAddLeft, onAddRight, onRemove }) => (
    <DirectionalContextMenu
        direction="column"
        anchorEl={anchorEl}
        open={open}
        onClose={onClose}
        onAddBefore={onAddLeft}
        onAddAfter={onAddRight}
        onRemove={onRemove}
    />
);

export default ColumnContextMenu;
