export default {
  purge: ["./index.html", "./src/**/*.{ts,tsx}"],
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    ...(import.meta.env.NODE_ENV === "production" ? { cssnano: {} } : {}),
  },
};
