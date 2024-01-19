/* @refersh granular */

import { A } from "@solidjs/router";
import type { ParentComponent } from "solid-js";
import { ThemeToggle } from "~/components/theme-toggle";

const Navigator = () => (
  <nav class="ml-auto flex gap-6 text-black dark:text-white">
    <A href="/" class="font-medium hover:underline hover:underline-offset-4">
      Figure
    </A>
    <A
      href="/about"
      class="font-medium hover:underline hover:underline-offset-4"
    >
      About
    </A>
  </nav>
);

export default ((props) => (
  <header class="sticky top-0 border-b border-slate-500 bg-sky-500 px-6 py-4 dark:bg-black">
    <div class="mx-auto flex max-w-screen-xl items-center">
      <Navigator />
      {props.children}
      <div class="ml-auto">
        <ThemeToggle />
      </div>
    </div>
  </header>
)) as ParentComponent;
