import React, { createContext } from "react";
import { ToolbarContextType, ToolbarProviderProps } from "./types";

export const ToolbarContext = createContext<ToolbarContextType | undefined>(undefined);

export const ToolbarProvider: React.FC<ToolbarProviderProps> = ({ children, ...handlers }) => {
    const contextValue: ToolbarContextType = {
        ...handlers,
        onClickSetBold: () => handlers.onClickSetBold(),
        onClickSetItalic: () => handlers.onClickSetItalic(),
        onClickSetCode: () => handlers.onClickSetCode(),
    };

    return <ToolbarContext.Provider value={contextValue}>{children}</ToolbarContext.Provider>;
};
