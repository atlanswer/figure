/* @refresh granular */

import { A, useLocation } from "@solidjs/router";

export const NotFoundPage = () => {
  const location = useLocation();

  return (
    <div class="prose flex h-full max-w-none flex-col place-content-center place-items-center dark:prose-invert">
      <p>
        You are visiting <code>{location.pathname}</code>.
      </p>
      <p>
        <span>404 - Not Found.</span>
        <span> </span>
        <A href="/" class="underline underline-offset-4">
          Back home
        </A>
      </p>
    </div>
  );
};
