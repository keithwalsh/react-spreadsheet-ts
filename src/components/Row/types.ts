export interface RowProps {
    theme?: "light" | "dark";
    children?: React.ReactNode;
    className?: string;
    ref?: React.Ref<HTMLTableRowElement> | null;
}
