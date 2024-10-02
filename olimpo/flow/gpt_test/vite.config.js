import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/main.js"),
      name: "onbotgo_gpt",
      formats: ["es"],
      fileName: "onbotgo_gpt.min",
    },
  },
});
