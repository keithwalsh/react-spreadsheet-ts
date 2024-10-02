import * as React from "react";
import { TableCell } from "@mui/material";

interface Props {
    children?: React.ReactNode;
    className?: string;
    onClick?: () => void;
    ref?: React.Ref<HTMLTableRowElement> | null;
}

const RowNumberCell: React.FC<Props> = ({ children, className, onClick, ref }) => {
    return (
        <TableCell
            sx={{
                color: "rgba(0, 0, 0, 0.54)",
                cursor: "pointer",
                userSelect: "none",
                backgroundColor: "#f0f0f0",
                fontWeight: "normal",
                textAlign: "center",
                padding: "2px 2px",
                width: "1px",
                borderRight: "1px solid #e0e0e0",
                "&:hover": {
                    backgroundColor: "#e0e0e0",
                },
            }}
            className={className}
            ref={ref}
            onClick={onClick}
        >
            {children}
        </TableCell>
    );
};

export default RowNumberCell;
