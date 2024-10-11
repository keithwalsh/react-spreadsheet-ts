// hooks/useSpreadsheetActions.ts
import { useCallback } from "react";
import { Alignment } from "../store/types";

const useSpreadsheetActions = (dispatch: React.Dispatch<any>) => {
    const handleUndo = useCallback(() => dispatch({ type: "UNDO" }), [dispatch]);
    const handleRedo = useCallback(() => dispatch({ type: "REDO" }), [dispatch]);
    const handleSetBold = useCallback(() => dispatch({ type: "SET_BOLD" }), [dispatch]);
    const handleSetItalic = useCallback(() => dispatch({ type: "SET_ITALIC" }), [dispatch]);
    const handleSetCode = useCallback(() => dispatch({ type: "SET_CODE" }), [dispatch]);
    const handleAddRow = useCallback(() => dispatch({ type: "ADD_ROW" }), [dispatch]);
    const handleRemoveRow = useCallback(() => dispatch({ type: "REMOVE_ROW" }), [dispatch]);
    const handleAddColumn = useCallback(() => dispatch({ type: "ADD_COLUMN" }), [dispatch]);
    const handleRemoveColumn = useCallback(() => dispatch({ type: "REMOVE_COLUMN" }), [dispatch]);
    const clearSelection = useCallback(() => dispatch({ type: "CLEAR_SELECTION" }), [dispatch]);
    const setAlignment = useCallback((alignment: Alignment) => dispatch({ type: "SET_ALIGNMENT", payload: alignment }), [dispatch]);

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
