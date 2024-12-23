/**
 * @file stories/index.stories.tsx
 * @fileoverview Storybook configuration for the Spreadsheet component, including theme customization and control options.
 */

import { Meta, StoryObj } from "@storybook/react";
import { ThemeProvider, createTheme } from "@mui/material";
import SpreadsheetWrapper from "../src";
import { SpreadsheetWrapperProps } from "../src/types";

const SpreadsheetMeta: Meta<SpreadsheetWrapperProps> = {
    title: "Spreadsheet",
    component: SpreadsheetWrapper,
    tags: ["autodocs"],
    argTypes: {
        darkMode: {
            control: "boolean",
            description: "Switch between light and dark mode.",
            defaultValue: false,
        },
        rows: {
            control: { type: "number", min: 1, max: 100 },
            description: "Number of initial rows",
            defaultValue: 4,
        },
        cols: {
            control: { type: "number", min: 1, max: 100 },
            description: "Number of initial columns",
            defaultValue: 4,
        },
    },
    decorators: [
        (Story, context) => {
            const { darkMode = false } = context.args;
            const theme = createTheme({
                palette: {
                    mode: darkMode ? "dark" : "light",
                },
            });

            return (
                <ThemeProvider theme={theme}>
                    <div
                        style={{
                            display: "inline-block",
                            padding: 0,
                            backgroundColor: darkMode ? "#000" : "#fff",
                        }}
                    >
                        <Story {...context.args} />
                    </div>
                </ThemeProvider>
            );
        },
    ],
};

export default SpreadsheetMeta;

type Story = StoryObj<SpreadsheetWrapperProps>;

export const Default: Story = {
    args: {
        darkMode: false,
        rows: 4,
        cols: 4,
    },
};
