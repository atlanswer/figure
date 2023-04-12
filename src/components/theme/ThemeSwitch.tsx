import { useSiteContext } from "../context/SiteContext";

export const ThemeSwitcher = () => {
  const [siteContext, { changeTheme }] = useSiteContext();

  const theme = () => siteContext.theme;

  const handleChangeTheme = () => {
    switch (theme()) {
      case "system":
        changeTheme("light");
        break;
      case "light":
        changeTheme("dark");
        break;
      case "dark":
        changeTheme("system");
        break;
    }
  };

  const iconClass = () => {
    switch (theme()) {
      case "light":
        return "i-ic:round-light-mode";
      case "dark":
        return "i-ic:round-dark-mode";
      case "system":
        return "i-ic:round-computer";
    }
  };

  return (
    <button class="border rounded p-1" onClick={handleChangeTheme}>
      <span
        role="img"
        aria-label="Light mode icon"
        class={`block ${iconClass()}`}
      ></span>
    </button>
  );
};
