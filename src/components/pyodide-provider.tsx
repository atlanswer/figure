/* @refresh granular */

import * as Comlink from "comlink";
import { ParentComponent, createContext, useContext } from "solid-js";
import PyodideWorker from "~/workers/pyodide?worker";
import { type Obj } from "~/workers/pyodide";

/** Global Pyodide worker */
const PyodideProviderContext = createContext<Comlink.Remote<Obj>>();

export const usePyodide = () => {
  const context = useContext(PyodideProviderContext);
  if (!context) {
    throw new Error("usePyodide: cannot find a PyodideProviderContext");
  }
  return context;
};

export const PyodideProvider: ParentComponent = (props) => {
  const pyodideWorker = new PyodideWorker();
  const pyodide = Comlink.wrap<Obj>(pyodideWorker);

  return (
    <PyodideProviderContext.Provider value={pyodide}>
      {props.children}
    </PyodideProviderContext.Provider>
  );
};
