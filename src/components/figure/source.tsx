import { type Component, For, Show, Setter } from "solid-js";
import { type Source } from "~/workers/pyodide";

export const SourcesPanel: Component<{
  sources: Source[];
  setSources: Setter<Source[]>;
}> = (props) => {
  return (
    <div class="flex flex-wrap place-items-center gap-4">
      <For each={props.sources}>
        {(source, idx) => (
          <SourceCard
            idx={idx()}
            source={source}
            setSource={props.setSources}
            numSource={props.sources.length}
          />
        )}
      </For>
      <AddSourceCard setSources={props.setSources} />
    </div>
  );
};

const SourceCard: Component<{
  idx: number;
  source: Source;
  setSource: Setter<Source[]>;
  numSource: number;
}> = (props) => {
  const removeSource = (idx: number) => {
    props.setSource((sources) => [
      ...sources.slice(0, idx),
      ...sources.slice(idx + 1),
    ]);
  };

  return (
    <div class="grid grid-flow-row gap-2 rounded bg-neutral-100 p-2 text-black shadow-md outline outline-1 outline-neutral-200 dark:bg-black dark:text-white">
      <div class="grid grid-flow-col place-content-between place-items-center gap-2">
        <span class="flex gap-2 text-lg font-semibold">
          <span class="rounded bg-sky-500 px-2 text-white">
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
              props.setSource((sources) => [
                ...sources.slice(0, props.idx),
                { ...sources[props.idx]!, type: "E" },
                ...sources.slice(props.idx + 1),
              ])
            }
          >
            J
          </button>
          <button
            aria-selected="false"
            class="whitespace-nowrap rounded px-2"
            classList={{ active: props.source.type === "M" }}
            onClick={() =>
              props.setSource((sources) => [
                ...sources.slice(0, props.idx),
                { ...sources[props.idx]!, type: "M" },
                ...sources.slice(props.idx + 1),
              ])
            }
          >
            M
          </button>
        </div>
        <Show when={props.numSource > 1}>
          <button
            class="rounded bg-neutral-500 text-white hover:bg-sky-500"
            onClick={() => removeSource(props.idx)}
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
        <div>Theta</div>
        <div>Phi</div>
        <div>Amplitude</div>
        <div>Phase</div>
      </form>
    </div>
  );
};

const AddSourceCard: Component<{ setSources: Setter<Source[]> }> = (props) => {
  const addSource = () => {
    props.setSources((source) => [
      ...source,
      { type: "M", theta: 90, phi: 0, amplitude: 1, phase: 0 },
    ]);
  };

  return (
    <button
      class="rounded bg-sky-500 p-1.5 text-white shadow hover:bg-sky-700"
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
