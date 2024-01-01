import type { Component } from "solid-js";
import { Navigator } from "~/components/header/Navigator";
import { ThemeSwitcher } from "~/components/theme/ThemeSwitch";

const Header: Component<{ class: string }> = (props) => (
  <header
    class={`backdrop-saturate-180 backdrop-blur-5 z-10 border-b border-[#eaeaea] bg-[hsla(0,0%,100%,0.5)] p-8 font-medium dark:bg-[hsla(0,0%,0%,.5)] ${props.class}`}
  >
    <div class="mx-auto flex max-w-screen-xl gap-6">
      <Navigator />
      <ThemeSwitcher />
    </div>
  </header>
);

export default Header;
