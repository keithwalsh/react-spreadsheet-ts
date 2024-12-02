import { Meta, StoryObj } from "@storybook/react";
import { fn } from '@storybook/test'
import { ThemeProvider, createTheme } from '@mui/material';
import Spreadsheet from "../src/components/Spreadsheet";
import { SpreadsheetProps } from "../src/types";

interface SpreadsheetStoryArgs extends SpreadsheetProps {
    mode?: 'light' | 'dark';
}

// Helper function for select controls
function createSelectControl({ options, description, defaultValue }: {
    options: string[]
    description: string
    defaultValue: string
}) {
    return {
        control: {
            type: 'select' as const,
            options,
        },
        description,
        defaultValue,
        table: {
            type: { summary: options.map(o => `"${o}"`).join(" | ") },
        },
    }
}

// Use a more specific name for the meta object
const SpreadsheetMeta: Meta<SpreadsheetStoryArgs> = {
    title: "Spreadsheet",
    component: Spreadsheet,
    tags: ["autodocs"],
    argTypes: {
        mode: createSelectControl({
            options: ["light", "dark"],
            description: "Switch between light and dark mode.",
            defaultValue: "light"
        }),
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
        toolbarOrientation: createSelectControl({
            options: ["horizontal", "vertical"],
            description: "Select the orientation of the button toolbar.",
            defaultValue: "horizontal"
        }),
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
