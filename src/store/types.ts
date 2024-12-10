export type TextFormattingOperation = 
    | { operation: "BOLD" | "ITALIC" | "CODE" | "LINK"; payload?: string }
    | { operation: "ALIGN_LEFT" | "ALIGN_CENTER" | "ALIGN_RIGHT" };

export type TableSizePayload = {
    row: number;
    col: number;
    isInitialSetup?: boolean;
};
