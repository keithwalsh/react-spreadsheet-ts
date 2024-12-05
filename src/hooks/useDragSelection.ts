/**
 * @fileoverview Hook to manage drag selection state and actions for spreadsheet
 * rows and columns.
 */

import { useCallback, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { startDrag, updateDragSelection, endDrag } from '../store/spreadsheetSlice'

export function useDragSelection() {
    const dispatch = useAppDispatch()
    const isDragging = useAppSelector(state => state.spreadsheet?.isDragging ?? false)

    useEffect(() => {
        const handleGlobalMouseUp = () => {
            if (isDragging) {
                dispatch(endDrag())
            }
        }

        window.addEventListener('mouseup', handleGlobalMouseUp, { passive: true })
        return () => window.removeEventListener('mouseup', handleGlobalMouseUp)
    }, [isDragging, dispatch])

    const handleDragStart = useCallback((row: number, col: number) => {
        if (!isDragging) {
            dispatch(startDrag({ row, col }))
        }
    }, [dispatch, isDragging])

    const handleDragEnter = useCallback((row: number, col: number) => {
        if (isDragging) {
            requestAnimationFrame(() => {
                dispatch(updateDragSelection({ row, col }))
            })
        }
    }, [isDragging, dispatch])

    const handleDragEnd = useCallback(() => {
        if (isDragging) {
            dispatch(endDrag())
        }
    }, [dispatch, isDragging])

    return {
        isDragging,
        handleDragStart,
        handleDragEnter,
        handleDragEnd
    }
} 