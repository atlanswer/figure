import { Show, createSignal } from "solid-js";
import type { Component } from "solid-js";
import { useSiteContext } from "../context/SiteContext";

const Gallery = () => (
  <div class="w-full flex flex-col place-items-center gap-8">
    <div>A figure</div>
    <NewFigure />
  </div>
);

const NewFigure: Component = () => {
  const [siteContext] = useSiteContext();
  let inputRef: HTMLInputElement | undefined;
  const [fileList, setFileList] = createSignal<HTMLInputElement["files"]>();
  const [hover, setHover] = createSignal(false);
  const [dragEnterCount, setDragEnterCount] = createSignal(0);

  return (
    <label
      aria-label="Upload files to create a new figure"
      class="w-full max-w-screen-md flex place-content-center gap-2 border rounded-md py-2 font-semibold shadow transition transition-padding hover:(bg-slate-2 dark:bg-slate-5) focus:(ring-2 ring-offset-2 ring-slate-3 dark:ring-offset-slate-7)"
      classList={{
        "py-4 border-(3 dashed)": siteContext.isDragOver,
        "bg-slate-50 dark:bg-slate-6": dragEnterCount() === 0,
        "bg-slate-2 dark:bg-slate-5 border-slate": dragEnterCount() > 0,
      }}
      onPointerEnter={(e) => {
        e.preventDefault();
        setHover(true);
      }}
      onPointerLeave={(e) => {
        e.preventDefault();
        setHover(false);
      }}
      onDragEnter={(e) => {
        e.preventDefault();
        setDragEnterCount((c) => c + 1);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        setDragEnterCount((c) => c - 1);
      }}
      onDrop={(e) => {
        e.preventDefault();
        console.log("Dropped on label");
        setFileList(e.dataTransfer?.files);
      }}
    >
      <span class="i-ic:round-add block h-6 w-6"></span>
      <Show when={hover() || siteContext.isDragOver}>
        <span>
          {dragEnterCount() > 0
            ? "Drop files here"
            : "Upload or drop files here to create a new figure"}
        </span>
      </Show>
      <Show when={fileList()?.length}>
        <span>File selected: {fileList()?.length}</span>
      </Show>
      <input
        aria-label="Upload files to create a new figure"
        type="file"
        accept=".png"
        multiple
        hidden
        ref={inputRef}
        onChange={() => {
          setFileList(inputRef?.files);
        }}
      />
    </label>
  );
};

export { Gallery };
