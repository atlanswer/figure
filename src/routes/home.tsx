import { createEffect, createSignal } from "solid-js";
import PyodideWorker from "~/workers/pyodide?worker";

export default () => {
  const pyodide = new PyodideWorker();

  const [msg, setMsg] = createSignal("");

  createEffect(() => {
    pyodide.onmessage = (event: MessageEvent<string>) => {
      setMsg(event.data);
    };
  });

  return (
    <div class="flex flex-col place-content-center place-items-center gap-4">
      <p class="bg-gradient-to-tr from-blue-700 to-blue-400 bg-clip-text pt-20 text-6xl font-bold leading-normal text-transparent">
        Figure
      </p>
      <button
        type="button"
        class="mb-2 me-2 w-fit rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        onClick={() => pyodide.postMessage("Hi from main thread.")}
      >
        Send Message to Web Worker
      </button>
      <textarea
        rows="5"
        class="block w-60 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
        placeholder="No message yet..."
      >
        {msg()}
      </textarea>
    </div>
  );
};
