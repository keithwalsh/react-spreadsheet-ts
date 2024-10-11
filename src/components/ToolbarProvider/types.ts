export interface ToolbarContextType {
    onClickUndo: () => void;
    onClickRedo: () => void;
    onClickAlignLeft: () => void;
    onClickAlignCenter: () => void;
    onClickAlignRight: () => void;
    onClickAddRow: () => void;
    onClickRemoveRow: () => void;
    onClickAddColumn: () => void;
    onClickRemoveColumn: () => void;
    onClickSetBold: () => void;
    onClickSetItalic: () => void;
    onClickSetCode: () => void;
    setTableSize: (row: number, col: number) => void;
    currentRows: number;
    currentCols: number;
    clearTable: () => void;
    transposeTable: () => void;
}

export interface ToolbarProviderProps extends ToolbarContextType {
    children: React.ReactNode;
}
