import { packages } from '../data.mjs';
import { esc, peso } from '../lib.mjs';
import { pageHead, ctaBand } from '../components.mjs';

function card(p) {
  return `
<article class="pkg${p.featured ? ' pkg-featured' : ''}" id="${p.id}">
  ${p.featured ? '<p class="eyebrow">Featured package</p>' : ''}
  <h2>${esc(p.name)}</h2>
  <p class="pkg-price-lg">${peso(p.price)}</p>
  <h3 class="label">Includes</h3>
  <ul class="includes">
    ${p.includes.map((i) => `<li>${esc(i)}</li>`).join('\n    ')}
  </ul>
  <p class="pkg-note">${p.prep ? `${esc(p.prep)}. ` : ''}Walk in before 10 AM for same-afternoon results.</p>
  <a class="btn btn-ink" href="book.html?service=${p.id}">Book this package<span class="sr-only">: ${esc(p.name)}</span></a>
</article>`;
}

export default function packagesPage() {
  const body = `
${pageHead({
  eyebrow: 'Packages',
  title: 'Packages, with the price up front.',
  lede: 'One price for the whole set. Need something extra? Add-on tests are priced on the Services page.',
})}
<section class="section section-tight">
  <div class="wrap pkg-grid">
    ${packages.map(card).join('\n')}
  </div>
  <p class="wrap fine">Prices are in Philippine pesos. Ask us which package your employer, school or agency requires before you pay.</p>
</section>
${ctaBand({ title: 'Not sure which package?', text: 'Tell us what you need it for and we will point you to the right one.' })}
`;
  return {
    file: 'packages.html',
    title: 'Packages',
    description:
      'Health check packages at BelleCare in Bacolod City, from ₱550. Annual physical exam at ₱1,450. See what is included and book online.',
    body,
  };
}
