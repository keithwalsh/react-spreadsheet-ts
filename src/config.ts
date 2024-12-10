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
    SwapVert,
    FileDownload
} from '@mui/icons-material';
import { SvgIconTypeMap } from '@mui/material';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import { ButtonId, ButtonAction } from './types';

interface ButtonDefinition {
    icon: OverridableComponent<SvgIconTypeMap<{}, "svg">> & { muiName: string }
    tooltip: string
    action: ButtonAction
    rotate?: number
}

type ButtonDefinitions = {
    [K in ButtonId]: ButtonDefinition
}

type ButtonGroups = {
    [key: string]: ButtonId[]
}

export const buttonDefinitions: ButtonDefinitions = {
    bold: {
        icon: FormatBold,
        tooltip: 'Bold',
        action: 'onFormatBold'
    },
    italic: {
        icon: FormatItalic,
        tooltip: 'Italic',
        action: 'onFormatItalic'
    },
    code: {
        icon: Code,
        tooltip: 'Code',
        action: 'onFormatCode'
    },
    alignLeft: {
        icon: FormatAlignLeft,
        tooltip: 'Align Left',
        action: 'onAlignLeft'
    },
    alignCenter: {
        icon: FormatAlignCenter,
        tooltip: 'Align Center',
        action: 'onAlignCenter'
    },
    alignRight: {
        icon: FormatAlignRight,
        tooltip: 'Align Right',
        action: 'onAlignRight'
    },
    cut: {
        icon: ContentCut,
        tooltip: 'Cut',
        action: 'onCut'
    },
    copy: {
        icon: ContentCopy,
        tooltip: 'Copy',
        action: 'onCopy'
    },
    paste: {
        icon: ContentPaste,
        tooltip: 'Paste',
        action: 'onPaste'
    },
    delete: {
        icon: Delete,
        tooltip: 'Delete',
        action: 'onDelete'
    },
    undo: {
        icon: Undo,
        tooltip: 'Undo',
        action: 'onUndo'
    },
    redo: {
        icon: Redo,
        tooltip: 'Redo',
        action: 'onRedo'
    },
    addRow: {
        icon: Add,
        tooltip: 'Add Row',
        action: 'onAddRow'
    },
    removeRow: {
        icon: Remove,
        tooltip: 'Remove Row',
        action: 'onRemoveRow'
    },
    addColumn: {
        icon: SwapVert,
        tooltip: 'Add Column',
        action: 'onAddColumn',
        rotate: 90
    },
    removeColumn: {
        icon: SwapVert,
        tooltip: 'Remove Column',
        action: 'onRemoveColumn',
        rotate: 90
    },
    downloadCSV: {
        icon: FileDownload,
        tooltip: 'Download CSV',
        action: 'onDownloadCSV'
    }
} as const;

export const buttonConfig: ButtonGroups = {
    clipboard: ['cut', 'copy', 'paste', 'delete'],
    history: ['undo', 'redo'],
    format: ['bold', 'italic', 'code'],
    align: ['alignLeft', 'alignCenter', 'alignRight'],
    table: ['addRow', 'removeRow', 'addColumn', 'removeColumn'],
    export: ['downloadCSV']
} as const;

export const defaultVisibleButtons = [
    ...buttonConfig.clipboard,
    ...buttonConfig.history,
    ...buttonConfig.format,
    ...buttonConfig.align,
    ...buttonConfig.table,
    ...buttonConfig.export
] as const;
