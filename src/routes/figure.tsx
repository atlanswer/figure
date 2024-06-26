/* @refresh granular */

import { Title } from "@solidjs/meta";
import { For, createEffect, on, type Component } from "solid-js";
import { createStore } from "solid-js/store";
import { z } from "zod";
import { FigureArea } from "~/components/figure";
import { viewPlaneConfigSchema } from "~/workers/pyodide";

export const figureConfigSchema = viewPlaneConfigSchema
  .omit({
    cutPlane: true,
  })
  .extend({ title: z.string() });
export type FigureConfig = z.infer<typeof figureConfigSchema>;
export const figureConfigArraySchema = z.array(figureConfigSchema);
export type FigureConfigs = z.infer<typeof figureConfigArraySchema>;

const figureConfigsStorageKey = "figure-configs";

export const FigurePage = () => {
  const figureConfigsDefault = [
    {
      title: "ME-Dipole",
      isDb: true,
      isGainTotal: false,
      sources: [
        {
          type: "E",
          direction: "Y",
          amplitude: 1,
          phase: 0,
        },
        {
          type: "M",
          direction: "X",
          amplitude: 1,
          phase: 0,
        },
      ],
    },
    {
      title: "E-Dipole",
      isDb: true,
      isGainTotal: false,
      sources: [
        {
          type: "E",
          direction: "Z",
          amplitude: 1,
          phase: 0,
        },
      ],
    },
    {
      title: "M-Dipole",
      isDb: true,
      isGainTotal: false,
      sources: [
        {
          type: "M",
          direction: "Z",
          amplitude: 1,
          phase: 0,
        },
      ],
    },
  ] as const satisfies FigureConfigs;

  const getFigureConfigsFromLocalStorage = (): FigureConfigs => {
    const figureConfigs = localStorage.getItem(figureConfigsStorageKey);
    if (figureConfigs === null) return figureConfigsDefault;
    let figureConfigsFromJson: unknown;
    try {
      figureConfigsFromJson = JSON.parse(figureConfigs);
    } catch {
      return figureConfigsDefault;
    }
    let parsedFigureConfigs: FigureConfigs;
    try {
      parsedFigureConfigs = figureConfigArraySchema.parse(
        figureConfigsFromJson,
      );
    } catch {
      return figureConfigsDefault;
    }
    return parsedFigureConfigs;
  };

  const [figureConfigs, setFigureConfigs] = createStore<FigureConfigs>(
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
      <button
        title="Add new figure"
        class="mb-12 mt-4 flex gap-1 place-self-center rounded border-none bg-sky-500 px-4 py-2 text-white shadow hover:bg-sky-700"
        onClick={() =>
          setFigureConfigs(figureConfigs.length, figureConfigsDefault[1])
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
    <div class="grid grid-cols-1 place-content-stretch divide-y-2 divide-neutral-200 px-4 dark:divide-neutral-800 sm:px-6 lg:px-8">
      <Title>Figure - AntCal</Title>
      <For each={figureConfigs}>
        {(figureConfig, idx) => (
          <FigureArea
            figureConfig={figureConfig}
            setFigureConfigs={setFigureConfigs}
            numFigures={figureConfigs.length}
            idx={idx()}
          />
        )}
      </For>
      <AddFigure />
    </div>
  );
};
