import { Link } from "@solidjs/meta";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import type { Component } from "solid-js";
import { SolidMarkdown } from "solid-markdown";

export const Markdown: Component<{ children: string }> = (props) => {
  return (
    <>
      {/* @ts-expect-error What happened to rehype plugins? */}
      <SolidMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeKatex]}>
        {props.children}
      </SolidMarkdown>
      <Link
        href="https://lf6-cdn-tos.bytecdntp.com/cdn/expire-1-M/KaTeX/0.15.2/katex.min.css"
        type="text/css"
        rel="stylesheet"
      />
    </>
  );
};
