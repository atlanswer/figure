import type { Component, JSX } from "solid-js";
import type * as Plot from "@observablehq/plot";
import type { plot } from "@observablehq/plot";
import type { FigureSource } from "./Gallery";
import type { SetStoreFunction } from "solid-js/store";
import { For, createEffect, onCleanup } from "solid-js";
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
    <div class="w-full max-w-screen-xl flex flex-col gap-4 border rounded bg-slate-50 p-4 transition dark:bg-slate-6">
      <div class="flex items-center gap-4">
        <TraceLegends
          class="flex-1"
          cols={props.cols}
          setFigures={props.setFigures}
          figureIdx={props.idx}
        />
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

const TraceLegend: Component<
  {
    name: string;
    color: string;
    setFigures: SetStoreFunction<FigureSource[]>;
  } & JSX.HTMLAttributes<HTMLSpanElement>
> = (props) => {
  return (
    <span class="min-w-12rem flex items-center gap-4 border rounded bg-slate-2 py-1 pl-4 font-semibold text-black">
      <span class="h-1 w-16" style={`background-color: ${props.color}`}></span>
      <span>{props.name}</span>
      <button class="border-l border-black px-1" onClick={props.onClick}>
        <span role="img" class="i-ic:round-close block h-5 w-5"></span>
      </button>
    </span>
  );
};

const TraceLegends: Component<{
  class: string;
  cols: FigureSource["cols"];
  setFigures: SetStoreFunction<FigureSource[]>;
  figureIdx: number;
}> = (props) => {
  return (
    <div class={`flex flex-wrap gap-4 ${props.class}`}>
      <For each={props.cols}>
        {(col, idx) => {
          // Skip the first column aka the frequency column.
          if (idx() === 0) return;

          const removeCol = (col: string) => {
            const colIdx = props.cols?.indexOf(col);
            props.setFigures(props.figureIdx, "cols", (c) => [
              ...c.slice(0, colIdx),
              ...c.slice(colIdx + 1),
            ]);
            props.setFigures(props.figureIdx, "data", (data) =>
              data.map((cols) => [
                ...cols.slice(0, colIdx),
                ...cols.slice(colIdx + 1),
              ]),
            );
          };

          return (
            <TraceLegend
              name={col}
              color={d3.schemePaired[idx() - 1]}
              setFigures={props.setFigures}
              onClick={[removeCol, col]}
            />
          );
        }}
      </For>
    </div>
  );
};
export default Canvas;
