import { createContext } from "solid-js";

/** Avaliable theme settings:
 * - "light": prefer light theme
 * - "dark": prefer dark theme
 * - "system": use the operating system setting
 */
export type ThemePreference = "light" | "dark" | "system";

/** Site-wide settings:
 * - theme: current color theme
 */
export interface SiteContextContent {
  readonly theme: ThemePreference;
}

/** useSiteContext:
 * - siteContext
 * - methods:
 *    - changeTheme: change site theme
 */
export type SiteContextUsage = readonly [
  context: SiteContextContent,
  methods: {
    changeTheme: (theme: ThemePreference) => void;
  },
];

export const SITE_CONTEXT_DEFAULT: SiteContextContent = {
  theme: "system",
};

export const SiteContext = createContext<SiteContextUsage>([
  SITE_CONTEXT_DEFAULT,
  {
    changeTheme: () => undefined,
  },
]);
