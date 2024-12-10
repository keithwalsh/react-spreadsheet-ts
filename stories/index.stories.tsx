import type { Meta, StoryObj } from "@storybook/react"
import { ThemeProvider, createTheme, Box } from '@mui/material'
import { useMemo } from 'react'
import SpreadsheetWrapper from "../src"

interface SpreadsheetStoryArgs {
    mode?: 'light' | 'dark'
    rows?: number
    cols?: number
}

const SpreadsheetWithTheme = ({ mode, rows = 10, cols = 10 }: SpreadsheetStoryArgs) => {
    const theme = useMemo(() => createTheme({
        palette: {
            mode: mode || 'light'
        }
    }), [mode])

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ 
                width: '100%', 
                height: '100vh', 
                padding: 2,
                backgroundColor: theme.palette.background.default
            }}>
                <SpreadsheetWrapper rows={rows} cols={cols} />
            </Box>
        </ThemeProvider>
    )
}

const SpreadsheetMeta: Meta<SpreadsheetStoryArgs> = {
    title: "Spreadsheet",
    component: SpreadsheetWithTheme,
    tags: ["autodocs"],
    argTypes: {
        mode: {
            control: { type: 'select' },
            options: ["light", "dark"],
            description: "Select the theme mode",
            defaultValue: "light"
        },
        rows: {
            control: { type: 'number' },
            description: "Number of rows",
            defaultValue: 10
        },
        cols: {
            control: { type: 'number' },
            description: "Number of columns",
            defaultValue: 10
        }
    },
    decorators: [
        (Story) => (
            <div style={{
                width: '100%',
                height: '100vh',
                margin: 0,
                padding: 0
            }}>
                <Story />
            </div>
        )
    ]
} satisfies Meta<SpreadsheetStoryArgs>

export default SpreadsheetMeta

export const Default: StoryObj<SpreadsheetStoryArgs> = {
    render: (args) => <SpreadsheetWithTheme {...args} />,
    args: {
        mode: "light",
        rows: 10,
        cols: 10
    }
}
