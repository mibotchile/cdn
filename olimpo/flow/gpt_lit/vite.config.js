import { defineConfig, searchForWorkspaceRoot } from "vite";
import { resolve } from "path";

export default defineConfig({
  server: {
    host: true,
    port: 5173,
    watch: {
      usePolling: true,
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, "src/main.js"),
      name: "onbotgo_gpt",
      formats: ["es"],
      fileName: "onbotgo_gpt.min",
    },
  },
});
