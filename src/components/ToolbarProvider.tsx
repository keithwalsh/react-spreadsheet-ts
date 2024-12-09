import React, { useState, createContext } from 'react';
import { ToolbarContextType } from '../types';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { applyTextFormatting } from '../store/spreadsheetSlice';
import LinkModal from './LinkModal';
import { Snackbar } from '@mui/material';

export const ToolbarContext = createContext<ToolbarContextType | undefined>(undefined);

export interface ToolbarProviderProps {
    children: React.ReactNode;
    onClickUndo: () => void;
    onClickRedo: () => void;
    onClickAlignLeft: () => void;
    onClickAlignCenter: () => void;
    onClickAlignRight: () => void;
    onClickAddRow: () => void;
    onClickRemoveRow: () => void;
    onClickAddColumn: () => void;
    onClickRemoveColumn: () => void;
    onClickSetBold: () => void;
    onClickSetItalic: () => void;
    onClickSetCode: () => void;
    setTableSize: (row: number, col: number) => void;
    currentRows: number;
    currentCols: number;
    clearTable: () => void;
    deleteSelected: () => void;
    transposeTable: () => void;
}

export const ToolbarProvider: React.FC<ToolbarProviderProps> = ({ 
    children,
    onClickUndo,
    onClickRedo,
    onClickAlignLeft,
    onClickAlignCenter,
    onClickAlignRight,
    onClickAddRow,
    onClickRemoveRow,
    onClickAddColumn,
    onClickRemoveColumn,
    onClickSetBold,
    onClickSetItalic,
    onClickSetCode,
    setTableSize,
    currentRows,
    currentCols,
    clearTable,
    deleteSelected,
    transposeTable
}) => {
    const dispatch = useAppDispatch();
    const [showLinkModal, setShowLinkModal] = useState(false);
    const [showSnackbar, setShowSnackbar] = useState(false);
    const { selectedCell, selectedCells, selectedRows, selectedColumns, selectAll, data } = useAppSelector(state => state.spreadsheet);
    const selectedCellData = selectedCell ? data[selectedCell.row]?.[selectedCell.col] : undefined;

    const hasMultipleSelections = () => {
        return selectedRows.length > 0 || 
            selectedColumns.length > 0 || 
            selectAll ||
            selectedCells.some(row => row.some(cell => cell));
    };

    const handleSetLink = () => {
        if (hasMultipleSelections()) {
            setShowSnackbar(true);
            return;
        }
        setShowLinkModal(true);
    };

    const handleLinkSubmit = (url: string | undefined) => {
        dispatch(applyTextFormatting({ operation: 'LINK', payload: url }));
        setShowLinkModal(false);
    };

    const contextValue: ToolbarContextType = {
        onClickUndo,
        onClickRedo,
        onClickAlignLeft,
        onClickAlignCenter,
        onClickAlignRight,
        onClickAddRow,
        onClickRemoveRow,
        onClickAddColumn,
        onClickRemoveColumn,
        onClickSetBold,
        onClickSetItalic,
        onClickSetCode,
        onClickSetLink: handleSetLink,
        setTableSize,
        currentRows,
        currentCols,
        clearTable,
        deleteSelected,
        transposeTable
    };

    return (
        <>
            <ToolbarContext.Provider value={contextValue}>
                {children}
            </ToolbarContext.Provider>
            <LinkModal
                open={showLinkModal}
                onClose={() => setShowLinkModal(false)}
                onSubmit={handleLinkSubmit}
                initialUrl={selectedCellData?.link}
            />
            <Snackbar
                open={showSnackbar}
                autoHideDuration={3000}
                onClose={() => setShowSnackbar(false)}
                message="Cannot set link when multiple cells are selected"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            />
        </>
    );
};
