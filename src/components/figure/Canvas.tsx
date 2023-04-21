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
    data: FigureSource["data"],
    cols: FigureSource["cols"],
  ): SVGSVGElement | undefined => {
    const xLabel = "Frequency (GHz)";
    const yLabel = "Scattering Parameter (dB)";

    const x = data.map((v) => v[0]);
    const xDomain = d3.extent(x);
    if (xDomain[0] === undefined) return;
    const xScale = d3.scaleLinear(xDomain, [100, 550]);
    const xAxis = d3.axisBottom(xScale).ticks(10);

    const y = data.map((v) => v.slice(1)).flat();
    const yDomain = [-40, 0];
    const yScale = d3.scaleLinear(yDomain, [300, 50]);
    const yAxis = d3.axisLeft(yScale).ticks(5);

    const zDomain = new d3.InternSet(cols.slice(1));

    // const line = d3.line().x((i) => xScale(x[i]));

    return undefined;
  };

  const plotPattern = (
    data: FigureSource["data"],
    cols: FigureSource["cols"],
  ): SVGSVGElement | undefined => {
    return undefined;
  };

  createEffect(() => {
    const figureElm = plotSParams(props.data, props.cols);

    if (figureElm === undefined) return;
    figureContainer?.append(figureElm);

    onCleanup(() => figureElm?.remove());
  });

  let removeButtonRef: HTMLButtonElement | undefined;

  // createEffect(() => {
  //   if (props.cols.length === 1) {
  //     if (removeButtonRef === undefined) return;
  //     removeButtonRef.click();
  //   }
  // });

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
          ref={removeButtonRef}
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
            aria-label="Remove trace icon"
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
        <span
          role="img"
          aria-label="Remove canvas icon"
          class="i-ic:round-close block h-5 w-5"
        ></span>
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
            const colIdx = props.cols.indexOf(col);
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
      <button class="text-slate-2">
        <span
          role="img"
          aria-label="Add trace icon"
          class="i-ic:round-add-box block h-6 w-6"
        ></span>
      </button>
    </div>
  );
};
export default Canvas;
