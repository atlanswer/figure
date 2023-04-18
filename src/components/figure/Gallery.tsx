import { Component, For } from "solid-js";
import type * as Plot from "@observablehq/plot";
import { plot, ruleY, dot } from "@observablehq/plot";
import * as d3 from "d3";
import { Show, createSignal, lazy } from "solid-js";
import { useSiteContext } from "../context/SiteContext";
import { blsMetroUnemployment } from "./data";

const Gallery = () => {
  const Canvas = lazy(() => import("./Canvas"));

  interface UnemploymentData {
    date: string;
    unemployment: string;
    division: string;
  }

  const [figures, setFigures] = createSignal<
    {
      data: string;
      plotFn: (data?: string) => ReturnType<typeof plot> | undefined;
    }[]
  >([
    // {
    //   data: blsMetroUnemployment,
    //   plotFn: (data) => {
    //     if (data === undefined) return;
    //     const x = (d: UnemploymentData) => d.date;
    //     const y = (d: UnemploymentData) => d.unemployment;
    //     const z = (d: UnemploymentData) => d.division;
    //     const yLabel = "Unemployment (%)";
    //     const height = 500;
    //     const color = "steelblue";
    //     const X = d3.map(data, x);
    //     const Y = d3.map(data, y);
    //     const Z = d3.map(data, z);
    //     const O = d3.map(data, (d) => d);
    //   },
    // },
  ]);

  return (
    <div class="w-full flex flex-col place-items-center gap-8">
      <For each={figures()} fallback={<p>Loading canvas...</p>}>
        {(figureItem) => <Canvas {...figureItem} />}
      </For>
      <NewFigure />
    </div>
  );
};

const NewFigure: Component = () => {
  const [siteContext] = useSiteContext();
  let inputRef: HTMLInputElement | undefined;
  const [fileList, setFileList] = createSignal<HTMLInputElement["files"]>();
  const [hover, setHover] = createSignal(false);
  const [dragEnterCount, setDragEnterCount] = createSignal(0);

  return (
    <label
      aria-label="Upload files to create a new figure"
      class="w-full max-w-screen-md flex place-content-center gap-2 border rounded-md p-2 font-semibold shadow transition transition-padding hover:(bg-slate-2 dark:bg-slate-5) focus:(ring-2 ring-offset-2 ring-slate-3 dark:ring-offset-slate-7)"
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
