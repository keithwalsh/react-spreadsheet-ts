/**
 * @fileoverview Renders a column header cell with context menu and drag-and-drop support.
 */

import React from "react";
import TableCell from "@mui/material/TableCell";
import ColumnContextMenu from "./ColumnContextMenu";
import { ColumnHeaderCellProps } from "../types";
import { useHeaderCellStyles } from "../styles"
import { getColumnLabel } from "../utils/columnUtils";

export function ColumnHeaderCell({
  index,
  handleColumnSelection,
  selectedColumns,
  onAddColumnLeft,
  onAddColumnRight,
  onRemoveColumn,
  onDragStart,
  onDragEnter,
  onDragEnd,
}: ColumnHeaderCellProps) {
  const isSelected = selectedColumns?.has(index) ?? false;
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [isHovered, setIsHovered] = React.useState(false);

  const styles = useHeaderCellStyles({ isSelected, isHovered });

  const handleContextMenu = (event: React.MouseEvent<HTMLTableCellElement>) => {
    event.preventDefault();
    setAnchorEl(event.currentTarget);
    handleColumnSelection(index);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleAddLeft = () => {
    onAddColumnLeft(index);
    handleCloseMenu();
  };

  const handleAddRight = () => {
    onAddColumnRight(index);
    handleCloseMenu();
  };

  const handleRemove = () => {
    onRemoveColumn(index);
    handleCloseMenu();
  };

  return (
    <>
      <TableCell
        sx={styles}
        onClick={() => handleColumnSelection(index)}
        onContextMenu={handleContextMenu}
        onMouseEnter={() => {
          setIsHovered(true);
          onDragEnter(index);
        }}
        onMouseLeave={() => setIsHovered(false)}
        onMouseDown={() => onDragStart(index)}
        onMouseUp={onDragEnd}
      >
        {getColumnLabel(index)}
      </TableCell>
      <ColumnContextMenu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        onAddLeft={handleAddLeft}
        onAddRight={handleAddRight}
        onRemove={handleRemove}
      />
    </>
  );
}

export default ColumnHeaderCell;