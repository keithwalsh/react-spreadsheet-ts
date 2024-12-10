import React, { useCallback, useRef, useEffect } from 'react'
import { useAtom } from 'jotai'
import { PrimitiveAtom } from 'jotai'
import { State } from '../types'
import { Box } from '@mui/material'
import Table from './Table'
import Toolbar from './Toolbar'
import { useDragSelection } from '../hooks'
import { addRow, removeRow, addColumn, removeColumn } from '../utils/spreadsheetOperations'

interface SpreadsheetProps {
    atom: PrimitiveAtom<State>
}

const Spreadsheet: React.FC<SpreadsheetProps> = ({ atom }) => {
    const [state, setState] = useAtom(atom)
    const { handleDragStart, handleDragEnter, handleDragEnd } = useDragSelection(atom)
    
    const containerRef = useRef<HTMLDivElement>(null)
    const tableRef = useRef<HTMLTableElement>(null)

    const handleCellChange = useCallback(
        (rowIndex: number, colIndex: number, value: string) => {
            const newData = state.data.map((row, i) => 
                i === rowIndex 
                    ? row.map((cell, j) => 
                        j === colIndex 
                            ? { ...cell, value }
                            : cell
                    )
                    : row
            )
            
            setState({
                ...state,
                data: newData
            })
        },
        [state, setState]
    )

    const handleAddRow = useCallback(() => {
        const result = addRow({ 
            data: state.data, 
            selectedCells: state.selectedCells 
        })
        setState({
            ...state,
            data: result.newData,
            selectedCells: result.newSelectedCells
        })
    }, [state, setState])

    const handleRemoveRow = useCallback(() => {
        const result = removeRow({ 
            data: state.data, 
            selectedCells: state.selectedCells 
        })
        setState({
            ...state,
            data: result.newData,
            selectedCells: result.newSelectedCells
        })
    }, [state, setState])

    const handleAddColumn = useCallback(() => {
        const result = addColumn({ 
            data: state.data, 
            selectedCells: state.selectedCells 
        })
        setState({
            ...state,
            data: result.newData,
            selectedCells: result.newSelectedCells
        })
    }, [state, setState])

    const handleRemoveColumn = useCallback(() => {
        const result = removeColumn({ 
            data: state.data, 
            selectedCells: state.selectedCells 
        })
        setState({
            ...state,
            data: result.newData,
            selectedCells: result.newSelectedCells
        })
    }, [state, setState])

    const handleDeleteSelected = useCallback(() => {
        if (!state.selectedCell && !state.selectedCells.some(row => row.some(cell => cell))) {
            return
        }

        const newData = state.data.map((dataRow, rowIndex) => {
            return dataRow.map((cell, colIndex) => {
                const shouldClear = 
                    (state.selectedCell?.row === rowIndex && state.selectedCell?.col === colIndex) ||
                    (state.selectedCells[rowIndex] && state.selectedCells[rowIndex][colIndex])

                return shouldClear ? { ...cell, value: '' } : cell
            })
        })

        setState({
            ...state,
            data: newData
        })
    }, [state, setState])

    // Add global paste handler
    const handleGlobalPaste = useCallback((event: ClipboardEvent) => {
        event.preventDefault()
        const pasteData = event.clipboardData?.getData('text')
        if (!pasteData || !state.selectedCell) return

        const rows = pasteData.split('\n')
        const newData = [...state.data]
        
        rows.forEach((row, rowOffset) => {
            const cells = row.split('\t')
            cells.forEach((cell, colOffset) => {
                const targetRow = state.selectedCell!.row + rowOffset
                const targetCol = state.selectedCell!.col + colOffset
                
                if (
                    targetRow < newData.length &&
                    targetCol < newData[0].length
                ) {
                    newData[targetRow][targetCol] = {
                        ...newData[targetRow][targetCol],
                        value: cell.trim()
                    }
                }
            })
        })
        
        setState({
            ...state,
            data: newData
        })
    }, [state, setState])

    useEffect(() => {
        document.addEventListener('paste', handleGlobalPaste)
        return () => document.removeEventListener('paste', handleGlobalPaste)
    }, [handleGlobalPaste])

    return (
        <div className="spreadsheet" ref={containerRef}>
            <Box sx={{ mb: 2 }}>
                <Toolbar 
                    onAddRow={handleAddRow}
                    onRemoveRow={handleRemoveRow}
                    onAddColumn={handleAddColumn}
                    onRemoveColumn={handleRemoveColumn}
                    onFormatBold={() => {/* TODO */}}
                    onFormatItalic={() => {/* TODO */}}
                    onFormatCode={() => {/* TODO */}}
                    onAlignLeft={() => {/* TODO */}}
                    onAlignCenter={() => {/* TODO */}}
                    onAlignRight={() => {/* TODO */}}
                    onCut={() => {/* TODO */}}
                    onCopy={() => {/* TODO */}}
                    onPaste={() => {/* TODO */}}
                    onUndo={() => {/* TODO */}}
                    onRedo={() => {/* TODO */}}
                    onDelete={handleDeleteSelected}
                />
            </Box>
            <Table
                atom={atom}
                onCellChange={handleCellChange}
                onDragStart={handleDragStart}
                onDragEnter={handleDragEnter}
                onDragEnd={handleDragEnd}
                ref={tableRef}
            />
        </div>
    )
}

export default Spreadsheet