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
            description: "Switch between light and dark mode",
            defaultValue: "light"
        },
        initialRows: {
            control: { type: "number", min: 1, max: 100, step: 1 },
            description: "The number of initial rows",
            defaultValue: 4
        },
        initialColumns: {
            control: { type: "number", min: 1, max: 100, step: 1 },
            description: "The number of initial columns",
            defaultValue: 5
        },
        toolbarOrientation: {
            control: { type: 'select' },
            options: ["horizontal", "vertical"],
            description: "Select the orientation of the button toolbar",
            defaultValue: "horizontal"
        }
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
        toolbarOrientation: "horizontal",
        initialRows: 4,
        initialColumns: 5,
        onChange: fn(),
        onFormatChange: fn()
    }
}
