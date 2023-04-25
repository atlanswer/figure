import type { Component, JSX } from "solid-js";
import type { FigureSource } from "./Gallery";
import type { SetStoreFunction } from "solid-js/store";
import { For, createEffect, onCleanup } from "solid-js";
import { produce } from "solid-js/store";
import * as d3 from "d3";

const Canvas: Component<
  FigureSource & { setFigures: SetStoreFunction<FigureSource[]>; idx: number }
> = (props) => {
  let figureSVGRef: SVGSVGElement | undefined;
  let removeButtonRef: HTMLButtonElement | undefined;

  const RemoveFigureButton = () => (
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
  );
  /** width = 72 dpi * 3.5 in */
  const width = 72 * 3.5;
  /** width = 72 dpi * 2.5 in */
  const height = 72 * 2.5;
  const margin = {
    top: 20,
    bottom: 50,
    left: 50,
    right: 10,
  };

  const plotSParams = (
    data: FigureSource["data"],
    cols: FigureSource["cols"],
  ) => {
    if (figureSVGRef === undefined) return;
    // Data
    const x = d3.map(data, (x) => x[0]);
    // const isDefined = (d, i) => !isNaN(x[i]) && !isNaN()
    const xDomain = d3.extent(x) as [number, number];
    const xRange = [margin.left, width - margin.right];
    const xScale = d3.scaleLinear(xDomain, xRange);
    const xAxis = d3.axisBottom(xScale).tickSizeOuter(0).tickPadding(0);

    const yDomain = [-40, 0];
    const yRange = [height - margin.bottom, margin.top];
    const yScale = d3.scaleLinear(yDomain, yRange);
    const yAxis = d3
      .axisLeft(yScale)
      .ticks((yDomain[1] - yDomain[0]) / 10)
      .tickSizeOuter(0)
      .tickPadding(0);

    // SVG
    const svg = d3
      .select(figureSVGRef)
      .attr("width", width)
      .attr("height", height)
      .attr("viewbox", [0, 0, width, height])
      .style("font-size", "10pt")
      .on("touchstart", (e: TouchEvent) => e.preventDefault());
    // X axis
    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .style("font-size", "10pt")
      .call(xAxis)
      .selectAll("line")
      .attr("y2", -xAxis.tickSize());
    // Y axis
    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .style("font-size", "10pt")
      .call(yAxis)
      .selectAll("line")
      .attr("x2", yAxis.tickSize());
  };

  const plotPattern = (
    data: FigureSource["data"],
    cols: FigureSource["cols"],
  ) => {
    if (figureSVGRef === undefined) return;
  };

  createEffect(() => {
    // Modify the SVG DOM element with D3
    plotSParams(props.data, props.cols);
    // Remove the DOM elements
    onCleanup(() => {
      figureSVGRef?.replaceChildren();
    });
  });

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
        <RemoveFigureButton />
      </div>
      <figure class="self-center border">
        <svg ref={figureSVGRef}></svg>
      </figure>
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
