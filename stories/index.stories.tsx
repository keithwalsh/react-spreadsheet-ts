/**
 * @fileoverview Storybook stories for the SpreadsheetWrapper component, showcasing various
 * configurations and themes. Includes examples for light and dark modes with theme toggle.
 */

import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import SpreadsheetWrapper from "../src";
import type { SpreadsheetWrapperProps } from "../src/types";
import { Container, IconButton } from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";

const meta: Meta<typeof SpreadsheetWrapper> = {
    title: "Spreadsheet",
    component: SpreadsheetWrapper,
    tags: ["autodocs"],
    argTypes: {
        rows: {
            control: { type: "number", min: 1, max: 100 },
            description: "Number of initial rows",
            table: {
                defaultValue: { summary: "4" },
                type: { summary: "number" },
            },
        },
        cols: {
            control: { type: "number", min: 1, max: 100 },
            description: "Number of initial columns",
            table: {
                defaultValue: { summary: "4" },
                type: { summary: "number" },
            },
        },
    },
};

export default meta;
type Story = StoryObj<typeof SpreadsheetWrapper>;

const SpreadsheetStory = (args: SpreadsheetWrapperProps) => {
    const [mode, setMode] = React.useState<'light' | 'dark'>('light');
    const isDarkMode = mode === 'dark';

    return (
        <Container maxWidth="lg" sx={{ 
            display: 'flex', 
            alignItems: 'flex-start', 
            justifyContent: 'space-between', 
            mt: 2,
            backgroundColor: isDarkMode ? '#121212' : '#fff',
            minHeight: '100vh',
            padding: 2
        }}>
            <SpreadsheetWrapper {...args} darkMode={isDarkMode} />
            <IconButton 
                aria-label="toggle color scheme" 
                color="inherit" 
                onClick={() => setMode(prev => (prev === 'light' ? 'dark' : 'light'))}
                sx={{ 
                    ml: 2,
                    color: isDarkMode ? '#fff' : '#000',
                    backgroundColor: isDarkMode ? '#333' : '#f5f5f5',
                    '&:hover': {
                        backgroundColor: isDarkMode ? '#444' : '#e0e0e0',
                    }
                }}
            >
                {isDarkMode ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
        </Container>
    );
};

export const Default: Story = {
    args: {
        rows: 4,
        cols: 4,
    },
    render: SpreadsheetStory,
};
