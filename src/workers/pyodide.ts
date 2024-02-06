/* @refresh granular */
// spell-checker:words HPBW

import * as Comlink from "comlink";
import type { PyodideInterface } from "pyodide";
import type { PyCallable, PySequence } from "pyodide/ffi";
import pyCodePlotViewPlane from "python/figure.py?raw";
import pyCodeInitialization from "python/initialization.py?raw";
import pyCodePlotSources from "python/plot_sources.py?raw";

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
  private totalFetchSize: number;
  private fetchedSize: number;

  constructor(callback: (progress: string) => void) {
    // TODO: update when needed
    this.totalFetchSize = 60_000_000;
    this.fetchedSize = 0;
    this.perfObserver = new PerformanceObserver((entries) => {
      entries.getEntries().forEach((entry) => {
        if (entry instanceof PerformanceResourceTiming) {
          this.fetchedSize += entry.encodedBodySize;
          const progress = `${((this.fetchedSize / this.totalFetchSize) * 100).toFixed()}%`;
          callback(progress);
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

  async ready(callback: () => void) {
    await this.pyodide;
    callback();
  }

  async plotViewPlane(
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

  async plotSources(sources: Source[]): Promise<[string]> {
    const pyPlotSources = (await this.pyodide).runPython(
      pyCodePlotSources,
    ) as PyCallable;

    const pyResult = pyPlotSources(sources) as string;

    pyPlotSources.destroy();

    return [pyResult];
  }
}

Comlink.expose(FigureCreator);
postMessage("ready");
