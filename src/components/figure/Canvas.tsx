import { Component, createEffect, createResource, onCleanup } from "solid-js";
import type * as Plot from "@observablehq/plot";
import type { plot } from "@observablehq/plot";
import { autoType, csvParse } from "d3";

const Canvas: Component<{
  data: string;
  plotFn: (data?: Plot.Data) => ReturnType<typeof plot> | undefined;
}> = (props) => {
  let figureContainer: HTMLDivElement | undefined;

  const [data] = createResource(
    props.data,
    async (d) => {
      return csvParse(d, autoType);
    },
    {
      deferStream: true,
    },
  );

  createEffect(() => {
    const figureElm = props.plotFn(data());
    if (figureElm === undefined) return;
    figureContainer?.append(figureElm);

    onCleanup(() => figureElm?.remove());
  });

  return (
    <div class="w-full max-w-screen-xl flex place-content-center border rounded p-4">
      <div ref={figureContainer} class="max-h-[400px] max-w-[600px]"></div>
    </div>
  );
};

export default Canvas;
