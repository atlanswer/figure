/* @refresh granular */
// spell-checker:words HPBW

import * as Comlink from "comlink";
import type { PyodideInterface } from "pyodide";
import type { PyCallable, PySequence } from "pyodide/ffi";
import pyCodePlotViewPlane from "python/figure.py?raw";
import pyCodeInitialization from "python/initialization.py?raw";

const pyodideModule = (await import(
  "/pyodide/pyodide.mjs"
)) as typeof import("/pyodide");

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
  private pyodide: Promise<PyodideInterface>;
  private perfObserver: PerformanceObserver;

  constructor() {
    this.perfObserver = new PerformanceObserver((entries) => {
      entries.getEntries().forEach((entry) => {
        if (entry instanceof PerformanceResourceTiming) {
          console.debug(entry.name);
        }
      });
    });
    this.perfObserver.observe({
      type: "resource",
    });
    this.pyodide = this.initializePyodide();
  }

  async initializePyodide() {
    const pyodide = await pyodideModule.loadPyodide({
      indexURL: "/pyodide/",
      // indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/",
      packages: ["numpy", "matplotlib"],
    });
    pyodide.runPython(pyCodeInitialization);
    return pyodide;
  }

  async createViewPlane(
    config: ViewPlaneConfig,
  ): Promise<[number, number, string]> {
    const pyPlotViewPlane = (await this.pyodide).runPython(
      pyCodePlotViewPlane,
    ) as PyCallable;

    const pyResult = pyPlotViewPlane(config) as PySequence;
    const result = pyResult.toJs() as [number, number, string];

    pyPlotViewPlane.destroy();
    pyResult.destroy();

    return result;
  }
}

Comlink.expose(FigureCreator);
postMessage("ready");
