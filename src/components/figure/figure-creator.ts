/* @refresh granular */

import { Remote } from "comlink";
import type { useFigureCreator } from "~/components/figure-creator-provider";
import { FigureCreator } from "~/workers/pyodide";

export const getFigureCreator = async ([
  workerShouldReady,
  RemoteFigureCreator,
]: ReturnType<typeof useFigureCreator>) => {
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

  return await createFigure();
};
