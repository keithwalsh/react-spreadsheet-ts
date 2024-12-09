# react-spreadsheet-ts

![Build](https://github.com/keithwalsh/react-spreadsheet-ts/actions/workflows/build.yml/badge.svg)
[![NPM Version](https://img.shields.io/npm/v/react-spreadsheet-ts.svg)](https://www.npmjs.com/package/react-spreadsheet-ts)
[![Code Climate](https://codeclimate.com/github/keithwalsh/react-spreadsheet-ts/badges/gpa.svg)](https://codeclimate.com/github/keithwalsh/react-spreadsheet-ts)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)

A lightweight, fully-typed React spreadsheet component built with TypeScript and Material-UI (MUI). 

## Features

- **Theme Support:** Integrates with MUI's ThemeProvider for consistent theming
- **CSV Export:** Export your data to CSV format
- **Cell Formatting:** 
  - Text formatting (bold, italic, code)
  - Text alignment (left, center, right)
  - URL links
- **Row and Column Operations:**
  - Add/remove rows and columns
  - Clear table contents
  - Transpose table
- **Selection Features:**
  - Single cell selection
  - Multi-cell selection
  - Row and column selection
  - Select all
- **Clipboard Operations:** 
  - Copy/paste support
  - Paste from external sources
- **History Management:**
  - Undo/redo functionality
  - State tracking
- **Redux Integration:** Built-in state management with Redux

## Installation
```bash
npm install react-spreadsheet-ts
```

## Basic Usage
```tsx
import { Spreadsheet } from 'react-spreadsheet-ts';
import { ThemeProvider, createTheme } from '@mui/material';

function App() {
  const theme = createTheme({
    palette: {
      mode: 'light' // or 'dark'
    }
  });

  return (
    <ThemeProvider theme={theme}>
      <Spreadsheet tableHeight="250px" />
    </ThemeProvider>
  );
}
```

## Props

| Prop | Type | Default | Description |
|----------------------|----------------------------------------------------------------------|----------------|-----------------------------------------------------------------------------------------------------------------|
| tableHeight | string | '250px' | The height of the table container. |
| value | CellData[][] | undefined | The initial data for the spreadsheet cells. Each cell can contain content and formatting options. |
| onChange | (data: CellData[][]) => void | undefined | Callback fired when the spreadsheet data changes. Receives the complete updated dataset. |

### Data Structure
The spreadsheet uses a two-dimensional array of `CellData` objects to represent the grid:

```typescript
interface CellData {
    content: string       // The text content of the cell
    alignment?: Alignment // Text alignment ('left', 'center', 'right')
    bold?: boolean       // Bold formatting
    italic?: boolean     // Italic formatting
    code?: boolean       // Code (monospace) formatting
    link?: string        // Optional URL for cell content
}
```

### onChange Callback
The `onChange` callback is called whenever the spreadsheet data is modified. It receives the entire updated dataset as a two-dimensional array of `CellData` objects:

```typescript
const handleChange = (newData: CellData[][]) => {
    // Example of the data structure received:
    // [
    //     [
    //         { content: "A1", alignment: "left", bold: false },
    //         { content: "B1", alignment: "center", bold: true }
    //     ],
    //     [
    //         { content: "A2", alignment: "right", italic: true },
    //         { content: "B2", alignment: "left", code: true }
    //     ]
    // ]
    console.log('Spreadsheet data changed:', newData);
};
```

## Controlled Component Example
```tsx
import { useState } from 'react';
import { Spreadsheet, CellData } from 'react-spreadsheet-ts';
import { ThemeProvider, createTheme } from '@mui/material';

function App() {
  const [data, setData] = useState<CellData[][]>([
    [
      { content: 'Name', alignment: 'center', bold: true },
      { content: 'Age', alignment: 'center', bold: true },
      { content: 'Country', alignment: 'center', bold: true }
    ],
    [
      { content: 'Alice', alignment: 'left' },
      { content: '30', alignment: 'right' },
      { content: 'USA', alignment: 'left' }
    ]
  ]);

  const theme = createTheme({
    palette: {
      mode: 'light'
    }
  });

  const handleDataChange = (newData: CellData[][]) => {
    setData(newData);
    // You can perform additional operations here, such as:
    // - Saving to a backend
    // - Validating data
    // - Triggering other UI updates
  };

  return (
    <ThemeProvider theme={theme}>
      <Spreadsheet
        value={data}
        onChange={handleDataChange}
        tableHeight="250px"
      />
    </ThemeProvider>
  );
}
```

## State Management
The spreadsheet component internally manages its state using Redux, but exposes changes through the `onChange` callback. This allows you to:
- Track all changes to the spreadsheet data
- Implement undo/redo functionality in your application
- Sync data with external storage
- Validate changes before accepting them

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.