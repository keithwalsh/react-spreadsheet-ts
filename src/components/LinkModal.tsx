/**
 * @fileoverview Modal dialog for adding and editing hyperlinks in spreadsheet cells.
 */

import { useEffect, useState } from "react";
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
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                    placeholder="https://example.com"
                />
            </DialogContent>
            <DialogActions sx={{ justifyContent: "space-between", px: 1 }}>
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
            </DialogActions>
        </Dialog>
    );
};

export default LinkModal;
