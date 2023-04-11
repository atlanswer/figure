import { Bookshelf } from "~/components/tutorial/Bookshelf";

const App = () => (
  <main
    id="content-main"
    class="min-h-screen w-screen flex flex-col place-content-center place-items-center gap-4"
  >
    <Bookshelf name="Solid" />
  </main>
);

export default App;
