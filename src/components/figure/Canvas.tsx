import { Component, createMemo, createResource } from "solid-js";
import type * as Plot from "@observablehq/plot";
import type { plot } from "@observablehq/plot";
import { Suspense, lazy } from "solid-js";
import { autoType, csvParse } from "d3";

const Canvas: Component<{
  data: string;
  plotFn: (data?: Plot.Data) => ReturnType<typeof plot> | undefined;
}> = (props) => {
  const Figure = lazy(() => import("./Figure"));

  const [data] = createResource(
    props.data,
    async (d) => {
      return csvParse(d, autoType);
    },
    {
      deferStream: true,
    },
  );

  const plotFigure = createMemo(() => props.plotFn(data()));

  return (
    <div class="w-full max-w-screen-xl flex place-content-center border rounded p-4">
      <Suspense fallback={<p>Drawing figure...</p>}>
        <Figure figureElm={plotFigure()} />
      </Suspense>
    </div>
  );
};

export default Canvas;
