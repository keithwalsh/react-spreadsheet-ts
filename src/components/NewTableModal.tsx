import React, { useState } from "react";
import { Modal, Box, Typography, Button, TextField, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { NewTableModalProps } from "../types";

const NewTableModal: React.FC<NewTableModalProps> = ({ open, onClose, onCreateNewTable }) => {
    const [rows, setRows] = useState("");
    const [columns, setColumns] = useState("");

    const handleCreate = () => {
        const rowsNum = parseInt(rows, 10);
        const columnsNum = parseInt(columns, 10);
        if (rowsNum >= 1 && rowsNum <= 500 && columnsNum >= 1 && columnsNum <= 20) {
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
                <TextField
                    label="Rows"
                    type="number"
                    value={rows}
                    onChange={(e) => setRows(e.target.value)}
                    fullWidth
                    margin="normal"
                    inputProps={{ min: 1, max: 500 }}
                    helperText="Valid range: 1-500"
                />
                <TextField
                    label="Columns"
                    type="number"
                    value={columns}
                    onChange={(e) => setColumns(e.target.value)}
                    fullWidth
                    margin="normal"
                    inputProps={{ min: 1, max: 20 }}
                    helperText="Valid range: 1-20"
                />
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
