/* @refresh granular */

import { type Component, For, createEffect, on } from "solid-js";
import { createStore } from "solid-js/store";
import { FigureArea } from "~/components/figure";
import { type ViewPlaneConfig } from "~/workers/pyodide";

export interface FigureConfig extends Omit<ViewPlaneConfig, "cutPlane"> {
  title: string;
}

const figureConfigsStorageKey = "figure-configs";

export const FigurePage = () => {
  const figureConfigsDefault: FigureConfig[] = [
    {
      title: "E-Dipole",
      isDb: true,
      sources: [{ type: "E", theta: 90, phi: 90, amplitude: 1, phase: 0 }],
    },
  ];

  // TODO: complete validation
  const isFigureConfigs = (
    figureConfigs: unknown,
  ): figureConfigs is FigureConfig[] => {
    if (!(figureConfigs instanceof Array)) return false;
    if (
      !figureConfigs.every(
        (figureConfig) =>
          "title" in figureConfig &&
          "isDb" in figureConfig &&
          "sources" in figureConfig,
      )
    )
      return false;
    return true;
  };

  const getFigureConfigsFromLocalStorage = () => {
    const figureConfigs = localStorage.getItem(figureConfigsStorageKey);
    if (figureConfigs === null) return figureConfigsDefault;
    let parsedFigureConfigs: unknown;
    try {
      parsedFigureConfigs = JSON.parse(figureConfigs);
    } catch {
      return figureConfigsDefault;
    }
    if (!isFigureConfigs(parsedFigureConfigs)) return figureConfigsDefault;
    return parsedFigureConfigs;
  };

  const [figureConfigs, setFigureConfigs] = createStore<FigureConfig[]>(
    getFigureConfigsFromLocalStorage(),
  );

  createEffect(
    on(
      // TODO: optimize here
      () => JSON.stringify(figureConfigs),
      () => {
        localStorage.setItem(
          figureConfigsStorageKey,
          JSON.stringify(figureConfigs),
        );
      },
    ),
  );

  const AddFigure: Component = () => {
    return (
      <button class="mt-4 flex gap-1 place-self-center rounded bg-sky-500 px-4 py-2 text-white shadow">
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
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          class="h-6 w-6"
        >
          <path
            fill-rule="evenodd"
            d="M2.25 13.5a8.25 8.25 0 0 1 8.25-8.25.75.75 0 0 1 .75.75v6.75H18a.75.75 0 0 1 .75.75 8.25 8.25 0 0 1-16.5 0Z"
            clip-rule="evenodd"
          />
          <path
            fill-rule="evenodd"
            d="M12.75 3a.75.75 0 0 1 .75-.75 8.25 8.25 0 0 1 8.25 8.25.75.75 0 0 1-.75.75h-7.5a.75.75 0 0 1-.75-.75V3Z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
    );
  };

  return (
    <div class="grid grid-cols-1 place-content-stretch divide-y divide-neutral-200 px-4 py-4 dark:divide-neutral-800 sm:px-6 lg:px-8">
      <For each={figureConfigs}>
        {(figureConfig, idx) => (
          <FigureArea
            figureConfig={figureConfig}
            setFigureConfig={setFigureConfigs}
            numFigures={figureConfigs.length}
            idx={idx()}
          />
        )}
      </For>
      <AddFigure />
    </div>
  );
};
