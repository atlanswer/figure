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

  const fruits = [
    { name: "🍊", count: 21 },
    { name: "🍇", count: 13 },
    { name: "🍏", count: 8 },
    { name: "🍌", count: 5 },
    { name: "🍐", count: 3 },
    { name: "🍋", count: 2 },
    { name: "🍎", count: 1 },
    { name: "🍉", count: 1 },
  ];

  const plotSParams = (
    data: FigureSource["data"],
    cols: FigureSource["cols"],
  ): SVGElement | undefined => {
    // const xLabel = "Frequency (GHz)";
    // const yLabel = "Scattering Parameter (dB)";

    // const x = data.map((v) => v[0]);
    // const xDomain = d3.extent(x);
    // if (xDomain[0] === undefined) return;
    // const xScale = d3.scaleLinear(xDomain, [100, 550]);
    // const xAxis = d3.axisBottom(xScale).ticks(10);

    // const y = data.map((v) => v.slice(1)).flat();
    // const yDomain = [-40, 0];
    // const yScale = d3.scaleLinear(yDomain, [300, 50]);
    // const yAxis = d3.axisLeft(yScale).ticks(5);

    // const zDomain = new d3.InternSet(cols.slice(1));

    // const line = d3.line().x((i) => xScale(x[i]));

    // const svg = d3
    //   .create("svg")
    //   .attr("width", 600)
    //   .attr("height", 400)
    //   .attr("viewBox", [0, 0, 600, 400])
    //   .attr("style", "max-width: 100%; height: auto; height: intrinsic;")
    //   .style("-webkit-tap-highlight-color", "transparent");

    // svg.append("g").attr("transform", `translate(0,500)`).call(xAxis);

    // svg
    //   .append("g")
    //   .attr("transform", `translate(100,0)`)
    //   .call(yAxis)
    //   .call((g) => g.select(".domain").remove())
    //   .call((g) => g.append("text"))
    //   .attr("x", -100)
    //   .attr("y", 10)
    //   .attr("fill", "currentColor")
    //   .attr("text-anchor", "start")
    //   .text(yLabel);

    // svg
    //   .append("g")
    //   .attr("fill", "none")
    //   .attr("stroke", "steelblue")
    //   .selectAll("path")
    //   .data(d3.group(d3.range(x.length), (i) => i));

    // const svgNode = svg.node();
    // if (svgNode === null) return;
    // return svgNode;

    const width = 600;
    const height = 202;
    const margin = {
      top: 20,
      bottom: 0,
      left: 30,
      right: 0,
    };

    const x = d3
      .scaleLinear()
      .domain([0, d3.max(fruits, (d) => d.count) as number])
      .range([margin.left, width - margin.right])
      .interpolate(d3.interpolateRound);

    const y = d3
      .scaleBand()
      .domain(fruits.map((d) => d.name))
      .range([margin.top, height - margin.bottom])
      .padding(0.1)
      .round(true);

    const color = d3
      .scaleSequential()
      .domain([0, d3.max(fruits, (d) => d.count)] as number[])
      .interpolator(d3.interpolateBlues);

    const e1 = fruits.map((d) => (
      <rect
        y={y(d.name)}
        x={x(0)}
        width={x(d.count) - x(0)}
        height={y.bandwidth()}
        fill={color(d.count)}
      ></rect>
    ));

    const e2 = fruits.map((d) => (
      <text
        y={y(d.name)}
        x={x(d.count)}
        dy="0.35em"
        fill={d3.lab(color(d.count)).l < 60 ? "white" : "black"}
      >
        {d.count}
      </text>
    ));

    const n1 = <g transform={`translate(0,${margin.top})`}></g>;
    const n2 = <g transform={`translate(${margin.left},0)`}></g>;

    const svg = (
      <svg
        viewBox={`0 0 ${width} ${height}`}
        style={`height: ${height}px; max-width: ${width}px; font: 10px sans-serif;`}
      >
        <g>{e1}</g>
        <g text-anchor="end" transform={`translate(-6,${y.bandwidth() / 2})`}>
          {e2}
        </g>
        {
          d3
            .select(n1 as Element)
            .call(d3.axisTop(x))
            .call((g) => g.select(".domain").remove())
            .node() as JSX.Element
        }
        {
          d3
            .select(n2 as Element)
            .call(d3.axisLeft(y))
            .call((g) => g.select(".domain").remove())
            .node() as JSX.Element
        }
      </svg>
    ) as SVGElement;

    return svg;
  };

  const plotPattern = (
    data: FigureSource["data"],
    cols: FigureSource["cols"],
  ): SVGSVGElement | undefined => {
    return undefined;
  };

  createEffect(() => {
    const figureElm = plotSParams(props.data, props.cols);

    if (figureElm === undefined) {
      console.log("plotSParams produces an empty node.");
      return;
    }
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
        class="max-h-[400px] max-w-[600px] self-center"
      ></div>
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
