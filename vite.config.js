import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { terser } from "rollup-plugin-terser";
import { visualizer } from "rollup-plugin-visualizer";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      components: path.resolve(__dirname, "./src/components"),
      features: path.resolve(__dirname, "./src/features"),
      hooks: path.resolve(__dirname, "./src/hooks"),
      context: path.resolve(__dirname, "./src/context"),
      "rosie-firebase": path.resolve(__dirname, "./src/rosie-firebase"),
      pages: path.resolve(__dirname, "./src/pages"),
      util: path.resolve(__dirname, "./src/util"),
    },
  },
  plugins: [
    react(),
    terser({
      compress: true,
      mangle: true,
    }),
    visualizer(),
  ],
});
