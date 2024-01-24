/* @refresh granular */

import * as Comlink from "comlink";
import type { PyCallable, PyProxy } from "pyodide/ffi";
import pyCodePlotFigPlane1 from "python/figure.py?raw";

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

  createFigPlane1() {
    const pyPlotFigPlane1 = this.pyodide.runPython(
      pyCodePlotFigPlane1,
    ) as PyCallable;

    const svg = pyPlotFigPlane1() as string;

    pyPlotFigPlane1.destroy();

    return svg;
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
