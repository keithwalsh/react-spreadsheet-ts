/**
 * @file src/hooks/useOutsideClick.ts
 * @fileoverview Detects clicks outside specified elements and triggers a cleanup action,
 * commonly used for closing menus or clearing selections in a spreadsheet.
 */

import { useEffect } from "react";
import { PrimitiveAtom, useSetAtom } from "jotai";
import { SpreadsheetState } from "../types";

const useOutsideClick = (refs: React.RefObject<HTMLElement>[], atom: PrimitiveAtom<SpreadsheetState>) => {
    const setState = useSetAtom(atom);

    useEffect(() => {
        const listener = (event: MouseEvent) => {
            // Check if click was inside any of the refs
            if (refs.some((ref) => ref.current && ref.current.contains(event.target as Node))) {
                return;
            }

            // Clear all selections when clicking outside
            setState((prev) => ({
                ...prev,
                selectedCell: null,
                selectedCells: Array(prev.data.length).fill(Array(prev.data[0].length).fill(false)),
                selectedRows: [],
                selectedColumns: [],
                selectAll: false,
            }));
        };

        document.addEventListener("mousedown", listener);
        return () => {
            document.removeEventListener("mousedown", listener);
        };
    }, [refs, setState]);
};

export default useOutsideClick;
