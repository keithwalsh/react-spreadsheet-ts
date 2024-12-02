#### Tests
- Paste data from clipboard
- Select and drag to select multiple cells
- Select and drag to select rows
- Select and drag to select columns
- Delete rows
- Delete columns
- Highlight part of the contents of a cell



#### Problem
Spreadsheet paste functionality doesn't work on initial load because the container isn't focused and ready to receive paste events.

#### Solution
1. Make container focusable with `tabIndex={0}`
2. Auto-focus container on mount
3. Add document-level paste event listener
4. Handle paste events even when no cell is selected

Key code changes:
- src/Spreadsheet.tsx
```tsx
// Make container focusable and auto-focus
const containerRef = useRef<HTMLDivElement>(null);
useEffect(() => {
    containerRef.current?.focus();
}, []);

// Add document-level paste handler
useEffect(() => {
    document.addEventListener('paste', handleGlobalPaste);
    return () => document.removeEventListener('paste', handleGlobalPaste);
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

const handleRowDragEnter = useCallback((rowIndex: number) => {
    if (state.dragStartRow !== null) {
        dispatch({ type: "UPDATE_ROW_SELECTION", payload: rowIndex });
    }
}, [state.dragStartRow]);

const handleRowDragEnd = useCallback(() => {
    dispatch({ type: "END_ROW_SELECTION" });
}, []);
```
3. Add similar handlers for column selection.

The key is connecting mouse events to selection state updates through the reducer.