import { Outlet } from "solid-start";
import { Footer } from "~/components/footer/Footer";
import Header from "~/components/header/Header";

const App = () => (
  <div class="font-sans text-black antialiased dark:text-white">
    <div id="page-main" class="min-h-screen flex flex-col gap-8">
      <Header class="sticky top-0 w-full" />
      <main class="px-8">
        <Outlet />
      </main>
    </div>
    <Footer />
  </div>
);

export default App;
