import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { resolve } from "path";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
      include: ["src"],
      exclude: ["**/*.test.ts", "**/*.test.tsx"]
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.tsx"),
      name: "ReactSpreadsheetTs",
      formats: ["es", "cjs"],
      fileName: (format) => `index.${format === "es" ? "esm" : format}.js`
    },
    rollupOptions: {
      external: ["react", "react-dom", "@emotion/react", "@emotion/styled", "@mui/material", "react-icons", "@mui/icons-material"],
      output: {
        preserveModules: true,
        exports: 'named'
      }
    }
  }
});
