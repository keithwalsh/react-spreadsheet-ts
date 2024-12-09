import type { Meta, StoryObj } from "@storybook/react"
import { fn } from '@storybook/test'
import { ThemeProvider, createTheme } from '@mui/material'
import { useMemo } from 'react'
import Spreadsheet from "../src"  // Updated to use the wrapped version
import type { SpreadsheetProps } from "../src/types"

interface SpreadsheetStoryArgs extends SpreadsheetProps {
    mode?: 'light' | 'dark'
}

const SpreadsheetWithTheme = ({ mode, ...props }: SpreadsheetStoryArgs) => {
    const theme = useMemo(() => createTheme({
        palette: {
            mode: mode || 'light'
        }
    }), [mode])

    return (
        <ThemeProvider theme={theme}>
            <Spreadsheet {...props} />
        </ThemeProvider>
    )
}

const SpreadsheetMeta: Meta<SpreadsheetStoryArgs> = {
    title: "Spreadsheet",
    component: Spreadsheet,
    tags: ["autodocs"],
    argTypes: {
        mode: {
            control: { type: 'select' },
            options: ["light", "dark"],
            description: "Select the theme mode",
            defaultValue: "light"
        },
    },
    decorators: [
        (Story) => (
            <div style={{
                display: "inline-block",
                padding: 0,
                margin: 0
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
        onChange: fn(),
    }
}
