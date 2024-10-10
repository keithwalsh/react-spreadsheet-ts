// src/components/TableSizeChooser.tsx

import React, { useState } from "react";
import { Box, Typography } from "@mui/material";

interface TableSizeChooserProps {
    maxRows?: number;
    maxCols?: number;
    onSizeSelect: (rows: number, cols: number) => void;
}

const TableSizeChooser: React.FC<TableSizeChooserProps> = ({ maxRows = 10, maxCols = 10, onSizeSelect }) => {
    const [hoveredRow, setHoveredRow] = useState(0);
    const [hoveredCol, setHoveredCol] = useState(0);

    const handleMouseEnter = (rowIndex: number, colIndex: number) => {
        setHoveredRow(rowIndex);
        setHoveredCol(colIndex);
    };

    const handleClick = () => {
        onSizeSelect(hoveredRow + 1, hoveredCol + 1);
    };

    return (
        <Box sx={{ padding: 2, width: "auto" }}>
            {" "}
            {/* Adjusted width */}
            <Typography variant="subtitle1">
                {hoveredCol + 1} x {hoveredRow + 1} Table
            </Typography>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 0.5, // Add spacing between rows
                }}
                onClick={handleClick}
                onMouseLeave={() => {
                    setHoveredRow(0);
                    setHoveredCol(0);
                }}
            >
                {[...Array(maxRows)].map((_, rowIndex) => (
                    <Box
                        key={rowIndex}
                        sx={{
                            display: "flex",
                            gap: 0.5, // Add spacing between columns
                        }}
                    >
                        {[...Array(maxCols)].map((_, colIndex) => (
                            <Box
                                key={colIndex}
                                sx={{
                                    width: 20,
                                    height: 20,
                                    border: "1px solid #ccc",
                                    backgroundColor: rowIndex <= hoveredRow && colIndex <= hoveredCol ? "#DEF" : "#fff",
                                    cursor: "pointer",
                                }}
                                onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
                            />
                        ))}
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default TableSizeChooser;
