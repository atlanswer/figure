import { Show, createSignal } from "solid-js";

const Gallery = () => (
  <div class="w-full flex flex-col place-items-center gap-8">
    <div>A figure</div>
    <NewFigure />
  </div>
);

const NewFigure = () => {
  const [hover, setHover] = createSignal(false);

  return (
    <button
      aria-label="Upload files to create a new figure"
      class="w-full max-w-screen-md flex place-content-center gap-2 border rounded-md bg-slate-50 py-2 font-semibold shadow transition transition-padding dark:bg-slate-6 hover:(bg-slate-2 dark:bg-slate-5) focus:(ring-2 ring-offset-2 ring-slate-3 dark:ring-offset-slate-7)"
      onPointerEnter={(e) => {
        e.preventDefault();
        setHover(true);
      }}
      onPointerLeave={(e) => {
        e.preventDefault();
        setHover(false);
      }}
    >
      <span class="i-ic:round-add block h-6 w-6"></span>
      <Show when={hover()}>
        <span>Upload or drop a data file</span>
      </Show>
      <input
        aria-label="Upload files to create a new figure"
        type="file"
        accept=".png"
        multiple
        hidden
      />
    </button>
  );
};

export { Gallery };
