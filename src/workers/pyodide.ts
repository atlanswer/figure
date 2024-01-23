/* @refresh granular */

import * as Comlink from "comlink";
import type { PyProxy } from "pyodide/ffi";

console.debug("Starting Pyodide web worker...");

/* Load Pyodide */

const pyodideModule = (await import(
  "/pyodide/pyodide.mjs"
)) as typeof import("/pyodide");

const loadPyodideAndPackages = async () => {
  const pyodide = await pyodideModule.loadPyodide({
    indexURL: "/pyodide/",
    packages: ["numpy", "matplotlib"],
  });
  return pyodide;
};

const pyodide = await loadPyodideAndPackages();

export class FigureCreator {
  private pyodide: typeof pyodide;

  constructor() {
    this.pyodide = pyodide;
  }

  get pyodideVersion() {
    return this.pyodide.version;
  }

  times2(x: number) {
    const np = this.pyodide.pyimport("numpy") as PyProxy & {
      sqrt: (x: number) => number;
    };

    const result = np.sqrt(x);

    np.destroy();

    return result;
  }
}

console.debug("Pyodide web worker initialized.");

Comlink.expose(FigureCreator);
postMessage("ready");
