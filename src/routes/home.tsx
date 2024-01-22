/* @refresh granular */

import { createEffect, createSignal } from "solid-js";
import { usePyodide } from "~/components/pyodide-provider";

export default () => {
  const pyodide = usePyodide();

  const [msg, setMsg] = createSignal("");

  createEffect(() => {
    pyodide.onmessage = (event: MessageEvent<string>) => {
      setMsg(event.data);
    };
  });

  return (
    <div class="flex flex-col place-content-center place-items-center gap-4 p-8">
      <button
        type="button"
        class="mb-2 me-2 w-fit rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        onClick={() => pyodide.postMessage(null)}
      >
        Invoke Web Worker
      </button>
      <textarea
        rows="8"
        class="block w-60 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
        placeholder="No message yet..."
      >
        {msg()}
      </textarea>
    </div>
  );
};
