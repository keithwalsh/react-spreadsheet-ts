import { useState, useCallback } from "react";
import { Modal, Box, Typography, Button, TextField, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { NewTableModalProps, TableDimensionInputProps } from "../types";

function TableDimensionInput({ label, value, onChange, max }: TableDimensionInputProps) {
    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        const numValue = parseInt(newValue, 10);
        if (newValue === "" || (numValue >= 1 && numValue <= max)) {
            onChange(newValue);
        }
    }, [onChange, max]);

    return (
        <TextField
            label={label}
            type="number"
            value={value}
            onChange={handleChange}
            fullWidth
            margin="normal"
            inputProps={{ min: 1, max }}
            helperText={`Valid range: 1-${max}`}
        />
    );
}

export function NewTableModal({ open, onClose, onCreateNewTable }: NewTableModalProps) {
    const [rows, setRows] = useState("");
    const [columns, setColumns] = useState("");
    const [error, setError] = useState<string | null>(null);

    const validateAndCreate = useCallback(() => {
        const rowsNum = parseInt(rows, 10);
        const columnsNum = parseInt(columns, 10);

        if (isNaN(rowsNum) || isNaN(columnsNum)) {
            setError("Please enter valid numbers for rows and columns");
            return;
        }

        if (rowsNum < 1 || rowsNum > 500) {
            setError("Rows must be between 1 and 500");
            return;
        }

        if (columnsNum < 1 || columnsNum > 20) {
            setError("Columns must be between 1 and 20");
            return;
        }

        setError(null);
        onCreateNewTable(rowsNum, columnsNum);
        setRows("");
        setColumns("");
    }, [rows, columns, onCreateNewTable]);

    const handleClose = useCallback(() => {
        setError(null);
        setRows("");
        setColumns("");
        onClose();
    }, [onClose]);

    return (
        <Modal open={open} onClose={handleClose}>
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
                    borderRadius: 1,
                }}
            >
                <IconButton
                    onClick={handleClose}
                    sx={{
                        position: "absolute",
                        right: 8,
                        top: 8,
                    }}
                >
                    <CloseIcon />
                </IconButton>
                <Typography variant="h6" component="h2">
                    Create New Table
                </Typography>
                <Typography variant="body2" sx={{ mt: 2, mb: 3 }}>
                    Enter table size. Please, remember that the current table contents will be lost.
                </Typography>
                {error && (
                    <Typography color="error" sx={{ mb: 2 }}>
                        {error}
                    </Typography>
                )}
                <TableDimensionInput
                    label="Rows"
                    value={rows}
                    onChange={setRows}
                    max={500}
                />
                <TableDimensionInput
                    label="Columns"
                    value={columns}
                    onChange={setColumns}
                    max={20}
                />
                <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
                    <Button onClick={handleClose} sx={{ mr: 1 }}>
                        Cancel
                    </Button>
                    <Button onClick={validateAndCreate} variant="contained">
                        Create
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
}

export default NewTableModal;
