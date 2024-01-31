/* @refresh granular */

import { Show, createEffect, createSignal } from "solid-js";
import { useFigureCreator } from "~/components/contexts/figure-creator";
import { getFigureCreator } from "~/components/figure/figure-creator";
import { ViewPlane } from "~/components/figure/view-plane";
import type { Source } from "~/workers/pyodide";
import { SourcesPanel } from "./source";

export const FigureArea = () => {
  const sourceKey = "figure-sources";
  const sourcesDefault: Source[] = [
    { type: "E", theta: 90, phi: 90, amplitude: 1, phase: 0 },
  ];
  const isSources = (sources: unknown): sources is Source[] => {
    if (!(sources instanceof Array)) return false;
    if (
      !sources.every(
        (source) =>
          "theta" in source &&
          "phi" in source &&
          "amplitude" in source &&
          "phase" in source,
      )
    )
      return false;
    return true;
  };
  const getSourcesFromLocalStorage = () => {
    const sources = localStorage.getItem(sourceKey);
    if (sources === null) return sourcesDefault;
    let parsedSources: unknown;
    try {
      parsedSources = JSON.parse(sources);
    } catch {
      return sourcesDefault;
    }
    if (!isSources(parsedSources)) return sourcesDefault;
    return parsedSources;
  };

  const fcContext = useFigureCreator();
  const awaitableFc = getFigureCreator(fcContext);

  const [fcReady, setFcReady] = createSignal(false);
  const [sources, setSources] = createSignal<Source[]>(
    getSourcesFromLocalStorage(),
  );

  awaitableFc.then(
    () => setFcReady(true),
    () => undefined,
  );

  createEffect(() => {
    localStorage.setItem("figure-sources", JSON.stringify(sources()));
  });

  return (
    <section class="flex flex-col place-items-center gap-4 py-4">
      <figure class="flex flex-col gap-2 p-2">
        <figcaption>
          <input
            type="text"
            placeholder="Figure Title"
            class="rounded border border-neutral-50 bg-white px-2 py-1 text-lg font-bold text-black focus-visible:outline-none focus-visible:ring dark:bg-black dark:text-white"
          />
        </figcaption>
        <div class="grid max-w-full grid-flow-col gap-4 overflow-x-auto rounded font-semibold">
          <Show when={fcReady()} fallback={<FigureAreaFallback />}>
            <ViewPlane cutPlane="YZ" sources={sources()} />
            <ViewPlane cutPlane="XZ" sources={sources()} />
            <ViewPlane cutPlane="XY" sources={sources()} />
          </Show>
        </div>
      </figure>
      <SourcesPanel sources={sources()} setSources={setSources} />
    </section>
  );
};

const FigureAreaFallback = () => (
  <div class="flex h-[312px] w-80 animate-pulse place-content-center place-items-center gap-2 self-stretch rounded bg-neutral-50 text-black outline outline-1 outline-neutral-200">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-6 w-6"
      viewBox="0 0 32 32"
      aria-label="Python loading indicator"
    >
      <path
        fill="currentColor"
        d="M23.488 9.14v2.966a4.284 4.284 0 0 1-4.173 4.236h-6.672a3.408 3.408 0 0 0-3.34 3.394v6.36c0 1.81 1.574 2.876 3.34 3.395a11.176 11.176 0 0 0 6.672 0c1.682-.487 3.34-1.467 3.34-3.394V23.55h-6.672v-.849h10.012c1.941 0 2.665-1.354 3.34-3.386a11.464 11.464 0 0 0 0-6.79c-.48-1.932-1.396-3.386-3.34-3.386Zm-3.752 16.108a1.273 1.273 0 1 1-1.254 1.269a1.26 1.26 0 0 1 1.254-1.27"
      />
      <path
        fill="none"
        d="M19.736 25.248a1.273 1.273 0 1 1-1.254 1.269a1.26 1.26 0 0 1 1.254-1.27"
      />
      <path
        fill="currentColor"
        d="M15.835 2a19.072 19.072 0 0 0-3.192.273c-2.827.499-3.34 1.544-3.34 3.472V8.29h6.68v.849H6.796a4.17 4.17 0 0 0-4.173 3.387a12.486 12.486 0 0 0 0 6.789c.475 1.977 1.609 3.386 3.55 3.386H8.47V19.65a4.245 4.245 0 0 1 4.173-4.15h6.672a3.365 3.365 0 0 0 3.34-3.394V5.745a3.729 3.729 0 0 0-3.34-3.472A20.838 20.838 0 0 0 15.835 2m-3.612 2.048a1.273 1.273 0 1 1-1.254 1.277a1.268 1.268 0 0 1 1.254-1.277"
      />
      <path
        fill="none"
        d="M12.223 4.048a1.273 1.273 0 1 1-1.254 1.277a1.268 1.268 0 0 1 1.254-1.277"
      />
    </svg>
    <span>Loading Python...</span>
  </div>
);
