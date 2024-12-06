import type { Meta, StoryObj } from "@storybook/react"
import { fn } from '@storybook/test'
import { ThemeProvider, createTheme } from '@mui/material'
import { useMemo } from 'react'
import Spreadsheet from "../src/components/Spreadsheet"
import type { SpreadsheetProps } from "../src/types"

interface SpreadsheetStoryArgs extends SpreadsheetProps {
    mode?: 'light' | 'dark'
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
        initialRows: {
            control: { type: "number", min: 1, max: 100, step: 1 },
            description: "The number of initial rows.",
            defaultValue: 4,
        },
        initialColumns: {
            control: { type: "number", min: 1, max: 100, step: 1 },
            description: "The number of initial columns.",
            defaultValue: 5,
        },
    },
    decorators: [
        (Story, context) => {
            const { mode = 'light' } = context.args
            const theme = useMemo(() => createTheme({
                palette: { mode }
            }), [mode])

            return (
                <ThemeProvider theme={theme}>
                    <div style={{
                        display: "inline-block",
                        padding: 0,
                        backgroundColor: mode === "dark" ? "#000" : "#fff"
                    }}>
                        <Story />
                    </div>
                </ThemeProvider>
            )
        }
    ]
}

export default SpreadsheetMeta

type Story = StoryObj<SpreadsheetStoryArgs>

export const Default: Story = {
    args: {
        mode: "light",
        onChange: fn(),
        onFormatChange: fn(),
        initialRows: 4,
        initialColumns: 5
    }
}
