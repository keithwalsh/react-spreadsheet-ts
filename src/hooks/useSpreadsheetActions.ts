// hooks/useSpreadsheetActions.ts
import { useCallback } from "react";
import { useAppDispatch } from '../store/hooks'
import { applyTextFormatting } from '../store/spreadsheetSlice'

const useSpreadsheetActions = () => {
    const dispatch = useAppDispatch()

    const handleSetBold = useCallback(() => 
        dispatch(applyTextFormatting({ operation: "BOLD" })), 
    [dispatch])
    
    const handleSetItalic = useCallback(() => 
        dispatch(applyTextFormatting({ operation: "ITALIC" })), 
    [dispatch])
    
    const handleSetCode = useCallback(() => 
        dispatch(applyTextFormatting({ operation: "CODE" })), 
    [dispatch])

    // ... other actions

    return {
        handleSetBold,
        handleSetItalic,
        handleSetCode,
        // ... other actions
    }
}

export default useSpreadsheetActions
