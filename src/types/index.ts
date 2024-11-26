export interface SpreadsheetProps {
    toolbarOrientation?: 'horizontal' | 'vertical'
    initialRows?: number
    initialColumns?: number
    tableHeight?: string
    value?: string[][]
    onChange?: (data: string[][]) => void
    onFormatChange?: (row: number, col: number, format: CellFormat) => void
}

export interface CellFormat {
    bold: boolean
    italic: boolean
    code: boolean
    alignment: 'left' | 'center' | 'right' | 'inherit' | 'justify'
}
