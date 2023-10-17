import { Title, useParams } from "solid-start";
import { HttpStatusCode } from "solid-start/server";

const PageNotFound = () => {
  const params = useParams<{ path: string }>();

  return (
    <div class="mx-auto max-w-screen-xl flex flex-1 flex-col place-content-center place-items-center gap-4">
      <Title>Page Not Found</Title>
      <HttpStatusCode code={404} />
      <h1 class="text-xl font-bold">404: Page Not Found</h1>
      <p>
        This route <code class="rounded bg-gray-2 p-1">{params.path}</code>{" "}
        does not exist.
      </p>
    </div>
  );
};

export default PageNotFound;
