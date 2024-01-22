/* @refresh granular */

import type { Remote } from "comlink";
import { Suspense, createResource } from "solid-js";
import { useFigureCreator } from "~/components/figure-creator-provider";
import type { FigureCreator } from "~/workers/pyodide";

export const Figure = () => {
  const [workerShouldReady, FigureCreator] = useFigureCreator();

  const figureShouldCreate = new Promise(
    (resolve: (value: Promise<Remote<FigureCreator>>) => void, reject) => {
      workerShouldReady.then(
        () => resolve(new FigureCreator()),
        () => reject(),
      );
    },
  );

  const figureCreator = new Promise(
    (resolve: (value: Remote<FigureCreator>) => void, reject) => {
      figureShouldCreate.then(
        (value) => resolve(value),
        () => reject(),
      );
    },
  );

  const [pyodideVersion] = createResource(async () => {
    console.log("Waiting for `figureCreator`");
    const fc = await figureCreator;
    console.log("Fetching version...");
    const version = await fc.pyodideVersion;
    console.log("version read.");
    return version;
  });

  return (
    <section class="grid grid-flow-col place-content-center place-items-center gap-4 py-4">
      <img class="w-[3.5in]" src="/icon.svg" alt="Figure" />
      <Suspense fallback={<p>Loading...</p>}>
        <p>Pyodide version: {pyodideVersion()}</p>
      </Suspense>
    </section>
  );
};
