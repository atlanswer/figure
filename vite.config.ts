import { defineConfig } from "vite";
import SolidStart from "solid-start/vite";
import vercel from "solid-start-vercel";
import UnocssPlugin from "@unocss/vite";

export default defineConfig({
  plugins: [
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
  build: {
    target: "esnext",
  },
});
