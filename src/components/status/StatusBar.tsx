import { A } from "solid-start";
import { ThemeSwitcher } from "../theme/ThemeSwitch";

export const StatusBar = () => (
  <div class="w-full flex gap-4">
    <A href="/">Home</A>
    <span class="flex-1">StatusBar</span>
    <ThemeSwitcher />
  </div>
);
