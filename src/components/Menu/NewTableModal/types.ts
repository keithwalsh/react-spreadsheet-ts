export interface NewTableModalProps {
    open: boolean;
    onClose: () => void;
    onCreateNewTable: (rows: number, columns: number) => void;
}
