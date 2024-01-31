import { type Component, For, Show } from "solid-js";
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
  return (
    <div class="grid grid-flow-row gap-2 rounded-lg bg-neutral-100 p-2 text-black shadow-md outline-1 outline-neutral-500 dark:bg-black dark:text-white dark:outline">
      <div class="grid grid-flow-col place-content-between place-items-center gap-2">
        <span class="flex gap-2 text-lg font-semibold">
          <span class="rounded bg-neutral-500 px-2 text-white">
            {props.idx + 1}
          </span>
          <span class="w-20">{props.source.type}-dipole</span>
        </span>
        <div
          aria-orientation="horizontal"
          class="grid grid-cols-2 place-content-center place-items-stretch rounded bg-neutral-200 p-1 font-bold text-neutral-500 dark:bg-neutral-800 [&>.active]:bg-sky-500 [&>.active]:text-white"
        >
          <button
            aria-selected="true"
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
            aria-selected="false"
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
        </div>
        <Show when={props.numSources > 1}>
          <button
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
      </div>
      <form class="grid grid-cols-2 grid-rows-2 place-items-end gap-2">
        <div class="flex flex-col">
          <label>Theta</label>
          <input type="number" />
        </div>
        <div>Phi</div>
        <div>Amplitude</div>
        <div>Phase</div>
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
