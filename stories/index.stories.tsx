import { Meta, StoryObj } from "@storybook/react";
import Spreadsheet from "../src/Spreadsheet";
import { SpreadsheetProps } from "../src/types";

interface SpreadsheetStoryArgs extends SpreadsheetProps {}

// Use a more specific name for the meta object
const SpreadsheetMeta: Meta<SpreadsheetStoryArgs> = {
    title: "Spreadsheet",
    component: Spreadsheet,
    tags: ["autodocs"],
    argTypes: {
        theme: {
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
    },
    decorators: [
        (Story, context) => {
            const { theme } = context.args;
            const backgroundColor = theme === "dark" ? "#000" : "#fff";

            // Create a unique key based on initialRows and initialColumns
            const key = `rows-${context.args.initialRows}-cols-${context.args.initialColumns}`;

            return (
                <div
                    style={{
                        display: "inline-block",
                        padding: 0,
                        backgroundColor, // Dynamically set based on theme
                    }}
                    key={key} // Add the key here
                >
                    <Story {...context.args} />
                </div>
            );
        },
    ],
};

export default SpreadsheetMeta;

type Story = StoryObj<SpreadsheetStoryArgs>;

export const Default: Story = {
    args: {
        theme: "light",
        toolbarOrientation: "horizontal",
        initialRows: 4,
        initialColumns: 5,
    },
};
