/**
 * @fileoverview Redux store configuration using Redux Toolkit for spreadsheet state
 * management. Includes the root reducer and store setup.
 */

import { configureStore } from '@reduxjs/toolkit'
import { spreadsheetReducer } from './spreadsheetSlice'

export const createStore = () => configureStore({
    reducer: {
        spreadsheet: spreadsheetReducer
    }
})

export type RootState = ReturnType<ReturnType<typeof createStore>['getState']>
export type AppDispatch = ReturnType<typeof createStore>['dispatch']