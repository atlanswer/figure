/* @refresh granular */

import { A } from "@solidjs/router";
import { ThemeToggle } from "~/components/theme-toggle";

const Navigator = () => (
  <nav class="flex-1 font-medium leading-loose text-black dark:text-white">
    <span class="absolute right-1/2 max-w-max translate-x-1/2 [&_>_:not(:first-child)]:ml-8">
      <A href="/" class="hover:underline hover:underline-offset-4">
        Figure
      </A>
      <A href="/about" class="hover:underline hover:underline-offset-4">
        About
      </A>
    </span>
  </nav>
);

export const Header = () => (
  <header class="sticky top-0 place-content-center border-b border-sky-600 bg-teal-300 px-8 py-4 text-black dark:border-neutral-900 dark:bg-black dark:text-white">
    <div class="mx-auto flex max-w-screen-xl place-content-between gap-8">
      <Navigator />
      <ThemeToggle />
    </div>
  </header>
);
