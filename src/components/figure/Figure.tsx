import { createEffect, createSignal, onCleanup, onMount } from "solid-js";
import * as Plot from "@observablehq/plot";
import * as d3 from "d3";

// const plotFigure = async (root: HTMLDivElement, data: Plotly.Data[]) => {
//   const { newPlot } = await import("plotly.js-dist-min");
//   newPlot(
//     root,
//     data,
//     {
//       font: {
//         family:
//           "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
//         size: 18,
//       },
//     },
//     { responsive: true },
//   );
// };

const Figure = () => {
  let figureCanvas: HTMLDivElement | undefined;

  const [data, setData] = createSignal<Plot.Data>();

  createEffect(() => {
    d3.csv("/data/gistemp.csv", d3.autoType).then(setData);
  });

  createEffect(() => {
    if (data() === undefined) return;
    const chart = Plot.plot({
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
        Plot.ruleY([0]),
        Plot.dot(data(), { x: "Date", y: "Anomaly", stroke: "Anomaly" }),
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
    // plotFigure(figureCanvas, [
    //   {
    //     type: "bar",
    //     x: [1, 2, 3, 4],
    //     y: [5, 10, 2, 8],
    //     marker: {
    //       color: "#C8A2C8",
    //       line: {
    //         width: 2.5,
    //       },
    //     },
    //   },
    // ]);
  });

  return <div ref={figureCanvas} class="h-[400px] w-[600px]"></div>;
};

export default Figure;
