/* @refersh granular */

export default () => (
  <footer class="items-center border-t bg-slate-100 px-6 py-4 text-black dark:bg-slate-600 dark:text-white">
    <div class="mx-auto flex max-w-screen-xl flex-col gap-4 sm:flex-row sm:gap-6">
      <span>
        Built by
        <span> </span>
        <a
          href="https://github.com/atlanswer"
          target="_blank"
          class="font-medium underline underline-offset-4"
        >
          @atlanswer
        </a>
      </span>
      <a
        href="https://status.atlanswer.com"
        target="_blank"
        class="flex flex-1 items-center gap-1"
      >
        <span class="underline underline-offset-4">Status</span>
      </a>
      <a
        href="https://github.com/atlanswer/figure"
        target="_blank"
        class="flex items-center gap-1"
      >
        <span class="underline underline-offset-4">Source</span>
      </a>
    </div>
  </footer>
);
