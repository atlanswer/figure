import { Component, JSX, Show, createSelector, createSignal } from "solid-js";
import type { FigureSource } from "./Gallery";
import type { SetStoreFunction } from "solid-js/store";
import { For, createEffect, onCleanup } from "solid-js";
import { produce } from "solid-js/store";
import * as d3 from "d3";
import { plotSParams } from "./plot";

const Canvas: Component<
  FigureSource & { setFigures: SetStoreFunction<FigureSource[]>; idx: number }
> = (props) => {
  let figureRef: HTMLElement | undefined;
  let figureSVGRef: SVGSVGElement | undefined;
  let removeFigureButtonRef: HTMLButtonElement | undefined;

  const RemoveFigureButton = () => (
    <button
      ref={removeFigureButtonRef}
      class="border rounded p-1"
      onClick={() => {
        props.setFigures(
          produce((figures) => {
            figures.splice(props.idx, 1);
          }),
        );
      }}
    >
      <span
        role="img"
        aria-label="Remove trace icon"
        class="i-ic:round-playlist-remove block h-6 w-6"
      ></span>
    </button>
  );

  const plotPattern = (
    data: FigureSource["data"],
    cols: FigureSource["cols"],
  ) => {
    if (figureSVGRef === undefined) return;
  };

  createEffect(() => {
    // Modify the SVG DOM element with D3
    plotSParams(props.data, props.cols, figureSVGRef);
    updateFigureMargin();
    // Remove the DOM elements
    onCleanup(() => {
      figureSVGRef?.replaceChildren();
    });
  });

  // Remove the figure if there's no trace left
  // createEffect(() => {
  //   if (props.cols.length === 1) {
  //     if (removeButtonRef === undefined) return;
  //     removeButtonRef.click();
  //   }
  // });

  const scales = d3.range(1, 4);
  const [scale, setScale] = createSignal(3);
  const scaleSelected = createSelector(scale);
  const updateFigureMargin = () => {
    if (figureRef === undefined) return;
    const svgHeight = figureSVGRef?.clientHeight ?? 0;
    const svgWidth = figureSVGRef?.clientWidth ?? 0;
    figureRef.style.margin = `${((scale() - 1) * svgHeight) / 2}px ${
      ((scale() - 1) * svgWidth) / 2
    }px`;
  };

  const ZoomButtons: Component = () => (
    <div class="flex self-center border rounded">
      <For each={scales}>
        {(i) => (
          <div class="flex items-center gap-1 border-r px-2 py-1 last:border-none">
            <Show when={scaleSelected(i)}>
              <span class="i-ic:round-zoom-in inline-block h-5 w-5"></span>
            </Show>
            <button class="font-semibold" onClick={() => setScale(i)}>
              {i}x
            </button>
          </div>
        )}
      </For>
    </div>
  );

  return (
    <div class="w-full max-w-screen-xl flex flex-col gap-4 border rounded bg-slate-50 p-4 transition dark:bg-slate-6">
      <div class="flex items-center gap-4">
        <TraceLegends
          class="flex-1"
          cols={props.cols}
          setFigures={props.setFigures}
          figureIdx={props.idx}
        />
        <RemoveFigureButton />
      </div>
      <ZoomButtons />
      <div class="self-center">
        <figure
          ref={figureRef}
          class="self-center border"
          style={{
            scale: scale(),
          }}
        >
          <svg ref={figureSVGRef}></svg>
        </figure>
      </div>
    </div>
  );
};

const TraceLegend: Component<
  {
    name: string;
    color: string;
    setFigures: SetStoreFunction<FigureSource[]>;
  } & JSX.HTMLAttributes<HTMLSpanElement>
> = (props) => {
  return (
    <span class="min-w-12rem flex items-center gap-4 border rounded bg-slate-2 py-1 pl-4 font-semibold text-black">
      <span class="h-1 w-16" style={`background-color: ${props.color}`}></span>
      <span>{props.name}</span>
      <button class="border-l border-black px-1" onClick={props.onClick}>
        <span
          role="img"
          aria-label="Remove canvas icon"
          class="i-ic:round-close block h-5 w-5"
        ></span>
      </button>
    </span>
  );
};

const TraceLegends: Component<{
  class: string;
  cols: FigureSource["cols"];
  setFigures: SetStoreFunction<FigureSource[]>;
  figureIdx: number;
}> = (props) => {
  return (
    <div class={`flex flex-wrap gap-4 ${props.class}`}>
      <For each={props.cols}>
        {(col, idx) => {
          // Skip the first column aka the frequency column.
          if (idx() === 0) return;

          const removeCol = (col: string) => {
            const colIdx = props.cols.indexOf(col);
            props.setFigures(props.figureIdx, "cols", (c) => [
              ...c.slice(0, colIdx),
              ...c.slice(colIdx + 1),
            ]);
            props.setFigures(props.figureIdx, "data", (data) =>
              data.map((cols) => [
                ...cols.slice(0, colIdx),
                ...cols.slice(colIdx + 1),
              ]),
            );
          };

          return (
            <TraceLegend
              name={col}
              color={d3.schemeTableau10[idx() - 1]}
              setFigures={props.setFigures}
              onClick={[removeCol, col]}
            />
          );
        }}
      </For>
      <button class="text-slate-2">
        <span
          role="img"
          aria-label="Add trace icon"
          class="i-ic:round-add-box block h-6 w-6"
        ></span>
      </button>
    </div>
  );
};
export default Canvas;
