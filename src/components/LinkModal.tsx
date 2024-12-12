import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Box } from "@mui/material";
import { LinkModalProps } from "../types";

const LinkModal: React.FC<LinkModalProps> = ({ open, onClose, onSubmit, initialUrl = "" }) => {
    const [url, setUrl] = useState(initialUrl);

    useEffect(() => {
        setUrl(initialUrl);
    }, [initialUrl, open]);

    const handleSubmit = () => {
        onSubmit(url.trim() || undefined);
        onClose();
    };

    const handleRemove = () => {
        onSubmit(undefined);
        onClose();
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") handleSubmit();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{initialUrl ? "Edit Link" : "Add Link"}</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="URL"
                    type="url"
                    fullWidth
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="https://example.com"
                />
            </DialogContent>
            <DialogActions>
                <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%", px: 1 }}>
                    {initialUrl && (
                        <Button onClick={handleRemove} color="error">
                            Remove Link
                        </Button>
                    )}
                    <Box>
                        <Button onClick={onClose}>Cancel</Button>
                        <Button onClick={handleSubmit} variant="contained" color="primary" disabled={!url.trim()}>
                            {initialUrl ? "Update" : "Add"} Link
                        </Button>
                    </Box>
                </Box>
            </DialogActions>
        </Dialog>
    );
};

export default LinkModal;
