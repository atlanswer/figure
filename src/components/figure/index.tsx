/* @refresh granular */

import { Show, createSignal, type Component } from "solid-js";
import { type SetStoreFunction } from "solid-js/store";
import { useFigureCreator } from "~/components/contexts/figure-creator";
import { getFigureCreator } from "~/components/figure/figure-creator";
import { ViewPlane } from "~/components/figure/view-plane";
import { type FigureConfig } from "~/routes/figure";
import { SourcesPanel } from "./source";

export const FigureArea: Component<{
  figureConfig: FigureConfig;
  setFigureConfig: SetStoreFunction<FigureConfig[]>;
  numFigures: number;
  idx: number;
}> = (props) => {
  const fcContext = useFigureCreator();
  const awaitableFc = getFigureCreator(fcContext);

  const [fcReady, setFcReady] = createSignal<boolean>(false);

  awaitableFc.then(
    () => setFcReady(true),
    () => undefined,
  );

  return (
    <section class="flex flex-col place-items-center gap-4 py-8">
      <figure class="flex max-w-full flex-col gap-4">
        <figcaption class="flex flex-wrap place-items-center gap-4">
          <input
            type="text"
            name="Figure Title"
            placeholder="Figure Title"
            class="rounded bg-neutral-100 px-2 py-1 text-2xl font-semibold text-black shadow focus-visible:outline-none focus-visible:ring dark:bg-neutral-800 dark:text-white"
            value={props.figureConfig.title}
            onChange={(event) =>
              props.setFigureConfig(props.idx, "title", event.target.value)
            }
          />
          <div
            title="Switch axes scale"
            class="grid grid-cols-2 place-content-center place-items-stretch rounded bg-neutral-100 p-1 text-neutral-500 shadow dark:bg-neutral-800 [&>.active]:bg-sky-500 [&>.active]:text-white"
          >
            <button
              class="whitespace-nowrap rounded px-2"
              classList={{ active: props.figureConfig.isDb }}
              onClick={() => props.setFigureConfig(props.idx, "isDb", true)}
            >
              dB
            </button>
            <button
              class="whitespace-nowrap rounded px-2"
              classList={{ active: !props.figureConfig.isDb }}
              onClick={() => props.setFigureConfig(props.idx, "isDb", false)}
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
                props.setFigureConfig(props.idx, "isGainTotal", false)
              }
            >
              Gain <em>θ</em>/<em>ϕ</em>
            </button>
            <button
              class="whitespace-nowrap rounded px-2"
              classList={{ active: props.figureConfig.isGainTotal }}
              onClick={() =>
                props.setFigureConfig(props.idx, "isGainTotal", true)
              }
            >
              Gain Total
            </button>
          </div>
          <Show when={props.numFigures > 1}>
            <button
              title="Remove figure"
              class="ml-auto text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
              onClick={() =>
                // eslint-disable-next-line solid/reactivity
                props.setFigureConfig((figureConfigs) => [
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
        <div class="grid grid-flow-col place-items-center gap-4 overflow-x-auto rounded font-semibold">
          <Show when={fcReady()} fallback={<FigureAreaFallback />}>
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
        setFigureConfigs={props.setFigureConfig}
        idx={props.idx}
      />
    </section>
  );
};

const FigureAreaFallback = () => (
  <div class="flex h-[344px] w-80 animate-pulse place-content-center place-items-center gap-2 self-stretch rounded bg-neutral-100 text-black shadow dark:bg-neutral-800 dark:text-white">
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
