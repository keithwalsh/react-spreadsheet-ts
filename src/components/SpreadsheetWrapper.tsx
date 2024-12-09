// src/components/SpreadsheetWrapper.tsx
import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from '../store';
import Spreadsheet from './Spreadsheet';
import type { SpreadsheetProps } from '../types';

const SpreadsheetWrapper: React.FC<SpreadsheetProps> = (props) => {
    // Create store instance for this specific spreadsheet
    const store = createStore();

    return (
        <Provider store={store}>
            <Spreadsheet {...props} />
        </Provider>
    );
};

export default SpreadsheetWrapper;