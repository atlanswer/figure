import {
  partytownSnippet,
  type PartytownConfig,
} from "@builder.io/partytown/integration";
import { isServer } from "solid-js/web";

declare global {
  interface Document {
    /** If Partytown is initialized */
    _partytown?: boolean;
  }
}

export const Partytown = (props: PartytownConfig & { nonce: boolean }) => {
  // this check is only be done on the client, and skipped over on the server
  if (isServer) return;

  if (!document.querySelector("script[data-partytown]")) {
    // the append script to document code should only run on the client
    // and only if the SSR'd script doesn't already exist within the document.
    // If the SSR'd script isn't found in the document, then this
    // must be a clientside only render. Append the partytown script
    // to the <head>.
    const scriptElm = document.createElement("script");
    scriptElm.dataset.partytown = "";
    scriptElm.innerHTML = partytownSnippet(props);
  }

  // should only append this script once per document, and is not dynamic
  document._partytown = true;
};
