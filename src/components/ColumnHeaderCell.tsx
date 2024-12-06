/**
 * @fileoverview Renders a column header cell with context menu and drag-and-drop support.
 */

import React from "react";
import TableCell from "@mui/material/TableCell";
import ColumnContextMenu from "./ColumnContextMenu";
import { ColumnHeaderCellProps } from "../types";
import { useHeaderCellStyles } from "../styles"
import { getColumnLabel } from "../utils/columnUtils";
import { useDragSelection } from "../hooks/useDragSelection";
import { RootState } from "../store";
import { useAppSelector } from "../store/hooks";

export function ColumnHeaderCell({
  index,
  handleColumnSelection,
  selectedColumns,
  onAddColumnLeft,
  onAddColumnRight,
  onRemoveColumn,
}: ColumnHeaderCellProps) {
  const isSelected = selectedColumns?.includes(index) ?? false;
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [isHovered, setIsHovered] = React.useState(false);
  const [isMouseDown, setIsMouseDown] = React.useState(false);

  const { selectAll, selectedCell, selectedCells } = useAppSelector((state: RootState) => state.spreadsheet);
  
  // Check if any cell in this column is selected
  const isHighlighted = React.useMemo(() => {
    if (selectedCell) {
      return selectedCell.col === index;
    }
    if (selectedCells && selectedCells.length > 0) {
      return selectedCells.some(row => row[index]);
    }
    return false;
  }, [selectedCell, selectedCells, index]);

  const styles = useHeaderCellStyles({ 
    isSelected: isSelected || selectAll, 
    isHovered,
    isHighlighted
  });
  
  const { handleDragStart, handleDragEnter, handleDragEnd, isDragging } = useDragSelection();

  const handleContextMenu = (event: React.MouseEvent<HTMLTableCellElement>) => {
    event.preventDefault();
    setAnchorEl(event.currentTarget);
    handleColumnSelection(index);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsMouseDown(true);
    handleDragStart(-1, index);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (isDragging) {
      handleDragEnter(-1, index);
    }
  };

  const handleMouseUp = () => {
    if (isMouseDown) {
      setIsMouseDown(false);
      handleDragEnd();
    }
  };

  React.useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isMouseDown) {
        setIsMouseDown(false);
        handleDragEnd();
      }
    };

    document.addEventListener('mouseup', handleGlobalMouseUp);
    return () => document.removeEventListener('mouseup', handleGlobalMouseUp);
  }, [isMouseDown, handleDragEnd]);

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
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setIsHovered(false)}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
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