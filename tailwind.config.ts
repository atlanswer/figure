import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx,css,md,mdx}"],
  darkMode: "class",
  theme: {
    extend: {},
  },
  plugins: [typography],
} satisfies Config;
