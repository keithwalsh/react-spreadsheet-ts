import { useState, createContext, useContext } from "react";
import { useAtom } from "jotai";
import LinkModal from "./LinkModal";
import { Snackbar } from "@mui/material";
import { ToolbarContextType, ToolbarProviderProps } from "../types";

export const ToolbarContext = createContext<ToolbarContextType | null>(null);

export const ToolbarProvider = ({ children, spreadsheetAtom, ...handlers }: ToolbarProviderProps) => {
    const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
    const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    const [state, setState] = useAtom(spreadsheetAtom);

    const handleLinkModalClose = () => setIsLinkModalOpen(false);
    const handleSnackbarClose = () => setIsSnackbarOpen(false);

    const handleSetLink = () => {
        const selectedCells = state.selectedCells;
        const selectedCell = state.selectedCell;

        if (selectedCells.some((row: boolean[]) => row.some((cell: boolean) => cell)) || !selectedCell) {
            setSnackbarMessage("Cannot set link when multiple cells are selected");
            setIsSnackbarOpen(true);
            return;
        }
        setIsLinkModalOpen(true);
    };

    const handleSubmitLink = (url: string | undefined) => {
        if (state.selectedCell) {
            const { row, col } = state.selectedCell;
            const newData = [...state.data];
            newData[row][col] = { ...newData[row][col], link: url };
            setState({
                ...state,
                data: newData,
                past: [
                    ...state.past,
                    {
                        data: state.data,
                        selectedCell: state.selectedCell,
                        selectedCells: state.selectedCells,
                        selectedRows: state.selectedRows,
                        selectedColumns: state.selectedColumns,
                        isDragging: state.isDragging,
                        selectAll: state.selectAll,
                    },
                ],
                future: [],
            });
        }
        setIsLinkModalOpen(false);
        setSnackbarMessage("Link saved successfully!");
        setIsSnackbarOpen(true);
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
                initialUrl={state.selectedCell ? state.data[state.selectedCell.row][state.selectedCell.col].link : undefined}
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
