import { Title, useParams } from "solid-start";
import { HttpStatusCode } from "solid-start/server";

const PageNotFound = () => {
  const params = useParams<{ path: string }>();

  return (
    <main class="min-h-screen flex flex-col place-content-center place-items-center gap-4">
      <Title>Not Found</Title>
      <HttpStatusCode code={404} />
      <h1 class="text-xl font-bold">Page Not Found</h1>
      <p>
        This route <code class="rounded bg-gray-2 px-1">{params.path}</code>{" "}
        does not exist.
      </p>
    </main>
  );
};

export default PageNotFound;
