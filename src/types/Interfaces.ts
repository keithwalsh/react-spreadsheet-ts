/**
import { ToolbarActionHandlers } from "./types";
import { ActionConfig } from "./types";
 * @file src/types/Interfaces.ts
 * @fileoverview Defines core interfaces for spreadsheet component state, props, and data structures
 */

// External dependencies
import { CSSProperties } from 'react';
import { DragEventHandler } from 'react';
import { MenuItemProps, PopoverOrigin, SxProps, TextFieldProps, Theme } from '@mui/material';
import { PrimitiveAtom } from 'jotai';
import { ArrowBack, ArrowDownward, ArrowForward, ArrowUpward } from '@mui/icons-material';

// Internal project modules
import { 
    ColumnContextMenu,
    RowContextMenu,
  } from "../components";
import { 
  ActionConfig,
  Alignment,
  ButtonType,
  ColumnContextMenuProps,
  DimensionType, 
  DirectionalMenuProps,
  InsertPosition, 
  Orientation, 
  SelectionType, 
  SpreadsheetDirection,
  TableSizeChooserProps,
  ToolbarActionHandlers,
  TooltipPlacement
} from "./";

/** Props for action menu items, omitting onClick from MenuItemProps */
export interface ActionMenuItemProps extends Omit<MenuItemProps, "onClick"> {
    icon: React.ElementType;
    onClick: () => void;
    text: string;
}

/** Defines an adjacent range by two corner coordinates */
export interface AdjacentRange {
    endCoordinate: CellCoordinate;
    startCoordinate: CellCoordinate;
}

/** Base context interface */
export interface BaseContextType {
    clearTable: () => void;
    deleteSelected: () => void;
    handleCENTER: () => void;
    handleLEFT: () => void;
    handleRIGHT: () => void;
    onClickCENTER: () => void;
    onClickLEFT: () => void;
    onClickRIGHT: () => void;
    spreadsheetAtom: PrimitiveAtom<SpreadsheetState>;
    transposeTable: () => void;
}

/** Base structure payload for modifications with current table state and target index */
export interface BaseStructurePayload {
    data: CellData[][];
    index: number;
    selectedCells: boolean[][];
}

/** Common handler props */
export interface BaseHandlers {
    onDragEnd: () => void;
    onDragEnter: (index: number) => void;
    onDragStart: (index: number) => void;
}

/** Base header cell props */
export interface BaseHeaderCellProps extends BaseProps, BaseHandlers {
    atom: PrimitiveAtom<SpreadsheetState>;
    index: number;
}

/** Base props that several components share */
export interface BaseProps {
    spreadsheetAtom: PrimitiveAtom<SpreadsheetState>;
}

/** Base props shared by all menu types */
export interface BaseMenuProps {
    anchorEl: HTMLElement | null;
    onClose: () => void;
    open: boolean;
}

/** Defines a button with a title, icon, and handler key. */
export interface ButtonDefinition {
    buttonType: ButtonType;
    handlerKey: string;
    icon: React.ElementType;
    title: string;
}

export interface ButtonGroupProps {
    dividerMargin?: number;
    iconMargin?: number;
    iconSize?: number;
    orientation?: Orientation;
    tooltipArrow?: boolean;
    tooltipPlacement?: TooltipPlacement;
    visibleButtons?: string[];
    visibleTypes?: ButtonType[];
}

/** Button-handler mapping by string keys */
export interface ButtonHandlerKey {
    [key: string]: () => void;
}

/** Coordinates of a cell (rowIndex, colIndex) */
export interface CellCoordinate {
    colIndex: number;
    rowIndex: number;
}

/** Props for cell content styling */
export interface CellContentStyleProps {
    cellData: CellData;
    isEditing: boolean;
    style?: CSSProperties;
}

/** Data for a single cell */
export interface CellData {
    align?: Alignment;
    link?: string;
    style: TextStyle;
    value: string;
}

/** Handler for mouse down events on cells with selection modifiers */
export interface CellMouseDownHandler {
    (coordinate: CellCoordinate, shiftKey: boolean, ctrlKey: boolean): void;
}

/** Props for the Cell component */
export interface CellProps {
    activeCell: CellCoordinate | null;
    cellData: CellData;
    colIndex: number;
    isDarkMode: boolean;
    onCellBlur?: () => void;
    onCellChange: (coordinate: CellCoordinate, value: string) => void;
    onCellKeyDown: (e: React.KeyboardEvent) => void;
    onDoubleClick?: (coordinate: CellCoordinate) => void;
    onMouseDown: CellMouseDownHandler;
    onMouseEnter: (coordinate: CellCoordinate) => void;
    onMouseUp: () => void;
    rowIndex: number;
    selectAll: boolean;
    selectedCells: boolean[][];
    selectedColumns: number[];
    selectedRows: number[];
    style?: CSSProperties;
}

