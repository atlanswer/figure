import type { Component } from "solid-js";
import { Navigator } from "~/components/header/Navigator";
import { ThemeSwitcher } from "~/components/theme/ThemeSwitch";

const Header: Component<{ class: string }> = (props) => (
  <header
    class={`font-medium backdrop-blur-sm w-full flex gap-4 dark:text-white border-b max-w-screen-xl ${props.class}`}
  >
    <Navigator />
    <ThemeSwitcher />
  </header>
);

export default Header;
