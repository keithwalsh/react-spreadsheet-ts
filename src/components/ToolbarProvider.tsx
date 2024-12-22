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
import { useTableActions, useUndoRedo } from "../hooks";
import type { SpreadsheetState } from "../types";

export const ToolbarContext = createContext<ToolbarContextType | null>(null);

export const ToolbarProvider = ({ children, spreadsheetAtom, ...handlers }: ToolbarProviderProps) => {
    const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
    const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [state] = useAtom(spreadsheetAtom);
    const { handleLink } = useTableActions(spreadsheetAtom);
    const [activeCell, setActiveCell] = useState<SpreadsheetState["selection"]["activeCell"]>(null);
    const { handleUndo, handleRedo } = useUndoRedo(spreadsheetAtom);

    const handleLinkModalClose = () => {
        setIsLinkModalOpen(false);
        setActiveCell(null);
    };

    const handleSnackbarClose = () => setIsSnackbarOpen(false);

    const handleSetLink = () => {
        const selectedCell = state.selection.cells.findIndex((row: boolean[], rowIndex: number) => 
            row.findIndex((isSelected: boolean, colIndex: number) => {
                if (isSelected) {
                    setActiveCell({ row: rowIndex, col: colIndex });
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
            handleLink(url, activeCell);
            setIsLinkModalOpen(false);
            setActiveCell(null);
            setSnackbarMessage(url ? "Link added successfully!" : "Link removed successfully!");
            setIsSnackbarOpen(true);
        } catch (error) {
            setSnackbarMessage("Error setting link");
            setIsSnackbarOpen(true);
        }
    };

    const value: ToolbarContextType = {
        spreadsheetAtom,
        ...handlers,
        handleLinkModalClose,
        handleSnackbarClose,
        isLinkModalOpen,
        isSnackbarOpen,
        snackbarMessage,
        onClickSetLink: handleSetLink,
        handleUndo,
        handleRedo,
    };

    return (
        <ToolbarContext.Provider value={value}>
            {children}
            <LinkModal
                open={isLinkModalOpen}
                onClose={handleLinkModalClose}
                onSubmit={handleSubmitLink}
                initialUrl={activeCell ? state.data[activeCell.row][activeCell.col].link : undefined}
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