import type { ParentComponent } from "solid-js";

const A: ParentComponent<{ href: string }> = (props) => (
  <a href={props.href} target="_blank" rel="noreferrer">
    {props.children}
  </a>
);

const About = () => (
  <div class="mx-auto max-w-screen-xl prose">
    <h1>Figure</h1>
    <b>Create publication quality figures. Work in progress!</b>
    <p>This project is built upon these technologies:</p>
    <ul>
      <li>
        <A href="https://www.solidjs.com/">Solid</A>
      </li>
      <li>
        <A href="https://start.solidjs.com/">SolidStart</A>
      </li>
      <li>
        <A href="https://unocss.dev/">UnoCSS</A>
      </li>
      <li>
        <A href="https://d3js.org/">D3</A>
      </li>
    </ul>
    <p>
      This project is hosted on <A href="https://vercel.com/">Vercel</A>.
    </p>

    <h2>Privacy</h2>
    <p>
      This web app does not collect, store, or share any private data. The only
      data it processes are those you uploaded via interactions and your system
      theme. The latter one is stored locally in your browser.
    </p>
    <p>
      Information related to you could still be processed by the host provider
      Vercel. Check out their privacy policy{" "}
      <A href="https://vercel.com/legal/privacy-policy">here</A>.
    </p>

    <h2>Reference</h2>
    <figure>
      <figcaption>
        <cite>
          <A href="https://journals.ieeeauthorcenter.ieee.org/">
            IEEE Author Center
          </A>
        </cite>
      </figcaption>
    </figure>
    <figure>
      <p>
        <b>10pt</b> is used by the vast majority of papers.
      </p>
      <figcaption>
        —<cite>How to Use the IEEEtran LaTeX Class</cite>
      </figcaption>
    </figure>
    <figure>
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
      <figcaption>
        —
        <cite>
          Preparation of Papers for IEEE Transactions and Journals (April 2013)
        </cite>
      </figcaption>
    </figure>
  </div>
);

export default About;
