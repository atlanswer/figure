import type { Component } from "solid-js";
import { Bookshelf } from "./tutorial/Bookshelf";

const App: Component = () => {
  return (
    <div
      class="h-screen w-screen flex flex-col place-content-center place-items-center gap-4"
      style="background: fixed radial-gradient(circle, #D8D8D8 0.1rem, #F6F1F1 0.1rem) top left / 2rem 2rem;"
    >
      <p class="from-blue-3 to-blue-6 bg-gradient-to-br bg-clip-text text-center align-middle font-sans text-4xl font-bold text-transparent">
        Solid Template
      </p>
      <Bookshelf name="Solid" />
    </div>
  );
};

export default App;
