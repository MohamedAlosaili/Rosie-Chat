import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      components: path.resolve(__dirname, "./src/components"),
      features: path.resolve(__dirname, "./src/features"),
      hooks: path.resolve(__dirname, "./src/hooks"),
      "rosie-firebase": path.resolve(__dirname, "./src/rosie-firebase"),
      pages: path.resolve(__dirname, "./src/pages"),
      imgs: path.resolve(__dirname, "./src/imgs"),
      util: path.resolve(__dirname, "./src/util"),
    },
  },
  plugins: [react()],
});
