# Figure

**Create publication quality figures. Work in progress!**

Part of the [AntCal](https://github.com/atlanswer/AntCal) project.

If you encountered any issue, please reach out to me.

This web app is built with the following tools:

- [Solid](https://solidjs.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Pyodide](https://pyodide.org/)
- [Numpy](https://numpy.org/)
- [Matplotlib](https://matplotlib.org/)

And it's hosted on [Vercel](https://vercel.com/).

## Notes

$$
e = mc^2
$$

### Figures

- Currently all sources are positioned at the origin
- Amplitudes are normalized to the maximum radiation of E-/M-dipole respectively
- Far fields are sampled every 1°
- There may be bugs in phase implementation

#### E-dipole:

- Gain $θ$: $\sin(\theta)\cos(\phi)$
- Gain $ϕ$: $\sin(\phi)$

#### M-dipole:

- Gain $θ$: $\sin(\phi)$
- Gain $ϕ$: $\sin(\theta)\cos(\phi)$

### Report

Upload date files to generate data figures. Work in progress!

## Privacy

This web app does not collect, store, or share any
private data. The only data it processes are the
files you choose to upload and your system
theme, which are stored locally in your browser.

Analytics that contains your infomation are still
being processed by the host provider Vercel.
Their privacy policy can be found here:
[Privacy Policy](https://vercel.com/legal/privacy-policy),
[Web Analytics Privacy and Compliance](https://vercel.com/docs/analytics/privacy-policy),
[Speed Insights Privacy and Compliance](https://vercel.com/docs/speed-insights/privacy-policy).

## Reference

- [IEEE Author Center](https://journals.ieeeauthorcenter.ieee.org/)

> 10pt is used by the vast majority of papers.
>
> —How to Use the IEEEtran LaTeX Class

> Format and save your graphics using a suitable
> graphics processing program that will allow
> you to create the images as PostScript (PS),
> Encapsulated PostScript (.EPS),
> Tagged Image File Format (.TIFF),
> Portable Document Format (.PDF),
> or Portable Network Graphics (.PNG).
>
> Most charts, graphs, and tables are one column wide
> (3.5 inches / 88 millimeters / 21 picas)
> or page wide (7.16 inches / 181 millimeters / 43 picas).
> The maximum depth a graphic can be is 8.5 inches
> (216 millimeters / 54 picas).
>
> Author photographs, color, and grayscale figures
> should be at 300 dpi.
> Lineart, including tables should be a minimum
> of 600 dpi.
>
> While IEEE does accept vector artwork,
> it is our policy is to rasterize
> all figures for publication.
> This is done in order to preserve the
> figures’ integrity across multiple computer platforms.
>
> All color figures should be generated in RGB
> or CMYK color space.
> Grayscale images should be submitted in
> Grayscale color space.
> Line art may be provided in grayscale
> OR bitmap colorspace.
>
> When preparing your graphics IEEE suggests
> that you use of one of the
> following Open Type fonts:
> Times New Roman, Helvetica, Arial, Cambria, and Symbol.
>
> —Preparation of Papers for IEEE Transactions and Journals (April 2013)
