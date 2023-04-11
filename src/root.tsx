import { Suspense } from "solid-js";
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
import "./root.css";
import "uno.css";
import "@unocss/reset/tailwind.css";

const Root = () => (
  <Html lang="en">
    <Head>
      <Title>Figure</Title>
      <Meta name="description" content="Create publication quality figures." />
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

export default Root;
