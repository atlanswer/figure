import { useTheme } from "~/components/theme-provider";

export const ThemeToggle = () => {
  const [theme, setTheme] = useTheme();

  const toggleTheme = () => {
    const systemTheme =
      window.matchMedia("(prefers-color-scheme: dark)").matches ?
        "dark"
      : "light";
    switch (theme()) {
      case "light":
        setTheme(systemTheme === "light" ? "dark" : "system");
        break;
      case "dark":
        setTheme(systemTheme === "light" ? "system" : "light");
        break;
      case "system":
        setTheme(systemTheme === "light" ? "dark" : "light");
    }
  };

  return (
    <button
      class="rounded border p-2 text-black dark:text-white"
      onClick={() => toggleTheme()}
    >
      Switch Theme (current: {theme()})
    </button>
  );
};
