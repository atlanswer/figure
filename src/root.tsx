import {
  Suspense,
  createEffect,
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
  const [siteContext, { onPreferColorSchemeChange, setIsDragOver }] =
    useSiteContext();
  const [dragOverCount, setDragOverCount] = createSignal(0);
  const [dark, setDark] = createSignal(false);

  if (!isServer) {
    const prefersDarkMediaQuery = matchMedia("(prefers-color-scheme: dark)");
    createRenderEffect(() => {
      onPreferColorSchemeChange(prefersDarkMediaQuery.matches);
    });
    prefersDarkMediaQuery.onchange = (e) =>
      onPreferColorSchemeChange(e.matches);
    document.ondragenter = (e) => {
      e.preventDefault();
      setDragOverCount((c) => c + 1);
      if (dragOverCount() === 1) {
        setIsDragOver(true);
      }
    };
    document.ondragleave = (e) => {
      e.preventDefault();
      setDragOverCount((c) => c - 1);
    };
    document.ondrop = (e) => {
      e.preventDefault();
      setDragOverCount((c) => c - 1);
    };
    document.ondragover = (e) => {
      e.preventDefault();
    };
    onCleanup(() => {
      prefersDarkMediaQuery.onchange = null;
      document.ondragenter = null;
      document.ondragleave = null;
      document.ondrop = null;
      document.ondragover = null;
    });
  }

  createEffect(() => {
    if (dragOverCount() === 0) {
      setIsDragOver(false);
    }
  });

  createRenderEffect(() => {
    switch (siteContext.userTheme) {
      case "system":
        if (siteContext.prefersDark()) setDark(true);
        else setDark(false);
        break;
      case "dark":
        setDark(true);
        break;
      default:
        setDark(false);
    }
  });

  return (
    <Html lang="en" classList={{ dark: dark() }}>
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
