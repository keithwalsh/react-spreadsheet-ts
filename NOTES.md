#### Tests

-   Paste data from clipboard
-   Apply formatting when single cell is selected and when multiple cells are selected
-   Apply alignment when single cell is selected and when multiple cells are selected
-   Delete rows
-   Delete columns
-   When a cell is in edit mode and contains content, the user must be able to highlight any portion of that content.
-   Cell range selection (when clicking inside the spreadsheet and dragging outwards)
-   Column header and row number selection via click-and-drag
-   Clicking a selected cell should not trigger a re-render that momentarily removes and reapplies the selection outline.
-   Column and row headers corresponding to selected cells should be automatically highlighted, to help users quickly track their position within the spreadsheet.
- The system must allow users to exit cell edit mode by clicking outside the active cell, without requiring them to enter edit mode on a different cell.
- When a single cell is selected and not in edit mode, pressing the up, down, left, or right arrow keys must move the selection to the next cell in the corresponding direction.
---

-   Multiple row selection via click-and-drag on row numbers is broken; only single row selection works.
-   Users cannot exit cell edit mode by clicking outside the active cell; they must enter edit mode on a different cell instead.

#### Problem

Spreadsheet paste functionality doesn't work on initial load because the container isn't focused and ready to receive paste events.

#### Solution

1. Make container focusable with `tabIndex={0}`
2. Auto-focus container on mount
3. Add document-level paste event listener
4. Handle paste events even when no cell is selected

Key code changes:

-   src/Spreadsheet.tsx

```tsx
// Make container focusable and auto-focus
const containerRef = useRef<HTMLDivElement>(null);
useEffect(() => {
    containerRef.current?.focus();
}, []);

// Add document-level paste handler
useEffect(() => {
    document.addEventListener("paste", handleGlobalPaste);
    return () => document.removeEventListener("paste", handleGlobalPaste);
}, [handlePasteEvent]);
```

#### Problem

Column header and row number selection via click-and-drag is not functioning.

#### Solution

1. Add mouse event handlers to `RowNumberCell` and `ColumnHeaderCell` components.

```tsx
onMouseDown={() => onDragStart(rowIndex)}
onMouseEnter={() => onDragEnter(rowIndex)}
onMouseUp={onDragEnd}
```

2. Define the drag handlers in `Spreadsheet.tsx`.

```tsx
const handleRowDragStart = useCallback((rowIndex: number) => {
    dispatch({ type: "START_ROW_SELECTION", payload: rowIndex });
}, []);

const handleRowDragEnter = useCallback(
    (rowIndex: number) => {
        if (state.dragStartRow !== null) {
            dispatch({ type: "UPDATE_ROW_SELECTION", payload: rowIndex });
        }
    },
    [state.dragStartRow]
);

const handleRowDragEnd = useCallback(() => {
    dispatch({ type: "END_ROW_SELECTION" });
}, []);
```

3. Add similar handlers for column selection.

The key is connecting mouse events to selection state updates through the reducer.

#### Problem

In edit mode, the cell shadow does not appear.

#### Solution

Apply the styles directly at the TableCell level (via sx prop) instead of nesting them. This ensures the shadow and other styles are applied with the correct specificity and scope.
Before:

```
position: "absolute",
top: 0,
left: 0,
// ... nested styles that didn't work
```

After:

```
// Direct application to TableCell
...(isEditing && {
    boxShadow: "rgba(0, 0, 0, 0.2) 0px 3px 1px -2px...",
    textIndent: "3px",
    zIndex: 1,
})

```
