import type { Component } from "solid-js";

const Footer: Component<{ class?: string }> = (props) => (
  <footer
    class={`b-t bg-slate-1 dark:bg-slate-6 items-center p-8 ${
      props.class ? props.class : ""
    }`}
  >
    <div class="lt-sm:flex-col mx-auto flex max-w-screen-xl gap-6">
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
        />
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
        />
        <span class="underline underline-offset-4">Source code</span>
      </a>
    </div>
  </footer>
);

export { Footer };
