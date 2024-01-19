import {
  partytownSnippet,
  type PartytownConfig,
  SCRIPT_TYPE,
} from "@builder.io/partytown/integration";
import { type JSX } from "solid-js";
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
  // onMount(() => window.dispatchEvent(new CustomEvent("ptupdate")));
  return (
    <script
      type={SCRIPT_TYPE}
      src={props.src}
      textContent={props.textContent}
    />
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
