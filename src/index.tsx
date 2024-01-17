/* @refresh granular */
import { Route, Router } from "@solidjs/router";
import { lazy, type ParentComponent } from "solid-js";
import { render } from "solid-js/web";
import { ThemeProvider } from "~/components/theme-provider";
import "~/global.css";

const Home = lazy(() => import("~/routes/home"));
const NotFound = lazy(() => import("~/routes/404"));

const App: ParentComponent = (props) => {
  return (
    <ThemeProvider defaultTheme="system" storageKey="figure-theme">
      {props.children}
    </ThemeProvider>
  );
};

const root = document.getElementById("root");

if (root instanceof HTMLElement) {
  render(
    () => (
      <Router root={App}>
        <Route path="/" component={Home} />
        <Route path="*404" component={NotFound} />
      </Router>
    ),
    root,
  );
} else if (import.meta.env.DEV) {
  throw new Error(
    "Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?",
  );
}
