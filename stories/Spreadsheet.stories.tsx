import { Meta, StoryObj } from "@storybook/react";
import Spreadsheet from "../src/Spreadsheet"; // Adjust the import path as necessary
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
        },
    },
    decorators: [
        (Story, context) => {
            const { theme } = context.args;
            const backgroundColor = theme === "dark" ? "#000" : "#fff";

            return (
                <div
                    style={{
                        display: "inline-block",
                        padding: "30px",
                        backgroundColor, // Dynamically set based on theme
                    }}
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
    },
};
