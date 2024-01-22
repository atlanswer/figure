/* @refresh granular */

import * as Comlink from "comlink";
import { type ParentComponent, createContext, useContext } from "solid-js";
import PyodideWorker from "~/workers/pyodide?worker";
import type { FigureCreator as FC } from "~/workers/pyodide";

/** Global Pyodide worker */
const FigureCreatorProviderContext =
  createContext<[Promise<Worker>, Comlink.Remote<typeof FC>]>();

export const useFigureCreator = () => {
  const context = useContext(FigureCreatorProviderContext);
  if (!context) {
    throw new Error("usePyodide: cannot find a PyodideProviderContext");
  }
  return context;
};

export const FigureCreatorProvider: ParentComponent = (props) => {
  const pyodideWorker = new PyodideWorker();
  const FigureCreator = Comlink.wrap<typeof FC>(pyodideWorker);

  const workerShouldReady = new Promise(
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

  return (
    <FigureCreatorProviderContext.Provider
      value={[workerShouldReady, FigureCreator]}
    >
      {props.children}
    </FigureCreatorProviderContext.Provider>
  );
};
