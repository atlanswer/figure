import { ParentComponent, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import { SITE_CONTEXT_DEFAULT, SiteContext } from "~/context";
import type { ThemePreference } from "~/context";

export const useSiteContext = () => useContext(SiteContext);

export const SiteContextProvider: ParentComponent = (props) => {
  const [siteContext, setSiteContext] = createStore({
    ...SITE_CONTEXT_DEFAULT,
  });

  const changeTheme = (theme: ThemePreference) =>
    setSiteContext("theme", theme);

  return (
    <SiteContext.Provider value={[siteContext, { changeTheme }]}>
      {props.children}
    </SiteContext.Provider>
  );
};
