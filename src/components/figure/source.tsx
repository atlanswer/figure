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
      <div class="grid grid-flow-col place-content-between">
        <span class="text-lg font-semibold">
          {`${props.idx + 1}: ${props.source.type}-dipole`}
        </span>
        <Show when={props.numSource > 1}>
          <button onClick={() => removeSource(props.idx)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="h-6 w-6"
            >
              <path
                fill-rule="evenodd"
                d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm3 10.5a.75.75 0 0 0 0-1.5H9a.75.75 0 0 0 0 1.5h6Z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </Show>
      </div>
      <form class="grid grid-flow-row place-items-end gap-2">
        <NumberInput tag="theta" source={props.source} />
        <NumberInput tag="phi" source={props.source} />
      </form>
    </div>
  );
};

const AddSourceCard: Component<{ setSources: Setter<Source[]> }> = (props) => {
  const addSource = () => {
    props.setSources((source) => [
      ...source,
      {
        type: "M",
        theta: 90,
        phi: 0,
        amplitude: 1,
        phase: 0,
      },
    ]);
  };

  return (
    <button class="rounded-full bg-white text-sky-500" onClick={addSource}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        class="h-10 w-10"
      >
        <path
          fill-rule="evenodd"
          d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z"
          clip-rule="evenodd"
        />
      </svg>
    </button>
  );
};

const NumberInput: Component<{ tag: keyof Source; source: Source }> = (
  props,
) => {
  return (
    <label
      for="theta-input"
      class="grid grid-flow-col place-items-center gap-2 font-medium text-gray-900 dark:text-white"
    >
      {`${props.tag[0].toUpperCase()}${props.tag.slice(1)}: `}
      <div class="relative flex max-w-[8rem] items-center">
        <button
          type="button"
          id="decrement-button"
          data-input-counter-decrement="quantity-input"
          class="h-11 rounded-s-lg border border-gray-300 bg-gray-100 p-3 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700"
          onClick={() => {}}
        >
          <svg
            class="h-3 w-3 text-gray-900 dark:text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 18 2"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M1 1h16"
            />
          </svg>
        </button>
        <input
          type="number"
          min="0"
          max="359"
          value={props.source[props.tag]}
          id="quantity-input"
          data-input-counter
          aria-describedby="helper-text-explanation"
          class="block h-11 w-full border-x-0 border-gray-300 bg-gray-50 py-4 text-center text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          placeholder="999"
          required
        />
        <button
          type="button"
          id="increment-button"
          data-input-counter-increment="quantity-input"
          class="h-11 rounded-e-lg border border-gray-300 bg-gray-100 p-3 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700"
        >
          <svg
            class="h-3 w-3 text-gray-900 dark:text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 18 18"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 1v16M1 9h16"
            />
          </svg>
        </button>
      </div>
    </label>
  );
};
