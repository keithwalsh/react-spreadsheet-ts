/**
 * @file src/contexts/ToolbarContext.tsx
 * @fileoverview Provides context for spreadsheet toolbar actions and state.
 */

import { createContext, useContext } from "react";
import { ToolbarContextType } from "../types";

export const ToolbarContext = createContext<ToolbarContextType | null>(null);

export const useToolbar = () => {
    const context = useContext(ToolbarContext);
    if (!context) {
        throw new Error("useToolbar must be used within a ToolbarProvider");
    }
    return context;
};
