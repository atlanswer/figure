import {
  Suspense,
  createRenderEffect,
  createSignal,
  onCleanup,
} from "solid-js";
import {
  Body,
  ErrorBoundary,
  FileRoutes,
  Routes,
  Head,
  Html,
  Meta,
  Scripts,
  Title,
  Link,
} from "solid-start";
import {
  useSiteContext,
  SiteContextProvider,
} from "~/components/context/SiteContext";
import "./root.css";
import "uno.css";
import "@unocss/reset/tailwind.css";
import { isServer } from "solid-js/web";

const App = () => {
  const [siteContext] = useSiteContext();
  const [matchDarkQuery, setMatchDarkQuery] = createSignal(false);

  if (!isServer) {
    const prefersDarkMediaQuery = matchMedia("(prefers-color-scheme: dark)");
    createRenderEffect(() => {
      setMatchDarkQuery(prefersDarkMediaQuery.matches);
    });
    prefersDarkMediaQuery.onchange = (e) => setMatchDarkQuery(e.matches);
    onCleanup(() => (prefersDarkMediaQuery.onchange = null));
  }

  const isDarkClass = () => {
    switch (siteContext.theme) {
      case "dark":
        return true;
      case "system":
        if (matchDarkQuery()) return true;
        else return false;
      default:
        return false;
    }
  };

  return (
    <Html lang="en" classList={{ dark: isDarkClass() }}>
      <Head>
        <Title>Figure</Title>
        <Meta
          name="description"
          content="Create publication quality figures."
        />
        <Meta charset="utf-8" />
        <Meta name="viewport" content="width=device-width, initial-scale=1" />
        <Link rel="icon" type="image/svg" href="/images/me-dipole.svg" />
        <Meta name="color-scheme" content="light dark" />
        <meta
          name="theme-color"
          // @ts-expect-error: Property media not exist
          media="(prefers-color-scheme: light)"
          content="#19A7CE"
        />
        <meta
          name="theme-color"
          // @ts-expect-error: Property media not exist
          media="(prefers-color-scheme: dark)"
          content="#146C94"
        />
      </Head>
      <Body>
        <Suspense>
          <ErrorBoundary>
            <Routes>
              <FileRoutes />
            </Routes>
          </ErrorBoundary>
        </Suspense>
        <Scripts />
      </Body>
    </Html>
  );
};

const Root = () => (
  <SiteContextProvider>
    <App />
  </SiteContextProvider>
);

export default Root;
