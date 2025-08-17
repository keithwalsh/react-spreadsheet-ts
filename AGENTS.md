# Codebase Overview
`react-spreadsheet-ts` provides a lightweight, fully typed spreadsheet component built on React, Material‑UI, and Jotai state atoms. The library exposes a single entry point that re-exports the main wrapper component and its props for consumers.

## Components
- **SpreadsheetWrapper** – sets up theme and state providers, creating a per-instance atom and switching between light and dark modes via MUI’s `ThemeProvider`.

- **Spreadsheet** – core UI component that wires together hooks for structure editing, drag selection, keyboard navigation, undo/redo, and toolbar actions, while managing history and CSV export logic.

## State Management
- **Initial State & Atom Factory** – `initialState` seeds cell data, selection, and history buffers, while `createSpreadsheetAtom` produces isolated Jotai atoms with helper utilities like `updateData` for immutable updates.

## Hooks
- **Structure Operations** – `useTableStructure` exposes add/remove row/column handlers with history tracking.
- **Selection** – `useDragSelection` tracks mouse drag state to update row, column, or cell selections.
- **Formatting & Alignment** – `useTableActions` toggles text styles or alignment across active selections.
- **Undo/Redo** – `useUndoRedo` manipulates `past` and `future` stacks for reversible operations.

## Utilities & Types
- **A central index** re-exports spreadsheet operations, selection helpers, CSV conversion, history utilities, and more.

- **Comprehensive type definitions** describe actions, payloads, and atom contracts, enabling typed handler patterns throughout the codebase.

## Configuration & Styling
- **Toolbar and menu behavior** is configurable via `buttonConfig` and `menuConfig`, defining default buttons, shortcuts, and table actions.
- **Styling helpers** in `src/styles` centralize cell appearance, button groups, and theme-aware colors for consistent rendering.

Overall, the repository organizes its spreadsheet functionality into modular React components, Jotai atoms for state isolation, custom hooks for user interactions, and utility layers for data manipulation and UI configuration.