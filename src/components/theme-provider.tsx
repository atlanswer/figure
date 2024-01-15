import type { Accessor, JSX } from "solid-js";
import {
  createContext,
  createRenderEffect,
  createSignal,
  useContext,
} from "solid-js";

type Theme = "light" | "dark" | "system";

type ThemeProviderProps = {
  children: JSX.Element;
  defaultTheme: Theme;
  storageKey: string;
};

type ThemeProviderState = [
  theme: Accessor<Theme>,
  setTheme: (theme: Theme) => void,
];

const initialState: ThemeProviderState = [() => "system", () => null];

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider(props: ThemeProviderProps) {
  const [theme, setTheme] = createSignal<Theme>(
    (localStorage.getItem(props.storageKey) as Theme) || props.defaultTheme,
  );

  createRenderEffect(() => {
    const body = window.document.body;
    body.classList.remove("light", "dark");

    if (theme() == "system") {
      const systemTheme =
        window.matchMedia("(prefers-color-scheme: dark)").matches ?
          "dark"
        : "light";

      body.classList.add(systemTheme);
    } else {
      body.classList.add(theme());
    }
  });

  return (
    <ThemeProviderContext.Provider
      value={[
        theme,
        (theme: Theme) => {
          localStorage.setItem(props.storageKey, theme);
          setTheme(theme);
        },
      ]}
    >
      {props.children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  return useContext(ThemeProviderContext);
};
