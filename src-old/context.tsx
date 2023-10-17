import { createContext } from "solid-js";

/** Avaliable theme settings:
 * - "light": prefer light theme
 * - "dark": prefer dark theme
 * - "system": use the operating system setting
 */
export type UserThemePreference = "light" | "dark" | "system";

/** Site-wide info */
export interface SiteContextContent {
  /** Check if (prefers-color-scheme: dark) is matched */
  readonly prefersDark: () => boolean;
  /** The theme preference user chooses */
  readonly userTheme: UserThemePreference;
  /** If something is being dragged over the site */
  readonly isDragOver: boolean;
}

/** useSiteContext:
 * - siteContext
 * - methods:
 *    - changeTheme: change site theme
 */
export type SiteContextUsage = readonly [
  context: SiteContextContent,
  methods: {
    onPreferColorSchemeChange: (matches: boolean) => void;
    changeUserTheme: (theme: UserThemePreference) => void;
    setIsDragOver: (isDragOver: boolean) => void;
  },
];

export const SITE_CONTEXT_DEFAULT: SiteContextContent = {
  prefersDark: () => false,
  userTheme: "system",
  isDragOver: false,
};

export const SiteContext = createContext<SiteContextUsage>([
  SITE_CONTEXT_DEFAULT,
  {
    onPreferColorSchemeChange: () => undefined,
    changeUserTheme: () => undefined,
    setIsDragOver: () => undefined,
  },
]);
