/**
 * @fileoverview Modal dialog for creating new spreadsheet tables with configurable
 * dimensions. Validates input ranges and provides immediate feedback.
 */

import React, { useState } from "react";
import { Modal, Box, Typography, Button, TextField, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { NewTableModalProps } from "../types";

interface TableDimensionField {
    label: string;
    value: string;
    max: number;
    setValue: (value: string) => void;
}

export const NewTableModal: React.FC<NewTableModalProps> = ({ open, onClose, onCreateNewTable }) => {
    const [rows, setRows] = useState("");
    const [columns, setColumns] = useState("");

    const dimensionFields: TableDimensionField[] = [
        { label: "Rows", value: rows, max: 500, setValue: setRows },
        { label: "Columns", value: columns, max: 20, setValue: setColumns }
    ];

    const isValidDimension = (value: string, max: number) => {
        const num = parseInt(value, 10);
        return num >= 1 && num <= max;
    };

    const handleCreate = () => {
        const rowsNum = parseInt(rows, 10);
        const columnsNum = parseInt(columns, 10);
        if (isValidDimension(rows, 500) && isValidDimension(columns, 20)) {
            onCreateNewTable(rowsNum, columnsNum);
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 400,
                    bgcolor: "background.paper",
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2,
                }}
            >
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: "absolute",
                        right: 8,
                        top: 8,
                    }}
                >
                    <CloseIcon />
                </IconButton>
                <Typography variant="h6" component="h2" gutterBottom>
                    Create new table
                </Typography>
                <Typography variant="body2" sx={{ mt: 2, mb: 3 }}>
                    Enter table size. Please, remember that the current table contents will be lost.
                </Typography>
                {dimensionFields.map(({ label, value, max, setValue }) => (
                    <TextField
                        key={label}
                        label={label}
                        type="number"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        fullWidth
                        margin="normal"
                        inputProps={{ min: 1, max }}
                        error={value !== "" && !isValidDimension(value, max)}
                        helperText={`Valid range: 1-${max}`}
                    />
                ))}
                <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
                    <Button onClick={onClose} sx={{ mr: 1 }}>
                        Cancel
                    </Button>
                    <Button onClick={handleCreate} variant="contained">
                        Create
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default NewTableModal;