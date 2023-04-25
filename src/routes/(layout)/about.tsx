const About = () => (
  <div class="mx-auto max-w-screen-xl prose">
    <h1>Figure</h1>
    <b>Create publication quality figures. Work in progress!</b>
    <p>This project is built upon these technologies:</p>
    <ul>
      <li>Solid</li>
      <li>SolidStart</li>
      <li>UnoCSS</li>
      <li>Observable Plot</li>
      <li>D3</li>
    </ul>
    <p>
      This project is hosted on{" "}
      <a href="https://vercel.com" target="_blank" rel="noreferrer">
        Vercel
      </a>
      .
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
      <a
        href="https://vercel.com/legal/privacy-policy"
        target="_blank"
        rel="noreferrer"
      >
        here
      </a>
      .
    </p>

    <h2>Reference</h2>
    <figure>
      <figcaption>
        <cite>
          <a href="https://journals.ieeeauthorcenter.ieee.org/create-your-ieee-journal-article/authoring-tools-and-templates/tools-for-ieee-authors/ieee-article-templates/">
            Preparation of Papers for IEEE Transactions and Journals
          </a>
        </cite>
      </figcaption>
    </figure>
    <figure>
      <p>10pt is used by the vast majority of papers.</p>
      <figcaption>
        —<cite>How to Use the IEEEtran LaTeX Class</cite>
      </figcaption>
    </figure>
    <figure>
      <p>
        High-contrast line figures and tables should be prepared with 600 dpi
        resolution and saved with no compression, 1 bit per pixel (monochrome).
      </p>
      <p>
        Photographs and grayscale figures should be prepared with 300 dpi
        resolution and saved with no compression, 8 bits per pixel (grayscale).
        Most charts graphs and tables are one column wide (3 1/2 inches or 21
        picas) or two-column width (7 1/16 inches, 43 picas wide).
      </p>
      <figcaption>
        —
        <cite>
          <a href="https://journals.ieeeauthorcenter.ieee.org/create-your-ieee-journal-article/authoring-tools-and-templates/tools-for-ieee-authors/ieee-article-templates/">
            Preparation of Papers for IEEE Transactions and Journals
          </a>
        </cite>
      </figcaption>
    </figure>
  </div>
);

export default About;
