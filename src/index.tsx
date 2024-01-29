/* @refresh granular */

import { MetaProvider } from "@solidjs/meta";
import { Route, Router } from "@solidjs/router";
import { ErrorBoundary, lazy, type ParentComponent } from "solid-js";
import { render } from "solid-js/web";
import { Footer } from "~/components/footer";
import { Header } from "~/components/header";
import { VercelAnalytics, VercelSpeedInsight } from "~/components/partytown";
import { ThemeProvider } from "~/components/contexts/theme";
import "~/global.css";
import { ErrorPage } from "~/routes/errorpage";
import { FigureCreatorProvider } from "./components/contexts/figure-creator";

const App: ParentComponent = (props) => {
  // onMount(() => addPartytown({ debug: !!DEV }));

  return (
    <ErrorBoundary fallback={ErrorPage}>
      <FigureCreatorProvider>
        <MetaProvider>
          <ThemeProvider defaultTheme="dark">
            <Header />
            <main class="flex-auto">{props.children}</main>
            <Footer />
            <VercelSpeedInsight />
            <VercelAnalytics />
          </ThemeProvider>
        </MetaProvider>
      </FigureCreatorProvider>
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
