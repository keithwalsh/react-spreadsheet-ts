export interface RowNumberCellProps {
    theme?: "light" | "dark";
    children?: React.ReactNode;
    className?: string;
    onClick?: () => void;
    selectedRows?: Set<number>;
    rowIndex: number;
    ref?: React.Ref<HTMLTableRowElement> | null;
}
