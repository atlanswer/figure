export default {
  purge: ["./index.html", "./src/**/*.{ts,tsx}"],
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    ...(process.env.NODE_ENV === "production" ? { cssnano: {} } : {}),
  },
};
