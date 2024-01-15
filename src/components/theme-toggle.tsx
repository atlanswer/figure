import { useTheme } from "./theme-provider.tsx";

export const ThemeToggle = () => {
  const [theme, setTheme] = useTheme();

  return (
    <button
      class="rounded border p-2 text-black dark:text-white"
      onClick={() =>
        setTheme(
          theme() === "system" ? "light"
          : theme() === "light" ? "dark"
          : "system",
        )
      }
    >
      Switch Theme (current: {theme()})
    </button>
  );
};
