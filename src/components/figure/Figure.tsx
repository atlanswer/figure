import type * as d3 from "d3";
import type * as Plot from "@observablehq/plot";
import { createEffect, createSignal, onCleanup, onMount } from "solid-js";
import { dot, plot, ruleY } from "@observablehq/plot";
import { csv, autoType } from "d3";

const Figure = () => {
  let figureCanvas: HTMLDivElement | undefined;

  const [data, setData] = createSignal<Plot.Data>();

  createEffect(() => {
    csv("/data/gistemp.csv", autoType).then(setData);
  });

  createEffect(() => {
    if (data() === undefined) return;
    const chart = plot({
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
        dot(data(), { x: "Date", y: "Anomaly", stroke: "Anomaly" }),
      ],
    });
    figureCanvas?.append(chart);
    onCleanup(() => chart.remove());
  });

  onMount(() => {
    if (!figureCanvas) {
      console.error("Cannot find a canvas to draw the figure.");
      return;
    }
  });

  return <div ref={figureCanvas} class="max-h-[400px] max-w-[600px]"></div>;
};

export default Figure;
