import type { Accessor, ParentProps } from "solid-js";
import {
  createContext,
  createRenderEffect,
  createSignal,
  mergeProps,
  useContext,
} from "solid-js";

type Theme = "light" | "dark" | "system";

interface ThemeProviderProps extends ParentProps {
  defaultTheme?: Theme;
  forceTheme?: Theme;
  storageKey?: string;
}

/**
 * Theme context
 * @property theme - get the current theme
 * @property setTheme - change theme
 * @example
 * [theme, setTheme] = useContext(ThemeProviderContext)
 */
const ThemeProviderContext =
  createContext<[Accessor<Theme>, (theme: Theme) => void]>();

/**
 * Shortcut for theme context
 * @example
 * [theme, setTheme] = useTheme()
 */
export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (!context) {
    throw new Error("useTheme: cannot find a ThemeProviderContext");
  }
  return context;
};

export function ThemeProvider(props: ThemeProviderProps) {
  const propsDef = mergeProps(
    {
      defaultTheme: "system",
      storageKey: "figure-theme",
    } satisfies ThemeProviderProps,
    props,
  );

  const [theme, setTheme] = createSignal<Theme>(
    // eslint-disable-next-line solid/reactivity
    (localStorage.getItem(propsDef.storageKey) ||
      propsDef.defaultTheme) as Theme,
  );

  const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

  const syncSystemTheme = () => {
    const body = document.body;
    if (prefersDarkScheme.matches) body.classList.add("dark");
    else body.classList.remove("dark");
  };

  /** Should have no flashing until we switch to server side rendering. */
  createRenderEffect(() => {
    const body = document.body;

    localStorage.setItem(propsDef.storageKey, theme());

    switch (theme()) {
      case "system":
        prefersDarkScheme.addEventListener("change", syncSystemTheme);
        syncSystemTheme();
        break;
      case "light":
        prefersDarkScheme.removeEventListener("change", syncSystemTheme);
        body.classList.remove("dark");
        break;
      case "dark":
        prefersDarkScheme.removeEventListener("change", syncSystemTheme);
        body.classList.add("dark");
        break;
    }
  });

  return (
    <ThemeProviderContext.Provider
      value={[
        theme,
        (theme) => {
          setTheme(theme);
        },
      ]}
    >
      {props.children}
    </ThemeProviderContext.Provider>
  );
}
