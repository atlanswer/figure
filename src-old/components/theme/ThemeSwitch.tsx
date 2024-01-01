import { useSiteContext } from "../context/SiteContext";

export const ThemeSwitcher = () => {
  const [siteContext, { changeUserTheme }] = useSiteContext();

  const handleChangeTheme = () => {
    switch (siteContext.userTheme) {
      case "system":
        if (siteContext.prefersDark()) changeUserTheme("light");
        else changeUserTheme("dark");
        break;
      case "light":
        if (siteContext.prefersDark()) changeUserTheme("system");
        else changeUserTheme("dark");
        break;
      case "dark":
        if (siteContext.prefersDark()) changeUserTheme("light");
        else changeUserTheme("system");
        break;
    }
  };

  const iconClass = () => {
    switch (siteContext.userTheme) {
      case "system":
        if (siteContext.prefersDark()) return "i-ic:round-dark-mode";
        else return "i-ic:round-light-mode";
      case "light":
        return "i-ic:round-light-mode";
      case "dark":
        return "i-ic:round-dark-mode";
    }
  };

  return (
    <button class="rounded border p-1" onClick={handleChangeTheme}>
      <span
        role="img"
        aria-label="Light mode icon"
        class={`block ${iconClass()}`}
      />
    </button>
  );
};
