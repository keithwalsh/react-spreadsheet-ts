import * as React from "react";
import { TableContainer as TableContainerMui, Table as TableMui, Paper as PaperMui, TableHead, TableBody, useTheme } from "@mui/material";
import { useAtom } from "jotai";
import { PrimitiveAtom } from "jotai";
import { State } from "../types";
import Row from "./Row";
import Cell from "./Cell";
import RowNumberCell from "./RowNumberCell";
import ColumnHeaderCell from "./ColumnHeaderCell";
import SelectAllCell from "./SelectAllCell";

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

    const theme = useTheme();
    const isDarkMode = theme.palette.mode === "dark";

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
        borderRight: "none",
        borderBottom: "none",
    };

    const handleDragStart = React.useCallback(
        (event: React.DragEvent<HTMLDivElement>) => {
            event.preventDefault();
            onDragStart(-1, -1); // Will be set by the cell components
        },
        [onDragStart]
    );

    const handleDragEnter = React.useCallback(
        (event: React.DragEvent<HTMLDivElement>) => {
            event.preventDefault();
            onDragEnter(-1, -1); // Will be set by the cell components
        },
        [onDragEnter]
    );

    const handleDragEnd = React.useCallback(
        (event: React.DragEvent<HTMLDivElement>) => {
            event.preventDefault();
            onDragEnd();
        },
        [onDragEnd]
    );

    return (
        <div>
            <TableContainerMui
                component={!isDarkMode ? PaperMui : "div"}
                sx={{
                    ...(isDarkMode ? darkThemeStyles : lightThemeStyles),
                    ...commonStyles,
                }}
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
                                    onDragStart={handleDragStart}
                                    onDragEnter={handleDragEnter}
                                    onDragEnd={handleDragEnd}
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
                                    onDragStart={handleDragStart}
                                    onDragEnter={handleDragEnter}
                                    onDragEnd={handleDragEnd}
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
