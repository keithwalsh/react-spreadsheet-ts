import { Meta, StoryObj } from "@storybook/react";
import { fn } from '@storybook/test'
import { ThemeProvider, createTheme } from '@mui/material';
import Spreadsheet from "../src/Spreadsheet";
import { SpreadsheetProps } from "../src/types";

interface SpreadsheetStoryArgs extends SpreadsheetProps {
    mode?: 'light' | 'dark';
}

// Use a more specific name for the meta object
const SpreadsheetMeta: Meta<SpreadsheetStoryArgs> = {
    title: "Spreadsheet",
    component: Spreadsheet,
    tags: ["autodocs"],
    argTypes: {
        mode: {
            control: {
                type: "select",
                options: ["light", "dark"],
            },
            description: "Switch between light and dark mode.",
            defaultValue: "light",
            table: {
                type: { summary: `"light" | "dark"` },
            },
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
        toolbarOrientation: {
            control: {
                type: "select",
                options: ["horizontal", "vertical"],
            },
            description: "Select the orientation of the button toolbar.",
            defaultValue: "horizontal",
            table: {
                type: { summary: `"horizontal" | "vertical"` },
            },
        },
        onChange: {
            description: 'Callback fired when spreadsheet data changes'
        },
        onFormatChange: {
            description: 'Callback fired when cell formatting changes'
        }
    },
    decorators: [
        (Story, context) => {
            const { mode = 'light' } = context.args;
            const theme = createTheme({
                palette: {
                    mode,
                },
            });

            // Create a unique key based on initialRows and initialColumns
            const key = `rows-${context.args.initialRows}-cols-${context.args.initialColumns}`;

            return (
                <ThemeProvider theme={theme}>
                    <div
                        style={{
                            display: "inline-block",
                            padding: 0,
                            backgroundColor: mode === "dark" ? "#000" : "#fff",
                        }}
                        key={key}
                    >
                        <Story {...context.args} />
                    </div>
                </ThemeProvider>
            );
        },
    ],
};

export default SpreadsheetMeta;

type Story = StoryObj<SpreadsheetStoryArgs>;

export const Default: Story = {
    args: {
        mode: "light",
        toolbarOrientation: "horizontal",
        initialRows: 4,
        initialColumns: 5,
        onChange: fn(),
        onFormatChange: fn()
    },
};
