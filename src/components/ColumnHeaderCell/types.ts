export interface ColumnHeaderCellProps {
    index: number;
    handleColumnSelection: (index: number) => void;
    selectedColumns?: Set<number>;
    className?: string;
    onAddColumnLeft: (index: number) => void;
    onAddColumnRight: (index: number) => void;
    onRemoveColumn: (index: number) => void;
}
