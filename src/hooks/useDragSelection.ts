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
        const handleGlobalMouseUp = (e: MouseEvent) => {
            if (isDragging) {
                e.preventDefault()
                dispatch(endDrag())
            }
        }

        const handleGlobalMouseMove = (e: MouseEvent) => {
            if (!isDragging) return
            
            // Prevent text selection during drag
            e.preventDefault()
        }

        window.addEventListener('mouseup', handleGlobalMouseUp)
        window.addEventListener('mousemove', handleGlobalMouseMove)
        
        return () => {
            window.removeEventListener('mouseup', handleGlobalMouseUp)
            window.removeEventListener('mousemove', handleGlobalMouseMove)
        }
    }, [isDragging, dispatch])

    const handleDragStart = useCallback((row: number, col: number) => {
        dispatch(startDrag({ row, col }))
    }, [dispatch])

    const handleDragEnter = useCallback((row: number, col: number) => {
        if (isDragging) {
            dispatch(updateDragSelection({ row, col }))
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