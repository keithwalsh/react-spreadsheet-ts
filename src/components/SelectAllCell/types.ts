import { TableCellProps } from "@mui/material";

export interface SelectAllCellProps extends TableCellProps {
    selectAll: boolean;
    toggleSelectAll: () => void;
    iconSize?: number;
}
