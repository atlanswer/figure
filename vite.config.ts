import { defineConfig } from "vite";
import SolidStart from "solid-start/vite";
import vercel from "solid-start-vercel";
// import devtools from "solid-devtools/vite";
import UnocssPlugin from "@unocss/vite";

export default defineConfig({
  plugins: [
    // devtools({
    //   autoname: true,
    //   locator: {
    //     targetIDE: "vscode",
    //     jsxLocation: true,
    //     componentLocation: true,
    //   },
    // }),
    SolidStart({
      adapter: vercel({
        edge: true,
      }),
      ssr: true,
    }),
    UnocssPlugin(),
  ],
  server: {
    port: 3000,
  },
  optimizeDeps: {
    // include: ["d3", "solid-devtools"],
    include: ["d3"],
  },
  build: {
    target: "esnext",
  },
});
