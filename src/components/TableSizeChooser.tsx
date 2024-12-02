/**
 * @fileoverview Component for choosing the table size.
 */

import { Box, Typography, TextField } from '@mui/material';
import { TableSizeChooserProps } from '../types';
import { useTableSizeChooser } from '../hooks';
import { useTableSizeChooserStyles } from '../styles';

export function TableSizeChooser({
  maxRows = 20,
  maxCols = 20,
  currentRows,
  currentCols,
  onSizeSelect,
}: TableSizeChooserProps) {
  const classes = useTableSizeChooserStyles();
  const {
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
  } = useTableSizeChooser({ maxRows, maxCols, currentRows, currentCols, onSizeSelect });

  return (
    <Box className={classes.container}>
      <Box className={classes.inputGroup}>
        <TextField
          label="Rows"
          value={inputRows}
          onChange={(e) => handleInputChange('rows', e.target.value)}
          onBlur={handleInputBlur}
          onFocus={handleInputFocus}
          type="number"
          InputProps={{ inputProps: { min: 1, max: maxRows } }}
          size="small"
        />
        <Typography variant="h6">x</Typography>
        <TextField
          label="Columns"
          value={inputCols}
          onChange={(e) => handleInputChange('cols', e.target.value)}
          onBlur={handleInputBlur}
          onFocus={handleInputFocus}
          type="number"
          InputProps={{ inputProps: { min: 1, max: maxCols } }}
          size="small"
        />
      </Box>
      <Box
        className={classes.gridContainer}
        onClick={handleClick}
        onMouseLeave={() => {
          setHoveredRow(parseInt(inputRows, 10) - 1);
          setHoveredCol(parseInt(inputCols, 10) - 1);
        }}
      >
        {[...Array(maxRows)].map((_, rowIndex) => (
          <Box key={rowIndex} className={classes.gridRow}>
            {[...Array(maxCols)].map((_, colIndex) => {
              const isActive = rowIndex <= hoveredRow && colIndex <= hoveredCol;
              const isSelected = rowIndex < currentRows && colIndex < currentCols;

              return (
                <Box
                  key={colIndex}
                  className={classes.gridCell}
                  sx={{
                    border: isSelected ? '1px solid #000' : '1px solid #ccc',
                    backgroundColor: isActive
                      ? 'rgba(25, 118, 210, 0.12)'
                      : isSelected
                      ? 'rgba(25, 118, 210, 0.12)'
                      : '#fff',
                  }}
                  onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
                />
              );
            })}
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export default TableSizeChooser
