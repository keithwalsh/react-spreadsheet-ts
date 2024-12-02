# react-spreadsheet-ts

![Build](https://github.com/keithwalsh/react-spreadsheet-ts/actions/workflows/build.yml/badge.svg)
[![NPM Version](https://img.shields.io/npm/v/react-spreadsheet-ts.svg)](https://www.npmjs.com/package/react-spreadsheet-ts)
[![Code Climate](https://codeclimate.com/github/keithwalsh/react-spreadsheet-ts/badges/gpa.svg)](https://codeclimate.com/github/keithwalsh/react-spreadsheet-ts)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)

A lightweight, fully-typed React spreadsheet component built with TypeScript and Material-UI (MUI). 

## Features

- **Light/Dark Theme Support:** Easily switch between light and dark modes.
- **CSV Export:** Export your data to CSV format.
- **Cell Formatting:** Apply bold, italic, and code formatting to cells.
- **Text Alignment:** Align cell text to the left, center, or right.
- **Row and Column Operations:**
  - Add or remove rows and columns.
  - Clear the table.
  - Transpose the table.
- **Cell Selection and Multi-Selection:** Select individual cells or ranges of cells.
- **Copy/Paste Support:** Copy and paste cell data.
- **Undo/Redo Functionality:** Revert or reapply changes.
- **Virtual Scrolling:** Efficient rendering for large datasets.

## Installation
Install the package via npm:
`npm install react-spreadsheet-ts`

## Usage
Import the Spreadsheet component and include it in your React application:
```tsx
import { Spreadsheet } from 'react-spreadsheet-ts';

function App() {
  return (
    <Spreadsheet
      theme="light"
      toolbarOrientation="horizontal"
      initialRows={4}
      initialColumns={10}
      tableHeight="250px"
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|----------------------|----------------------------------------------------------------------|----------------|-----------------------------------------------------------------------------------------------------------------|
| theme | 'light' \| 'dark' | 'light' | The theme of the spreadsheet. |
| toolbarOrientation | 'horizontal' \| 'vertical' | 'horizontal' | Orientation of the toolbar. |
| initialRows | number | 4 | The initial number of rows. |
| initialColumns | number | 10 | The initial number of columns. |
| tableHeight | string | '250px' | The height of the table container. |
| value | string[][] | undefined | The data for the spreadsheet cells. Enables controlled component behavior. |
| onChange | (data: string[][]) => void | undefined | Callback fired when the data in the spreadsheet changes. |
| onFormatChange | (row: number, col: number, format: CellFormat) => void | undefined | Callback fired when the format of a cell changes (e.g., bold, italic, code, alignment). |
CellFormat

### CellFormat Interface
The CellFormat interface defines the formatting options for a cell:
```tsx
interface CellFormat {
  bold: boolean;
  italic: boolean;
  code: boolean;
  alignment: 'left' | 'center' | 'right' | 'inherit' | 'justify';
}
```

- **bold:** Applies bold styling to the cell content.
- **italic:** Applies italic styling to the cell content.
- **code:** Applies code formatting (monospace font) to the cell content.
- **alignment:** Sets the text alignment for the cell.

##Controlled Component Usage
The `Spreadsheet` component can operate in a controlled mode by providing the `value` prop along with `onChange` and `onFormatChange` callbacks.

### Example: Controlled Spreadsheet
```tsx
import { useState } from 'react';
import { Spreadsheet, CellFormat } from 'react-spreadsheet-ts';

function App() {
  const [data, setData] = useState<string[][]>([
    ['Name', 'Age', 'Country'],
    ['Alice', '30', 'USA'],
    ['Bob', '25', 'Canada'],
  ]);

  const [formats, setFormats] = useState<Record<string, CellFormat>>({});

  const handleDataChange = (newData: string[][]) => {
    setData(newData);
  };

  const handleFormatChange = (row: number, col: number, format: CellFormat) => {
    const key = `${row}-${col}`;
    setFormats((prevFormats) => ({
      ...prevFormats,
      [key]: format,
    }));
  };

  return (
    <Spreadsheet
      value={data}
      onChange={handleDataChange}
      onFormatChange={handleFormatChange}
      initialRows={data.length}
      initialColumns={data[0].length}
      theme="light"
      toolbarOrientation="horizontal"
      tableHeight="400px"
    />
  );
}
```

##Advanced Usage

###Accessing Cell Formats
In addition to cell data, you can track and modify cell formats using the onFormatChange callback.

```tsx
const handleFormatChange = (row: number, col: number, format: CellFormat) => {
  // Update your state or perform actions based on the new format
};
```