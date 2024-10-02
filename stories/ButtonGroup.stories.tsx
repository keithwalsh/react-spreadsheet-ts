import { Meta, StoryObj } from "@storybook/react";
import { ButtonGroup, ButtonGroupProvider } from "@components";
import { ButtonGroupContextType } from "@types";
import { action } from "@storybook/addon-actions";

interface ButtonGroupStoryArgs extends ButtonGroupContextType {
    palletteMode?: "light" | "dark";
    visibleButtons?: (string | "divider")[];
    orientation?: "horizontal" | "vertical";
    marginTop?: number;
    iconSize?: number;
    dividerMargin?: number;
    iconMargin?: number;
    tooltipArrow?: boolean;
    tooltipPlacement?:
        | "bottom-end"
        | "bottom-start"
        | "bottom"
        | "left-end"
        | "left-start"
        | "left"
        | "right-end"
        | "right-start"
        | "right"
        | "top-end"
        | "top-start"
        | "top";
}

const meta: Meta<ButtonGroupStoryArgs> = {
    title: "Toolbar/ButtonGroup",
    component: ButtonGroup,
    argTypes: {
        palletteMode: {
            control: {
                type: "select",
                options: ["light", "dark"],
            },
            description: "To switch between light and dark mode.",
            defaultValue: "light",
        },
        visibleButtons: {
            control: "multi-select",
            options: [
                "Undo",
                "Redo",
                "divider",
                "Align Left",
                "Align Center",
                "Align Right",
                "Set Bold",
                "Set Italic",
                "Set Code",
                "Add Row",
                "Remove Row",
                "Add Column",
                "Remove Column",
            ],
            description: "Select which buttons to display in the ButtonGroup",
            defaultValue: [], // All buttons shown by default
        },
        orientation: {
            control: {
                type: "radio",
                options: ["horizontal", "vertical"],
            },
            description: "The component orientation (layout flow direction).",
            defaultValue: "horizontal",
        },
        marginTop: {
            control: { type: "number", min: 0, max: 50, step: 1 },
            description: "Top margin value.",
            defaultValue: 3,
        },
        iconSize: {
            control: { type: "number", min: 10, max: 50, step: 1 },
            description: "The size of the icons.",
            defaultValue: 20,
        },
        iconMargin: {
            control: { type: "number", min: 0, max: 2, step: 0.1 },
            description: "The size of the margins around the icons.",
            defaultValue: 0.3, // Changed from 23 to 0.3
        },
        dividerMargin: {
            control: { type: "number", min: 0, max: 2, step: 0.1 },
            description: "The size of the margins on both sides of the divider.",
            defaultValue: 0.5,
        },
        tooltipArrow: {
            control: "boolean",
            description: "If true, adds an arrow to the tooltip.",
            defaultValue: true,
        },
        tooltipPlacement: {
            control: {
                type: "select",
                options: [
                    "bottom-end",
                    "bottom-start",
                    "bottom",
                    "left-end",
                    "left-start",
                    "left",
                    "right-end",
                    "right-start",
                    "right",
                    "top-end",
                    "top-start",
                    "top",
                ],
            },
            description: "Tooltip placement.",
            defaultValue: "top",
        },
        // Handler functions as actions
        onClickUndo: { action: "Undo Clicked" },
        onClickRedo: { action: "Redo Clicked" }, // Corrected typo
        onClickAlignLeft: { action: "Align Left Clicked" },
        onClickAlignCenter: { action: "Align Center Clicked" },
        onClickAlignRight: { action: "Align Right Clicked" },
        onClickAddRow: { action: "Add Row Clicked" },
        onClickRemoveRow: { action: "Remove Row Clicked" },
        onClickAddColumn: { action: "Add Column Clicked" },
        onClickRemoveColumn: { action: "Remove Column Clicked" },
        onClickSetBold: { action: "Set Bold Clicked" },
        onClickSetItalic: { action: "Set Italic Clicked" },
        onClickSetCode: { action: "Set Code Clicked" },
    },
    decorators: [
        (Story, context) => (
            <ButtonGroupProvider
                onClickUndo={context.args.onClickUndo}
                onClickRedo={context.args.onClickRedo}
                onClickAlignLeft={context.args.onClickAlignLeft}
                onClickAlignCenter={context.args.onClickAlignCenter}
                onClickAlignRight={context.args.onClickAlignRight}
                onClickAddRow={context.args.onClickAddRow}
                onClickRemoveRow={context.args.onClickRemoveRow}
                onClickAddColumn={context.args.onClickAddColumn}
                onClickRemoveColumn={context.args.onClickRemoveColumn}
                onClickSetBold={context.args.onClickSetBold}
                onClickSetItalic={context.args.onClickSetItalic}
                onClickSetCode={context.args.onClickSetCode}
            >
                <Story {...context.args} />
            </ButtonGroupProvider>
        ),
    ],
};

export default meta;

type Story = StoryObj<ButtonGroupStoryArgs>;

export const Default: Story = {
    args: {
        palletteMode: "light",
        visibleButtons: [], // Show all buttons by default
        orientation: "horizontal",
        marginTop: 3,
        iconSize: 20,
        iconMargin: 0.3,
        dividerMargin: 0.5,
        tooltipArrow: true,
        tooltipPlacement: "top",
        onClickUndo: action("Undo Clicked"),
        onClickRedo: action("Redo Clicked"), // Corrected typo
        onClickAlignLeft: action("Align Left Clicked"),
        onClickAlignCenter: action("Align Center Clicked"),
        onClickAlignRight: action("Align Right Clicked"),
        onClickAddRow: action("Add Row Clicked"),
        onClickRemoveRow: action("Remove Row Clicked"),
        onClickAddColumn: action("Add Column Clicked"),
        onClickRemoveColumn: action("Remove Column Clicked"),
        onClickSetBold: action("Set Bold Clicked"),
        onClickSetItalic: action("Set Italic Clicked"),
        onClickSetCode: action("Set Code Clicked"),
    },
};
