// src/components/SpreadsheetWrapper.tsx
import React from 'react';
import { Provider } from 'jotai';
import { createSpreadsheetAtom } from '../store/atoms';
import Spreadsheet from './Spreadsheet';

interface SpreadsheetWrapperProps {
    rows?: number
    cols?: number
}

export const SpreadsheetWrapper: React.FC<SpreadsheetWrapperProps> = ({ 
    rows = 4,
    cols = 4 
}) => {
    const spreadsheetAtom = React.useMemo(() => createSpreadsheetAtom(rows, cols), [rows, cols])
    
    return (
        <Provider>
            <Spreadsheet atom={spreadsheetAtom as any} />
        </Provider>
    )
}

export default SpreadsheetWrapper;