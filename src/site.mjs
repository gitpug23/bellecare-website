// Facts that appear on every page. Change them here, then run `npm run build`.
// Anything marked SAMPLE is a stand-in until the clinic confirms the real value.

// Where this build is served from. Every page's internal links (nav, footer, "Book a visit", ...)
// are written relative ("services.html", not "/services.html"), so they work unchanged from a
// domain root or from a GitHub Pages subpath. Only two things need to know the deployment target:
// absolute URLs in SEO tags (canonical, og:url, sitemap.xml) and the 404 page, which GitHub Pages
// can serve from any depth so its asset links can't be page-relative.
//
// Locally (`npm run build` / `npm start`) both fall back to the custom domain below. The GitHub
// Pages workflow (.github/workflows/deploy.yml) sets SITE_URL and BASE_PATH from the repo name,
// so this needs no edits when that workflow runs. Once a custom domain is attached to Pages
// (see README, "Custom domain"), drop that workflow's env block and these defaults take over again.
const BASE_PATH = process.env.BASE_PATH || '';

export const site = {
  name: 'BelleCare',
  legalName: 'BelleCare Health and Diagnostic Center',
  tagline: 'One clinic, one visit.',
  url: process.env.SITE_URL || 'https://bellecare.ph',

  phone: '(034) 000 0000', // SAMPLE, from the brand guide's stationery
  phoneHref: '+63340000000',
  email: 'hello@bellecare.ph',
  dohLicense: '', // e.g. '00-0000'. Shown in the footer only when filled in.

  address: {
    street: 'Lacson St., Mandalagan',
    city: 'Bacolod City',
    postal: '6100',
    region: 'Negros Occidental',
  },
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Lacson+St+Mandalagan+Bacolod+City',

  // 0 = Sunday. SAMPLE days; the brand guide gives 6 AM to 5 PM.
  hours: { days: [1, 2, 3, 4, 5, 6], open: '06:00', close: '17:00' },
  walkInCutoff: '10:00',

  // Time slots offered on the booking form.
  slots: ['6:00 – 8:00 AM', '8:00 – 10:00 AM', '10:00 AM – 12 NN', '1:00 – 3:00 PM', '3:00 – 5:00 PM'],

  // Booking requests. Leave `endpoint` empty and the form opens the visitor's email app.
  // To receive requests without an email app, paste a form endpoint (Formspree, Getform, ...).
  booking: { endpoint: '' },
};

export const nav = [
  { label: 'Services', href: 'services.html' },
  { label: 'Doctors', href: 'doctors.html' },
  { label: 'Packages', href: 'packages.html' },
  { label: 'Results', href: 'results.html' },
];

// The path this build is rooted at ('' for a domain root, '/repo-name' for a Pages subpath).
// Used only by 404.html's asset links; every other path in the site is page-relative.
export const basePath = BASE_PATH;
