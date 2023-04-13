import { Outlet } from "solid-start";
import { Footer } from "~/components/footer/Footer";
import Header from "~/components/header/Header";

const App = () => (
  <>
    <div
      id="page-main"
      class="mx-auto min-h-screen flex flex-col gap-8"
    >
      <Header class="sticky top-0 p-8" />
      <main class="px-8">
        <div class="flex flex-col place-items-center gap-4">
          <Outlet />
        </div>
      </main>
    </div>
    <Footer />
  </>
);

export default App;
