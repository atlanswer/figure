/* @refresh granular */

import { proxy } from "comlink";
import { Show, createSignal, type Component } from "solid-js";
import { type SetStoreFunction } from "solid-js/store";
import { useFigureCreator } from "~/components/contexts/figure-creator";
import { ViewPlane } from "~/components/figure/view-plane";
import type { FigureConfig, FigureConfigs } from "~/routes/figure";
import { SourcesPanel } from "./source";

export const FigureArea: Component<{
  figureConfig: FigureConfig;
  setFigureConfigs: SetStoreFunction<FigureConfigs>;
  numFigures: number;
  idx: number;
}> = (props) => {
  const [figureCreatorReady] = useFigureCreator();

  const [pyodideReady, setPyodideReady] = createSignal(false);

  void figureCreatorReady.then((figureCreator) =>
    figureCreator.ready(proxy(() => setPyodideReady(true))),
  );

  return (
    <section class="flex flex-col place-items-center gap-4 py-8">
      <figure class="flex max-w-full flex-col gap-2">
        <figcaption class="flex place-content-between place-items-center gap-4">
          <div class="flex flex-wrap place-items-center gap-4">
            <div class="relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="absolute left-2 top-2 h-6 w-6 fill-neutral-500"
              >
                <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
                <path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
              </svg>
              <input
                type="text"
                name="Figure Title"
                placeholder="Figure Title"
                class="w-72 max-w-full rounded bg-neutral-100 px-2 py-1 pl-10 text-2xl font-semibold text-black shadow focus-visible:outline-none focus-visible:ring dark:bg-neutral-800 dark:text-white"
                value={props.figureConfig.title}
                onChange={(event) =>
                  props.setFigureConfigs(props.idx, "title", event.target.value)
                }
              />
            </div>
            <div
              title="Switch axes scale"
              class="grid grid-cols-2 place-content-center place-items-stretch rounded bg-neutral-100 p-1 text-neutral-500 shadow dark:bg-neutral-800 [&>.active]:bg-sky-500 [&>.active]:text-white"
            >
              <button
                class="whitespace-nowrap rounded px-2"
                classList={{ active: props.figureConfig.isDb }}
                onClick={() => props.setFigureConfigs(props.idx, "isDb", true)}
              >
                dB
              </button>
              <button
                class="whitespace-nowrap rounded px-2"
                classList={{ active: !props.figureConfig.isDb }}
                onClick={() => props.setFigureConfigs(props.idx, "isDb", false)}
              >
                Linear
              </button>
            </div>
            <div
              title="Switch gain type"
              class="grid grid-cols-2 place-content-center place-items-stretch rounded bg-neutral-100 p-1 text-neutral-500 shadow dark:bg-neutral-800 [&>.active]:bg-sky-500 [&>.active]:text-white"
            >
              <button
                class="whitespace-nowrap rounded px-2"
                classList={{ active: !props.figureConfig.isGainTotal }}
                onClick={() =>
                  props.setFigureConfigs(props.idx, "isGainTotal", false)
                }
              >
                Gain <em>θ</em>/<em>ϕ</em>
              </button>
              <button
                class="whitespace-nowrap rounded px-2"
                classList={{ active: props.figureConfig.isGainTotal }}
                onClick={() =>
                  props.setFigureConfigs(props.idx, "isGainTotal", true)
                }
              >
                Gain Total
              </button>
            </div>
          </div>
          <Show when={props.numFigures > 1}>
            <button
              title="Remove figure"
              class="ml-auto text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
              onClick={() =>
                // eslint-disable-next-line solid/reactivity
                props.setFigureConfigs((figureConfigs) => [
                  ...figureConfigs.slice(0, props.idx),
                  ...figureConfigs.slice(props.idx + 1),
                ])
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="h-8 w-8"
              >
                <path
                  fill-rule="evenodd"
                  d="M2.515 10.674a1.875 1.875 0 0 0 0 2.652L8.89 19.7c.352.351.829.549 1.326.549H19.5a3 3 0 0 0 3-3V6.75a3 3 0 0 0-3-3h-9.284c-.497 0-.974.198-1.326.55l-6.375 6.374ZM12.53 9.22a.75.75 0 1 0-1.06 1.06L13.19 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06l1.72-1.72 1.72 1.72a.75.75 0 1 0 1.06-1.06L15.31 12l1.72-1.72a.75.75 0 1 0-1.06-1.06l-1.72 1.72-1.72-1.72Z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </Show>
        </figcaption>
        <div class="grid grid-flow-col place-items-center gap-4 overflow-x-auto rounded py-2 font-semibold">
          <Show when={pyodideReady()} fallback={<FigureAreaFallback />}>
            <ViewPlane cutPlane="YZ" {...props.figureConfig} />
            <ViewPlane cutPlane="XZ" {...props.figureConfig} />
            <ViewPlane cutPlane="XY" {...props.figureConfig} />
          </Show>
        </div>
        <figcaption class="flex flex-wrap place-content-center place-items-center gap-8 text-black dark:text-white">
          <Show
            when={props.figureConfig.isGainTotal}
            fallback={
              <>
                <span class="before:inline-block before:h-1 before:w-12 before:rounded before:bg-[#1f77b4] before:align-middle">
                  <span> </span>Gain <em>θ</em>
                </span>
                <span class="before:inline-block before:h-1 before:w-12 before:rounded before:bg-[#ff7f0e] before:align-middle">
                  <span> </span>Gain <em>ϕ</em>
                </span>
              </>
            }
          >
            <span class="before:inline-block before:h-1 before:w-12 before:rounded before:bg-[#1f77b4] before:align-middle">
              <span> </span>Gain Total
            </span>
          </Show>
        </figcaption>
      </figure>
      <SourcesPanel
        sources={props.figureConfig.sources}
        setFigureConfigs={props.setFigureConfigs}
        srcIdx={props.idx}
      />
    </section>
  );
};

const FigureAreaFallback = () => {
  const [figureCreatorReady, progress] = useFigureCreator();

  const [webWorkerInitialized, setWebWorkerInitalized] =
    createSignal<boolean>(false);

  void figureCreatorReady.then(() => setWebWorkerInitalized(true));

  return (
    <div class="flex h-[344px] w-80 place-content-center place-items-center rounded bg-neutral-100 px-8 text-black shadow dark:bg-neutral-800 dark:text-white">
      <Show when={webWorkerInitialized()} fallback={<WebWorkerLoading />}>
        <PyodideLoading progress={progress()} />
      </Show>
    </div>
  );
};

const PyodideLoading: Component<{ progress: string }> = (props) => {
  return (
    <div class="grid w-full grid-flow-row place-items-center gap-4">
      <div class="flex place-items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          viewBox="0 0 32 32"
          aria-label="Pyodide loading indicator"
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
      <div class="w-full">
        <div
          class="mb-2 ms-[calc(var(--progress)-1.25rem)] inline-block rounded-lg border border-sky-200 bg-sky-50 px-1.5 py-0.5 text-xs font-medium text-sky-500 transition-[margin-inline-start] duration-1000 dark:border-sky-800 dark:bg-sky-800/30"
          style={{ "--progress": props.progress }}
        >
          {props.progress}
        </div>
        <div
          class="flex h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700"
          role="progressbar"
          aria-valuenow={props.progress.replace("$", "")}
          aria-valuemin="0"
          aria-valuemax="100"
        >
          <div
            class="flex flex-col justify-center overflow-hidden whitespace-nowrap rounded-full bg-sky-500 text-center text-xs text-white transition-[width] duration-1000"
            style={{ width: props.progress }}
          />
        </div>
      </div>
    </div>
  );
};

const WebWorkerLoading = () => (
  <div class="flex animate-pulse place-items-center gap-2">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      class="h-6 w-6"
    >
      <path
        fill-rule="evenodd"
        d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 0 0-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 0 0-2.282.819l-.922 1.597a1.875 1.875 0 0 0 .432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 0 0 0 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 0 0-.432 2.385l.922 1.597a1.875 1.875 0 0 0 2.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 0 0 2.28-.819l.923-1.597a1.875 1.875 0 0 0-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 0 0 0-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 0 0-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 0 0-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 0 0-1.85-1.567h-1.843ZM12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z"
        clip-rule="evenodd"
      />
    </svg>
    <span>Loading Web Worker...</span>
  </div>
);
