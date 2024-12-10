import React from 'react';
import {
    Box,
    ButtonGroup,
    IconButton,
    Tooltip
} from '@mui/material';
import {
    ContentCopy,
    ContentPaste,
    ContentCut,
    Undo,
    Redo,
    Delete,
    FormatBold,
    FormatItalic,
    Code,
    FormatAlignLeft,
    FormatAlignCenter,
    FormatAlignRight,
    Add,
    Remove,
    SwapVert
} from '@mui/icons-material';

interface ToolbarProps {
    onAddRow: () => void;
    onRemoveRow: () => void;
    onAddColumn: () => void;
    onRemoveColumn: () => void;
    onFormatBold: () => void;
    onFormatItalic: () => void;
    onFormatCode: () => void;
    onAlignLeft: () => void;
    onAlignCenter: () => void;
    onAlignRight: () => void;
    onCut: () => void;
    onCopy: () => void;
    onPaste: () => void;
    onUndo: () => void;
    onRedo: () => void;
    onDelete: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
    onAddRow,
    onRemoveRow,
    onAddColumn,
    onRemoveColumn,
    onFormatBold,
    onFormatItalic,
    onFormatCode,
    onAlignLeft,
    onAlignCenter,
    onAlignRight,
    onCut,
    onCopy,
    onPaste,
    onUndo,
    onRedo,
    onDelete,
}) => {
    return (
        <Box sx={{ mb: 2, display: 'flex', gap: 1 }}>
            <ButtonGroup variant="outlined" size="small">
                <Tooltip title="Undo">
                    <IconButton onClick={onUndo}><Undo /></IconButton>
                </Tooltip>
                <Tooltip title="Redo">
                    <IconButton onClick={onRedo}><Redo /></IconButton>
                </Tooltip>
            </ButtonGroup>

            <ButtonGroup variant="outlined" size="small">
                <Tooltip title="Cut">
                    <IconButton onClick={onCut}><ContentCut /></IconButton>
                </Tooltip>
                <Tooltip title="Copy">
                    <IconButton onClick={onCopy}><ContentCopy /></IconButton>
                </Tooltip>
                <Tooltip title="Paste">
                    <IconButton onClick={onPaste}><ContentPaste /></IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                    <IconButton onClick={onDelete}><Delete /></IconButton>
                </Tooltip>
            </ButtonGroup>

            <ButtonGroup variant="outlined" size="small">
                <Tooltip title="Bold">
                    <IconButton onClick={onFormatBold}><FormatBold /></IconButton>
                </Tooltip>
                <Tooltip title="Italic">
                    <IconButton onClick={onFormatItalic}><FormatItalic /></IconButton>
                </Tooltip>
                <Tooltip title="Code">
                    <IconButton onClick={onFormatCode}><Code /></IconButton>
                </Tooltip>
            </ButtonGroup>

            <ButtonGroup variant="outlined" size="small">
                <Tooltip title="Align Left">
                    <IconButton onClick={onAlignLeft}><FormatAlignLeft /></IconButton>
                </Tooltip>
                <Tooltip title="Align Center">
                    <IconButton onClick={onAlignCenter}><FormatAlignCenter /></IconButton>
                </Tooltip>
                <Tooltip title="Align Right">
                    <IconButton onClick={onAlignRight}><FormatAlignRight /></IconButton>
                </Tooltip>
            </ButtonGroup>

            <ButtonGroup variant="outlined" size="small">
                <Tooltip title="Add Row">
                    <IconButton onClick={onAddRow}><Add /></IconButton>
                </Tooltip>
                <Tooltip title="Remove Row">
                    <IconButton onClick={onRemoveRow}><Remove /></IconButton>
                </Tooltip>
            </ButtonGroup>

            <ButtonGroup variant="outlined" size="small">
                <Tooltip title="Add Column">
                    <IconButton onClick={onAddColumn}><SwapVert sx={{ transform: 'rotate(90deg)' }} /></IconButton>
                </Tooltip>
                <Tooltip title="Remove Column">
                    <IconButton onClick={onRemoveColumn}><SwapVert sx={{ transform: 'rotate(90deg)' }} /></IconButton>
                </Tooltip>
            </ButtonGroup>
        </Box>
    );
};

export default Toolbar;
