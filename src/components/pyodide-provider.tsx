import { ParentComponent, createContext, useContext } from "solid-js";
import PyodideWorker from "~/workers/pyodide?worker";

/** Global Pyodide worker */
const PyodideProviderContext = createContext<Worker>();

export const usePyodide = () => {
  const context = useContext(PyodideProviderContext);
  if (!context) {
    throw new Error("usePyodide: cannot find a PyodideProviderContext");
  }
  return context;
};

export const PyodideProvider: ParentComponent = (props) => {
  const pyodide = new PyodideWorker();
  return (
    <PyodideProviderContext.Provider value={pyodide}>
      {props.children}
    </PyodideProviderContext.Provider>
  );
};
