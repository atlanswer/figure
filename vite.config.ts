import { partytownVite } from "@builder.io/partytown/utils";
import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import tsconfigPaths from "vite-tsconfig-paths";
import devtools from "solid-devtools/vite";

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    devtools({
      autoname: true,
      locator: false,
    }),
    solidPlugin(),
    partytownVite({}),
  ],
  build: {
    target: "esnext",
  },
  assetsInclude: ["/pyodide/pyodide.mjs"],
  worker: {
    format: "es",
    plugins: () => [tsconfigPaths()],
    rollupOptions: {
      external: ["/pyodide/pyodide.mjs"],
    },
  },
});
