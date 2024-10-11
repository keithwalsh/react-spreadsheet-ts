export interface TableProps {
    theme?: "light" | "dark";
    children?: React.ReactNode;
    className?: string;
    onPaste?: (event: React.ClipboardEvent<HTMLDivElement>) => void;
    style?: React.CSSProperties;
}
