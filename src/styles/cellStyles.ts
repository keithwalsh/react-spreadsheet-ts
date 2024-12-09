import { Theme } from '@mui/material';

export const getBackgroundColor = (
    isDarkMode: boolean,
    isColumnSelected: boolean,
    isRowSelected: boolean,
    isMultiSelected: boolean,
    isSingleCellSelected: boolean
) => {
    if (isSingleCellSelected) return isDarkMode ? '#1a237e' : '#e3f2fd';
    if (isMultiSelected) return isDarkMode ? '#283593' : '#bbdefb';
    if (isColumnSelected || isRowSelected) return isDarkMode ? '#1a237e80' : '#e3f2fd80';
    return 'transparent';
};

export const getCellStyles = (
    isDarkMode: boolean,
    theme: Theme,
    isEditing: boolean,
    style?: React.CSSProperties
) => ({
    borderRight: `1px solid ${isDarkMode ? '#686868' : '#e0e0e0'}`,
    borderBottom: `1px solid ${isDarkMode ? '#686868' : '#e0e0e0'}`,
    padding: '4px 8px',
    outline: 'none',
    cursor: 'default',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    userSelect: 'none',
    minWidth: '100px',
    maxWidth: '100%',
    height: '25px',
    fontSize: '14px',
    fontFamily: 'Arial',
    position: 'relative',
    backgroundColor: isDarkMode ? theme.palette.background.paper : '#ffffff',
    color: isDarkMode ? theme.palette.text.primary : '#000000',
    ...(isEditing && {
        whiteSpace: 'normal',
        overflow: 'visible',
        outline: `2px solid ${theme.palette.primary.main}`,
        zIndex: 1
    }),
    ...style
});
