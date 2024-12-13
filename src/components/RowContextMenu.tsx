import React from "react";
import DirectionalContextMenu from "./DirectionalContextMenu";
import { RowContextMenuProps } from "../types";

const RowContextMenu: React.FC<RowContextMenuProps> = ({ anchorEl, open, onClose, onAddAbove, onAddBelow, onRemove }) => (
    <DirectionalContextMenu
        direction="row"
        anchorEl={anchorEl}
        open={open}
        onClose={onClose}
        onAddBefore={onAddAbove}
        onAddAfter={onAddBelow}
        onRemove={onRemove}
    />
);

export default RowContextMenu;
