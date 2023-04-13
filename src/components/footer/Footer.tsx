import type { Component } from "solid-js";

const Footer: Component<{ class?: string }> = (props) => (
  <footer
    class={`b-t p-8 items-center bg-slate-1 dark:bg-slate-6 ${props.class}`}
  >
    <div class="mx-auto max-w-screen-xl flex gap-6 lt-sm:flex-col">
      <span>
        Built by{" "}
        <a
          href="https://github.com/atlanswer"
          target="_blank"
          rel="noreferrer"
          class="font-medium underline underline-offset-4"
        >
          Atlanswer
        </a>
        .
      </span>
      <a
        href="https://status.waferlab.dev"
        target="_blank"
        rel="noreferrer"
        class="flex flex-1 items-center gap-1"
      >
        <span
          role="img"
          aria-label="Status icon"
          class="i-ic:round-trending-up inline-block h-6 w-6"
        ></span>
        <span class="underline underline-offset-4">Status</span>
      </a>
      <a
        href="https://github.com/atlanswer/figure"
        target="_blank"
        rel="noreferrer"
        class="flex items-center gap-1"
      >
        <span
          role="img"
          aria-label="GitHub icon"
          class="i-mdi:github inline-block h-6 w-6"
        ></span>
        <span class="underline underline-offset-4">Source code</span>
      </a>
    </div>
  </footer>
);

export { Footer };
