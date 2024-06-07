import { defineConfig } from "vite";
import { resolve } from "node:path";
import tsconfigPaths from "vite-tsconfig-paths";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [tsconfigPaths(), dts({})],
  build: {
    lib: {
      entry: resolve(__dirname, "./src/index.ts"),
      name: "yap",
      fileName: "yap",
    },
  },
});
