import { TableCellProps } from "@mui/material";

export interface SelectAllCellProps extends TableCellProps {
    theme?: "light" | "dark";
    selectAll: boolean;
    toggleSelectAll: () => void;
    iconSize?: number;
}
