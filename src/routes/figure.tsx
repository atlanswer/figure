/* @refresh granular */

import { For, createEffect, on } from "solid-js";
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
      () => JSON.stringify(figureConfigs),
      () => {
        localStorage.setItem(
          figureConfigsStorageKey,
          JSON.stringify(figureConfigs),
        );
      },
    ),
  );

  return (
    <div class="grid grid-cols-1 place-content-stretch divide-y divide-neutral-200 px-4 py-4 dark:divide-neutral-800 sm:px-6 lg:px-8">
      <For each={figureConfigs}>
        {(figureConfig, idx) => (
          <FigureArea
            figureConfig={figureConfig}
            setFigureConfig={setFigureConfigs}
            idx={idx()}
          />
        )}
      </For>
    </div>
  );
};
