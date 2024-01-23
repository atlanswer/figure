/* @refresh granular */

import type { Remote } from "comlink";
import { Suspense, createResource } from "solid-js";
import { useFigureCreator } from "~/components/figure-creator-provider";
import { FigureCreator } from "~/workers/pyodide";

export const Figure = () => {
  const [workerShouldReady, RemoteFigureCreator] = useFigureCreator();

  const figureShouldCreate = new Promise(
    (
      resolve: (value: InstanceType<typeof RemoteFigureCreator>) => void,
      reject,
    ) => {
      workerShouldReady.then(
        () => resolve(new RemoteFigureCreator()),
        () => reject(),
      );
    },
  );

  const createFigure = (): Promise<Remote<FigureCreator>> =>
    new Promise((resolve, reject) => {
      figureShouldCreate.then(
        (value) => resolve(value),
        () => reject(),
      );
    });

  const [result] = createResource(async () => {
    console.debug("Waiting for `figureCreator`");
    const fc = await createFigure();
    console.debug("Got `figureCreator`");
    const times2 = await fc.times2(3);
    return times2.toPrecision(5);
  });

  const FigureFallback = () => (
    <div class="flex animate-pulse place-content-center gap-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        class="h-6 w-6"
        aria-label="Figure loading indicator fill-black"
      >
        <path
          fill-rule="evenodd"
          d="M2.25 2.25a.75.75 0 0 0 0 1.5H3v10.5a3 3 0 0 0 3 3h1.21l-1.172 3.513a.75.75 0 0 0 1.424.474l.329-.987h8.418l.33.987a.75.75 0 0 0 1.422-.474l-1.17-3.513H18a3 3 0 0 0 3-3V3.75h.75a.75.75 0 0 0 0-1.5H2.25Zm6.54 15h6.42l.5 1.5H8.29l.5-1.5Zm8.085-8.995a.75.75 0 1 0-.75-1.299 12.81 12.81 0 0 0-3.558 3.05L11.03 8.47a.75.75 0 0 0-1.06 0l-3 3a.75.75 0 1 0 1.06 1.06l2.47-2.47 1.617 1.618a.75.75 0 0 0 1.146-.102 11.312 11.312 0 0 1 3.612-3.321Z"
          clip-rule="evenodd"
        />
      </svg>
      <span>Loading Python...</span>
    </div>
  );

  return (
    <section class="grid grid-flow-col place-content-center place-items-center gap-4 py-4">
      <figure class="flex h-48 w-48 place-content-center place-items-center rounded border-t bg-neutral-50 text-black outline outline-1 outline-neutral-200">
        <Suspense>
          <FigureFallback />
        </Suspense>
      </figure>
      <Suspense fallback={<p class="animate-pulse">Loading...</p>}>
        <p>The square root of 3 is {result()}</p>
      </Suspense>
    </section>
  );
};
