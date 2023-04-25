import type { Component } from "solid-js";
import type { FigureSource } from "./Gallery";
import { createSignal, Show } from "solid-js";
import { useSiteContext } from "~/components/context/SiteContext";
import { SetStoreFunction, produce } from "solid-js/store";
import * as d3 from "d3";

const NewFigure: Component<{ setFigures: SetStoreFunction<FigureSource[]> }> = (
  props,
) => {
  const [siteContext] = useSiteContext();
  let inputRef: HTMLInputElement | undefined;
  const [hover, setHover] = createSignal(false);
  const [dragEnterCount, setDragEnterCount] = createSignal(0);

  const handleFileInput = async (fileList?: FileList | null) => {
    if (fileList === null || fileList === undefined) return;
    if (fileList.length > 1) {
      console.warn("More than one file.");
      return;
    }
    const file = fileList.item(0);
    if (file === null) {
      console.warn("FileList is empty.");
      return;
    }
    const dataString = await file.text();
    const d3DataArray = d3.csvParseRows(dataString, d3.autoType);
    const cols = d3DataArray.shift();

    const checkCols = (cols: unknown): cols is string[] => {
      if (cols === undefined) {
        console.warn("File is empty.");
        return false;
      }
      if (!Array.isArray(cols)) {
        console.warn("CSV file contains no header row.");
      }
      if (!(cols as Array<unknown>).every((v) => typeof v === "string")) {
        console.warn("CSV header row is not a string array.");
      }
      return true;
    };
    if (!checkCols(cols)) return;

    const checkD3DataArray = (d: typeof d3DataArray): d is number[][] => {
      if (
        !d.every((v) => {
          if (!Array.isArray(v)) {
            console.warn("File is only one line.");
          }
          if (!(v as Array<unknown>).every((i) => typeof i === "number")) {
            console.warn("File contains non-numeric values.");
            return false;
          }
          return true;
        })
      )
        return false;
      return true;
    };
    if (!checkD3DataArray(d3DataArray)) return;

    // Push parsed data into the figure stack
    props.setFigures(
      produce((figures) => {
        figures.push({ data: d3DataArray, cols: cols });
      }),
    );

    if (inputRef === undefined) return;
    inputRef.value = "";
  };

  return (
    <div class="grid grid-rows-[min-content] grid-cols-2 w-full max-w-screen-sm gap-4 font-semibold">
      <button
        class="border rounded-md bg-slate-50 p-2 shadow transition dark:bg-slate-6 hover:(bg-slate-2 dark:bg-slate-5)"
        onClick={async () => {
          const { s_example_cols, s_example_data } = await import(
            "./example-data"
          );
          props.setFigures(
            produce((figures) => {
              figures.push({ data: s_example_data, cols: s_example_cols });
            }),
          );
        }}
      >
        Example: Scattering Parameters
      </button>
      <button
        class="border rounded-md bg-slate-50 p-2 shadow transition dark:bg-slate-6 hover:(bg-slate-2 dark:bg-slate-5)"
        onClick={async () => {
          const { pattern_example_cols, pattern_example_data } = await import(
            "./example-data"
          );
          props.setFigures(
            produce((figures) => {
              figures.push({
                data: pattern_example_cols,
                cols: pattern_example_data,
              });
            }),
          );
        }}
      >
        Example: Radiation Patterns
      </button>
      <label
        aria-label="Upload files to create a new figure"
        class="col-span-2 flex place-content-center gap-2 border rounded-md p-2 shadow transition-all hover:(bg-slate-2 dark:bg-slate-5)"
        classList={{
          "py-4 border-(3 dashed)": siteContext.isDragOver,
          "bg-slate-50 dark:bg-slate-6": dragEnterCount() === 0,
          "bg-slate-2 dark:bg-slate-5 border-slate": dragEnterCount() > 0,
        }}
        onPointerEnter={(e) => {
          e.preventDefault();
          setHover(true);
        }}
        onPointerLeave={(e) => {
          e.preventDefault();
          setHover(false);
        }}
        onDragEnter={(e) => {
          e.preventDefault();
          setDragEnterCount((c) => c + 1);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setDragEnterCount((c) => c - 1);
        }}
        onDrop={(e) => {
          e.preventDefault();
          handleFileInput(e.dataTransfer?.files);
        }}
      >
        <span class="i-ic:round-add block h-6 w-6"></span>
        <Show when={hover() || siteContext.isDragOver}>
          <span>
            {dragEnterCount() > 0
              ? "Drop files here"
              : "Upload or drop files here to create a new figure"}
          </span>
        </Show>
        <input
          aria-label="Upload files to create a new figure"
          type="file"
          accept="text/csv"
          multiple
          ref={inputRef}
          hidden
          class="absolute mx-auto w-full max-w-screen-sm opacity-50 focus:(ring-2 ring-offset-2 ring-slate-3 dark:ring-offset-slate-7)"
          onChange={() => {
            handleFileInput(inputRef?.files);
          }}
        />
      </label>
    </div>
  );
};

export { NewFigure };
