import type { StorybookConfig } from "@storybook/react-vite";
import { mergeConfig } from "vite";

const config: StorybookConfig = {
    stories: ["../stories/**/*.stories.@(ts|tsx)"],
    addons: [
        "@storybook/addon-essentials",
        "@storybook/addon-interactions",
        "@storybook/addon-links",
        "@storybook/addon-styling"
    ],
    framework: {
        name: "@storybook/react-vite",
        options: {}
    },
    core: {
        builder: "@storybook/builder-vite"
    },
    viteFinal: async (config) => {
        return mergeConfig(config, {
            resolve: {
                alias: {
                    'src': '/src'
                }
            }
        });
    }
};
export default config;
