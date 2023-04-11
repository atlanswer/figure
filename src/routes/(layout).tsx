import { Outlet } from "solid-start";
import { StatusBar } from "~/components/status/StatusBar";

const App = () => (
  <main id="content-main">
    <div class="mx-auto min-h-screen max-w-screen-xl flex flex-col place-items-center gap-4 p-8">
      <StatusBar />
      <Outlet />
    </div>
  </main>
);

export default App;
