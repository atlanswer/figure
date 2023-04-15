import { ParentComponent, createSignal, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import { SITE_CONTEXT_DEFAULT, SiteContext } from "~/context";
import type { UserThemePreference } from "~/context";

export const useSiteContext = () => useContext(SiteContext);

export const SiteContextProvider: ParentComponent = (props) => {
  const [matchDarkQuery, setMatchDarkQuery] = createSignal(false);

  const [siteContext, setSiteContext] = createStore({
    ...SITE_CONTEXT_DEFAULT,
    prefersDark: matchDarkQuery,
  });

  const onPreferColorSchemeChange = (matches: boolean) =>
    setMatchDarkQuery(matches);
  const changeUserTheme = (theme: UserThemePreference) =>
    setSiteContext("userTheme", theme);
  const setIsDragOver = (isDragOver: boolean) =>
    setSiteContext("isDragOver", isDragOver);

  return (
    <SiteContext.Provider
      value={[
        siteContext,
        { onPreferColorSchemeChange, changeUserTheme, setIsDragOver },
      ]}
    >
      {props.children}
    </SiteContext.Provider>
  );
};
