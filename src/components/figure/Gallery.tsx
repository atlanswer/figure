import { For, Suspense, SuspenseList, createEffect } from "solid-js";
import type * as Plot from "@observablehq/plot";
import { plot, ruleY, dot } from "@observablehq/plot";
import * as d3 from "d3";
import { Show, createSignal, lazy } from "solid-js";
import { useSiteContext } from "../context/SiteContext";
import { createStore, produce } from "solid-js/store";
import { NewFigure } from "./NewFigure";

export type FigureSource = {
  data?: number[][];
  cols?: string[];
};

const Gallery = () => {
  const Canvas = lazy(() => import("./Canvas"));
  const [figures, setFigures] = createStore<FigureSource[]>([]);

  return (
    <div class="w-full flex flex-col place-items-center gap-8">
      <SuspenseList revealOrder="forwards">
        <For each={figures} fallback={<p>Figures will be added here.</p>}>
          {(figure, idx) => {
            return (
              <Suspense fallback={<p>Loading figure...</p>}>
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
