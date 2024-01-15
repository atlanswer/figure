import type { Component } from "solid-js";

import { ThemeProvider } from "./components/theme-provider.tsx";
import { ThemeToggle } from "./components/theme-toggle.tsx";

const App: Component = () => {
  return (
    <ThemeProvider defaultTheme="system" storageKey="figure-theme">
      <main class="flex min-h-screen w-screen flex-col place-content-center place-items-center gap-4">
        <p class="bg-gradient-to-tr from-blue-700 to-blue-400 bg-clip-text text-center align-middle font-sans text-6xl font-bold leading-normal text-transparent">
          Solid Template
        </p>
        <ThemeToggle />
      </main>
    </ThemeProvider>
  );
};

export default App;
