import {
  For,
  Show,
  createUniqueId,
  type Component,
  createResource,
  Suspense,
  untrack,
} from "solid-js";
import { unwrap, type SetStoreFunction } from "solid-js/store";
import { type FigureConfig } from "~/routes/figure";
import { type Source } from "~/workers/pyodide";
import { useFigureCreator } from "../contexts/figure-creator";
import { useDrawPerf } from "../contexts/draw-perf";

export const SourcesPanel: Component<{
  sources: Source[];
  setFigureConfigs: SetStoreFunction<FigureConfig[]>;
  idx: number;
}> = (props) => {
  return (
    <div class="flex flex-wrap place-content-center place-items-center gap-4">
      <SourcePreview sources={props.sources} />
      <For each={props.sources}>
        {(source, idx) => (
          <SourceCard
            source={source}
            setFigureConfigs={props.setFigureConfigs}
            numSources={props.sources.length}
            figIdx={props.idx}
            idx={idx()}
          />
        )}
      </For>
      <AddSource setFigureConfigs={props.setFigureConfigs} idx={props.idx} />
    </div>
  );
};

const SourcePreview: Component<{ sources: Source[] }> = (props) => {
  const [figureCreatorReady] = useFigureCreator();
  const [, updateAvgTime] = useDrawPerf();

  const [sourcesPreviewData] = createResource(
    () => JSON.stringify(props.sources),
    async () => {
      const t_start = Date.now();

      const fc = await figureCreatorReady;
      const [svgData] = await fc.plotSources(
        untrack(() => unwrap(props.sources)),
      );

      const t_finish = Date.now();
      updateAvgTime(t_finish - t_start);

      return `data:image/svg+xml,${encodeURIComponent(svgData)}`;
    },
  );

  return (
    <figure class="flex h-44 w-44 place-content-center place-items-center rounded-md bg-neutral-100 text-black shadow-md outline-1 outline-neutral-500 dark:bg-neutral-800 dark:text-white dark:outline">
      <Suspense fallback={<SourcePreviewLoading />}>
        <img
          width="176"
          height="176"
          class="rounded-md"
          src={sourcesPreviewData.latest ?? ""}
          alt="Source Preview"
        />
      </Suspense>
    </figure>
  );
};

export const SourcePreviewLoading = () => (
  <div class="flex place-content-center gap-2 p-4">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      class="h-6 w-6 animate-spin"
    >
      <path fill="currentColor" d="M12 4V2A10 10 0 0 0 2 12h2a8 8 0 0 1 8-8" />
    </svg>
    <span class="font-semibold">Creating source preview...</span>
  </div>
);

