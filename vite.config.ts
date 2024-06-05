import { defineConfig } from "vite";
import { resolve } from "node:path";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "./src/lib/yap"),
      name: "yap",
      fileName: "yap",
    },
  },
});
