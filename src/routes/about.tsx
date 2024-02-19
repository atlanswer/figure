/* @refresh granular */
// spell-checker:words CMYK

import { Title } from "@solidjs/meta";
import { SolidMarkdown } from "solid-markdown";
import aboutMd from "~/md/about.md?raw";

export const AboutPage = () => (
  <article class="prose prose-neutral mx-auto max-w-screen-xl px-8 py-16 dark:prose-invert md:px-16">
    <Title>About - AntCal</Title>

    <SolidMarkdown children={aboutMd} />

    <h1>Figure</h1>

    <b>Create publication quality figures. Work in progress!</b>
    <p>
      Part of the
      <span> </span>
      <a href="https://github.com/atlanswer/AntCal" target="_black">
        AntCal
      </a>
      <span> </span>
      project.
    </p>
    <p>If you encountered any issue, please reach out to me.</p>
    <p>This web app is built with the following tools:</p>
    <ul>
      <li>
        <a href="https://solidjs.com/" target="_blank">
          Solid
        </a>
      </li>
      <li>
        <a href="https://tailwindcss.com/" target="_blank">
          Tailwind CSS
        </a>
      </li>
      <li>
        <a href="https://pyodide.org/" target="_blank">
          Pyodide
        </a>
      </li>
      <li>
        <a href="https://numpy.org/" target="_blank">
          Numpy
        </a>
      </li>
      <li>
        <a href="https://matplotlib.org/" target="_blank">
          Matplotlib
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

    <h2>Notes</h2>

    <h3>Figure</h3>
    <ul>
      <li>Currently all sources are positioned at the origin</li>
      <li>
        Amplitudes are normalized to the maximum radiation of E-/M-dipole
        respectively
      </li>
      <li>Far fields are sampled every 1°</li>
      <li>There may be bugs in phase implementation</li>
    </ul>
    <h3>Report</h3>
    <p>Work in progress!</p>

    <h2>Privacy</h2>

    <p>
      This web app does not collect, store, or share any private data. The only
      data it processes are the files you choose to upload and your system
      theme, which are stored locally in your browser.
    </p>
    <p>
      Analytics that contains your infomation are still being processed by the
      host provider Vercel. Their privacy policy can be found here:
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
        Author photographs, color, and grayscale figures should be at least{" "}
        <b>300 dpi</b>. Lineart, including tables should be a minimum of{" "}
        <b>600 dpi</b>.
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
