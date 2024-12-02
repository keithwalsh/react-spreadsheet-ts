/**
 * @fileoverview Component for choosing the table size.
 */

import { Box, Typography, TextField } from '@mui/material';
import { TableSizeChooserProps } from '../types';
import { useTableSizeChooser } from '../hooks';
import { useTableSizeChooserStyles } from '../styles';

function renderTextField(label: string, value: string, onChange: (value: string) => void, onBlur: () => void, max: number) {
  return (
    <TextField
      label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      type="number"
      InputProps={{ inputProps: { min: 1, max } }}
      size="small"
    />
  )
}

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
    setHoveredRow,
    setHoveredCol,
  } = useTableSizeChooser({ maxRows, maxCols, currentRows, currentCols, onSizeSelect });

  return (
    <Box className={classes.container}>
      <Box className={classes.inputGroup}>
        {renderTextField("Rows", inputRows, (value) => handleInputChange('rows', value), handleInputBlur, maxRows)}
        <Typography variant="h6">x</Typography>
        {renderTextField("Columns", inputCols, (value) => handleInputChange('cols', value), handleInputBlur, maxCols)}
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
