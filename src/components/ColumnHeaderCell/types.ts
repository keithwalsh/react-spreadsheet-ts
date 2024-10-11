export interface ColumnHeaderCellProps {
    theme?: "light" | "dark";
    index: number;
    handleColumnSelection: (index: number) => void;
    selectedColumns?: Set<number>;
    className?: string;
}
