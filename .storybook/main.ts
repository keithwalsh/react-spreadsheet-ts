import type { StorybookConfig } from "@storybook/react-vite";
import { mergeConfig } from "vite";

const config: StorybookConfig = {
    stories: ["../stories/**/*.stories.mdx", "../stories/**/*.stories.@(js|jsx|ts|tsx)"],
    addons: [
        "@storybook/addon-onboarding",
        "@storybook/addon-links",
        "@storybook/addon-essentials",
        "@chromatic-com/storybook",
        "@storybook/addon-interactions",
        "@storybook/react",
        "@storybook/addon-styling",
    ],
    framework: {
        name: "@storybook/react-vite",
        options: {},
    },
    viteFinal: async (config) => {
        return mergeConfig(config, {});
    },
};
export default config;
