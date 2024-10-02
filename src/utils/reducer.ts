import { Action, State } from "@types";
import { addRow, removeRow, addColumn, removeColumn } from "./grid";

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
        case "SET_ALIGNMENTS": {
            return {
                ...state,
                alignments: action.payload,
                past: [[state.data, state.alignments], ...state.past.slice(0, 9)],
                future: [],
            };
        }
        case "UNDO": {
            if (state.past.length === 0) return state;
            const [previousData, previousAlignments] = state.past[0];
            const newPast = state.past.slice(1);
            return {
                ...state,
                data: previousData,
                alignments: previousAlignments,
                past: newPast,
                future: [[state.data, state.alignments], ...state.future],
            };
        }
        case "REDO": {
            if (state.future.length === 0) return state;
            const [nextData, nextAlignments] = state.future[0];
            const newFuture = state.future.slice(1);
            return {
                ...state,
                data: nextData,
                alignments: nextAlignments,
                past: [[state.data, state.alignments], ...state.past],
                future: newFuture,
            };
        }
        case "SET_SELECTED_COLUMN":
            return { ...state, selectedColumn: action.payload };
        case "SET_SELECTED_ROW":
            return { ...state, selectedRow: action.payload };
        case "SET_SELECTED_CELL":
            return { ...state, selectedCell: action.payload };
        case "SET_SELECTED_CELLS":
            return { ...state, selectedCells: action.payload };
        case "SET_SELECT_ALL":
            return { ...state, selectAll: action.payload };
        case "CLEAR_SELECTION":
            return {
                ...state,
                selectedCells: Array.from({ length: state.data.length }, () => Array(state.data[0].length).fill(false)),
                selectAll: false,
                selectedColumn: null,
                selectedRow: null,
                selectedCell: null,
            };
        case "ADD_ROW": {
            const { newData, newAlignments, newSelectedCells } = addRow(state.data, state.alignments, state.selectedCells);
            return {
                ...state,
                data: newData,
                alignments: newAlignments,
                selectedCells: newSelectedCells,
            };
        }
        case "REMOVE_ROW": {
            const { newData, newAlignments, newSelectedCells } = removeRow(state.data, state.alignments, state.selectedCells);
            return {
                ...state,
                data: newData,
                alignments: newAlignments,
                selectedCells: newSelectedCells,
            };
        }
        case "ADD_COLUMN": {
            const { newData, newAlignments, newSelectedCells } = addColumn(state.data, state.alignments, state.selectedCells);
            return {
                ...state,
                data: newData,
                alignments: newAlignments,
                selectedCells: newSelectedCells,
            };
        }
        case "REMOVE_COLUMN": {
            const { newData, newAlignments, newSelectedCells } = removeColumn(state.data, state.alignments, state.selectedCells);
            return {
                ...state,
                data: newData,
                alignments: newAlignments,
                selectedCells: newSelectedCells,
            };
        }
        case "SET_ALIGNMENT": {
            const alignment = action.payload;
            const newAlignments = state.alignments.map((row) => [...row]);

            if (state.selectAll) {
                // Apply alignment to all cells
                for (let i = 0; i < newAlignments.length; i++) {
                    for (let j = 0; j < newAlignments[i].length; j++) {
                        newAlignments[i][j] = alignment;
                    }
                }
            } else if (state.selectedColumn !== null) {
                for (let i = 0; i < newAlignments.length; i++) {
                    newAlignments[i][state.selectedColumn] = alignment;
                }
            } else if (state.selectedRow !== null) {
                for (let j = 0; j < newAlignments[state.selectedRow].length; j++) {
                    if (state.selectedCells[state.selectedRow][j]) {
                        newAlignments[state.selectedRow][j] = alignment;
                    }
                }
            } else if (state.selectedCell !== null) {
                newAlignments[state.selectedCell.row][state.selectedCell.col] = alignment;
            }

            return {
                ...state,
                alignments: newAlignments,
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
        case "SET_BOLD": {
            const newData = state.data.map((row, rowIndex) =>
                row.map((cell, colIndex) => {
                    if (
                        (state.selectAll ||
                            (state.selectedColumn !== null && colIndex === state.selectedColumn) ||
                            (state.selectedRow !== null && rowIndex === state.selectedRow) ||
                            (state.selectedCell !== null && rowIndex === state.selectedCell.row && colIndex === state.selectedCell.col) ||
                            state.selectedCells[rowIndex][colIndex]) &&
                        cell.trim() !== "" // Check if the cell has non-empty content
                    ) {
                        // If the cell is already bold, remove the asterisks
                        if (cell.startsWith("**") && cell.endsWith("**")) {
                            return cell.slice(2, -2);
                        }
                        // Otherwise, add asterisks to make it bold
                        return `**${cell}**`;
                    }
                    return cell;
                })
            );
            return { ...state, data: newData };
        }
        case "SET_ITALIC": {
            const newData = state.data.map((row, rowIndex) =>
                row.map((cell, colIndex) => {
                    if (
                        (state.selectAll ||
                            (state.selectedColumn !== null && colIndex === state.selectedColumn) ||
                            (state.selectedRow !== null && rowIndex === state.selectedRow) ||
                            (state.selectedCell !== null && rowIndex === state.selectedCell.row && colIndex === state.selectedCell.col) ||
                            state.selectedCells[rowIndex][colIndex]) &&
                        cell.trim() !== "" // Check if the cell has non-empty content
                    ) {
                        if (cell.startsWith("**_") && cell.endsWith("_**")) {
                            return cell.slice(0, 2) + cell.slice(3, -3) + cell.slice(-2);
                        }
                        // If the string already begins and ends with "_", remove them
                        else if (cell.startsWith("_") && cell.endsWith("_")) {
                            return cell.slice(1, -1);
                        }
                        // If the string begins and ends with "**", add "_" after the first "**" and before the last "**"
                        else if (cell.startsWith("**") && cell.endsWith("**")) {
                            return cell.replace(/^\*\*/, "**_").replace(/\*\*$/, "_**");
                        }
                        // Otherwise, add "_" at the start and end of the string
                        else {
                            return `_${cell}_`;
                        }
                    }
                    return cell;
                })
            );
            return { ...state, data: newData };
        }
        case "SET_CODE": {
            const newData = state.data.map((row, rowIndex) =>
                row.map((cell, colIndex) => {
                    if (
                        (state.selectAll ||
                            (state.selectedColumn !== null && colIndex === state.selectedColumn) ||
                            (state.selectedRow !== null && rowIndex === state.selectedRow) ||
                            (state.selectedCell !== null && rowIndex === state.selectedCell.row && colIndex === state.selectedCell.col) ||
                            state.selectedCells[rowIndex][colIndex]) &&
                        cell.trim() !== "" // Check if the cell has non-empty content
                    ) {
                        let content = cell;
                        let prefix = "";
                        let suffix = "";

                        // Extract bold and italic markers
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

                        // Handle code block formatting
                        if (content.startsWith("```") && content.endsWith("```")) {
                            content = content.slice(3, -3);
                        } else if (content.startsWith("`") && content.endsWith("`")) {
                            content = content.slice(1, -1);
                        } else if (content.includes("\n")) {
                            content = "```\n" + content + "\n```";
                        } else {
                            content = "`" + content + "`";
                        }

                        // Reapply bold and italic markers
                        return prefix + content + suffix;
                    }
                    return cell;
                })
            );
            return { ...state, data: newData };
        }

        default:
            return state;
    }
}