/** Props for cell styling */
export interface CellStyleProps {
    colIndex: number;
    hasLink?: boolean;
    isColumnSelected: boolean;
    isDarkMode: boolean;
    isEditing: boolean;
    isRowSelected: boolean;
    isSelectAllSelected: boolean;
    isSelected: boolean;
    multipleCellsSelected: boolean;
    rowIndex: number;
    selectedCells: Record<number, Record<number, boolean>>;
    style?: CSSProperties;
}

/** Payload for data-related actions (for undo/redo or direct updates) */
export interface DataPayload {
    activeCell?: CellCoordinate | null;
    data: CellData[][];
    isAllSelected?: boolean;
    isDragging?: boolean;
    selectedCells?: boolean[][];
    selectedColumns?: number[];
    selectedRows?: number[];
}

/** Basic dimensions type */
export interface Dimensions {
    cols: number;
    rows: number;
}

/** Minimal payload for single-dimension operations (DELETE, etc.) */
export interface DimensionPayload {
    index: number;
}

/** Props for drag event handlers */
export interface DragHandlers {
    onDragEnd: () => void;
    onDragEnter: DragEventHandler;
    onDragStart: DragEventHandler;
}

/** Drag state for row/column/cell selection */
export interface DragState {
    isDragging: boolean;
    start: CellCoordinate | null;
}

/** Result of a structure-modification operation */
export interface OperationResult {
    newData: CellData[][];
    newSelectedCells: boolean[][];
}

/** Props for directional context menu */
export interface DirectionalContextMenuProps extends BaseMenuProps {
    direction: SpreadsheetDirection;
    onAddAfter: () => void;
    onAddBefore: () => void;
    onRemove: () => void;
}

/** Props for header cells with type safety */
export interface HeaderCellProps<T extends SpreadsheetDirection> {
    atom: PrimitiveAtom<SpreadsheetState>;
    ContextMenu: T extends SpreadsheetDirection.ROW ? typeof RowContextMenu : typeof ColumnContextMenu;
    index: number;
    isHighlighted: boolean;
    isSelected: boolean;
    menuProps: T extends SpreadsheetDirection.ROW ? DirectionalMenuProps<SpreadsheetDirection.ROW> : Omit<ColumnContextMenuProps, keyof BaseMenuProps>;
    onDragEnd: () => void;
    onDragEnter: (index: number) => void;
    onDragStart: (index: number) => void;
    renderContent: (index: number) => React.ReactNode;
    type: T;
}

export interface HeaderCellStylesParams {
    isSelected: boolean;
    isHighlighted: boolean;
    isHovered: boolean;
}

export interface LinkModalProps {
    initialUrl?: string;
    open: boolean;
    onClose: () => void;
    onSubmit: (url: string | undefined) => void;
}

export interface LinkModalStyles {
    dialogActions: SxProps<Theme>;
    buttonContainer: SxProps<Theme>;
}

/** Parameters for configuring the menu */
export interface MenuConfigParams extends ToolbarContextType {
    handleNewTable: () => void;
    onDownloadCSV: () => void;
    TableSizeChooser: React.ComponentType<TableSizeChooserProps>;
    toolbarContext: ToolbarContextType;
}

export interface MenuPositionConfig {
    afterIcon: typeof ArrowDownward | typeof ArrowForward;
    afterText: string;
    anchorOrigin: PopoverOrigin;
    beforeIcon: typeof ArrowUpward | typeof ArrowBack;
    beforeText: string;
    transformOrigin: PopoverOrigin;
}

/** Configuration for add/remove menu actions */
export interface MenuTypeConfig {
    add: ActionConfig[];
    remove: ActionConfig;
}

/** Result for paste operations */
export interface PasteOperationResult {
    dimensions: Dimensions;
    newAlignments: Alignment[][];
    newBold: boolean[][];
    newCode: boolean[][];
    newData: CellData[][];
    newItalic: boolean[][];
    newSelectedCells: boolean[][];
}

/** Payload for row/column insertion with position only (Action-level) */
export interface PositionalPayload extends DimensionPayload {
    position:
        | InsertPosition.ROW_ABOVE
        | InsertPosition.ROW_BELOW
        | InsertPosition.COL_LEFT
        | InsertPosition.COL_RIGHT;
}

