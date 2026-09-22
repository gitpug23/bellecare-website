import { site } from './site.mjs';
import { directory } from './data.mjs';
import { esc, peso, photo, scheduleText, daysText, timeRange } from './lib.mjs';

export const pageHead = ({ eyebrow, title, lede }) => `
<section class="page-head">
  <div class="wrap">
    <p class="eyebrow">${esc(eyebrow)}</p>
    <h1>${title}</h1>
    <p class="lede">${lede}</p>
  </div>
</section>`;

export const sectionHead = ({ eyebrow, title, lede, link, id }) => `
<div class="section-head">
  <div>
    <p class="eyebrow">${esc(eyebrow)}</p>
    <h2${id ? ` id="${id}"` : ''}>${title}</h2>
    ${lede ? `<p class="lede">${lede}</p>` : ''}
  </div>
  ${link ? `<a class="link-arrow" href="${link.href}">${link.label}</a>` : ''}
</div>`;

// Monday-first strip of the days a doctor is in. Decorative; the text schedule carries the meaning.
export function weekStrip(schedule) {
  const on = new Set(schedule.flatMap((b) => b.days));
  return `<ol class="week" aria-hidden="true">${[1, 2, 3, 4, 5, 6, 0]
    .map((d) => `<li${on.has(d) ? ' class="on"' : ''}>${['S', 'M', 'T', 'W', 'T', 'F', 'S'][d]}</li>`)
    .join('')}</ol>`;
}

export function doctorCard(d, { eager = false } = {}) {
  const action = d.consult
    ? `<a class="link-arrow" href="book.html?service=consult-${d.id}">Book a consult<span class="sr-only"> with ${esc(d.short)}</span></a>`
    : `<a class="link-arrow" href="services.html#imaging">See imaging services</a>`;
  return `
<article class="doc" id="${d.id}" data-doctor data-specialty="${d.slug}" data-schedule="${esc(JSON.stringify(d.schedule))}">
  ${photo({ key: `doctors/${d.id}`, label: 'Photo', alt: d.name, ratio: '4 / 5', eager })}
  <div class="doc-body">
    <p class="label doc-spec"><span>${esc(d.specialty)}</span><span class="badge" data-badge hidden>In today</span></p>
    <h3>${esc(d.name)}</h3>
    <p class="doc-for">${esc(d.for)}</p>
    ${weekStrip(d.schedule)}
    <ul class="sched">
      ${d.schedule.map((b) => `<li><span>${daysText(b.days)}</span><span>${timeRange(b.from, b.to)}</span></li>`).join('\n      ')}
    </ul>
    <p class="doc-meta">${[d.fee ? `Consult fee ${peso(d.fee)}` : null, d.room ? `Room ${d.room}` : null].filter(Boolean).join(' · ')}</p>
    ${action}
  </div>
</article>`;
}

// The second-floor signage plate from the brand guide, as a directory.
export function directoryCard() {
  return `
<div class="directory">
  <div class="dir-head"><span class="dir-floor">${directory.floor}</span><span class="label">${directory.floorName}</span></div>
  <ul>
    ${directory.rooms.map((r) => `<li><span>${esc(r.name)}</span><span class="dir-room">${r.room}</span></li>`).join('\n    ')}
  </ul>
</div>`;
}

// The room plate from the brand guide: ink type, one blue edge.
export const plate = ({ title, detail }) => `
<div class="plate">
  <p class="label">Room plate</p>
  <div class="plate-edge"><h3>${esc(title)}</h3><p>${esc(detail)}</p></div>
</div>`;

export const ctaBand = ({ title = 'Book a laboratory test.', text = 'Tell us what you need and when. We will text you to confirm.' } = {}) => `
<section class="cta">
  <div class="wrap cta-grid">
    <div>
      <h2>${title}</h2>
      <p class="lede">${text}</p>
    </div>
    <div class="cta-actions">
      <a class="btn btn-ink" href="book.html">Book a visit</a>
      <a class="btn btn-line" href="tel:${site.phoneHref}">Call ${esc(site.phone)}</a>
    </div>
  </div>
</section>`;
