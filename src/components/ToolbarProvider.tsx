import React, { useState, createContext } from 'react';
import { useAtom } from 'jotai';
import { ToolbarContextType } from '../types';
import { createSpreadsheetAtom, createSelectedCellAtom, createSelectedCellsAtom, createSelectedRowsAtom, createSelectedColumnsAtom, createSelectAllAtom } from '../store/atoms';
import LinkModal from './LinkModal';
import { Snackbar } from '@mui/material';

export const ToolbarContext = createContext<ToolbarContextType | undefined>(undefined);

export interface ToolbarProviderProps {
    children: React.ReactNode;
    spreadsheetAtom: ReturnType<typeof createSpreadsheetAtom>;
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
    spreadsheetAtom,
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
    const [showLinkModal, setShowLinkModal] = useState(false);
    const [showSnackbar, setShowSnackbar] = useState(false);
    
    const [selectedCell] = useAtom(createSelectedCellAtom(spreadsheetAtom));
    const [selectedCells] = useAtom(createSelectedCellsAtom(spreadsheetAtom));
    const [selectedRows] = useAtom(createSelectedRowsAtom(spreadsheetAtom));
    const [selectedColumns] = useAtom(createSelectedColumnsAtom(spreadsheetAtom));
    const [selectAll] = useAtom(createSelectAllAtom(spreadsheetAtom));
    const [state, setState] = useAtom(spreadsheetAtom);
    const data = state.data;
    
    const selectedCellData = selectedCell ? data[selectedCell.row]?.[selectedCell.col] : undefined;

    const hasMultipleSelections = () => {
        return selectedRows.length > 0 || 
            selectedColumns.length > 0 || 
            selectAll ||
            selectedCells.some((row: boolean[], rowIndex: number) => 
                row.some((isSelected: boolean, colIndex: number) => 
                    isSelected && data[rowIndex]?.[colIndex]?.value !== ''
                )
            );
    };

    const handleSetLink = () => {
        if (hasMultipleSelections()) {
            setShowSnackbar(true);
            return;
        }
        setShowLinkModal(true);
    };

    const handleLinkSubmit = (url: string | undefined) => {
        if (selectedCell) {
            const { row, col } = selectedCell;
            const newData = [...data];
            if (!newData[row]) newData[row] = [];
            newData[row][col] = { ...newData[row][col], link: url };
            setState({ ...state, data: newData });
        }
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
