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
  const height = 72 * 3;
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
    const dataT = d3.transpose(data) as number[][];
    const x = dataT[0];
    const y = dataT.splice(1);
    const dataP = y.map((d) => d3.zip(x, d) as [number, number][]);

    // const isDefined = (d, i) => !isNaN(x[i]) && !isNaN()
    const xDomain = d3.extent(x) as [number, number];
    const xRange = [margin.left, width - margin.right];
    const xScale = d3.scaleLinear(xDomain, xRange);
    const xAxis = d3.axisBottom(xScale).tickSizeOuter(0).tickPadding(0);
    const xGrid = (g: d3.Selection<SVGGElement, unknown, null, unknown>) =>
      g
        .selectAll("line")
        .data(xScale.ticks())
        .join("line")
        .attr("stroke-linecap", "round")
        .attr("x1", (d) => xScale(d))
        .attr("x2", (d) => xScale(d))
        .attr("y1", margin.top)
        .attr("y2", height - margin.bottom)
        .attr("stroke", "currentColor")
        .attr("stroke-opacity", 0.5)
        .attr("stroke-width", 0.5)
        .attr("stroke-dasharray", "1");

    const yDomain = [-40, 0];
    const yRange = [height - margin.bottom, margin.top];
    const yScale = d3.scaleLinear(yDomain, yRange);
    const yAxis = d3
      .axisLeft(yScale)
      .ticks((yDomain[1] - yDomain[0]) / 10)
      .tickSizeOuter(0)
      .tickPadding(0);
    const yGrid = (g: d3.Selection<SVGGElement, unknown, null, unknown>) =>
      g
        .selectAll("line")
        .data(yScale.ticks((yDomain[1] - yDomain[0]) / 10))
        .join("line")
        .attr("stroke-linecap", "round")
        .attr("x1", margin.left)
        .attr("x2", width - margin.right)
        .attr("y1", (d) => yScale(d))
        .attr("y2", (d) => yScale(d))
        .attr("stroke", "currentColor")
        .attr("stroke-opacity", 0.5)
        .attr("stroke-width", 0.5)
        .attr("stroke-dasharray", "1");

    const trace = d3
      .line()
      .x((d) => xScale(d[0]))
      .y((d) => yScale(d[1]));

    // SVG
    const svg = d3
      .select(figureSVGRef)
      .attr("width", width)
      .attr("height", height)
      .attr("viewbox", [0, 0, width, height])
      .style("font-size", "10pt")
      .style("font-family", "Arial,Helvetica,sans-serif")
      .on("touchstart", (e: TouchEvent) => e.preventDefault());

    // X grid
    svg.append("g").call(xGrid);
    // X axis
    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .style("font-size", "10pt")
      .style("font-family", "Arial,Helvetica,sans-serif")
      .call(xAxis)
      .call((g) =>
        g
          .selectAll("line")
          .attr("y2", -xAxis.tickSize())
          .attr("stroke-linecap", "round"),
      )
      .call((g) =>
        g
          .select("g:last-child>line")
          .attr("y2", -yScale(yDomain[0]) + margin.top),
      )
      .append("text")
      .attr("text-anchor", "middle")
      .attr("x", xScale(d3.mean(xDomain) as number))
      .attr("y", 35)
      .attr("fill", "currentColor")
      .text("Frequency (GHz)");
    // Y grid
    svg.append("g").call(yGrid);
    // Y axis
    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .style("font-size", "10pt")
      .style("font-family", "Arial,Helvetica,sans-serif")
      .call(yAxis)
      .call((g) =>
        g
          .selectAll("line")
          .attr("x2", yAxis.tickSize())
          .attr("stroke-linecap", "round"),
      )
      .call((g) =>
        g
          .select("g:last-child>line")
          .attr("x2", xScale(xDomain[1]) - margin.left),
      )
      .call((g) => g.selectAll("path").attr("stroke-linecap", "round"))
      .append("text")
      .attr("text-anchor", "middle")
      .attr("transform", "rotate(-90)")
      .attr("y", -35)
      .attr("x", -yScale(d3.mean(yDomain) as number))
      .attr("fill", "currentColor")
      .text("Scattering Parameters (dB)");
    // Traces
    svg
      .append("g")
      .attr("fill", "none")
      .attr("stroke", "currentColor")
      .attr("stroke-linecap", "round")
      .selectAll("path")
      .data(dataP)
      .join("path")
      .attr("d", (d) => trace(d))
      .attr("stroke", (_, i) => d3.schemeTableau10[i])
      .attr("stroke-dasharray", (_, i) => (i % 2 ? "5" : null));
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
