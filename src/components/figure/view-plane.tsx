import { Suspense, createResource, type Component, Show } from "solid-js";
import { unwrap } from "solid-js/store";
import { useFigureCreator } from "~/components/contexts/figure-creator";
import { getFigureCreator } from "~/components/figure/figure-creator";
import type { ViewPlaneConfig } from "~/workers/pyodide";

export const ViewPlane: Component<ViewPlaneConfig> = (props) => {
  const fcContext = useFigureCreator();
  const awaitableFc = getFigureCreator(fcContext);

  const [encodedSvgData] = createResource(
    // TODO: optimize here
    () => [props.isDb, JSON.stringify(props.sources)],
    async () => {
      const fc = await awaitableFc;
      const svgData = await fc.createViewPlane({
        cutPlane: props.cutPlane,
        isDb: props.isDb,
        sources: unwrap(props.sources),
      });
      return `data:image/svg+xml,${encodeURIComponent(svgData)}`;
    },
  );

  return (
    <div class="flex flex-col gap-2 rounded bg-neutral-100 p-3 text-black shadow-md dark:bg-neutral-200 dark:shadow-none">
      <div class="flex place-content-between gap-2">
        <span class="text-lg">
          <em>{props.cutPlane}</em>-Plane
        </span>
        <Show when={encodedSvgData.loading}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            class="h-6 w-6 animate-spin"
          >
            <path
              fill="currentColor"
              d="M12 4V2A10 10 0 0 0 2 12h2a8 8 0 0 1 8-8"
            />
          </svg>
        </Show>
      </div>
      <div class="flex h-[252px] w-[252px] flex-wrap place-content-center rounded outline outline-1 outline-neutral-100">
        <Suspense fallback={<ViewPlaneLoading />}>
          <img
            width="252"
            height="252"
            src={encodedSvgData.latest ?? ""}
            alt={`${props.cutPlane} Plane`}
          />
        </Suspense>
      </div>
    </div>
  );
};

export const ViewPlaneLoading = () => (
  <div class="flex place-content-center gap-2">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      class="h-6 w-6 animate-spin"
    >
      <path fill="currentColor" d="M12 4V2A10 10 0 0 0 2 12h2a8 8 0 0 1 8-8" />
    </svg>
    <span>Creating figure...</span>
  </div>
);
