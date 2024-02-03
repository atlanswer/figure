/* @refresh granular */

import { Title } from "@solidjs/meta";

export const ReportPage = () => {
  return (
    <div class="grid grid-cols-1 place-content-stretch place-items-center divide-y-2 divide-neutral-200 px-4 py-4 dark:divide-neutral-800 sm:px-6 lg:px-8">
      <Title>Report - AntCal</Title>
      <article class="prose mt-16 dark:prose-invert">
        <p>
          Create publication quality reports from data files. Work in progress!
        </p>
      </article>
    </div>
  );
};
