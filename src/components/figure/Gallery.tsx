import { Component, For, Suspense, SuspenseList, createEffect } from "solid-js";
import type * as Plot from "@observablehq/plot";
import { plot, ruleY, dot } from "@observablehq/plot";
import * as d3 from "d3";
import { Show, createSignal, lazy } from "solid-js";
import { useSiteContext } from "../context/SiteContext";
import { SetStoreFunction, createStore, produce } from "solid-js/store";

export type FigureSource = {
  data?: { [key: string]: number }[];
};

const Gallery = () => {
  const Canvas = lazy(() => import("./Canvas"));

  const [figures, setFigures] = createStore<FigureSource[]>([]);

  // createEffect(() => {
  //   console.log("Begin:");
  //   figures.forEach((figure) => {
  //     console.log(figure.data);
  //   });
  //   console.log("End.");
  // });

  return (
    <div class="w-full flex flex-col place-items-center gap-8">
      <SuspenseList revealOrder="forwards">
        <For each={figures} fallback={<p>Figures will be added here.</p>}>
          {(figure) => (
            <Suspense fallback={<p>Loading figure...</p>}>
              <Canvas {...figure} />
            </Suspense>
          )}
        </For>
      </SuspenseList>
      <NewFigure setFigures={setFigures} />
    </div>
  );
};

const NewFigure: Component<{ setFigures: SetStoreFunction<FigureSource[]> }> = (
  props,
) => {
  const [siteContext] = useSiteContext();
  let inputRef: HTMLInputElement | undefined;
  const [hover, setHover] = createSignal(false);
  const [dragEnterCount, setDragEnterCount] = createSignal(0);

  const handleFileInput = async (fileList?: FileList | null) => {
    if (fileList === null || fileList === undefined) return;
    if (fileList.length > 1) {
      console.warn("More than one file.");
      return;
    }
    const file = fileList.item(0);
    if (file === null) {
      console.warn("FileList is empty.");
      return;
    }
    const dataString = await file.text();
    const d3DataArray = d3.csvParse(dataString, d3.autoType);
    const data = Array.from(d3DataArray) as { [key: string]: number }[];
    props.setFigures(
      produce((figures) => {
        figures.push({ data: data });
      }),
    );
    if (inputRef === undefined) return;
    inputRef.value = "";
  };

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
        console.log("File dropped on label");
        handleFileInput(e.dataTransfer?.files);
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
      <input
        aria-label="Upload files to create a new figure"
        type="file"
        accept="text/csv"
        multiple
        hidden
        ref={inputRef}
        onChange={() => {
          handleFileInput(inputRef?.files);
        }}
      />
    </label>
  );
};

export { Gallery };
