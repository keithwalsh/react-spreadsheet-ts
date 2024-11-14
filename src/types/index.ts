export interface SpreadsheetProps {
    toolbarOrientation?: 'horizontal' | 'vertical'
    initialRows?: number
    initialColumns?: number
    tableHeight?: string
    value?: string[][]
    onChange?: (data: string[][]) => void
}
