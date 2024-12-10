import type { Meta, StoryObj } from "@storybook/react";
import { ThemeProvider, createTheme, Box } from "@mui/material";
import { useMemo } from "react";
import SpreadsheetWrapper from "../src";

interface SpreadsheetStoryArgs {
    mode?: "light" | "dark";
    rows?: number;
    cols?: number;
}

const SpreadsheetWithTheme = ({ mode, rows = 4, cols = 5 }: SpreadsheetStoryArgs) => {
    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode: mode || "light",
                },
            }),
        [mode]
    );

    return (
        <ThemeProvider theme={theme}>
            <Box
                sx={{
                    backgroundColor: theme.palette.background.default,
                }}
            >
                <SpreadsheetWrapper rows={rows} cols={cols} />
            </Box>
        </ThemeProvider>
    );
};

const SpreadsheetMeta: Meta<SpreadsheetStoryArgs> = {
    title: "Spreadsheet",
    component: SpreadsheetWithTheme,
    tags: ["autodocs"],
    argTypes: {
        mode: {
            control: { type: "select" },
            options: ["light", "dark"],
            description: "Select the theme mode",
            defaultValue: "light",
        },
        rows: {
            control: { type: "number" },
            description: "Number of rows",
            defaultValue: 4,
        },
        cols: {
            control: { type: "number" },
            description: "Number of columns",
            defaultValue: 5,
        },
    },
    decorators: [
        (Story) => (
            <div>
                <Story />
            </div>
        ),
    ],
} satisfies Meta<SpreadsheetStoryArgs>;

export default SpreadsheetMeta;

export const Default: StoryObj<SpreadsheetStoryArgs> = {
    render: (args) => <SpreadsheetWithTheme {...args} />,
    args: {
        mode: "light",
        rows: 4,
        cols: 5,
    },
};
