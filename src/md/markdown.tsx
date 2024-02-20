import { Link } from "@solidjs/meta";
import { micromark } from "micromark";
import { gfm, gfmHtml } from "micromark-extension-gfm";
import { math, mathHtml } from "micromark-extension-math";
import type { Component } from "solid-js";

const Markdown: Component<{ children: string }> = (props) => {
  return (
    <>
      <div
        // eslint-disable-next-line solid/no-innerhtml
        innerHTML={micromark(props.children, {
          allowDangerousHtml: true,
          extensions: [gfm(), math()],
          htmlExtensions: [gfmHtml(), mathHtml()],
        })}
      />
      <Link
        href="https://lf6-cdn-tos.bytecdntp.com/cdn/expire-1-M/KaTeX/0.15.2/katex.min.css"
        type="text/css"
        rel="stylesheet"
      />
    </>
  );
};

export default Markdown;
