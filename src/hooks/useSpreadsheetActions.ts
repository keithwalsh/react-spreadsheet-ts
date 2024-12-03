// hooks/useSpreadsheetActions.ts
import { useCallback } from "react";
import { Alignment, State, CellFormat } from "../types";

const useSpreadsheetActions = (
    dispatch: React.Dispatch<any>,
    handleFormatChange?: (format: CellFormat) => void
) => {
    const handleUndo = useCallback(() => dispatch({ type: "UNDO" }), [dispatch]);
    const handleRedo = useCallback(() => dispatch({ type: "REDO" }), [dispatch]);
    const handleSetBold = useCallback(() => dispatch({ type: "SET_BOLD" }), [dispatch]);
    const handleSetItalic = useCallback(() => dispatch({ type: "SET_ITALIC" }), [dispatch]);
    const handleSetCode = useCallback(() => dispatch({ type: "SET_CODE" }), [dispatch]);
    const handleAddRow = useCallback(() => dispatch({ type: "ADD_ROW" }), [dispatch]);
    const handleRemoveRow = useCallback(() => dispatch({ type: "REMOVE_ROW" }), [dispatch]);
    const handleAddColumn = useCallback(() => {
        dispatch({ type: "ADD_COLUMN", payload: { index: -1, position: "right" } });
    }, [dispatch]);
    const handleRemoveColumn = useCallback(() => {
        dispatch({ type: "REMOVE_COLUMN", payload: { index: -1 } });
    }, [dispatch]);
    const clearSelection = useCallback(() => dispatch({ type: "CLEAR_SELECTION" }), [dispatch]);
    const setAlignment = useCallback((alignment: Alignment, state: State) => {
        if (handleFormatChange && state.selectedCell) {
            const format: CellFormat = {
                bold: state.bold[state.selectedCell.row]?.[state.selectedCell.col] || false,
                italic: state.italic[state.selectedCell.row]?.[state.selectedCell.col] || false,
                code: state.code[state.selectedCell.row]?.[state.selectedCell.col] || false,
                alignment: alignment
            }
            handleFormatChange(format)
        }
        dispatch({ type: "SET_ALIGNMENT", payload: alignment })
    }, [dispatch, handleFormatChange])

    return {
        handleUndo,
        handleRedo,
        handleSetBold,
        handleSetItalic,
        handleSetCode,
        handleAddRow,
        handleRemoveRow,
        handleAddColumn,
        handleRemoveColumn,
        clearSelection,
        setAlignment,
    };
};

export default useSpreadsheetActions;
