import { useState, createContext, useContext } from "react";
import { useAtom } from "jotai";
import LinkModal from "./LinkModal";
import { Snackbar } from "@mui/material";
import { ToolbarContextType, ToolbarProviderProps } from "../types";
import { useSpreadsheetActions } from "../hooks/useTableActions";
import type { State } from "../types";

export const ToolbarContext = createContext<ToolbarContextType | null>(null);

export const ToolbarProvider = ({ children, spreadsheetAtom, ...handlers }: ToolbarProviderProps) => {
    const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
    const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [state] = useAtom(spreadsheetAtom);
    const { handleLink } = useSpreadsheetActions(spreadsheetAtom);
    const [activeCell, setActiveCell] = useState<State["selectedCell"]>(null);

    const handleLinkModalClose = () => {
        setIsLinkModalOpen(false);
        setActiveCell(null);
    };

    const handleSnackbarClose = () => setIsSnackbarOpen(false);

    const handleSetLink = () => {
        const totalSelectedCells = state.selectedCells.flat().filter((cell) => cell).length;

        if (totalSelectedCells !== 1) {
            setSnackbarMessage("Please select exactly one cell to set a link.");
            setIsSnackbarOpen(true);
            return;
        }

        setActiveCell(state.selectedCell);
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
