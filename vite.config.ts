import { partytownVite } from "@builder.io/partytown/utils";
import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import tsconfigPaths from "vite-tsconfig-paths";
import externalize from "vite-plugin-externalize-dependencies";

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    solidPlugin(),
    partytownVite({}),
    externalize({
      externals: ["node-fetch"],
    }),
  ],
  build: {
    target: "esnext",
  },
  worker: {
    format: "es",
    plugins: () => [
      tsconfigPaths(),
      externalize({
        externals: ["node-fetch"],
      }),
    ],
    rollupOptions: {
      external: ["node-fetch"],
    },
  },
});
