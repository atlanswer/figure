/* @refresh granular */
/* spell-checker:words sdkn, sdkv */

import {
  partytownSnippet,
  type PartytownConfig,
  SCRIPT_TYPE,
} from "@builder.io/partytown/integration";
import { Show, type JSX, DEV } from "solid-js";
import { isServer } from "solid-js/web";

interface PartytownDocument extends Document {
  /** If Partytown is initialized */
  _partytown?: boolean;
}

declare const document: PartytownDocument;

export const Partytown = (
  props: Pick<
    JSX.ScriptHTMLAttributes<HTMLScriptElement>,
    "src" | "innerHTML" | "textContent"
  >,
) => {
  return (
    <script
      type={SCRIPT_TYPE}
      src={props.src}
      textContent={props.textContent}
    />
  );
};

declare global {
  interface Window {
    va?: unknown;
    vaq?: unknown[];
    si?: unknown;
    siq?: unknown[];
  }
}

export const VercelAnalytics = () => {
  if (!isServer) {
    window.va =
      window.va ||
      function (...params: unknown[]) {
        (window.vaq = window.vaq || []).push(params);
      };
  }
  return (
    <Show
      when={!DEV}
      fallback={
        <script
          type={SCRIPT_TYPE}
          src="https://va.vercel-scripts.com/v1/script.debug.js"
          data-sdkn="@vercel/analytics"
          data-sdkv="1.1.2"
        />
      }
    >
      <script
        type={SCRIPT_TYPE}
        src="/_vercel/insights/script.js"
        data-sdkn="@vercel/analytics"
        data-sdkv="1.1.2"
      />
    </Show>
  );
};

export const VercelSpeedInsight = () => {
  if (!isServer) {
    window.si =
      window.si ||
      function (...params: unknown[]) {
        (window.siq = window.siq || []).push(params);
      };
  }
  return (
    <Show
      when={!DEV}
      fallback={
        <script
          defer
          src="https://va.vercel-scripts.com/v1/speed-insights/script.debug.js"
          data-sdkn="@vercel/speed-insights"
          data-sdkv="1.0.6"
        />
      }
    >
      <script
        defer
        src="/_vercel/speed-insights/script.js"
        data-sdkn="@vercel/speed-insights"
        data-sdkv="1.0.6"
      />
    </Show>
  );
};

export const addPartytown = ({ ...props }: PartytownConfig = {}) => {
  // this check is only be done on the client, and skipped over on the server
  if (!isServer && !document._partytown) {
    if (!document.querySelector("script[data-partytown]")) {
      // the append script to document code should only run on the client
      // and only if the SSR'd script doesn't already exist within the document.
      // If the SSR'd script isn't found in the document, then this
      // must be a clientside only render. Append the partytown script
      // to the <head>.
      const scriptElm = document.createElement("script");
      scriptElm.dataset.partytown = "";
      scriptElm.innerHTML = partytownSnippet(props);
      document.head.appendChild(scriptElm);
    }
    // should only append this script once per document, and is not dynamic
    document._partytown = true;
  }
  // `dangerouslySetInnerHTML` only works for scripts rendered as HTML from SSR.
  // The added code will set the [type="data-pt-script"] attribute
  // to the SSR rendered <script>. If this code renders as SSR HTML,
  // then on the client it'll execute and add the attribute which will tell
  // the Client JS of the component to NOT add the same script to the <head>.
  // const innerHTML =
  //   partytownSnippet(props) + 'document.currentScript.dataset.partytown="";';
  // eslint-disable-next-line solid/no-innerhtml
  // return <script innerHTML={innerHTML} nonce={props.nonce} />;
};
