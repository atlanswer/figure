/* @refresh granular */

import * as Comlink from "comlink";
import type { PyCallable } from "pyodide/ffi";
import pyCodeInitialization from "python/initialization.py?raw";
import pyCodePlotViewPlane from "python/figure.py?raw";

// console.debug("Starting Pyodide web worker...");

/* Load Pyodide */

const pyodideModule = (await import(
  "/pyodide/pyodide.mjs"
)) as typeof import("/pyodide");

const loadPyodideAndPackages = async () => {
  const pyodide = await pyodideModule.loadPyodide({
    indexURL: "/pyodide/",
    // indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/",
    packages: ["numpy", "matplotlib"],
  });
  pyodide.runPython(pyCodeInitialization);
  return pyodide;
};

const pyodide = await loadPyodideAndPackages();

export interface Source {
  type: "E" | "M";
  phi: number;
  theta: number;
  amplitude: number;
  phase: number;
}

export type CutPlane = "XZ" | "YZ" | "XY";

export interface ViewPlaneConfig {
  cutPlane: CutPlane;
  isDb: boolean;
  isGainTotal: boolean;
  sources: Source[];
}

export class FigureCreator {
  private pyodide: typeof pyodide;

  constructor() {
    this.pyodide = pyodide;
  }

  get pyodideVersion() {
    return this.pyodide.version;
  }

  createViewPlane(config: ViewPlaneConfig) {
    const pyPlotViewPlane = this.pyodide.runPython(
      pyCodePlotViewPlane,
    ) as PyCallable;

    const svgData = pyPlotViewPlane(config) as string;

    pyPlotViewPlane.destroy();

    return svgData;
  }
}

// console.debug("Pyodide web worker initialized.");

Comlink.expose(FigureCreator);
postMessage("ready");
