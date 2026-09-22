import { site } from '../site.mjs';
import { doctors, groups, packages } from '../data.mjs';
import { esc, peso, photo, dayRange, hoursText, addressLine } from '../lib.mjs';
import { sectionHead, doctorCard, directoryCard, ctaBand } from '../components.mjs';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function home() {
  const featured = packages.find((p) => p.featured);
  const others = packages.filter((p) => !p.featured).slice(0, 3);

  const body = `
<section class="hero">
  <div class="wrap hero-grid">
    <div class="hero-copy">
      <h1>Lab, imaging and consults under one roof.</h1>
      <p class="lede">Walk in before 10 AM and most results are released the same afternoon. Mandalagan, Bacolod City.</p>
      <div class="btn-row">
        <a class="btn btn-ink" href="book.html">Book a visit</a>
        <a class="btn btn-line" href="packages.html">View packages</a>
      </div>
      <p class="status" data-status>
        <span class="status-dot" aria-hidden="true"></span>
        <span data-status-text>Open ${dayRange(site.hours.days)}, ${hoursText()}</span>
      </p>
    </div>
    ${photo({ key: 'hero', label: 'Clinic reception photo', alt: 'The BelleCare reception area', ratio: '5 / 4.4', eager: true, cls: 'hero-photo' })}
  </div>
  <div class="wrap">
    <ul class="strip">
      ${groups
        .map(
          (g) => `<li><a href="services.html#${g.id}"><h2>${g.name}</h2><p>${esc(g.summary)}</p></a></li>`,
        )
        .join('\n      ')}
    </ul>
  </div>
</section>

<section class="section" aria-labelledby="visit-title">
  <div class="wrap">
    ${sectionHead({ eyebrow: 'How a visit works', id: 'visit-title', title: 'Book, get seen, collect your results.' })}
    <ol class="steps">
      <li>
        <span class="step-n">01</span>
        <h3>Book or walk in.</h3>
        <p>Send a request online, or come in from 6 AM. Walk in before 10 AM for same-afternoon results.</p>
      </li>
      <li>
        <span class="step-n">02</span>
        <h3>Get tested or see the doctor.</h3>
        <p>Blood extraction is in Room 201 on the second floor. Bring a valid ID and your referral slip.</p>
      </li>
      <li>
        <span class="step-n">03</span>
        <h3>Collect your results.</h3>
        <p>Most results are ready the same afternoon. The wait time is listed beside every test.</p>
      </li>
    </ol>
  </div>
</section>

<section class="section" aria-labelledby="packages-title">
  <div class="wrap">
    ${sectionHead({
      eyebrow: 'Packages',
      id: 'packages-title', title: 'Packages, with the price up front.',
      link: { href: 'packages.html', label: 'See all packages' },
    })}
    <div class="pkg-split">
      <article class="feature">
        <p class="eyebrow eyebrow-on-ink">Featured package</p>
        <h3>${esc(featured.name)}</h3>
        <p class="feature-text">${esc(featured.blurb)}</p>
        <p class="feature-price">${peso(featured.price)}</p>
        <a class="btn btn-white" href="book.html?service=${featured.id}">Book this package</a>
      </article>
      <ul class="pkg-list">
        ${others
          .map(
            (p) => `<li>
          <a href="packages.html#${p.id}">
            <span><strong>${esc(p.name)}</strong><span class="pkg-blurb">${esc(p.blurb)}</span></span>
            <span class="pkg-price">${peso(p.price)}</span>
          </a>
        </li>`,
          )
          .join('\n        ')}
      </ul>
    </div>
  </div>
</section>

<section class="section" aria-labelledby="doctors-title">
  <div class="wrap">
    ${sectionHead({
      eyebrow: 'Doctors',
      id: 'doctors-title', title: 'Meet the doctors.',
      lede: 'See who is in and pick a day.',
      link: { href: 'doctors.html', label: 'See all schedules' },
    })}
    <div class="doc-grid">
      ${doctors.map((d) => doctorCard(d)).join('\n')}
    </div>
  </div>
</section>

<section class="section section-surface" aria-labelledby="find-title">
  <div class="wrap find">
    <div>
      <p class="eyebrow">Find us</p>
      <h2 id="find-title">Lacson Street, Mandalagan.</h2>
      <dl class="facts">
        <div><dt class="label">Address</dt><dd>${esc(addressLine())}</dd></div>
        <div><dt class="label">Hours</dt><dd>${dayRange(site.hours.days)}<br>${hoursText()}</dd></div>
        <div><dt class="label">Phone</dt><dd><a href="tel:${site.phoneHref}">${esc(site.phone)}</a></dd></div>
        <div><dt class="label">Email</dt><dd><a href="mailto:${site.email}">${site.email}</a></dd></div>
      </dl>
      <div class="btn-row">
        <a class="btn btn-ink" href="${site.mapsUrl}" target="_blank" rel="noopener">Get directions<span class="sr-only"> (opens in a new tab)</span></a>
        <a class="btn btn-line" href="tel:${site.phoneHref}">Call us</a>
      </div>
    </div>
    ${directoryCard()}
  </div>
</section>

${ctaBand()}
`;

  const jsonld = {
    '@context': 'https://schema.org',
    '@type': 'MedicalClinic',
    name: site.legalName,
    url: site.url,
    image: `${site.url}/assets/og-image.png`,
    logo: `${site.url}/assets/logo/bellecare-stacked.svg`,
    telephone: site.phoneHref,
    email: site.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.address.street,
      addressLocality: site.address.city,
      postalCode: site.address.postal,
      addressRegion: site.address.region,
      addressCountry: 'PH',
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: site.hours.days.map((d) => DAYS[d]),
        opens: site.hours.open,
        closes: site.hours.close,
      },
    ],
  };

  return {
    file: 'index.html',
    title: `${site.legalName} · Lab, imaging and consults in Bacolod City`,
    description:
      'Laboratory, imaging, consults and medical certificates in Mandalagan, Bacolod City. See doctors and schedules, compare packages and book a visit.',
    body,
    jsonld,
  };
}
