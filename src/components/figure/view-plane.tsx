import { Suspense, createResource, type Component } from "solid-js";
import { unwrap } from "solid-js/store";
import { useFigureCreator } from "~/components/contexts/figure-creator";
import { getFigureCreator } from "~/components/figure/figure-creator";
import type { ViewPlaneConfig } from "~/workers/pyodide";

export const ViewPlane: Component<ViewPlaneConfig> = (props) => {
  const fcContext = useFigureCreator();
  const awaitableFc = getFigureCreator(fcContext);

  const [encodedSvgData] = createResource(props, async () => {
    const fc = await awaitableFc;
    const svgData = await fc.createViewPlane({
      cutPlane: props.cutPlane,
      sources: unwrap(props.sources),
    });
    return `data:image/svg+xml,${encodeURIComponent(svgData)}`;
  });

  return (
    <div class="flex flex-col gap-2 rounded bg-neutral-100 p-3 text-black shadow-md dark:bg-neutral-200 dark:shadow-none">
      <div class="text-lg">
        <em>{props.cutPlane}</em>-Plane
      </div>
      <div class="flex h-[252px] w-[252px] flex-wrap place-content-center rounded outline outline-neutral-100">
        <Suspense fallback={<ViewPlaneLoading />}>
          <img
            width="252"
            height="252"
            src={encodedSvgData()}
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
      class="h-6 w-6 animate-spin fill-black"
    >
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
    <span>Creating figure...</span>
  </div>
);
