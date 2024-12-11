#### Tests

-   Paste data from clipboard
    //- Apply formatting/alignment when single cell is selected.
    //- Apply formatting/alignment when multiple cells are selected via cell range selection.
    //- Apply formatting/alignment when multiple cells are selected via column header selection.
    //- Apply formatting/alignment when multiple cells are selected via row number selection.
    //- Apply formatting/alignment when multiple cells are selected via "Select All" checkbox.
    //- Delete/add rows/columns via context menu.
    //- Delete/add rows/columns via Button Group.
    //- Users should be able to highlight content within cells in edit mode.
    //- Cell range selection (when clicking inside the spreadsheet and dragging outwards)
    //- Enable column header and row number selection via click-and-drag.
    //- Clicking a selected cell should not trigger a re-render that removes and reapplies the selection outline.
    //- When one or more cells are selected, the corresponding row and column headers should be highlighted.
    //- Exit cell edit mode by clicking outside the active cell.
-   When not in edit mode and a single cell is selected, arrow keys should move the selection to the adjacent cell.
    //- The spreadsheet component must deselect all cells when the user clicks anywhere outside its boundaries.

---

#### Bugs

-   Entering content in spreadsheet cell edit mode, then exiting, duplicates the content on a new line.
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
