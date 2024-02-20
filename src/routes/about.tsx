/* @refresh granular */
// spell-checker:words CMYK

import { Title } from "@solidjs/meta";
import { lazy } from "solid-js";
import aboutMd from "~/md/about.md?raw";

const LazyMarkdown = lazy(() => import("~/md/markdown"));

export const AboutPage = () => (
  <article class="prose prose-neutral mx-auto max-w-screen-xl px-8 py-16 dark:prose-invert md:px-16">
    <Title>About - AntCal</Title>
    <LazyMarkdown>{aboutMd}</LazyMarkdown>
  </article>
);
