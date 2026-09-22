import { site, nav } from './site.mjs';
import { esc, dayRange, hoursText, addressLine } from './lib.mjs';

const clientData = {
  hours: site.hours,
  walkInCutoff: site.walkInCutoff,
  phone: site.phone,
  phoneHref: site.phoneHref,
  email: site.email,
  endpoint: site.booking.endpoint,
};

export function layout({ file, title, description, body, jsonld, scripts = [], noindex = false }) {
  const isHome = file === 'index.html';
  const fullTitle = isHome ? title : `${title} · ${site.legalName}`;
  const canonical = `${site.url}/${isHome ? '' : file}`;
  const year = new Date().getFullYear();
  const data = JSON.stringify(clientData).replaceAll('<', '\\u003c');

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(description)}">
${noindex ? '<meta name="robots" content="noindex">\n' : ''}<meta name="color-scheme" content="light">
<meta name="theme-color" content="#ffffff">
<link rel="canonical" href="${canonical}">
<link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="assets/apple-touch-icon.png">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(site.legalName)}">
<meta property="og:title" content="${esc(fullTitle)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${site.url}/assets/og-image.png">
<meta name="twitter:card" content="summary_large_image">
<link rel="preload" href="assets/fonts/archivo-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="assets/fonts/hanken-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="assets/css/styles.css">
<script>document.documentElement.classList.add('js')</script>
${jsonld ? `<script type="application/ld+json">${JSON.stringify(jsonld).replaceAll('<', '\\u003c')}</script>` : ''}
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<header class="site-header">
  <div class="wrap bar">
    <a class="brand" href="index.html" aria-label="${esc(site.legalName)}, home">
      <img src="assets/logo/bellecare-horizontal.svg" alt="" width="240" height="47">
    </a>
    <nav id="site-nav" class="nav" aria-label="Main">
      <ul>
        ${nav.map((n) => `<li><a href="${n.href}"${n.href === file ? ' aria-current="page"' : ''}>${n.label}</a></li>`).join('\n        ')}
      </ul>
    </nav>
    <a class="btn btn-blue bar-cta" href="book.html">Book a visit</a>
    <button class="menu-btn" type="button" aria-expanded="false" aria-controls="site-nav">Menu</button>
  </div>
</header>
<main id="main">
${body}
</main>
<footer class="site-footer">
  <div class="wrap">
    <div class="foot-grid">
      <div class="foot-brand">
        <img src="assets/logo/bellecare-horizontal.svg" alt="${esc(site.legalName)}" width="240" height="47" loading="lazy">
        <p>${esc(site.tagline)}</p>
      </div>
      <div>
        <h2 class="label">Visit</h2>
        <address>${esc(site.address.street)}<br>${esc(site.address.city)} ${esc(site.address.postal)}</address>
        <p>${dayRange(site.hours.days)}<br>${hoursText()}</p>
        <p><a href="${site.mapsUrl}" rel="noopener" target="_blank">Get directions<span class="sr-only"> (opens in a new tab)</span></a></p>
      </div>
      <div>
        <h2 class="label">Contact</h2>
        <p><a href="tel:${site.phoneHref}">${esc(site.phone)}</a></p>
        <p><a href="mailto:${site.email}">${site.email}</a></p>
      </div>
      <div>
        <h2 class="label">Explore</h2>
        <ul class="foot-links">
          ${nav.map((n) => `<li><a href="${n.href}">${n.label}</a></li>`).join('\n          ')}
          <li><a href="book.html">Book a visit</a></li>
        </ul>
      </div>
    </div>
    <div class="foot-base">
      <p>© ${year} ${esc(site.legalName)}${site.dohLicense ? ` · DOH Lic. ${esc(site.dohLicense)}` : ''}</p>
      <p>Maupod kami sa imo.</p>
    </div>
  </div>
</footer>
<script type="application/json" id="site-data">${data}</script>
<script src="assets/js/site.js" defer></script>
${scripts.map((s) => `<script src="${s}" defer></script>`).join('\n')}
</body>
</html>
`;
}
