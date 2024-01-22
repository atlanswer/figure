/* @refresh granular */

import { Suspense, createResource } from "solid-js";
import { usePyodide } from "~/components/pyodide-provider";

export const Figure = () => {
  const pyodide = usePyodide();

  const updateObj = async () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    await pyodide.inc();
    return await pyodide.counter;
  };

  const [counter] = createResource(updateObj);

  return (
    <Suspense>
      <section class="grid grid-flow-col place-content-center py-4">
        {counter()}
      </section>
    </Suspense>
  );
};