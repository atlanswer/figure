import { Route, Router } from "@solidjs/router";
import { lazy, type ParentComponent } from "solid-js";
import { render } from "solid-js/web";
import Footer from "~/components/footer";
import Header from "~/components/header";
import { ThemeProvider } from "~/components/theme-provider";
import "~/global.css";
import { MetaProvider } from "@solidjs/meta";

const App: ParentComponent = (props) => {
  return (
    <MetaProvider>
      <ThemeProvider>
        <Header />
        {props.children}
        <Footer />
      </ThemeProvider>
    </MetaProvider>
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
