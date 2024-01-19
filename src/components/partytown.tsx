import type { PartytownProps } from "@builder.io/partytown/react";
import { isServer } from "solid-js/web";

export const Partytown = (props: PartytownProps = {}) => {
  // this check is only be done on the client, and skipped over on the server
  if (isServer) return;
};
