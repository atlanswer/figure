import { type Component, For, Show, createUniqueId } from "solid-js";
import { type SetStoreFunction } from "solid-js/store";
import { type FigureConfig } from "~/routes/figure";
import { type Source } from "~/workers/pyodide";

export const SourcesPanel: Component<{
  sources: Source[];
  setFigureConfigs: SetStoreFunction<FigureConfig[]>;
  idx: number;
}> = (props) => {
  return (
    <div class="flex flex-wrap place-items-center gap-4">
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

const SourceCard: Component<{
  source: Source;
  setFigureConfigs: SetStoreFunction<FigureConfig[]>;
  numSources: number;
  figIdx: number;
  idx: number;
}> = (props) => {
  const sourceInfos = ["theta", "phi", "amplitude", "phase"] as const;

  return (
    <div class="grid grid-flow-row gap-2 rounded-lg bg-neutral-100 p-2 text-neutral-900 shadow-md outline-1 outline-neutral-500 dark:bg-black dark:text-neutral-100 dark:outline">
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
          {(info) => {
            const inputId = createUniqueId();
            return (
              <div class="flex flex-col gap-1">
                <label for={inputId} class="text-sm">
                  {info[0]?.toUpperCase() +
                    info.slice(1) +
                    (info === "amplitude" ? " (relative)" : " (deg)")}
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
                        info,
                        (prev) =>
                          info === "amplitude" ?
                            prev <= 1 ?
                              prev
                            : prev - 1
                          : info === "theta" ?
                            prev < 90 ?
                              prev + 90
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
                    value={props.source[info]}
                    type="number"
                    min="0"
                    max={info === "theta" ? "180" : "359"}
                    step={info === "amplitude" ? "0.1" : "1"}
                    class="w-16 border border-x-0 border-neutral-500 bg-transparent text-center focus-visible:outline-none"
                    required
                    onChange={(event) =>
                      props.setFigureConfigs(
                        props.figIdx,
                        "sources",
                        props.idx,
                        info,
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
                        info,
                        (prev) =>
                          info === "amplitude" ? prev + 1
                          : info === "theta" ?
                            prev > 90 ?
                              prev - 90
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
