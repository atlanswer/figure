import type { Component } from "solid-js";
import { Navigator } from "~/components/header/Navigator";
import { ThemeSwitcher } from "~/components/theme/ThemeSwitch";

const Header: Component<{ class: string }> = (props) => (
  <header
    class={`font-medium border-b border-[#eaeaea] p-8 z-10 backdrop-saturate-180 backdrop-blur-5 bg-[hsla(0,0%,100%,0.5)] dark:bg-[hsla(0,0%,0%,.5)] ${props.class}`}
  >
    <div class="mx-auto max-w-screen-xl flex gap-6">
      <Navigator />
      <ThemeSwitcher />
    </div>
  </header>
);

export default Header;
