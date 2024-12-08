import type { Meta, StoryObj } from "@storybook/react"
import { fn } from '@storybook/test'
import { ThemeProvider, createTheme } from '@mui/material'
import { useMemo } from 'react'
import Spreadsheet from "../src/components/Spreadsheet"
import type { SpreadsheetProps } from "../src/types"
import { Provider } from 'react-redux'
import { createStore } from '../src/store'

interface SpreadsheetStoryArgs extends SpreadsheetProps {
    mode?: 'light' | 'dark'
}

const store = createStore()

const SpreadsheetWithProvider = ({ mode, ...props }: SpreadsheetStoryArgs) => {
    const theme = useMemo(() => createTheme({
        palette: {
            mode: mode || 'light'
        }
    }), [mode])

    return (
        <Provider store={store}>
            <ThemeProvider theme={theme}>
                <Spreadsheet {...props} />
            </ThemeProvider>
        </Provider>
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

            return (
                <div style={{
                    display: "inline-block",
                    padding: 0,
                    backgroundColor: mode === "dark" ? "#000" : "#fff"
                }}>
                    <Story />
                </div>
            )
        }
    ]
}

export default SpreadsheetMeta

type Story = StoryObj<SpreadsheetStoryArgs>

export const Default: Story = {
    render: (args) => <SpreadsheetWithProvider {...args} />,
    args: {
        mode: "light",
        onChange: fn(),
        onFormatChange: fn(),
        initialRows: 4,
        initialColumns: 5
    }
}
