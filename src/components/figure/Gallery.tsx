import { For, Suspense, SuspenseList, createEffect } from "solid-js";
import type * as Plot from "@observablehq/plot";
import { plot, ruleY, dot } from "@observablehq/plot";
import * as d3 from "d3";
import { Show, createSignal, lazy } from "solid-js";
import { useSiteContext } from "../context/SiteContext";
import { createStore, produce } from "solid-js/store";
import { NewFigure } from "./NewFigure";

export type FigureSource = {
  data: number[][];
  cols: string[];
};

const Gallery = () => {
  const Canvas = lazy(() => import("./Canvas"));
  const [figures, setFigures] = createStore<FigureSource[]>([]);

  createEffect(() => {
    figures.forEach((figure) => {
      console.log(figure.cols);
      console.log(figure.data[0]);
    });
  });

  return (
    <div class="w-full flex flex-col place-items-center gap-8">
      <SuspenseList revealOrder="forwards">
        <For each={figures}>
          {(figure, idx) => {
            return (
              <Suspense fallback={<p>Loading canvas...</p>}>
                <Canvas {...figure} setFigures={setFigures} idx={idx()} />
              </Suspense>
            );
          }}
        </For>
      </SuspenseList>
      <NewFigure setFigures={setFigures} />
    </div>
  );
};

export { Gallery };
