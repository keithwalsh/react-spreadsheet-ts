# React Spreadsheet TS

A simple, lightweight spreadsheet component written in TypeScript for React applications.

## Features

- Light/Dark theme support
- CSV export functionality
- Cell formatting (Bold, Italic, Code)
- Text alignment
- Row and column operations
- Cell selection and multi-selection
- Copy/Paste support
- Undo/Redo functionality
- Virtual scrolling for performance

## Installation
`npm install react-spreadsheet-ts`

## Usage
```tsx
import Spreadsheet from 'react-spreadsheet-ts';
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
|------|------|---------|-------------|
| theme | `"light"` \| `"dark"` | `"light"` | Theme of the spreadsheet |
| toolbarOrientation | `"horizontal"` \| `"vertical"` | `"horizontal"` | Orientation of the toolbar |
| initialRows | `number` | `4` | Initial number of rows |
| initialColumns | `number` | `10` | Initial number of columns |
| tableHeight | `string` | `"250px"` | Height of the table container |

## Features

### File Operations
- Create new table
- Download as CSV

### Cell Formatting
- Bold text
- Italic text
- Code formatting
- Text alignment (Left, Center, Right)

### Table Operations
- Add/Remove rows
- Add/Remove columns
- Clear table
- Transpose table
- Undo/Redo actions

## Development
- Install dependencies: `npm install`
- Run the development server: `npm run dev`
- Build the library: `npm run build`
- Run the tests: `npm run test`
- Run the storybook: `npm run storybook`

