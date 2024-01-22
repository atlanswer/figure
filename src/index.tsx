/* @refresh granular */

import { MetaProvider } from "@solidjs/meta";
import { Route, Router } from "@solidjs/router";
import {
  DEV,
  ErrorBoundary,
  lazy,
  onMount,
  type ParentComponent,
} from "solid-js";
import { render } from "solid-js/web";
import { Footer } from "~/components/footer";
import { Header } from "~/components/header";
import {
  VercelAnalytics,
  VercelSpeedInsight,
  addPartytown,
} from "~/components/partytown";
import { ThemeProvider } from "~/components/theme-provider";
import "~/global.css";
import { PyodideProvider } from "./components/pyodide-provider";

const App: ParentComponent = (props) => {
  onMount(() => addPartytown(DEV ? { debug: true } : {}));

  return (
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    <ErrorBoundary fallback={(err) => <p>Solid Error: {err.toString()}</p>}>
      <PyodideProvider>
        <MetaProvider>
          <ThemeProvider defaultTheme="dark">
            <Header />
            <main class="flex-auto">{props.children}</main>
            <Footer />
            <VercelSpeedInsight />
            <VercelAnalytics />
          </ThemeProvider>
        </MetaProvider>
      </PyodideProvider>
    </ErrorBoundary>
  );
};

const root = document.getElementById("root");

if (root instanceof HTMLElement) {
  render(
    () => (
      <Router root={App}>
        <Route path="/" component={lazy(() => import("~/routes/home"))} />
        <Route path="/about" component={lazy(() => import("~/routes/about"))} />
        <Route path="*404" component={lazy(() => import("~/routes/404"))} />
      </Router>
    ),
    root,
  );
} else if (import.meta.env.DEV) {
  throw new Error(
    "Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?",
  );
}
