  /** Action types for spreadsheet state management */
  export enum ActionType {
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
  export enum Alignment {
    LEFT = "LEFT",
    CENTER = "CENTER",
    RIGHT = "RIGHT"
  }

  /** Positions for inserting rows/columns */
  export enum InsertPosition {
    COL_LEFT = "COL_LEFT",
    COL_RIGHT = "COL_RIGHT",
    ROW_ABOVE = "ROW_ABOVE",
    ROW_BELOW = "ROW_BELOW"
  }

  export enum Orientation {
    HORIZONTAL = "HORIZONTAL",
    VERTICAL = "VERTICAL"
  }
  
  export enum DimensionType {
    ROWS = "ROWS",
    COLUMNS = "COLUMNS"
  }

  export enum HandlerAction {
    CLICK = "CLICK",
    HANDLE = "HANDLE"
  }
  
  /** Directions for spreadsheet operations */
 export enum SpreadsheetDirection {
    COLUMN = "COLUMN",
    ROW = "ROW"
  }

  export enum TooltipPlacement {
    TOP = "TOP",
    BOTTOM = "BOTTOM",
    LEFT = "LEFT",
    RIGHT = "RIGHT"
  }

  /** Text-format toggle operations */
  export enum TextFormatOperation {
    TOGGLE_BOLD = "TOGGLE_BOLD",
    TOGGLE_CODE = "TOGGLE_CODE",
    TOGGLE_ITALIC = "TOGGLE_ITALIC",
    TOGGLE_LINK = "TOGGLE_LINK"
  }