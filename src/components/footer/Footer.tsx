import type { Component } from "solid-js";

const Footer: Component<{ class?: string }> = (props) => (
  <footer
    class={`b-t p-8 flex lt-sm:flex-col items-center gap-4 bg-slate-1 dark:bg-slate-3 ${props.class}`}
  >
    <span class="flex-1">
      Built by{" "}
      <a
        href="https://github.com/atlanswer"
        target="_black"
        rel="noreferrer"
        class="font-medium underline underline-offset-4"
      >
        Atlanswer
      </a>
      .
    </span>
    <a
      href="https://github.com/atlanswer/figure"
      class="flex items-center gap-1"
    >
      <span class="i-mdi:github inline-block h-6 w-6"></span>
      <span>Source code</span>
    </a>
  </footer>
);

export { Footer };
