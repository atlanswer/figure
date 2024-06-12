/* @refresh granular */

import { attachDevtoolsOverlay } from "@solid-devtools/overlay";
import { MetaProvider } from "@solidjs/meta";
import { Route, Router } from "@solidjs/router";
import { ErrorBoundary, type ParentComponent } from "solid-js";
import { render } from "solid-js/web";
import { ThemeProvider } from "~/components/contexts/theme";
import { Footer } from "~/components/footer";
import { Header } from "~/components/header";
import { VercelAnalytics } from "~/components/partytown";
import "~/global.css";
import { NotFoundPage } from "~/routes/404";
import { ErrorPage } from "~/routes/errorpage";
import { DrawPerfProvider } from "./components/contexts/draw-perf";
import { FigureCreatorProvider } from "./components/contexts/figure-creator";
import { AboutPage } from "./routes/about";
import { FigurePage } from "./routes/figure";
import { ReportPage } from "./routes/report";

const App: ParentComponent = (props) => {
  attachDevtoolsOverlay();
  // onMount(() => addPartytown({ debug: !!DEV }));

  return (
    <ErrorBoundary fallback={ErrorPage}>
      <DrawPerfProvider>
        <FigureCreatorProvider>
          <MetaProvider>
            <ThemeProvider defaultTheme="dark">
              <ErrorBoundary fallback={ErrorPage}>
                <Header />
                <main class="flex-auto">{props.children}</main>
                <Footer />
              </ErrorBoundary>
              {/* <VercelSpeedInsight /> */}
              <VercelAnalytics />
            </ThemeProvider>
          </MetaProvider>
        </FigureCreatorProvider>
      </DrawPerfProvider>
    </ErrorBoundary>
  );
};

const root = document.getElementById("root");

if (root instanceof HTMLElement) {
  render(
    () => (
      <Router root={App}>
        <Route path="/" component={FigurePage} />
        <Route path="/report" component={ReportPage} />
        <Route path="/about" component={AboutPage} />
        <Route path="*404" component={NotFoundPage} />
      </Router>
    ),
    root,
  );
} else if (import.meta.env.DEV) {
  throw new Error(
    "Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?",
  );
}
