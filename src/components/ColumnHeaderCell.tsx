import * as React from "react";
import { TableCell } from "@mui/material";

interface Props {
    index: number;
    handleColumnSelection: (colIndex: number) => void;
    className?: string;
}

const ColumnHeaderCell: React.FC<Props> = ({ index, handleColumnSelection, className }) => {
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
                height: "1px",
                lineHeight: "1",
                fontSize: "0.8rem",
                borderRight: "1px solid #e0e0e0",
                "&:hover": {
                    backgroundColor: "#e0e0e0",
                },
            }}
            className={className}
            onClick={() => handleColumnSelection(index)}
        >
            {String.fromCharCode(65 + index)}
        </TableCell>
    );
};

export default ColumnHeaderCell;
