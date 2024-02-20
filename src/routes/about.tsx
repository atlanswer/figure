/* @refresh granular */
// spell-checker:words CMYK

import { Title } from "@solidjs/meta";
import aboutMd from "~/md/about.md?raw";
import { Markdown } from "~/md/markdown";

export const AboutPage = () => (
  <article class="prose prose-neutral mx-auto max-w-screen-xl px-8 py-16 dark:prose-invert md:px-16">
    <Title>About - AntCal</Title>
    <Markdown>{aboutMd}</Markdown>
  </article>
);
