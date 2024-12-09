import * as React from "react";
import { TableContainer as TableContainerMui, Table as TableMui, Paper as PaperMui, useTheme } from "@mui/material";
import { TableProps } from "../types";
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { handlePaste } from '../utils/handlePaste'
import { setData } from '../store/spreadsheetSlice'

const Table = React.forwardRef<HTMLTableElement, TableProps>(({ children, className }, ref) => {
    const dispatch = useAppDispatch()
    const state = useAppSelector(state => state.spreadsheet)
    
    const handlePasteEvent = React.useCallback((event: React.ClipboardEvent<HTMLDivElement>) => {
        event.preventDefault()
        const clipboardText = event.clipboardData?.getData('text') || ''
        
        // Extract formatting arrays from current data
        const alignments = state.data.map(row => row.map(cell => cell.alignment || 'left'))
        const bold = state.data.map(row => row.map(cell => cell.bold || false))
        const italic = state.data.map(row => row.map(cell => cell.italic || false))
        const code = state.data.map(row => row.map(cell => cell.code || false))
        
        const result = handlePaste(
            clipboardText,
            state.data,
            state.selectedCell,
            alignments,
            bold,
            italic,
            code
        )
        
        dispatch(setData({
            ...state,
            data: result.newData
        }))
    }, [dispatch, state])

    const theme = useTheme();
    const isDarkMode = theme.palette.mode === 'dark';

    const lightThemeStyles = {
        border: "1px solid #e0e0e0",
    };

    const darkThemeStyles = {
        border: "1px solid #686868",
    };

    const commonStyles = {
        mt: 0,
        width: "auto",
        display: "inline-block",
        backgroundColor: "transparent",
        borderRight: "none",
        borderBottom: "none",
    };

    return (
        <div className={className}>
            <TableContainerMui
                component={!isDarkMode ? PaperMui : "div"}
                sx={{
                    ...(isDarkMode ? darkThemeStyles : lightThemeStyles),
                    ...commonStyles,
                }}
                onPaste={handlePasteEvent}
            >
                <TableMui
                    ref={ref}
                    sx={{
                        "& .MuiTableCell-head": {
                            lineHeight: 0.05,
                        },
                    }}
                >
                    {children}
                </TableMui>
            </TableContainerMui>
        </div>
    );
});

Table.displayName = "Table";

export default Table;
