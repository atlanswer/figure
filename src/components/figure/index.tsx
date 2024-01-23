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
    return times2;
  });

  return (
    <section class="grid grid-flow-col place-content-center place-items-center gap-4 py-4">
      <img class="w-[3.5in]" src="/icon.svg" alt="Figure" />
      <Suspense fallback={<p>Loading...</p>}>
        <p>The square root of 3 is {result()}</p>
      </Suspense>
    </section>
  );
};
