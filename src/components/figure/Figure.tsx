import type { plot } from "@observablehq/plot";
import { Component, onCleanup, onMount } from "solid-js";

const Figure: Component<{
  figureElm: ReturnType<typeof plot> | undefined;
}> = (props) => {
  let figureCanvas: HTMLDivElement | undefined;

  onMount(() => {
    if (props.figureElm) {
      figureCanvas?.append(props.figureElm);
    }
  });

  onCleanup(() => {
    props.figureElm?.remove();
  });

  return <div ref={figureCanvas} class="max-h-[400px] max-w-[600px]"></div>;
};

export default Figure;
