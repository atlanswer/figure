/* @refresh granular */

import { A } from "@solidjs/router";
import { ThemeToggle } from "~/components/theme-toggle";

const Navigator = () => (
  <nav class="flex flex-1 font-medium leading-loose text-black dark:text-white sm:place-content-center">
    <span class="inline-block [&>:not(:first-child)]:ml-6">
      <A
        href="/"
        class="inline-block border-sky-500 px-1 py-4 [&.active]:border-b-2 [&.inactive]:hover:border-b-2 [&.inactive]:hover:border-neutral-300 dark:[&.inactive]:hover:border-neutral-700"
        end
      >
        Figure
      </A>
      <A
        href="/about"
        class="inline-block border-sky-500 px-1 py-4 [&.active]:border-b-2 [&.inactive]:hover:border-b-2 [&.inactive]:hover:border-neutral-300 dark:[&.inactive]:hover:border-neutral-700"
        end
      >
        About
      </A>
    </span>
  </nav>
);

export const Header = () => (
  <header class="sticky top-0 place-content-center bg-white px-8 text-black shadow dark:border-neutral-900 dark:bg-black dark:text-white">
    <div class="mx-auto flex max-w-screen-xl place-content-between place-items-center gap-8">
      <span class="hidden w-8 sm:inline" />
      <Navigator />
      <ThemeToggle />
    </div>
  </header>
);
