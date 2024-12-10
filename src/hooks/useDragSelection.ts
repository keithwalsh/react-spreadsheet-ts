/**
 * @fileoverview Hook to manage drag selection state and actions for spreadsheet
 * rows and columns.
 */

import { useCallback } from 'react'
import { useAtom } from 'jotai'
import { PrimitiveAtom } from 'jotai'
import { State } from '../types'

export const useDragSelection = (atom: PrimitiveAtom<State>) => {
    const [state, setState] = useAtom(atom)

    const handleDragStart = useCallback(
        (row: number, col: number) => {
            const newState = { ...state }
            newState.isDragging = true
            newState.dragStart = { row, col }

            // Clear previous selections
            newState.selectedCell = null
            newState.selectedColumns = []
            newState.selectedRows = []
            newState.selectedCells = state.selectedCells.map(row => row.map(() => false))
            newState.selectAll = false

            // Set new selection
            if (col === -1 && row >= 0) {
                newState.selectedRows = [row]
            } else if (row === -1 && col >= 0) {
                newState.selectedColumns = [col]
            } else if (row >= 0 && col >= 0) {
                newState.dragStartRow = row
                newState.dragStartColumn = col
                if (newState.selectedCells[row]) {
                    newState.selectedCells[row][col] = true
                }
            }

            setState(newState)
        },
        [state, setState]
    )

    const handleDragEnter = useCallback(
        (row: number, col: number) => {
            if (!state.isDragging || !state.dragStart) return

            const newState = { ...state }
            const { row: startRow, col: startCol } = state.dragStart

            // Handle row selection drag
            if (startCol === -1 && row >= 0) {
                const start = Math.min(startRow, row)
                const end = Math.max(startRow, row)
                newState.selectedRows = Array.from(
                    { length: end - start + 1 },
                    (_, i) => start + i
                )
            }
            // Handle column selection drag
            else if (startRow === -1 && col >= 0) {
                const start = Math.min(startCol, col)
                const end = Math.max(startCol, col)
                newState.selectedColumns = Array.from(
                    { length: end - start + 1 },
                    (_, i) => start + i
                )
            }
            // Handle cell selection drag
            else if (row >= 0 && col >= 0) {
                const startRow = Math.min(state.dragStartRow!, row)
                const endRow = Math.max(state.dragStartRow!, row)
                const startCol = Math.min(state.dragStartColumn!, col)
                const endCol = Math.max(state.dragStartColumn!, col)

                newState.selectedCells = state.selectedCells.map((rowCells, rowIndex) =>
                    rowCells.map((_, colIndex) =>
                        rowIndex >= startRow &&
                        rowIndex <= endRow &&
                        colIndex >= startCol &&
                        colIndex <= endCol
                    )
                )
            }

            setState(newState)
        },
        [state, setState]
    )

    const handleDragEnd = useCallback(() => {
        setState({ ...state, isDragging: false })
    }, [state, setState])

    return {
        handleDragStart,
        handleDragEnter,
        handleDragEnd
    }
}

export default useDragSelection