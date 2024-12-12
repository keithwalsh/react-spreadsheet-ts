/**
 * @fileoverview Modal dialog for creating new tables with customizable dimensions.
 * Validates input and provides immediate feedback.
 */

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
            slotProps={{
                input: {
                    inputProps: { min: 1, max },
                },
            }}
            helperText={`Valid range: 1-${max}`}
        />
    );
}

type Dimensions = {
    rows: string;
    columns: string;
};

const DIMENSION_LIMITS = {
    rows: { min: 1, max: 500 },
    columns: { min: 1, max: 20 },
} as const;

const validateDimensions = ({ rows, columns }: Dimensions): string | null => {
    const rowsNum = parseInt(rows, 10);
    const colsNum = parseInt(columns, 10);

    if (!rowsNum || rowsNum < DIMENSION_LIMITS.rows.min || rowsNum > DIMENSION_LIMITS.rows.max) {
        return `Rows must be between ${DIMENSION_LIMITS.rows.min} and ${DIMENSION_LIMITS.rows.max}`;
    }
    if (!colsNum || colsNum < DIMENSION_LIMITS.columns.min || colsNum > DIMENSION_LIMITS.columns.max) {
        return `Columns must be between ${DIMENSION_LIMITS.columns.min} and ${DIMENSION_LIMITS.columns.max}`;
    }
    return null;
};

const ModalContent = ({ onClose, error, children }: { onClose: () => void; error: string | null; children: React.ReactNode }) => (
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
        <IconButton onClick={onClose} sx={{ position: "absolute", right: 8, top: 8 }}>
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
        {children}
    </Box>
);

export function NewTableModal({ open, onClose, onCreateNewTable }: NewTableModalProps) {
    const [dimensions, setDimensions] = useState<Dimensions>({ rows: "", columns: "" });
    const [error, setError] = useState<string | null>(null);

    const handleCreate = () => {
        const validationError = validateDimensions(dimensions);
        if (validationError) {
            setError(validationError);
            return;
        }

        onCreateNewTable(parseInt(dimensions.rows, 10), parseInt(dimensions.columns, 10));
        handleClose();
    };

    const handleClose = () => {
        setError(null);
        setDimensions({ rows: "", columns: "" });
        onClose();
    };

    const updateDimension = (field: keyof Dimensions) => (value: string) => {
        setDimensions((prev) => ({ ...prev, [field]: value }));
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <ModalContent onClose={handleClose} error={error}>
                <TableDimensionInput label="Rows" value={dimensions.rows} onChange={updateDimension("rows")} max={DIMENSION_LIMITS.rows.max} />
                <TableDimensionInput label="Columns" value={dimensions.columns} onChange={updateDimension("columns")} max={DIMENSION_LIMITS.columns.max} />
                <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
                    <Button onClick={handleClose} sx={{ mr: 1 }}>
                        Cancel
                    </Button>
                    <Button onClick={handleCreate} variant="contained">
                        Create
                    </Button>
                </Box>
            </ModalContent>
        </Modal>
    );
}

export default NewTableModal;
