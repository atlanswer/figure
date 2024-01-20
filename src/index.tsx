import { MetaProvider } from "@solidjs/meta";
import { Route, Router } from "@solidjs/router";
import { lazy, onMount, Show, type ParentComponent, DEV } from "solid-js";
import { render } from "solid-js/web";
import Footer from "~/components/footer";
import Header from "~/components/header";
import { Partytown, addPartytown } from "~/components/partytown";
import { ThemeProvider } from "~/components/theme-provider";
import "~/global.css";

const App: ParentComponent = (props) => {
  onMount(() => addPartytown());

  return (
    <MetaProvider>
      <ThemeProvider>
        <Header />
        {props.children}
        <Footer />
        <Show
          when={!DEV}
          fallback={
            <Partytown src="https://va.vercel-scripts.com/v1/speed-insights/script.debug.js" />
          }
        >
          <Partytown src="/_vercel/speed-insights/script.js" />
        </Show>
        <Show
          when={!DEV}
          fallback={
            <Partytown src="https://va.vercel-scripts.com/v1/script.debug.js" />
          }
        >
          <Partytown src="/_vercel/insights/script.js" />
        </Show>
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
