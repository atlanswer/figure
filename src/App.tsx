import type { Component } from "solid-js";
import { Bookshelf } from "./tutorial/Bookshelf";

const App: Component = () => {
  return (
    <div
      id="content-div"
      class="min-h-screen w-screen flex flex-col place-content-center place-items-center gap-4"
    >
      <Bookshelf name="Solid" />
    </div>
  );
};

export default App;
