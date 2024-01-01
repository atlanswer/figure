import { createSignal } from "solid-js";

export const Counter = () => {
  const [count, setCount] = createSignal(0);

  return (
    <div class="flex items-center gap-2">
      Current count: {count()}
      <button
        onClick={() => setCount(count() + 1)}
        class="bg-blue rounded border px-2 py-1"
      >
        Increment
      </button>
    </div>
  );
};
