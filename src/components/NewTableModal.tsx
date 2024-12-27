/**
 * @fileoverview Modal dialog for creating new tables with customizable dimensions.
 * Validates input and provides immediate feedback.
 */

import { useState } from "react";
import { Modal, Box, Typography, Button, TextField, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { NewTableModalProps, TableDimensionInputProps, Dimensions, TableDimensionLimits } from "../types";

function TableDimensionInput({ label, value, onChange, max }: TableDimensionInputProps) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const num = parseInt(e.target.value, 10);
        if (!e.target.value || (num >= 1 && num <= max)) onChange(e.target.value);
    };

    return (
        <TextField
            label={label.charAt(0).toUpperCase() + label.slice(1)}
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

const validateDimension = (value: number, dimension: "rows" | "cols"): string | null => {
    const [min, max] = dimension === "rows" 
        ? [TableDimensionLimits.MIN_ROWS, TableDimensionLimits.MAX_ROWS]
        : [TableDimensionLimits.MIN_COLUMNS, TableDimensionLimits.MAX_COLUMNS];

    if (!value || value < min || value > max) {
        return `${dimension.charAt(0).toUpperCase() + dimension.slice(1)} must be between ${min} and ${max}`;
    }
    return null;
};

const validateDimensions = (dimensions: { rows: string; cols: string }): string | null => {
    const rowsNum = Number(dimensions.rows);
    const colsNum = Number(dimensions.cols);

    return validateDimension(rowsNum, "rows") || validateDimension(colsNum, "cols") || null;
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

const DIMENSIONS: Array<keyof Dimensions> = ["rows", "cols"];

export function NewTableModal({ open, onClose, onCreateNewTable }: NewTableModalProps) {
    const [dimensions, setDimensions] = useState<{ rows: string; cols: string }>({ rows: "", cols: "" });
    const [error, setError] = useState<string | null>(null);

    const handleCreate = () => {
        const validationError = validateDimensions(dimensions);
        if (validationError) {
            setError(validationError);
            return;
        }

        onCreateNewTable(Number(dimensions.rows), Number(dimensions.cols));
        handleClose();
    };

    const handleClose = () => {
        setError(null);
        setDimensions({ rows: "", cols: "" });
        onClose();
    };

    const updateDimension = (field: keyof typeof dimensions) => (value: string) => {
        setDimensions((prev) => ({ ...prev, [field]: value }));
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <ModalContent onClose={handleClose} error={error}>
                {DIMENSIONS.map((dimension) => (
                    <TableDimensionInput
                        key={dimension}
                        label={dimension}
                        value={dimensions[dimension]}
                        onChange={updateDimension(dimension)}
                        max={dimension === "rows" ? TableDimensionLimits.MAX_ROWS : TableDimensionLimits.MAX_COLUMNS}
                    />
                ))}
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
