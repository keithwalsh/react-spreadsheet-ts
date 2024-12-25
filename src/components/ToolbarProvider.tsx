/**
 * @file src/components/ToolbarProvider.tsx
 * @fileoverview Provides context and handlers for spreadsheet toolbar actions including undo/redo and link management.
 */

// External dependencies
import { useState, createContext, useContext } from "react";
import { useAtom } from "jotai";
import { Snackbar } from "@mui/material";

// Internal project modules
import LinkModal from "./LinkModal";
import { ToolbarContextType, ToolbarProviderProps } from "../types";
import { useTableActions } from "../hooks";
import type { Dimensions, SpreadsheetState } from "../types";

export const ToolbarContext = createContext<ToolbarContextType | null>(null);

export const ToolbarProvider = ({ children, spreadsheetAtom, ...handlers }: ToolbarProviderProps) => {
    const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
    const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [state] = useAtom(spreadsheetAtom);
    const { handleLink: originalHandleLink } = useTableActions(spreadsheetAtom);
    const [activeCell, setActiveCell] = useState<SpreadsheetState["selection"]["activeCell"]>(null);

    const handleLinkModalClose = () => {
        setIsLinkModalOpen(false);
        setActiveCell(null);
    };

    const handleSnackbarClose = () => setIsSnackbarOpen(false);

    const handleSetLink = () => {
        const selectedCell = state.selection.cells.findIndex((row: boolean[], rowIndex: number) => 
            row.findIndex((isSelected: boolean, colIndex: number) => {
                if (isSelected) {
                    setActiveCell({ rowIndex: rowIndex, colIndex: colIndex });
                    return true;
                }
                return false;
            }) !== -1
        );

        if (selectedCell === -1) {
            setSnackbarMessage("Please select exactly one cell to set a link.");
            setIsSnackbarOpen(true);
            return;
        }

        const totalSelectedCells = state.selection.cells.reduce((acc: number, row: boolean[]) => 
            acc + row.filter(Boolean).length, 0
        );

        if (totalSelectedCells !== 1) {
            setSnackbarMessage("Please select exactly one cell to set a link.");
            setIsSnackbarOpen(true);
            return;
        }

        setIsLinkModalOpen(true);
    };

    const handleSubmitLink = (url: string | undefined) => {
        if (!activeCell) {
            setSnackbarMessage("No cell selected.");
            setIsSnackbarOpen(true);
            return;
        }

        try {
            originalHandleLink(url, activeCell);
            setIsLinkModalOpen(false);
            setActiveCell(null);
            setSnackbarMessage(url ? "Link added successfully!" : "Link removed successfully!");
            setIsSnackbarOpen(true);
        } catch (error) {
            setSnackbarMessage("Error setting link");
            setIsSnackbarOpen(true);
        }
    };

    const handleLink = () => {
        if (!activeCell) return;
        originalHandleLink(undefined, activeCell);
    };

    const value: ToolbarContextType = {
        spreadsheetAtom,
        // UI State
        isLinkModalOpen,
        isSnackbarOpen,
        snackbarMessage,
        handleLinkModalClose,
        handleSnackbarClose,
        
        // Table dimensions
        currentRows: handlers.currentRows,
        currentCols: handlers.currentCols,
        setTableSize: (dimensions: Dimensions) => {
            handlers.setTableSize(dimensions.rows, dimensions.cols);
        },
        
        // Row/Column operations
        onClickAddRow: handlers.onClickAddRow,
        onClickAddColumn: handlers.onClickAddColumn,
        onClickRemoveRow: handlers.onClickRemoveRow,
        onClickRemoveColumn: handlers.onClickRemoveColumn,
        
        // Table operations
        clearTable: handlers.clearTable,
        deleteSelected: handlers.deleteSelected,
        transposeTable: handlers.transposeTable,
        onClickCLEAR_TABLE: handlers.clearTable,
        handleCLEAR_TABLE: handlers.clearTable,
        onClickTRANSPOSE_DATA: handlers.transposeTable,
        handleTRANSPOSE_DATA: handlers.transposeTable,
        
        // History handlers with UNDO/REDO enum values
        handleUNDO: handlers.onClickUndo,
        handleREDO: handlers.onClickRedo,
        onClickUNDO: handlers.onClickUndo,
        onClickREDO: handlers.onClickRedo,
        handleUndo: handlers.onClickUndo,
        handleRedo: handlers.onClickRedo,
        onClickUndo: handlers.onClickUndo,
        onClickRedo: handlers.onClickRedo,
        
        // Text formatting handlers
        handleBold: handlers.onClickSetBold,
        handleItalic: handlers.onClickSetItalic,
        handleCode: handlers.onClickSetCode,
        onClickBold: handlers.onClickSetBold,
        onClickItalic: handlers.onClickSetItalic,
        onClickCode: handlers.onClickSetCode,
        onClickLink: handleSetLink,
        onClickSetLink: handleSetLink,
        handleLink,
        
        // Toggle handlers
        handleTOGGLE_BOLD: handlers.onClickSetBold,
        handleTOGGLE_ITALIC: handlers.onClickSetItalic,
        handleTOGGLE_CODE: handlers.onClickSetCode,
        handleTOGGLE_LINK: handleSetLink,
        onClickTOGGLE_BOLD: handlers.onClickSetBold,
        onClickTOGGLE_ITALIC: handlers.onClickSetItalic,
        onClickTOGGLE_CODE: handlers.onClickSetCode,
        onClickTOGGLE_LINK: handleSetLink,
        
        // Alignment handlers
        handleAlignLeft: handlers.onClickAlignLeft,
        handleAlignCenter: handlers.onClickAlignCenter,
        handleAlignRight: handlers.onClickAlignRight,
        onClickAlignLeft: handlers.onClickAlignLeft,
        onClickAlignCenter: handlers.onClickAlignCenter,
        onClickAlignRight: handlers.onClickAlignRight,
        handleLEFT: handlers.onClickAlignLeft,
        handleCENTER: handlers.onClickAlignCenter,
        handleRIGHT: handlers.onClickAlignRight,
        onClickLEFT: handlers.onClickAlignLeft,
        onClickCENTER: handlers.onClickAlignCenter,
        onClickRIGHT: handlers.onClickAlignRight
    };

    return (
        <ToolbarContext.Provider value={value}>
            {children}
            <LinkModal
                open={isLinkModalOpen}
                onClose={handleLinkModalClose}
                onSubmit={handleSubmitLink}
                initialUrl={activeCell ? state.data[activeCell.rowIndex][activeCell.colIndex].link : undefined}
            />
            <Snackbar open={isSnackbarOpen} autoHideDuration={3000} onClose={handleSnackbarClose} message={snackbarMessage} />
        </ToolbarContext.Provider>
    );
};

export const useToolbar = () => {
    const context = useContext(ToolbarContext);
    if (!context) {
        throw new Error("useToolbar must be used within a ToolbarProvider");
    }
    return context;
};