const SourceCard: Component<{
  source: Source;
  setFigureConfigs: SetStoreFunction<FigureConfig[]>;
  numSources: number;
  figIdx: number;
  idx: number;
}> = (props) => {
  const sourceInfos = ["theta", "phi", "amplitude", "phase"] as const;

  return (
    <div class="grid h-44 grid-flow-row place-content-around gap-2 rounded-lg bg-neutral-100 p-2 text-neutral-900 shadow-md outline-1 outline-neutral-500 dark:bg-black dark:text-neutral-100 dark:outline">
      <div class="grid grid-flow-col place-content-between place-items-center gap-2">
        <span class="flex place-items-center gap-2 ">
          <span class="rounded bg-neutral-500 px-2 text-white">
            {props.idx + 1}
          </span>
          <span class="w-fit text-lg font-semibold">
            {props.source.type}-dipole
          </span>
        </span>
        <span class="flex place-items-center gap-2">
          <span class="grid grid-cols-2 place-content-center place-items-stretch rounded bg-neutral-200 p-1 font-bold text-neutral-500 dark:bg-neutral-800 [&>.active]:bg-sky-500 [&>.active]:text-white">
            <button
              class="whitespace-nowrap rounded px-2"
              classList={{ active: props.source.type === "E" }}
              onClick={() =>
                props.setFigureConfigs(
                  props.figIdx,
                  "sources",
                  props.idx,
                  "type",
                  "E",
                )
              }
            >
              J
            </button>
            <button
              class="whitespace-nowrap rounded px-2"
              classList={{ active: props.source.type === "M" }}
              onClick={() =>
                props.setFigureConfigs(
                  props.figIdx,
                  "sources",
                  props.idx,
                  "type",
                  "M",
                )
              }
            >
              M
            </button>
          </span>
          <Show when={props.numSources > 1}>
            <button
              aria-label="Remove source"
              class="rounded bg-neutral-500 text-white hover:bg-sky-500"
              onClick={() =>
                // eslint-disable-next-line solid/reactivity
                props.setFigureConfigs(props.figIdx, "sources", (sources) => [
                  ...sources.slice(0, props.idx),
                  ...sources.slice(props.idx + 1),
                ])
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="h-6 w-6"
              >
                <path
                  fill-rule="evenodd"
                  d="M4.25 12a.75.75 0 0 1 .75-.75h14a.75.75 0 0 1 0 1.5H5a.75.75 0 0 1-.75-.75Z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </Show>
        </span>
      </div>
      <form class="grid grid-cols-2 grid-rows-2 place-items-end gap-2">
        <For each={sourceInfos}>
          {(param) => {
            const inputId = createUniqueId();
            return (
              <div class="flex flex-col gap-1">
                <label for={inputId} class="text-sm">
                  {param[0]?.toUpperCase() +
                    param.slice(1) +
                    (param === "amplitude" ? " (relative)" : " (deg)")}
                </label>
                <div class="flex">
                  <button
                    type="button"
                    aria-label="Decrease value"
                    class="rounded-s border border-neutral-500 px-1"
                    onClick={() =>
                      props.setFigureConfigs(
                        props.figIdx,
                        "sources",
                        props.idx,
                        param,
                        (prev) =>
                          param === "amplitude" ?
                            prev <= 0.1 ?
                              prev
                            : prev - 0.1
                          : param === "theta" ?
                            prev < 90 ?
                              prev + 90
                            : prev - 90
                          : param === "phase" ?
                            prev <= -90 ?
                              prev + 270
                            : prev - 90
                          : prev < 90 ? prev + 270
                          : prev - 90,
                      )
                    }
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      class="h-6 w-6"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </button>
                  <input
                    id={inputId}
                    value={props.source[param].toFixed(2)}
                    type="number"
                    min={param === "phase" ? "-180" : "0"}
                    max={param === "theta" || param === "phase" ? "180" : "359"}
                    step={param === "amplitude" ? "0.01" : "1"}
                    class="w-16 border border-x-0 border-neutral-500 bg-transparent text-center focus-visible:outline-none"
                    required
                    onChange={(event) =>
                      props.setFigureConfigs(
                        props.figIdx,
                        "sources",
                        props.idx,
                        param,
                        +event.target.value,
                      )
                    }
                  />
                  <button
                    type="button"
                    aria-label="Increase value"
                    class="rounded-e border border-neutral-500 px-1"
                    onClick={() =>
                      props.setFigureConfigs(
                        props.figIdx,
                        "sources",
                        props.idx,
                        param,
                        (prev) =>
                          param === "amplitude" ? prev + 0.1
                          : param === "theta" ?
                            prev > 90 ?
                              prev - 90
                            : prev + 90
                          : param === "phase" ?
                            prev > 90 ?
                              prev - 270
                            : prev + 90
                          : prev >= 270 ? prev - 270
                          : prev + 90,
                      )
                    }
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      class="h-6 w-6"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M11.47 7.72a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 1 1-1.06 1.06L12 9.31l-6.97 6.97a.75.75 0 0 1-1.06-1.06l7.5-7.5Z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            );
          }}
        </For>
      </form>
    </div>
  );
};

const AddSource: Component<{
  setFigureConfigs: SetStoreFunction<FigureConfig[]>;
  idx: number;
}> = (props) => {
  const addSource = () => {
    props.setFigureConfigs(props.idx, "sources", (sources) => [
      ...sources,
      { type: "M", theta: 90, phi: 0, amplitude: 1, phase: 0 } satisfies Source,
    ]);
  };

  return (
    <button
      title="Add new source"
      class="rounded bg-sky-500 p-1 text-white shadow hover:bg-sky-700"
      onClick={addSource}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        class="h-6 w-6"
      >
        <path
          fill-rule="evenodd"
          d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z"
          clip-rule="evenodd"
        />
      </svg>
    </button>
  );
};
