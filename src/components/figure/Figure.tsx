import type Plotly from "plotly.js-dist-min";
import { onMount } from "solid-js";

const plotFigure = async (root: HTMLDivElement, data: Plotly.Data[]) => {
  const Plotly = await import("plotly.js-dist-min");
  Plotly.newPlot(
    root,
    data,
    {
      title: "Response",
      font: {
        size: 18,
      },
    },
    { responsive: true },
  );
};

const Figure = () => {
  let figureCanvas: HTMLDivElement | undefined;

  onMount(() => {
    if (!figureCanvas) {
      console.error("Cannot find a canvas to draw the figure.");
      return;
    }
    plotFigure(figureCanvas, [
      {
        type: "bar",
        x: [1, 2, 3, 4],
        y: [5, 10, 2, 8],
        marker: {
          color: "#C8A2C8",
          line: {
            width: 2.5,
          },
        },
      },
    ]);
  });

  return <div ref={figureCanvas} class="h-[400px] w-[600px]"></div>;
};

export default Figure;
