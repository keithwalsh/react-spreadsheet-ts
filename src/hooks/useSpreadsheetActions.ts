// hooks/useSpreadsheetActions.ts
import { useCallback } from 'react'
import { useAtom } from 'jotai'
import { PrimitiveAtom } from 'jotai'
import { State } from '../types'
import { TextFormattingOperation } from '../types'

export const useSpreadsheetActions = (atom: PrimitiveAtom<State>) => {
    const [state, setState] = useAtom(atom)

    const applyTextFormatting = useCallback(
        (operation: TextFormattingOperation) => {
            const newData = state.data.map((row, rowIndex) => {
                return row.map((cell, colIndex) => {
                    const shouldFormat =
                        (state.selectedCell?.row === rowIndex &&
                            state.selectedCell?.col === colIndex) ||
                        state.selectedCells[rowIndex][colIndex] ||
                        (state.selectedRows.includes(rowIndex) &&
                            state.selectedColumns.includes(colIndex))

                    if (!shouldFormat) return cell

                    switch (operation.operation) {
                        case 'BOLD':
                            return { ...cell, bold: !cell.bold }
                        case 'ITALIC':
                            return { ...cell, italic: !cell.italic }
                        case 'CODE':
                            return { ...cell, code: !cell.code }
                        case 'LINK':
                            return { ...cell, link: operation.payload || '' }
                        case 'ALIGN_LEFT':
                            return { ...cell, alignment: 'left' }
                        case 'ALIGN_CENTER':
                            return { ...cell, alignment: 'center' }
                        case 'ALIGN_RIGHT':
                            return { ...cell, alignment: 'right' }
                        default:
                            return cell
                    }
                })
            })

            setState({
                ...state,
                data: newData
            })
        },
        [state, setState]
    )

    return {
        applyTextFormatting
    }
}

export default useSpreadsheetActions
