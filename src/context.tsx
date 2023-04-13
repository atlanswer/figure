import { createContext } from "solid-js";

/** Avaliable theme settings:
 * - "light": prefer light theme
 * - "dark": prefer dark theme
 * - "system": use the operating system setting
 */
export type UserThemePreference = "light" | "dark" | "system";

/** Site-wide settings:
 * - theme: current color theme
 */
export interface SiteContextContent {
  readonly prefersDark: () => boolean;
  readonly userTheme: UserThemePreference;
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
  },
];

export const SITE_CONTEXT_DEFAULT: SiteContextContent = {
  prefersDark: () => false,
  userTheme: "system",
};

export const SiteContext = createContext<SiteContextUsage>([
  SITE_CONTEXT_DEFAULT,
  {
    onPreferColorSchemeChange: () => undefined,
    changeUserTheme: () => undefined,
  },
]);
