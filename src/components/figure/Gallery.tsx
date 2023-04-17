import { Component, For } from "solid-js";
import type * as Plot from "@observablehq/plot";
import {
  plot,
  ruleY,
  dot,
  rect,
  bin,
  density,
  rectY,
  binX,
} from "@observablehq/plot";
import { Show, createSignal, lazy } from "solid-js";
import { useSiteContext } from "../context/SiteContext";
import { athletes, gistemp } from "./data";

const Gallery = () => {
  const Canvas = lazy(() => import("./Canvas"));

  const plotFn1 = (data?: Plot.Data) => {
    if (data === undefined) return;

    return plot({
      style: {
        background: "transparent",
      },
      y: {
        grid: true,
      },
      color: {
        type: "diverging",
        scheme: "BuRd",
      },
      marks: [
        ruleY([0]),
        dot(data, { x: "Date", y: "Anomaly", stroke: "Anomaly" }),
      ],
    });
  };

  const plotFn2 = (data?: Plot.Data) => {
    if (data === undefined) return;

    return dot(data, { x: "weight", y: "height", stroke: "sex" }).plot({
      style: {
        background: "transparent",
      },
    });
  };

  const [figures, setFigures] = createSignal<
    {
      data: string;
      plotFn: (data?: Plot.Data) => ReturnType<typeof plot> | undefined;
    }[]
  >([
    {
      data: gistemp,
      plotFn: plotFn1,
    },
    {
      data: athletes,
      plotFn: plotFn2,
    },
    {
      data: athletes,
      plotFn: (data?: Plot.Data) => {
        if (data === undefined) return;

        return rect(
          data,
          bin(
            { fillOpacity: "count" },
            { x: "weight", y: "height", fill: "sex" },
          ),
        ).plot({
          style: {
            background: "transparent",
          },
        });
      },
    },
    {
      data: athletes,
      plotFn: (data?: Plot.Data) => {
        if (data === undefined) return;

        return density(data, {
          x: "weight",
          y: "height",
          stroke: "sex",
          bandwidth: 6,
        }).plot({
          style: {
            background: "transparent",
          },
        });
      },
    },
    {
      data: athletes,
      plotFn: (data?: Plot.Data) => {
        if (data === undefined) return;
        return rectY(
          data,
          binX({ y: "count" }, { x: "weight", fill: "sex" }),
        ).plot({
          style: {
            background: "transparent",
          },
        });
      },
    },
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
