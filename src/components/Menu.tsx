/**
 * @fileoverview Unified menu component handling both file and table operations including
 * size adjustment, CSV export, and table manipulations using mui-menubar.
 */

import React from "react";
import { MenuBar } from "mui-menubar";
import { createMenuConfig } from "../config/menuConfig";
import { useToolbar } from "./ToolbarProvider";
import { TableSizeChooserProps } from "../types";

const Menu: React.FC<{
    handleNewTable: (rows: number, cols: number) => void;
    onDownloadCSV: () => void;
    TableSizeChooser: React.FC<TableSizeChooserProps>;
}> = ({ handleNewTable, onDownloadCSV, TableSizeChooser }) => {
    const toolbarContext = useToolbar();

    const wrappedHandleNewTable = () => {
        // Default to 5x5 table when called without parameters
        handleNewTable(5, 5);
    };

    const menuConfig = createMenuConfig({
        handleNewTable: wrappedHandleNewTable,
        onDownloadCSV,
        TableSizeChooser,
        toolbarContext,
        ...toolbarContext,
    });

    return <MenuBar config={menuConfig} />;
};

export default Menu;