import { useState } from "react";
import { Modal, Box, Typography, Button, TextField, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { NewTableModalProps, TableDimensionInputProps } from "../types";

function TableDimensionInput({ label, value, onChange, max }: TableDimensionInputProps) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const num = parseInt(e.target.value, 10);
        if (!e.target.value || (num >= 1 && num <= max)) onChange(e.target.value);
    };

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

    const validateAndCreate = () => {
        const rowsNum = parseInt(rows, 10);
        const colsNum = parseInt(columns, 10);

        if (!rowsNum || rowsNum < 1 || rowsNum > 500) return setError("Rows must be between 1 and 500");
        if (!colsNum || colsNum < 1 || colsNum > 20) return setError("Columns must be between 1 and 20");

        setError(null);
        onCreateNewTable(rowsNum, colsNum);
        setRows("");
        setColumns("");
    };

    const handleClose = () => {
        setError(null);
        setRows("");
        setColumns("");
        onClose();
    };

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
                <IconButton onClick={handleClose} sx={{ position: "absolute", right: 8, top: 8 }}>
                    <CloseIcon />
                </IconButton>
                <Typography variant="h6">Create New Table</Typography>
                <Typography variant="body2" sx={{ mt: 2, mb: 3 }}>
                    Enter table size. The current table contents will be lost.
                </Typography>
                {error && (
                    <Typography color="error" sx={{ mb: 2 }}>
                        {error}
                    </Typography>
                )}
                <TableDimensionInput label="Rows" value={rows} onChange={setRows} max={500} />
                <TableDimensionInput label="Columns" value={columns} onChange={setColumns} max={20} />
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
