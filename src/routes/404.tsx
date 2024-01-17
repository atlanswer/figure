import { A, useLocation } from "@solidjs/router";
export default () => {
  const location = useLocation();

  return (
    <main class="flex w-full flex-auto flex-col place-content-center place-items-center gap-4">
      <code>{location.pathname}</code>
      <p>
        <span>404 - Not Found.</span>
        <span> </span>
        <A href="/" class="underline underline-offset-4">
          Back home
        </A>
      </p>
    </main>
  );
};
