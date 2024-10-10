// src/components/ButtonGroup.tsx

import React, { createContext } from "react";
import { ToolbarContextType, ToolbarProviderProps } from "../types";

/**
 * Context for ButtonGroup
 */
export const ToolbarContext = createContext<ToolbarContextType | undefined>(undefined);

/**
 * Provider for ButtonGroupContext
 */
export const ToolbarProvider: React.FC<ToolbarProviderProps> = ({ children, ...handlers }) => (
    <ToolbarContext.Provider value={handlers}>{children}</ToolbarContext.Provider>
);
