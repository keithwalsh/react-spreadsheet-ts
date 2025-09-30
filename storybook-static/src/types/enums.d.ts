/** Action types for spreadsheet state management */
export declare enum ActionType {
    ACTIVATE_CELL = "ACTIVATE_CELL",
    APPLY_ALIGNMENT = "APPLY_ALIGNMENT",
    APPLY_ALIGNMENTS = "APPLY_ALIGNMENTS",
    APPLY_TEXT_FORMAT = "APPLY_TEXT_FORMAT",
    CLEAR_SELECTION = "CLEAR_SELECTION",
    CLEAR_TABLE = "CLEAR_TABLE",
    DELETE_COLUMN = "DELETE_COLUMN",
    DELETE_ROW = "DELETE_ROW",
    END_CELL_DRAG = "END_CELL_DRAG",
    END_COLUMN_DRAG = "END_COLUMN_DRAG",
    END_COLUMN_SELECTION = "END_COLUMN_SELECTION",
    END_ROW_DRAG = "END_ROW_DRAG",
    END_ROW_SELECTION = "END_ROW_SELECTION",
    INSERT_COLUMN = "INSERT_COLUMN",
    INSERT_ROW = "INSERT_ROW",
    PASTE = "PASTE",
    REDO = "REDO",
    RESIZE_TABLE = "RESIZE_TABLE",
    SELECT_ALL = "SELECT_ALL",
    SELECT_CELLS = "SELECT_CELLS",
    SELECT_COLUMN = "SELECT_COLUMN",
    SELECT_ROW = "SELECT_ROW",
    START_CELL_DRAG = "START_CELL_DRAG",
    START_COLUMN_DRAG = "START_COLUMN_DRAG",
    START_COLUMN_SELECTION = "START_COLUMN_SELECTION",
    START_ROW_DRAG = "START_ROW_DRAG",
    START_ROW_SELECTION = "START_ROW_SELECTION",
    TRANSPOSE_DATA = "TRANSPOSE_DATA",
    UNDO = "UNDO",
    UPDATE_CELL_DRAG = "UPDATE_CELL_DRAG",
    UPDATE_COLUMN_DRAG = "UPDATE_COLUMN_DRAG",
    UPDATE_COLUMN_SELECTION = "UPDATE_COLUMN_SELECTION",
    UPDATE_ROW_DRAG = "UPDATE_ROW_DRAG",
    UPDATE_ROW_SELECTION = "UPDATE_ROW_SELECTION",
    UPDATE_TABLE_DATA = "UPDATE_TABLE_DATA"
}
/** Cell alignment options */
export declare enum Alignment {
    LEFT = "LEFT",
    CENTER = "CENTER",
    RIGHT = "RIGHT"
}
/** Positions for inserting rows/columns */
export declare enum InsertPosition {
    COL_LEFT = "COL_LEFT",
    COL_RIGHT = "COL_RIGHT",
    ROW_ABOVE = "ROW_ABOVE",
    ROW_BELOW = "ROW_BELOW"
}
export declare enum Orientation {
    HORIZONTAL = "HORIZONTAL",
    VERTICAL = "VERTICAL"
}
export declare enum DimensionType {
    ROWS = "ROWS",
    COLUMNS = "COLUMNS"
}
export declare enum NavigationKey {
    UP = "ARROW_UP",
    DOWN = "ARROW_DOWN",
    LEFT = "ARROW_LEFT",
    RIGHT = "ARROW_RIGHT",
    ENTER = "ENTER"
}
export declare enum HandlerAction {
    CLICK = "CLICK",
    HANDLE = "HANDLE"
}
export declare enum TooltipPlacement {
    TOP = "TOP",
    BOTTOM = "BOTTOM",
    LEFT = "LEFT",
    RIGHT = "RIGHT",
    CENTER = "CENTER"
}
/** Text-format toggle operations */
export declare enum TextFormatting {
    BOLD = "BOLD",
    CODE = "CODE",
    ITALIC = "ITALIC",
    LINK = "LINK"
}
export declare enum SelectionType {
    SINGLE_CELL = "SINGLE_CELL",
    MULTI_CELL = "MULTI_CELL",
    COLUMN = "COLUMN",
    ROW = "ROW",
    SELECT_ALL = "SELECT_ALL",
    NONE = "NONE"
}
export declare enum KeyboardAction {
    MOVE = "MOVE",
    SELECT = "SELECT",
    EDIT = "EDIT",
    DELETE = "DELETE"
}
export declare enum DragType {
    NONE = "NONE",
    CELL = "CELL",
    ROW = "ROW",
    COLUMN = "COLUMN"
}
export declare enum CellEditMode {
    VIEW = "VIEW",
    EDIT = "EDIT"
}
export declare enum MenuAction {
    ADD_LEFT = "ADD_LEFT",
    ADD_RIGHT = "ADD_RIGHT",
    ADD_ABOVE = "ADD_ABOVE",
    ADD_BELOW = "ADD_BELOW",
    REMOVE = "REMOVE"
}
export declare enum CellState {
    EDITING = "EDITING",
    SELECTED = "SELECTED",
    DEFAULT = "DEFAULT"
}
export declare enum CellContentType {
    TEXT = "TEXT",
    LINK = "LINK"
}
export declare enum ThemeMode {
    DARK = "DARK",
    LIGHT = "LIGHT"
}
/** Directions for spreadsheet operations */
export declare enum SpreadsheetDirection {
    COLUMN = "COLUMN",
    ROW = "ROW"
}
/** Event types for drag operations */
export declare enum DragEventType {
    START = "drag_start",
    ENTER = "drag_enter",
    END = "drag_end"
}
export declare enum ThemeColors {
    DARK_TEXT = "#BEBFC0",
    DARK_BORDER = "#686868",
    DARK_BACKGROUND = "#414547",
    DARK_SELECTED = "#5A5A5A",
    LIGHT_TEXT = "rgba(0, 0, 0, 0.54)",
    LIGHT_BORDER = "#e0e0e0",
    LIGHT_BACKGROUND = "#f0f0f0",
    LIGHT_SELECTED = "#d0d0d0"
}
export declare enum TableDimensionLimits {
    MIN_ROWS = 1,
    MAX_ROWS = 500,
    MIN_COLUMNS = 2,
    MAX_COLUMNS = 20
}
export declare enum ButtonType {
    HISTORY = "HISTORY",
    ALIGNMENT = "ALIGNMENT",
    TEXT_FORMATTING = "TEXT_FORMATTING",
    TABLE_STRUCTURE = "TABLE_STRUCTURE"
}
export declare enum CellStyleProperty {
    BACKGROUND = "backgroundColor",
    BORDER = "border",
    COLOR = "color",
    FONT_WEIGHT = "fontWeight",
    FONT_STYLE = "fontStyle"
}
//# sourceMappingURL=enums.d.ts.map