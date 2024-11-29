export interface TableSizeChooserProps {
    maxRows?: number;
    maxCols?: number;
    currentRows: number;
    currentCols: number;
    onSizeSelect: (rows: number, cols: number) => void;
}
