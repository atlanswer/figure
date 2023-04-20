import type { Component } from "solid-js";
import type * as Plot from "@observablehq/plot";
import type { plot } from "@observablehq/plot";
import type { FigureSource } from "./Gallery";
import type { SetStoreFunction } from "solid-js/store";
import { For, createEffect, createResource, onCleanup } from "solid-js";
import * as d3 from "d3";
import { produce } from "solid-js/store";

const Canvas: Component<
  FigureSource & { setFigures: SetStoreFunction<FigureSource[]>; idx: number }
> = (props) => {
  let figureContainer: HTMLDivElement | undefined;

  const plotSParams = (
    data?: FigureSource["data"],
    cols?: FigureSource["cols"],
  ): SVGSVGElement | undefined => {
    return undefined;
  };

  const plotPattern = (
    data?: FigureSource["data"],
    cols?: FigureSource["cols"],
  ): SVGSVGElement | undefined => {
    return undefined;
  };

  createEffect(() => {
    const figureElm = plotSParams(props.data);

    if (figureElm === undefined) return;
    figureContainer?.append(figureElm);

    onCleanup(() => figureElm?.remove());
  });

  return (
    <div class="w-full max-w-screen-xl flex flex-col gap-4 border rounded bg-slate-50 p-4 dark:bg-slate-6">
      <div class="flex items-center gap-4">
        <TraceLegends class="flex-1" cols={props.cols} />
        <button
          class="border rounded p-1"
          onClick={() => {
            props.setFigures(
              produce((figures) => {
                figures.splice(props.idx, 1);
              }),
            );
          }}
        >
          <span
            role="img"
            class="i-ic:round-playlist-remove block h-6 w-6"
          ></span>
        </button>
      </div>
      <div
        ref={figureContainer}
        class="max-h-[400px] max-w-[600px] justify-self-center"
      >
        Figure
      </div>
    </div>
  );
};

const TraceLegend: Component<{ name: string; color: string }> = (props) => {
  return <span class="min-w-12rem border rounded p-1">{props.name}</span>;
};

const TraceLegends: Component<{ class: string; cols: FigureSource["cols"] }> = (
  props,
) => (
  <div class={`flex flex-wrap gap-4 ${props.class}`}>
    <For each={props.cols}>
      {(col, idx) => {
        // Skip the first column aka the frequency column.
        if (idx() === 0) return;
        return <TraceLegend name={col} color={d3.schemePaired[idx()]} />;
      }}
    </For>
  </div>
);
export default Canvas;
