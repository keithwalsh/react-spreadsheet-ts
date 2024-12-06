import React, { createContext } from "react";
import { useAppDispatch } from '../store/hooks'
import { 
    applyTextFormatting,
} from '../store/spreadsheetSlice'
import { ToolbarContextType, ToolbarProviderProps } from "../types";

export const ToolbarContext = createContext<ToolbarContextType | undefined>(undefined);

export const ToolbarProvider: React.FC<ToolbarProviderProps> = ({ children, ...handlers }) => {
    const dispatch = useAppDispatch()

    const contextValue: ToolbarContextType = {
        ...handlers,
        onClickSetBold: () => {
            dispatch(applyTextFormatting({ operation: 'BOLD' }))
        },
        onClickSetItalic: () => {
            dispatch(applyTextFormatting({ operation: 'ITALIC' }))
        },
        onClickSetCode: () => {
            dispatch(applyTextFormatting({ operation: 'CODE' }))
        },
        onClickAlignLeft: () => {
            dispatch(applyTextFormatting({ operation: 'ALIGN_LEFT' }))
        },
        onClickAlignCenter: () => {
            dispatch(applyTextFormatting({ operation: 'ALIGN_CENTER' }))
        },
        onClickAlignRight: () => {
            dispatch(applyTextFormatting({ operation: 'ALIGN_RIGHT' }))
        },
    };

    return <ToolbarContext.Provider value={contextValue}>{children}</ToolbarContext.Provider>;
};
