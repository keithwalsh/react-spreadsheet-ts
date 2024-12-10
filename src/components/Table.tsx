import * as React from "react";
import { TableContainer as TableContainerMui, Table as TableMui, Paper as PaperMui, TableHead, TableBody, useTheme, createTheme } from "@mui/material";
import { useAtom } from "jotai";
import { PrimitiveAtom } from "jotai";
import { State } from "../types";
import Row from "./Row";
import Cell from "./Cell";
import RowNumberCell from "./RowNumberCell";
import ColumnHeaderCell from "./ColumnHeaderCell";
import SelectAllCell from "./SelectAllCell";

const defaultTheme = createTheme();

interface TableProps {
    atom: PrimitiveAtom<State>;
    onCellChange: (rowIndex: number, colIndex: number, value: string) => void;
    onDragStart: (row: number, col: number) => void;
    onDragEnter: (row: number, col: number) => void;
    onDragEnd: () => void;
    children?: React.ReactNode;
}

const Table = React.forwardRef<HTMLTableElement, TableProps>(({ atom, onCellChange, onDragStart, onDragEnter, onDragEnd, children }, ref) => {
    const [state] = useAtom(atom);

    const handlePasteEvent = React.useCallback(
        (event: React.ClipboardEvent<HTMLDivElement>) => {
            event.preventDefault();
            const clipboardText = event.clipboardData?.getData("text") || "";

            if (state.selectedCell) {
                onCellChange(state.selectedCell.row, state.selectedCell.col, clipboardText);
            }
        },
        [state.selectedCell, onCellChange]
    );

    const theme = useTheme() || defaultTheme;
    const isDarkMode = theme?.palette?.mode === "dark" || false;

    const lightThemeStyles = {
        border: "1px solid #e0e0e0",
    };

    const darkThemeStyles = {
        border: "1px solid #686868",
    };

    const commonStyles = {
        mt: 0,
        width: "auto",
        display: "inline-block",
        backgroundColor: "transparent",
    };

    const tableStyles = {
        ...commonStyles,
        ...(isDarkMode ? darkThemeStyles : lightThemeStyles),
    };

    const handleRowDragStart = React.useCallback(
        (rowIndex: number) => {
            onDragStart(rowIndex, -1);
        },
        [onDragStart]
    );

    const handleRowDragEnter = React.useCallback(
        (rowIndex: number) => {
            onDragEnter(rowIndex, -1);
        },
        [onDragEnter]
    );

    const handleColumnDragStart = React.useCallback(
        (colIndex: number) => {
            onDragStart(-1, colIndex);
        },
        [onDragStart]
    );

    const handleColumnDragEnter = React.useCallback(
        (colIndex: number) => {
            onDragEnter(-1, colIndex);
        },
        [onDragEnter]
    );

    return (
        <div>
            <TableContainerMui
                component={!isDarkMode ? PaperMui : "div"}
                sx={tableStyles}
                onPaste={handlePasteEvent}
            >
                <TableMui
                    ref={ref}
                    sx={{
                        "& .MuiTableCell-head": {
                            lineHeight: 0.05,
                        },
                    }}
                >
                    <TableHead>
                        <Row>
                            <SelectAllCell
                                selectAll={state.selectAll}
                                toggleSelectAll={() => {
                                    // TODO: Implement toggle all
                                }}
                            />
                            {state.data[0].map((_, colIndex) => (
                                <ColumnHeaderCell
                                    key={colIndex}
                                    atom={atom}
                                    index={colIndex}
                                    onDragStart={handleColumnDragStart}
                                    onDragEnter={handleColumnDragEnter}
                                    onDragEnd={onDragEnd}
                                    onAddColumnLeft={() => {}}
                                    onAddColumnRight={() => {}}
                                    onRemoveColumn={() => {}}
                                />
                            ))}
                        </Row>
                    </TableHead>
                    <TableBody>
                        {state.data.map((row, rowIndex) => (
                            <Row key={rowIndex}>
                                <RowNumberCell
                                    atom={atom}
                                    rowIndex={rowIndex}
                                    onDragStart={handleRowDragStart}
                                    onDragEnter={handleRowDragEnter}
                                    onDragEnd={onDragEnd}
                                    onAddAbove={() => {}}
                                    onAddBelow={() => {}}
                                    onRemove={() => {}}
                                />
                                {row.map((cellData, colIndex) => (
                                    <Cell
                                        key={colIndex}
                                        rowIndex={rowIndex}
                                        colIndex={colIndex}
                                        cellData={cellData}
                                        selectedCell={state.selectedCell}
                                        selectedCells={state.selectedCells}
                                        selectedColumns={state.selectedColumns}
                                        selectedRows={state.selectedRows}
                                        isDarkMode={theme.palette.mode === "dark"}
                                        onMouseDown={() => onDragStart(rowIndex, colIndex)}
                                        onMouseEnter={() => onDragEnter(rowIndex, colIndex)}
                                        onMouseUp={onDragEnd}
                                        onCellChange={onCellChange}
                                    />
                                ))}
                            </Row>
                        ))}
                    </TableBody>
                </TableMui>
                {children}
            </TableContainerMui>
        </div>
    );
});

Table.displayName = "Table";

export default Table;
