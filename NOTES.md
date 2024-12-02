### Problem
Spreadsheet paste functionality doesn't work on initial load because the container isn't focused and ready to receive paste events.

### Solution
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