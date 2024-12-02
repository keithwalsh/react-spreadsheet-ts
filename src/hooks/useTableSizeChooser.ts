/**
 * @fileoverview Custom hook for managing the table size chooser logic.
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { UseTableSizeChooserProps, UseTableSizeChooserReturn } from '../types';

export function useTableSizeChooser({
  maxRows,
  maxCols,
  currentRows,
  currentCols,
  onSizeSelect,
}: UseTableSizeChooserProps): UseTableSizeChooserReturn {
  const [hoveredRow, setHoveredRow] = useState(0);
  const [hoveredCol, setHoveredCol] = useState(0);
  const [inputRows, setInputRows] = useState(currentRows.toString());
  const [inputCols, setInputCols] = useState(currentCols.toString());
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setInputRows(currentRows.toString());
    setInputCols(currentCols.toString());
  }, [currentRows, currentCols]);

  const handleMouseEnter = useCallback((rowIndex: number, colIndex: number) => {
    setHoveredRow(rowIndex);
    setHoveredCol(colIndex);
    setInputRows((rowIndex + 1).toString());
    setInputCols((colIndex + 1).toString());
  }, []);

  const handleClick = useCallback(() => {
    onSizeSelect(hoveredRow + 1, hoveredCol + 1);
  }, [onSizeSelect, hoveredRow, hoveredCol]);

  const handleInputChange = useCallback(
    (type: 'rows' | 'cols', value: string) => {
      const numValue = parseInt(value, 10);
      if (isNaN(numValue)) return;

      if (type === 'rows') {
        setInputRows(value);
        setHoveredRow(Math.min(numValue - 1, maxRows - 1));
      } else {
        setInputCols(value);
        setHoveredCol(Math.min(numValue - 1, maxCols - 1));
      }
    },
    [maxRows, maxCols]
  );

  const handleInputBlur = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      const rows = Math.max(1, Math.min(parseInt(inputRows, 10), maxRows));
      const cols = Math.max(1, Math.min(parseInt(inputCols, 10), maxCols));
      onSizeSelect(rows, cols);
    }, 200);
  }, [inputRows, inputCols, maxRows, maxCols, onSizeSelect]);

  const handleInputFocus = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  return {
    hoveredRow,
    hoveredCol,
    inputRows,
    inputCols,
    handleMouseEnter,
    handleClick,
    handleInputChange,
    handleInputBlur,
    handleInputFocus,
    setHoveredRow,
    setHoveredCol,
  };
} 