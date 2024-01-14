export default {
  purge: ["./index.html", "./src/**/*.{ts,tsx}"],
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    // I don't want to install @type/node
    // eslint-disable-next-line
    ...(process.env.NODE_ENV === "production" ? { cssnano: {} } : {}),
  },
};
