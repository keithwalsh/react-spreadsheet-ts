import { Action, State, Alignment } from "./types";
import { adjustTableSize, addRow, removeRow, addColumn, removeColumn, markSelectedCells } from "../utils";

/**
 * The reducer function to manage table state.
 */
export function reducer(state: State, action: Action): State {
    switch (action.type) {
        case "SET_DATA": {
            return {
                ...state,
                data: action.payload,
                past: [[state.data, state.alignments], ...state.past.slice(0, 9)],
                future: [],
            };
        }

        case "SET_ALIGNMENT": {
            const alignment = action.payload;
            const newAlignments = state.alignments.map((row, rowIndex) =>
                row.map((cellAlignment, colIndex) => {
                    if (
                        state.selectAll ||
                        (state.selectedColumn !== null && colIndex === state.selectedColumn) ||
                        (state.selectedRow !== null && rowIndex === state.selectedRow) ||
                        (state.selectedCell !== null && rowIndex === state.selectedCell.row && colIndex === state.selectedCell.col) ||
                        state.selectedCells[rowIndex][colIndex]
                    ) {
                        return alignment;
                    }
                    return cellAlignment;
                })
            );

            return {
                ...state,
                alignments: newAlignments,
            };
        }

        case "UNDO":
        case "REDO": {
            const isUndo = action.type === "UNDO";
            const sourceStack = isUndo ? state.past : state.future;
            const targetStack = isUndo ? state.future : state.past;

            if (sourceStack.length === 0) {
                return state;
            }

            const [newData, newAlignments] = sourceStack[0];
            const newPresent: [string[][], Alignment[][]] = [state.data, state.alignments];

            return {
                ...state,
                data: newData,
                alignments: newAlignments,
                past: isUndo ? sourceStack.slice(1) : ([newPresent, ...targetStack] as [string[][], Alignment[][]][]),
                future: isUndo ? ([newPresent, ...targetStack] as [string[][], Alignment[][]][]) : sourceStack.slice(1),
                // Clear selection states
                selectedColumn: null,
                selectedRow: null,
                selectedCell: null,
                selectedCells: Array.from({ length: newData.length }, () => Array(newData[0].length).fill(false)),
                selectAll: false,
            };
        }

        case "SET_SELECT_ALL": {
            const newSelectAll = action.payload;
            const newSelectedCells = state.data.map((row) => row.map(() => newSelectAll));
            return {
                ...state,
                selectAll: newSelectAll,
                selectedCells: newSelectedCells,
                selectedRow: null,
                selectedColumn: null,
                selectedCell: null,
            };
        }

        case "SET_SELECTED_COLUMN":
        case "SET_SELECTED_ROW":
        case "SET_SELECTED_CELL":
        case "SET_SELECTED_CELLS":
        case "SET_SELECT_ALL":
        case "CLEAR_SELECTION":
            return {
                ...state,
                selectedColumn: action.type === "SET_SELECTED_COLUMN" ? action.payload : null,
                selectedRow: action.type === "SET_SELECTED_ROW" ? action.payload : null,
                selectedCell: action.type === "SET_SELECTED_CELL" ? action.payload : null,
                selectedCells:
                    action.type === "SET_SELECTED_CELLS"
                        ? action.payload
                        : action.type === "CLEAR_SELECTION"
                        ? Array.from({ length: state.data.length }, () => Array(state.data[0].length).fill(false))
                        : state.selectedCells,
                selectAll: action.type === "SET_SELECT_ALL" ? action.payload : false,
            };

        case "ADD_ROW":
        case "REMOVE_ROW":
        case "ADD_COLUMN":
        case "REMOVE_COLUMN": {
            const operationMap = {
                ADD_ROW: addRow,
                REMOVE_ROW: removeRow,
                ADD_COLUMN: addColumn,
                REMOVE_COLUMN: removeColumn,
            };

            const operation = operationMap[action.type];
            const operationParams = {
                data: state.data,
                alignments: state.alignments,
                selectedCells: state.selectedCells,
                ...(action.type === "ADD_COLUMN" && { index: action.payload.index, position: action.payload.position }),
                ...(action.type === "REMOVE_COLUMN" && { index: action.payload.index }),
            };

            const { newData, newAlignments, newSelectedCells } = operation(operationParams);

            return {
                ...state,
                data: newData,
                alignments: newAlignments,
                selectedCells: newSelectedCells,
                selectedColumn: null,
                selectedRow: null,
                selectedCell: null,
                selectAll: false,
                past: [[state.data, state.alignments], ...state.past.slice(0, 9)],
                future: [],
            };
        }

        case "HANDLE_PASTE": {
            const { newData, newAlignments } = action.payload;
            const newSelectedCells = Array.from({ length: newData.length }, () => Array(newData[0].length).fill(false));
            return {
                ...state,
                data: newData,
                alignments: newAlignments,
                selectedCells: newSelectedCells,
            };
        }

        case "APPLY_TEXT_FORMATTING": {
            const { operation } = action.payload;
            const newData = state.data.map((row, rowIndex) =>
                row.map((cell, colIndex) => {
                    if (
                        (state.selectAll ||
                            (state.selectedColumn !== null && colIndex === state.selectedColumn) ||
                            (state.selectedRow !== null && rowIndex === state.selectedRow) ||
                            (state.selectedCell !== null && rowIndex === state.selectedCell.row && colIndex === state.selectedCell.col) ||
                            state.selectedCells[rowIndex][colIndex]) &&
                        cell.trim() !== ""
                    ) {
                        switch (operation) {
                            case "BOLD":
                                return cell.startsWith("**") && cell.endsWith("**") ? cell.slice(2, -2) : `**${cell}**`;
                            case "ITALIC":
                                if (cell.startsWith("**_") && cell.endsWith("_**")) {
                                    return cell.slice(0, 2) + cell.slice(3, -3) + cell.slice(-2);
                                } else if (cell.startsWith("_") && cell.endsWith("_")) {
                                    return cell.slice(1, -1);
                                } else if (cell.startsWith("**") && cell.endsWith("**")) {
                                    return cell.replace(/^\*\*/, "**_").replace(/\*\*$/, "_**");
                                } else {
                                    return `_${cell}_`;
                                }
                            case "CODE":
                                let content = cell;
                                let prefix = "";
                                let suffix = "";
                                if (content.startsWith("**") && content.endsWith("**")) {
                                    prefix = "**";
                                    suffix = "**";
                                    content = content.slice(2, -2);
                                }
                                if (content.startsWith("_") && content.endsWith("_")) {
                                    prefix = prefix + "_";
                                    suffix = "_" + suffix;
                                    content = content.slice(1, -1);
                                }

                                if (content.startsWith("```") && content.endsWith("```")) {
                                    content = content.slice(3, -3);
                                } else if (content.startsWith("`") && content.endsWith("`")) {
                                    content = content.slice(1, -1);
                                } else if (content.includes("\n")) {
                                    content = "```\n" + content + "\n```";
                                } else {
                                    content = "`" + content + "`";
                                }
                                return prefix + content + suffix;
                        }
                    }
                    return cell;
                })
            );
            return { ...state, data: newData };
        }

        case "START_DRAG":
        case "UPDATE_DRAG":
        case "END_DRAG":
            let updatedSelectedCells = state.selectedCells;
            if (action.type === "START_DRAG" || action.type === "UPDATE_DRAG") {
                const startRow = action.type === "START_DRAG" ? action.payload.row : state.dragStart!.row;
                const startCol = action.type === "START_DRAG" ? action.payload.col : state.dragStart!.col;
                const endRow = action.type === "UPDATE_DRAG" ? action.payload.row : action.payload.row;
                const endCol = action.type === "UPDATE_DRAG" ? action.payload.col : action.payload.col;
                updatedSelectedCells = markSelectedCells(state.data, startRow, startCol, endRow, endCol);
            }
            return {
                ...state,
                isDragging: action.type !== "END_DRAG",
                dragStart: action.type === "START_DRAG" ? action.payload : action.type === "END_DRAG" ? null : state.dragStart,
                selectedCells: updatedSelectedCells,
            };

        case "SET_TABLE_SIZE": {
            const { row, col } = action.payload;
            const { data, alignments, selectedCells } = adjustTableSize(state.data, state.alignments, row, col);
            return {
                ...state,
                data,
                alignments,
                selectedCells,
                selectedCell: null,
                selectedRow: null,
                selectedColumn: null,
                selectAll: false,
            };
        }

        case "CLEAR_TABLE": {
            const newData = state.data.map((row) => row.map(() => ""));
            return {
                ...state,
                data: newData,
                past: [[state.data, state.alignments], ...state.past.slice(0, 9)],
                future: [],
            };
        }

        case "TRANSPOSE_TABLE": {
            const newData = state.data[0].map((_, colIndex) => state.data.map((row) => row[colIndex]));
            const newAlignments = state.alignments[0].map((_, colIndex) => state.alignments.map((row) => row[colIndex]));
            const newSelectedCells = Array.from({ length: newData.length }, () => Array(newData[0].length).fill(false));
            return {
                ...state,
                data: newData,
                alignments: newAlignments,
                selectedCells: newSelectedCells,
                past: [[state.data, state.alignments], ...state.past.slice(0, 9)],
                future: [],
                selectedCell: null,
                selectedRow: null,
                selectedColumn: null,
                selectAll: false,
            };
        }

        default:
            return state;
    }
}
