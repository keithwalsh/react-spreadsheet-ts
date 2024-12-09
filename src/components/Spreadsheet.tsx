import React, { useRef, useCallback, useEffect } from "react"
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { 
    setData, 
    startDrag,
    setTableSize,
    clearTable,
    transposeTable,
    toggleSelectAll,
    setSelectedCell,
    setSelectedColumn,
    undo,
    redo,
    deleteSelected,
    applyTextFormatting
} from '../store/spreadsheetSlice'
import {
    Box,
    Snackbar,
    TableBody,
    TableRow,
    TableHead,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button,
} from "@mui/material"
import { ButtonGroup, ToolbarProvider, Cell, ColumnHeaderCell, Row, RowNumberCell, SelectAllCell, Table, TableMenu } from "."
import { SpreadsheetProps, CellData, Alignment } from "../types"
import { useDragSelection } from '../hooks'
import { addRow, removeRow, addColumn, removeColumn } from '../utils/spreadsheetOperations'
import { downloadCSV } from '../utils'

export const Spreadsheet: React.FC<SpreadsheetProps> = ({
    value,
    onChange,
}) => {
    const dispatch = useAppDispatch()
    const state = useAppSelector(state => state.spreadsheet)
    const { handleDragStart, handleDragEnter, handleDragEnd } = useDragSelection()
    
    const containerRef = useRef<HTMLDivElement>(null)
    const tableRef = useRef<HTMLTableElement>(null)
    const buttonGroupRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (value) {
            // Convert value to CellData if it's just string[][]
            const cellData: CellData[][] = value.map(row => 
                row.map(cell => {
                    if (typeof cell === 'string') {
                        return {
                            content: cell,
                            alignment: 'left' as Alignment,
                            bold: false,
                            italic: false,
                            code: false
                        }
                    }
                    return {
                        content: cell.content,
                        alignment: cell.alignment || 'left',
                        bold: cell.bold || false,
                        italic: cell.italic || false,
                        code: cell.code || false
                    }
                })
            )
            dispatch(setData({
                data: cellData,
                selectedCell: null,
                selectedCells: Array(cellData.length).fill(Array(cellData[0].length).fill(false)),
                selectedRows: [],
                selectedColumns: [],
                isDragging: false,
                selectAll: false
            }))
        } else {
            // Initialize with default dimensions
            dispatch(setTableSize({ row: 4, col: 5, isInitialSetup: true }))
        }
    }, [value, dispatch])

    const handleCellChange = useCallback(
        (rowIndex: number, colIndex: number, value: string) => {
            const newData = state.data.map(row => [...row])
            newData[rowIndex][colIndex] = {
                ...newData[rowIndex][colIndex],
                content: value
            }
            dispatch(setData({
                ...state,
                data: newData
            }))
            // Call onChange callback if provided
            onChange?.(newData)
        },
        [dispatch, state, onChange]
    )

    const handleMouseDown = useCallback(
        (row: number, col: number) => {
            dispatch(startDrag({ row, col }))
        },
        [dispatch]
    )

    const handleSetTableSize = (row: number, col: number) => {
        dispatch(setTableSize({ row, col }))
    }

    const handleRowDragStart = useCallback(
        (rowIndex: number) => {
            handleDragStart(rowIndex, -1)
        },
        [handleDragStart]
    )

    const handleColumnDragStart = useCallback(
        (colIndex: number) => {
            handleDragStart(-1, colIndex)
        },
        [handleDragStart]
    )

    const handleCellSelection = useCallback(
        (rowIndex: number, colIndex: number) => {
            if (state.selectedCell?.row === rowIndex && 
                state.selectedCell?.col === colIndex && 
                !state.isDragging) {
                return
            }
            dispatch(setSelectedCell({ row: rowIndex, col: colIndex }))
        },
        [dispatch, state.selectedCell, state.isDragging]
    )

    useEffect(() => {
        const handleGlobalKeyDown = (event: KeyboardEvent) => {
            // Ignore keyboard events when editing a cell
            if (event.target instanceof HTMLElement && event.target.isContentEditable) {
                return;
            }

            if (!state.selectedCell) {
                return;
            }

            const { row, col } = state.selectedCell;
            let newRow = row;
            let newCol = col;

            switch (event.key) {
                case 'ArrowUp':
                    newRow = Math.max(0, row - 1);
                    break;
                case 'ArrowDown':
                    newRow = Math.min(state.data.length - 1, row + 1);
                    break;
                case 'ArrowLeft':
                    newCol = Math.max(0, col - 1);
                    break;
                case 'ArrowRight':
                    newCol = Math.min(state.data[0].length - 1, col + 1);
                    break;
                default:
                    return;
            }

            if (newRow !== row || newCol !== col) {
                dispatch(setSelectedCell({ row: newRow, col: newCol }));
                event.preventDefault();
            }
        };

        // Add global keyboard listener
        document.addEventListener('keydown', handleGlobalKeyDown);

        // Cleanup
        return () => {
            document.removeEventListener('keydown', handleGlobalKeyDown);
        };
    }, [dispatch, state.selectedCell, state.data]);

    // Add global paste handler
    const handleGlobalPaste = useCallback((event: ClipboardEvent) => {
        const clipboardText = event.clipboardData?.getData('text') || ''
        const rows = clipboardText.split('\n').map(row => row.split('\t'))
        
        if (!state.selectedCell) return
        
        const { row: startRow, col: startCol } = state.selectedCell
        
        const newData = state.data.map((dataRow, rowIndex) => {
            if (rowIndex < startRow || rowIndex >= startRow + rows.length) {
                return dataRow
            }
            
            return dataRow.map((cell, colIndex) => {
                if (colIndex < startCol || colIndex >= startCol + rows[0].length) {
                    return cell
                }
                
                const pasteContent = rows[rowIndex - startRow][colIndex - startCol]
                return {
                    ...cell,
                    content: pasteContent || ''
                }
            })
        })
        
        dispatch(setData({
            ...state,
            data: newData
        }))
    }, [dispatch, state])

    useEffect(() => {
        document.addEventListener('paste', handleGlobalPaste)
        return () => document.removeEventListener('paste', handleGlobalPaste)
    }, [handleGlobalPaste])

    return (
        <Box
            sx={{
                p: 0
            }}
        >
            <ToolbarProvider
                onClickUndo={() => dispatch(undo())}
                onClickRedo={() => dispatch(redo())}
                onClickAlignLeft={() => dispatch(applyTextFormatting({ operation: "ALIGN_LEFT" }))}
                onClickAlignCenter={() => dispatch(applyTextFormatting({ operation: "ALIGN_CENTER" }))}
                onClickAlignRight={() => dispatch(applyTextFormatting({ operation: "ALIGN_RIGHT" }))}
                onClickAddRow={() => {
                    const { newData, newSelectedCells } = addRow({
                        data: state.data,
                        selectedCells: state.selectedCells
                    });
                    dispatch(setData({
                        ...state,
                        data: newData,
                        selectedCells: newSelectedCells
                    }));
                }}
                onClickRemoveRow={() => {
                    const { newData, newSelectedCells } = removeRow({
                        data: state.data,
                        selectedCells: state.selectedCells
                    });
                    dispatch(setData({
                        ...state,
                        data: newData,
                        selectedCells: newSelectedCells
                    }));
                }}
                onClickAddColumn={() => {
                    const { newData, newSelectedCells } = addColumn({
                        data: state.data,
                        selectedCells: state.selectedCells
                    });
                    dispatch(setData({
                        ...state,
                        data: newData,
                        selectedCells: newSelectedCells
                    }));
                }}
                onClickRemoveColumn={() => {
                    const { newData, newSelectedCells } = removeColumn({
                        data: state.data,
                        selectedCells: state.selectedCells
                    });
                    dispatch(setData({
                        ...state,
                        data: newData,
                        selectedCells: newSelectedCells
                    }));
                }}
                onClickSetBold={() => dispatch(applyTextFormatting({ operation: "BOLD" }))}
                onClickSetItalic={() => dispatch(applyTextFormatting({ operation: "ITALIC" }))}
                onClickSetCode={() => dispatch(applyTextFormatting({ operation: "CODE" }))}
                setTableSize={handleSetTableSize}
                currentRows={state.data.length}
                currentCols={state.data[0]?.length || 0}
                clearTable={() => dispatch(clearTable())}
                deleteSelected={() => dispatch(deleteSelected())}
                transposeTable={() => dispatch(transposeTable())}
            >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <TableMenu 
                        onCreateNewTable={(rows, columns) => {
                            dispatch(setTableSize({ row: rows, col: columns }))
                        }}
                        onDownloadCSV={() => downloadCSV(state.data.map(row => 
                            row.map(cell => ({
                                content: cell.content,
                                alignment: cell.alignment || 'left',
                                bold: cell.bold || false,
                                italic: cell.italic || false,
                                code: cell.code || false
                            }))
                        ))}
                    />
                </Box>
                <div ref={buttonGroupRef}>
                    <ButtonGroup orientation="horizontal" />
                </div>
            </ToolbarProvider>
            <div 
                ref={containerRef}
                style={{ outline: 'none' }}
                data-spreadsheet-container="true"
            >
                <Table ref={tableRef}>
                    <TableHead>
                        <TableRow>
                            <SelectAllCell
                                selectAll={state.selectAll}
                                toggleSelectAll={() => dispatch(toggleSelectAll())}
                            />
                            {state.data[0].map((_, index) => (
                                <ColumnHeaderCell
                                    key={index}
                                    index={index}
                                    handleColumnSelection={() => dispatch(setSelectedColumn(index))}
                                    selectedColumns={state.selectedColumns}
                                    onAddColumnLeft={() => {
                                        const { newData, newSelectedCells } = addColumn({
                                            data: state.data,
                                            selectedCells: state.selectedCells,
                                            index: index,
                                            position: "left"
                                        });
                                        dispatch(setData({
                                            ...state,
                                            data: newData,
                                            selectedCells: newSelectedCells
                                        }));
                                    }}
                                    onAddColumnRight={() => {
                                        const { newData, newSelectedCells } = addColumn({
                                            data: state.data,
                                            selectedCells: state.selectedCells,
                                            index: index,
                                            position: "right"
                                        });
                                        dispatch(setData({
                                            ...state,
                                            data: newData,
                                            selectedCells: newSelectedCells
                                        }));
                                    }}
                                    onRemoveColumn={() => {
                                        const { newData, newSelectedCells } = removeColumn({
                                            data: state.data,
                                            selectedCells: state.selectedCells,
                                            index: index
                                        });
                                        dispatch(setData({
                                            ...state,
                                            data: newData,
                                            selectedCells: newSelectedCells
                                        }));
                                    }}
                                    onDragStart={handleColumnDragStart}
                                    onDragEnter={(col) => handleDragEnter(-1, col)}
                                    onDragEnd={handleDragEnd}
                                />
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {state.data.map((row, rowIndex) => (
                            <Row key={rowIndex}>
                                <RowNumberCell
                                    rowIndex={rowIndex}
                                    selectedRows={state.selectedRows}
                                    onDragStart={handleRowDragStart}
                                    onDragEnter={(row) => handleDragEnter(row, -1)}
                                    onDragEnd={handleDragEnd}
                                    onAddAbove={() => {
                                        const { newData, newSelectedCells } = addRow({
                                            data: state.data,
                                            selectedCells: state.selectedCells,
                                            index: rowIndex
                                        });
                                        dispatch(setData({
                                            ...state,
                                            data: newData,
                                            selectedCells: newSelectedCells
                                        }));
                                    }}
                                    onAddBelow={() => {
                                        const { newData, newSelectedCells } = addRow({
                                            data: state.data,
                                            selectedCells: state.selectedCells,
                                            index: rowIndex + 1
                                        });
                                        dispatch(setData({
                                            ...state,
                                            data: newData,
                                            selectedCells: newSelectedCells
                                        }));
                                    }}
                                    onRemove={() => {
                                        const { newData, newSelectedCells } = removeRow({
                                            data: state.data,
                                            selectedCells: state.selectedCells,
                                            index: rowIndex
                                        });
                                        
                                        // Update selected rows after removal
                                        const newSelectedRows = state.selectedRows
                                            .filter(row => row !== rowIndex) // Remove the deleted row
                                            .map(row => row > rowIndex ? row - 1 : row); // Adjust indices for rows after the deleted one
                                        
                                        dispatch(setData({
                                            ...state,
                                            data: newData,
                                            selectedCells: newSelectedCells,
                                            selectedRows: newSelectedRows
                                        }));
                                    }}
                                >
                                    {rowIndex + 1}
                                </RowNumberCell>
                                {row.map((cell, colIndex) => (
                                    <Cell
                                        key={colIndex}
                                        rowIndex={rowIndex}
                                        colIndex={colIndex}
                                        align={cell.alignment || 'left'}
                                        selectedCells={state.selectedCells}
                                        selectedCell={state.selectedCell}
                                        handleCellSelection={handleCellSelection}
                                        handleCellChange={handleCellChange}
                                        cellData={cell}
                                        onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
                                        onMouseEnter={() => handleDragEnter(rowIndex, colIndex)}
                                        onMouseUp={handleDragEnd}
                                        selectedColumns={state.selectedColumns}
                                        selectedRows={state.selectedRows}
                                    />
                                ))}
                            </Row>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <Snackbar
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                open={false}
                autoHideDuration={3000}
                onClose={() => {}}
                message=""
            />
            <Dialog
                open={false}
                onClose={() => {}}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Confirm Column Removal"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to remove this column? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {}}>Cancel</Button>
                    <Button onClick={() => {}} autoFocus>
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}

export default Spreadsheet