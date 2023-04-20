import { Component, createEffect, createResource, onCleanup } from "solid-js";
import type * as Plot from "@observablehq/plot";
import type { plot } from "@observablehq/plot";
import { autoType, csvParse } from "d3";
import type { FigureSource } from "./Gallery";

const Canvas: Component<FigureSource> = (props) => {
  let figureContainer: HTMLDivElement | undefined;

  const plotSParams = (
    data?: FigureSource["data"],
    cols?: FigureSource["cols"],
  ): SVGSVGElement | undefined => {
    return undefined;
  };

  const plotPattern = (
    data?: FigureSource["data"],
    cols?: FigureSource["cols"],
  ): SVGSVGElement | undefined => {
    return undefined;
  };

  createEffect(() => {
    const figureElm = plotSParams(props.data);

    if (figureElm === undefined) return;
    figureContainer?.append(figureElm);

    onCleanup(() => figureElm?.remove());
  });

  return (
    <div class="w-full max-w-screen-xl flex place-content-center border rounded p-4">
      <p>Canvas</p>
      <div ref={figureContainer} class="max-h-[400px] max-w-[600px]"></div>
    </div>
  );
};

export default Canvas;
