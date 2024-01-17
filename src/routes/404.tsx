import { A } from "@solidjs/router";
export default () => (
  <main class="flex w-full flex-auto flex-col place-content-center place-items-center gap-4">
    <p>
      <span>404 - Not Found.</span>
      <span> </span>
      <A href="/" class="underline underline-offset-4">
        Back home
      </A>
    </p>
  </main>
);
