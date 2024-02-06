/* @refresh granular */

import { proxy, wrap, type Remote } from "comlink";
import {
  createContext,
  useContext,
  type Accessor,
  type ParentComponent,
  createSignal,
} from "solid-js";
import type { FigureCreator } from "~/workers/pyodide";
import PyodideWorker from "~/workers/pyodide?worker";

/** Global Pyodide worker */
const FigureCreatorProviderContext =
  createContext<[Promise<Remote<FigureCreator>>, Accessor<string>]>();

export const useFigureCreator = () => {
  const context = useContext(FigureCreatorProviderContext);
  if (!context) {
    throw new Error("usePyodide: `PyodideProviderContext` not found");
  }
  return context;
};

export const FigureCreatorProvider: ParentComponent = (props) => {
  const pyodideWorker = new PyodideWorker();
  const RemoteFigureCreator = wrap<typeof FigureCreator>(pyodideWorker);

  const [progress, setProgress] = createSignal("0%");

  const workerReady = new Promise(
    (resolve: (value: Worker) => void, reject) => {
      pyodideWorker.addEventListener("error", reject);
      pyodideWorker.addEventListener(
        "message",
        (msg: MessageEvent<string>) => {
          pyodideWorker.removeEventListener("error", reject);
          msg.data === "ready" ? resolve(pyodideWorker) : reject();
        },
        { once: true },
      );
    },
  );

  const RemoteFigureCreatorReady = new Promise(
    (
      resolve: (value: InstanceType<typeof RemoteFigureCreator>) => void,
      reject,
    ) => {
      workerReady.then(
        () =>
          resolve(
            new RemoteFigureCreator(
              proxy((progress: string) => setProgress(progress)),
            ),
          ),
        () => reject(),
      );
    },
  );

  const FigureCreatorReady = new Promise(
    (resolve: (value: Remote<FigureCreator>) => void, reject) => {
      RemoteFigureCreatorReady.then(
        (value) => resolve(value),
        () => reject(),
      );
    },
  );

  return (
    <FigureCreatorProviderContext.Provider
      value={[FigureCreatorReady, progress]}
    >
      {props.children}
    </FigureCreatorProviderContext.Provider>
  );
};
