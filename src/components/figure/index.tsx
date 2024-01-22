/* @refresh granular */

import { Suspense, createResource } from "solid-js";
import { useFigureCreator } from "~/components/figure-creator-provider";

export const Figure = () => {
  const [workerShouldReady, FigureCreator] = useFigureCreator();

  const [pyodideVersion] = createResource(async () => {
    await workerShouldReady;
    console.log("Fetching...");
    const figureCreator = await new FigureCreator();
    console.log("Reading version.");
    const version = await figureCreator.pyodideVersion;
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