/** Props for size input component */
export interface SizeInputProps extends Omit<TextFieldProps, 'onChange'> {
    label: DimensionType;
    max: number;
    onChange: (type: Lowercase<DimensionType>, value: string) => void;
    type: Lowercase<DimensionType>;
    value: string;
}

export interface SpreadsheetProps {
    atom: PrimitiveAtom<SpreadsheetState>;
    onChange?: (data: CellData[][]) => void;
    tableHeight?: string;
    value?: CellData[][];
}

/** Stores selection state in the spreadsheet */
export interface SpreadsheetSelection {
    activeCell: CellCoordinate | null;
    cells: boolean[][];
    columns: number[];
    dragState?: DragState;
    isAllSelected: boolean;
    rows: number[];
    type: SelectionType;
}

/** Entire spreadsheet state */
export interface SpreadsheetState {
    data: CellData[][];
    future: DataPayload[];
    past: DataPayload[];
    selection: SpreadsheetSelection;
}

export interface SpreadsheetWrapperProps {
    cols?: number;
    darkMode?: boolean;
    rows?: number;
}

/** Used for styling or dimension info */
export interface TableDimensions {
    setTableSize: (dimensions: Dimensions) => void;
}

/** Table operations and state */
export interface TableState {
    clearTable: () => void;
    currentCols: number;
    currentRows: number;
    deleteSelected: () => void;
    handleRedo: () => void;
    handleUndo: () => void;
    setTableSize: (dimensions: Dimensions) => void;
    transposeTable: () => void;
}

/** Base interface for table structure modifications */
export interface TableStructureModification {
    data: CellData[][];
    selectedCells: boolean[][];
    targetIndex?: number;
}

/** Text formatting styles */
export interface TextStyle {
    BOLD: boolean;
    CODE: boolean;
    ITALIC: boolean;
}

/** Extended toolbar context */
export interface ToolbarContextType extends 
    BaseContextType,
    Omit<ToolbarActionHandlers, 'handleLink'>,
    UIState,
    Omit<TableDimensions, 'rows' | 'cols'> {
    currentRows: number;
    currentCols: number;
    setTableSize: (dimensions: Dimensions) => void;
    handleUndo: () => void;
    handleRedo: () => void;
    onClickUndo: () => void;
    onClickRedo: () => void;
    // Redefine handleLink with the correct parameter structure
    handleLink: (params: { url: string | undefined, activeCell: CellCoordinate }) => void;
    // Text formatting handlers
    handleBold: () => void;
    handleItalic: () => void;
    handleCode: () => void;
    onClickBold: () => void;
    onClickItalic: () => void;
    onClickCode: () => void;
    onClickLink: () => void;
    // Toggle handlers
    handleTOGGLE_BOLD: () => void;
    handleTOGGLE_ITALIC: () => void;
    handleTOGGLE_CODE: () => void;
    handleTOGGLE_LINK: () => void;
    onClickTOGGLE_BOLD: () => void;
    onClickTOGGLE_ITALIC: () => void;
    onClickTOGGLE_CODE: () => void;
    onClickTOGGLE_LINK: () => void;
    // Alignment handlers
    handleAlignLeft: () => void;
    handleAlignCenter: () => void;
    handleAlignRight: () => void;
    onClickAlignLeft: () => void;
    onClickAlignCenter: () => void;
    onClickAlignRight: () => void;
}

export interface ToolbarProviderProps {
    children: React.ReactNode;
    clearTable: () => void;
    currentCols: number;
    currentRows: number;
    deleteSelected: () => void;
    onClickAddColumn: (position: InsertPosition.COL_LEFT | InsertPosition.COL_RIGHT) => void;
    onClickAddRow: (position: InsertPosition.ROW_ABOVE | InsertPosition.ROW_BELOW) => void;
    onClickAlignCenter: () => void;
    onClickAlignLeft: () => void;
    onClickAlignRight: () => void;
    onClickRedo: () => void;
    onClickRemoveColumn: () => void;
    onClickRemoveRow: () => void;
    onClickSetBold: () => void;
    onClickSetCode: () => void;
    onClickSetItalic: () => void;
    onClickUndo: () => void;
    setTableSize: (dimensions: Dimensions) => void;
    spreadsheetAtom: PrimitiveAtom<SpreadsheetState>;
    transposeTable: () => void;
}

/** UI state for link modals and snackbars */
export interface UIState {
    handleLinkModalClose: () => void;
    handleSnackbarClose: () => void;
    isLinkModalOpen: boolean;
    isSnackbarOpen: boolean;
    snackbarMessage: string;
}