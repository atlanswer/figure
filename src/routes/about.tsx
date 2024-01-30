/* @refresh granular */

export const AboutPage = () => (
  <article class="prose prose-neutral mx-auto max-w-screen-xl px-8 py-16 dark:prose-invert md:px-16">
    <h1>Figure</h1>
    <b>Create publication quality figures. Work in progress!</b>
    <p>This project is built upon these technologies:</p>
    <ul>
      <li>
        <a href="https://www.solidjs.com/" target="_blank">
          Solid
        </a>
      </li>
      <li>
        <a href="https://tailwindcss.com/" target="_blank">
          Tailwind CSS
        </a>
      </li>
    </ul>
    <p>
      And it is hosted on{" "}
      <a href="https://vercel.com/" target="_blank">
        Vercel
      </a>
      .
    </p>
    <h2>Privacy</h2>
    <p>
      This web app does not collect, store, or share any private data. The only
      data it processes are files you choose to upload and your system theme.
      The latter is stored locally in your browser.
    </p>
    <p>
      Information related to you are still be processed by the host provider
      Vercel. Their privacy policy can be found here:
      <span> </span>
      <a href="https://vercel.com/legal/privacy-policy" target="_blank">
        Privacy Policy
      </a>
      <span>, </span>
      <a
        href="https://vercel.com/docs/analytics/privacy-policy"
        target="_blank"
      >
        Web Analytics Privacy and Compliance
      </a>
      <span>, </span>
      <a
        href="https://vercel.com/docs/speed-insights/privacy-policy"
        target="_blank"
      >
        Speed Insights Privacy and Compliance
      </a>
    </p>
    <h2>Reference</h2>
    <figure>
      <figcaption>
        <cite>
          <a href="https://journals.ieeeauthorcenter.ieee.org/" target="_blank">
            IEEE Author Center
          </a>
        </cite>
      </figcaption>
    </figure>

    <blockquote>
      <p>
        <b>10pt</b> is used by the vast majority of papers.
      </p>
      <footer>
        —<cite>How to Use the IEEEtran LaTeX Class</cite>
      </footer>
    </blockquote>

    <blockquote>
      <p>
        Format and save your graphics using a suitable graphics processing
        program that will allow you to create the images as PostScript (PS),
        Encapsulated PostScript (.EPS), Tagged Image File Format (.TIFF),
        Portable Document Format (.PDF), or Portable Network Graphics (.PNG).
      </p>
      <p>
        Most charts, graphs, and tables are one column wide (
        <b>3.5 inches / 88 millimeters / 21 picas</b>) or page wide (7.16 inches
        / 181 millimeters / 43 picas). The maximum depth a graphic can be is 8.5
        inches (216 millimeters / 54 picas).
      </p>
      <p>
        Author photographs, color, and grayscale figures should be at least
        300dpi. Lineart, including tables should be a minimum of <b>600dpi</b>.
      </p>
      <p>
        While IEEE does accept vector artwork, it is our policy is to rasterize
        all figures for publication. This is done in order to preserve the
        figures’ integrity across multiple computer platforms.
      </p>
      <p>
        All color figures should be generated in <b>RGB</b> or CMYK color space.
        Grayscale images should be submitted in Grayscale color space. Line art
        may be provided in grayscale OR bitmap colorspace.
      </p>
      <p>
        When preparing your graphics IEEE suggests that you use of one of the
        following Open Type fonts: Times New Roman, Helvetica, <b>Arial</b>,
        Cambria, and Symbol.
      </p>
      <footer>
        —
        <cite>
          Preparation of Papers for IEEE Transactions and Journals (April 2013)
        </cite>
      </footer>
    </blockquote>
  </article>
);
