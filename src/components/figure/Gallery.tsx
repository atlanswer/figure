import { Show, createSignal } from "solid-js";

const Gallery = () => (
  <div class="w-full flex flex-col place-items-center gap-8">
    <div>A figure</div>
    <NewFigure />
  </div>
);

const NewFigure = () => {
  const [focus, setFocus] = createSignal(false);

  return (
    <button
      class="w-full max-w-screen-md flex place-content-center gap-2 border rounded-md bg-slate-50 py-2 font-semibold shadow transition dark:bg-slate-6 hover:(bg-slate-2 dark:bg-slate-5) focus:(ring-2 ring-offset-2 ring-slate-3 dark:ring-offset-slate-7)"
      onFocusIn={() => setFocus(true)}
      onFocusOut={() => setFocus(false)}
      onPaste={(e) => {
        e.preventDefault();
        const paste = e.clipboardData?.getData("text/plain");
        console.log(`Paste: ${paste}`);
      }}
    >
      <span class="i-ic:round-add block h-6 w-6"></span>
      <Show when={focus()}>
        <span>Upload or drop a data file</span>
      </Show>
    </button>
  );
};

export { Gallery };
