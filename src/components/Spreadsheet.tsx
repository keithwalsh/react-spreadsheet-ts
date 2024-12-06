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
    redo
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
import { SpreadsheetProps } from "../types"
import { useDragSelection } from '../hooks'
import { addRow, removeRow, addColumn, removeColumn } from '../utils/spreadsheetOperations'
import { downloadCSV } from '../utils'

export const Spreadsheet: React.FC<SpreadsheetProps> = ({
    toolbarOrientation = 'horizontal',
    initialRows = 4,
    initialColumns = 10,
    value,
}) => {
    const dispatch = useAppDispatch()
    const state = useAppSelector(state => state.spreadsheet)
    const { handleDragStart, handleDragEnter, handleDragEnd } = useDragSelection()
    
    const containerRef = useRef<HTMLDivElement>(null)
    const tableRef = useRef<HTMLTableElement>(null)
    const buttonGroupRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (value) {
            dispatch(setData({
                data: value,
                alignments: Array(value.length).fill(Array(value[0].length).fill("left")),
                bold: Array(value.length).fill(Array(value[0].length).fill(false)),
                italic: Array(value.length).fill(Array(value[0].length).fill(false)),
                code: Array(value.length).fill(Array(value[0].length).fill(false)),
                selectedCell: null,
                selectedCells: Array(value.length).fill(Array(value[0].length).fill(false)),
                selectedRows: [],
                selectedColumns: [],
                isDragging: false,
                selectAll: false
            }))
        }
    }, [value, dispatch])

    useEffect(() => {
        if (!value) {
            dispatch(setTableSize({ row: initialRows, col: initialColumns }))
        }
    }, [initialRows, initialColumns, value, dispatch])

    const handleCellChange = useCallback(
        (rowIndex: number, colIndex: number, value: string) => {
            const newData = [...state.data.map(row => [...row])]
            newData[rowIndex][colIndex] = value
            dispatch(setData({
                data: newData,
                alignments: state.alignments,
                bold: state.bold,
                italic: state.italic,
                code: state.code,
                selectedCell: state.selectedCell,
                selectedCells: state.selectedCells,
                selectedRows: state.selectedRows,
                selectedColumns: state.selectedColumns,
                isDragging: state.isDragging,
                selectAll: state.selectAll
            }))
        },
        [dispatch, state.data, state.alignments, state.bold, state.italic, state.code, state.selectedCell, state.selectedCells, state.selectedRows, state.selectedColumns, state.isDragging, state.selectAll]
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

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                ...(toolbarOrientation === "horizontal" ? { p: 0 } : { p: 0 }),
                height: "100%",
            }}
        >
            <ToolbarProvider
                onClickUndo={() => dispatch(undo())}
                onClickRedo={() => dispatch(redo())}
                onClickAlignLeft={() => {}}
                onClickAlignCenter={() => {}}
                onClickAlignRight={() => {}}
                onClickAddRow={() => {
                    const { newData, newAlignments, newSelectedCells } = addRow({
                        data: state.data,
                        alignments: state.alignments,
                        selectedCells: state.selectedCells
                    });
                    dispatch(setData({
                        ...state,
                        data: newData,
                        alignments: newAlignments,
                        selectedCells: newSelectedCells
                    }));
                }}
                onClickRemoveRow={() => {
                    const { newData, newAlignments, newSelectedCells } = removeRow({
                        data: state.data,
                        alignments: state.alignments,
                        selectedCells: state.selectedCells
                    });
                    dispatch(setData({
                        ...state,
                        data: newData,
                        alignments: newAlignments,
                        selectedCells: newSelectedCells
                    }));
                }}
                onClickAddColumn={() => {
                    const { newData, newAlignments, newSelectedCells } = addColumn({
                        data: state.data,
                        alignments: state.alignments,
                        selectedCells: state.selectedCells,
                        index: state.selectedColumns?.[0] ?? state.data[0].length - 1
                    });
                    dispatch(setData({
                        ...state,
                        data: newData,
                        alignments: newAlignments,
                        selectedCells: newSelectedCells
                    }));
                }}
                onClickRemoveColumn={() => {
                    const { newData, newAlignments, newSelectedCells } = removeColumn({
                        data: state.data,
                        alignments: state.alignments,
                        selectedCells: state.selectedCells,
                        index: state.selectedColumns?.[0] ?? state.data[0].length - 1
                    });
                    dispatch(setData({
                        ...state,
                        data: newData,
                        alignments: newAlignments,
                        selectedCells: newSelectedCells
                    }));
                }}
                onClickSetBold={() => {}}
                onClickSetItalic={() => {}}
                onClickSetCode={() => {}}
                setTableSize={handleSetTableSize}
                currentRows={state.data.length}
                currentCols={state.data[0].length}
                clearTable={clearTable}
                transposeTable={transposeTable}
            >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <TableMenu 
                        onCreateNewTable={(rows, columns) => {
                            dispatch(setTableSize({ row: rows, col: columns }))
                        }}
                        onDownloadCSV={() => downloadCSV(state.data)}
                    />
                </Box>
                <div ref={buttonGroupRef}>
                    <ButtonGroup orientation={toolbarOrientation} />
                </div>
            </ToolbarProvider>
            <div ref={containerRef}>
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
                                    onAddColumnLeft={() => {}}
                                    onAddColumnRight={() => {}}
                                    onRemoveColumn={() => {}}
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
                                >
                                    {rowIndex + 1}
                                </RowNumberCell>
                                {row.map((cell, colIndex) => (
                                    <Cell
                                        key={colIndex}
                                        rowIndex={rowIndex}
                                        colIndex={colIndex}
                                        align={state.alignments[rowIndex][colIndex]}
                                        selectedCells={state.selectedCells}
                                        selectedCell={state.selectedCell}
                                        selectedColumns={state.selectedColumns}
                                        selectedRows={state.selectedRows}
                                        handleCellSelection={handleCellSelection}
                                        handleCellChange={handleCellChange}
                                        cellData={cell}
                                        onMouseDown={handleMouseDown}
                                        onMouseEnter={handleDragEnter}
                                        onMouseUp={handleDragEnd}
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