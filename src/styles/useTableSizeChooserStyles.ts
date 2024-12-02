/**
 * @fileoverview Styles for the TableSizeChooser component.
 */

import { makeStyles } from '@mui/styles';

export const useTableSizeChooserStyles = makeStyles(() => ({
  container: {
    padding: 2,
    width: 'auto',
  },
  inputGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    marginBottom: 2,
  },
  gridContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 0.5,
  },
  gridRow: {
    display: 'flex',
    gap: 0.5,
  },
  gridCell: {
    width: 10,
    height: 10,
    cursor: 'pointer',
  },
})); 