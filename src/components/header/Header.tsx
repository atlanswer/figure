import type { Component } from "solid-js";
import { Navigator } from "~/components/header/Navigator";
import { ThemeSwitcher } from "~/components/theme/ThemeSwitch";

const Header: Component<{ class: string }> = (props) => (
  <header
    class={`font-medium backdrop-blur-sm text-black dark:text-white border-b p-8 ${props.class}`}
  >
    <div class="mx-auto max-w-screen-xl flex gap-6">
      <Navigator />
      <ThemeSwitcher />
    </div>
  </header>
);

export default Header;
