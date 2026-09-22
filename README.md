# BelleCare website

Static marketing site for BelleCare Health and Diagnostic Center, Bacolod City. Built from the BelleCare Brand System v2.0. No dependencies and no framework: a small Node script turns the content files into plain HTML, CSS and JS in `dist/`.

```
npm run build     # writes dist/
npm start         # builds, then previews at http://localhost:4173
```

Deploy by uploading the contents of `dist/` to any static host (Netlify, Cloudflare Pages, GitHub Pages, S3). Nothing runs on a server.

## Deploying with GitHub Pages

`dist/` is gitignored, so Pages can't serve it directly from the repo. `.github/workflows/deploy.yml` builds it and deploys it instead, on every push to `main`.

Turn it on once: repo **Settings → Pages → Source → GitHub Actions**. The next push to `main` deploys, and the Actions tab shows the live URL — `https://<owner>.github.io/<repo>/`.

That URL sits under a subpath, not a domain root, so the workflow builds with `BASE_PATH` and `SITE_URL` set to that subpath (used by the 404 page's asset links and by the sitemap, canonical links and `og:url`; everything else on the site links relatively and needs no change). `npm run build` locally, without those variables, still targets the custom domain below.

### Custom domain

To serve this at `bellecare.ph` instead:

1. At the registrar, point `bellecare.ph` at GitHub Pages (an `A`/`ALIAS` record to GitHub's IPs, or a `CNAME` for a `www` subdomain — see [GitHub's custom domain docs](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)).
2. Repo **Settings → Pages → Custom domain** → enter `bellecare.ph` → save. Once DNS resolves, tick **Enforce HTTPS**.
3. Delete the `env:` block from `.github/workflows/deploy.yml`, so `SITE_URL` and `BASE_PATH` fall back to the domain-root defaults already in `src/site.mjs`.

## Before you publish

Everything marked SAMPLE is a stand-in. `npm run build` prints the list. Only these come from the brand guide: the name, address, hours (6 AM to 5 PM), the Annual Physical Exam Package at ₱1,450, Dra. Villanueva's Tuesday and Thursday schedule, and the second-floor room numbers.

| Change this | In |
| --- | --- |
| Phone, email, days open, address, DOH license, time slots | `src/site.mjs` |
| Doctors, schedules, fees, tests, prices, prep notes, packages | `src/data.mjs` |
| Copy on a page | `src/pages/*.mjs` |
| Colors, type, spacing | `src/assets/css/styles.css` (tokens at the top) |

Also update `site.url` in `src/site.mjs` if the domain is not bellecare.ph. It feeds the canonical links, sitemap and social image.

## Adding photos

Drop a file in `src/assets/img/` and rebuild. The site picks it up by name. Until then it shows the brand guide's labelled placeholder.

- `hero.jpg` for the home page (about 5:4.4)
- `doctors/villanueva.jpg`, `doctors/ledesma.jpg`, `doctors/arcenas.jpg`, `doctors/sarabia.jpg` (4:5 portraits)

Formats: jpg, jpeg, webp, png, avif. Keep each under about 300 KB.

## How booking works

There is no server, so a booking is a request, not a reserved slot. The form checks the details, then either:

1. opens the visitor's email app with the request filled in for `hello@bellecare.ph` (default), or
2. posts the request as JSON to a form service, if you paste its URL into `booking.endpoint` in `src/site.mjs` (Formspree, Getform and similar).

Option 2 is smoother for patients because it needs no email app. If you use it, add a short privacy notice page, because the form collects names and mobile numbers.

## Brand rules the build follows

- White is the brand. Blue is punctuation, one moment per surface. Blue text is always Signal Blue `#0A6B8C`, never `#36BAE4`. On a solid `#36BAE4` field the text is ink.
- Colors are the guide's swatches. The supplied logo SVGs use slightly different values (`#13AEDE`, `#231F20`, `#818285`), so the copies in `src/assets/logo/` are set to the guide's `#36BAE4`, `#201D1E` and `#778587`, which is how the guide's own PDF renders the logo. The originals are unchanged.
- Archivo for headings (500, -0.02em), Hanken Grotesk for text and UI. Both are self-hosted in `assets/fonts`.
- The logo is never stretched, shadowed or rotated. The white versions in `assets/logo/` are for ink or photography only, and the site does not currently use them.
- Out-of-range results use a brown H or L and a grey row tint, never red. Form errors follow the same rule.
- Copy is plain English with a little Hiligaynon, gives the price and wait time, and makes no promises about outcomes.

## Files

```
build.mjs              build and preview script
src/site.mjs           contact details, hours, booking settings
src/data.mjs           doctors, tests, packages
src/layout.mjs         header, footer, SEO tags
src/components.mjs     doctor card, directory, room plate, page headers
src/pages/             one file per page
src/assets/            css, js, fonts, logos, icons, img
```
