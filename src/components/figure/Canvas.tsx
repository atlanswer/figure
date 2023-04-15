import type { Component } from "solid-js";
import { Suspense, lazy } from "solid-js";

const Canvas: Component = () => {
  const Figure = lazy(() => import("./Figure"));

  return (
    <div class="w-full max-w-screen-xl border rounded p-4">
      <Suspense fallback={<p>Drawing figure...</p>}>
        <Figure />
      </Suspense>
    </div>
  );
};

export default Canvas;
