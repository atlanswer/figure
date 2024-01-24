/* @refresh granular */

import {
  Suspense,
  createResource,
  type ParentComponent,
  Show,
  createSignal,
} from "solid-js";
import { useFigureCreator } from "~/components/figure-creator-provider";
import { getFigureCreator } from "~/components/figure/figure-creator";

export const Figure = () => {
  const fcContext = useFigureCreator();
  const awaitableFc = getFigureCreator(fcContext);

  const [fcReady, setFcReady] = createSignal(false);

  awaitableFc.then(
    () => setFcReady(true),
    () => null,
  );

  const [result] = createResource(async () => {
    console.debug("Waiting for `figureCreator`");
    const fc = await awaitableFc;
    console.debug("Got `figureCreator`");
    const times2 = await fc.times2(3);
    return times2.toPrecision(5);
  });

  const Figure: ParentComponent = (props) => (
    <div class="flex h-[196px] w-[196px] flex-wrap place-content-center rounded bg-neutral-50 outline outline-1 outline-neutral-200">
      <Suspense fallback={<FigureLoading />}>{props.children}</Suspense>
    </div>
  );

  const [figPlane1] = createResource(async () => {
    const fc = await getFigureCreator(fcContext);

    const svg = await fc.createFigPlane1();

    // eslint-disable-next-line solid/no-innerhtml
    return <div innerHTML={svg} />;
  });

  const [figPlane2] = createResource(async () => {
    await getFigureCreator(fcContext);
    return <div>Hi</div>;
  });

  return (
    <section class="flex flex-col place-content-center place-items-center gap-4 py-8">
      <figure class="grid grid-flow-col place-content-center gap-6 rounded font-semibold text-black">
        <Show when={fcReady()} fallback={<NoFcFallback />}>
          <Figure>{figPlane1.latest}</Figure>
          <Figure>{figPlane2.latest}</Figure>
        </Show>
      </figure>
      <Suspense fallback={<p class="animate-pulse">Loading...</p>}>
        <p class="">The square root of 3 is {result()}</p>
      </Suspense>
    </section>
  );
};

const NoFcFallback = () => (
  <div class="flex h-[196px] w-80 animate-pulse place-content-center place-items-center gap-2 self-stretch rounded bg-neutral-50 outline outline-1 outline-neutral-200">
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

const FigureLoading = () => (
  <div class="flex place-content-center gap-2">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      class="h-6 w-6 animate-spin fill-black"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      />
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
    <span>Creating figure...</span>
  </div>
);
