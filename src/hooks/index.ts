/**
 * @file src/hooks/index.ts
 * @fileoverview Exports custom hooks for handling outside clicks, table actions, drag selection, table structure, undo/redo functionality, and keyboard navigation.
 */

import useOutsideClick from "./useOutsideClick";
import useTableActions from "./useTableActions";
import { useDragSelection } from "./useDragSelection";
import { useTableStructure } from "./useTableStructure";
import { useUndoRedo } from "./useUndoRedo";
import { useKeyboardNavigation } from "./useKeyboardNavigation";

export { 
    useOutsideClick, 
    useTableActions, 
    useDragSelection, 
    useTableStructure, 
    useUndoRedo,
    useKeyboardNavigation 
};
