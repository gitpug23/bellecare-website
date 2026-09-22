import { site } from '../site.mjs';
import { packages } from '../data.mjs';
import { esc, peso, allGroups, hoursText, dayRange, scheduleText, daysText } from '../lib.mjs';
import { pageHead } from '../components.mjs';

const label = (name, price) => (price == null ? name : `${name} — ${peso(price)}`);

function options() {
  const groups = allGroups();
  const pkg = `<optgroup label="Packages">${packages
    .map((p) => `<option value="${p.id}">${esc(label(p.name, p.price))}</option>`)
    .join('')}</optgroup>`;
  const rest = groups
    .map((g) => {
      const opts = g.items
        .map((it) => {
          const attrs = it.doctor
            ? ` data-days="${it.days.join(',')}" data-hint="${esc(`${it.doctor.short} sees patients ${scheduleText(it.doctor.schedule)}.`)}"`
            : it.note
              ? ` data-hint="${esc(it.note)}"`
              : '';
          return `<option value="${it.id}"${attrs}>${esc(label(it.name, it.price))}</option>`;
        })
        .join('');
      return `<optgroup label="${g.name}">${opts}</optgroup>`;
    })
    .join('');
  return pkg + rest;
}

export default function bookPage() {
  const body = `
${pageHead({
  eyebrow: 'Book a visit',
  title: 'Book a laboratory test, package or consult.',
  lede: 'Tell us what you need and when. We will text you to confirm the time.',
})}

<section class="section section-tight">
  <div class="wrap book-grid">
    <div class="book-main">
      <noscript><p class="notice">The booking form needs JavaScript. Call <a href="tel:${site.phoneHref}">${esc(site.phone)}</a> or email <a href="mailto:${site.email}">${site.email}</a> instead.</p></noscript>

      <form id="book-form" class="form" novalidate>
        <div class="alert" id="form-alert" role="alert" tabindex="-1" hidden></div>

        <div class="field-row">
          <div class="field">
            <label for="name">Full name</label>
            <input id="name" name="name" type="text" autocomplete="name" required aria-describedby="name-err">
            <p class="err" id="name-err" hidden></p>
          </div>
          <div class="field">
            <label for="phone">Mobile number</label>
            <input id="phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="0917 000 0000" required aria-describedby="phone-err">
            <p class="err" id="phone-err" hidden></p>
          </div>
        </div>

        <div class="field">
          <label for="email">Email <span class="opt">Optional</span></label>
          <input id="email" name="email" type="email" autocomplete="email" aria-describedby="email-err">
          <p class="err" id="email-err" hidden></p>
        </div>

        <div class="field">
          <label for="service">What do you need?</label>
          <div class="select"><select id="service" name="service" required aria-describedby="service-hint service-err">
            <option value="">Choose a test, package or consult</option>
            ${options()}
          </select></div>
          <p class="hint" id="service-hint" hidden></p>
          <p class="err" id="service-err" hidden></p>
        </div>

        <div class="field-row">
          <div class="field">
            <label for="date">Preferred date</label>
            <input id="date" name="date" type="date" required aria-describedby="date-err">
            <p class="err" id="date-err" hidden></p>
          </div>
          <div class="field">
            <label for="slot">Preferred time</label>
            <div class="select"><select id="slot" name="slot" required aria-describedby="slot-hint slot-err">
              <option value="">Choose a time</option>
              ${site.slots.map((s) => `<option>${esc(s)}</option>`).join('')}
            </select></div>
            <p class="hint" id="slot-hint">Choose a time before 10 AM for same-afternoon results.</p>
            <p class="err" id="slot-err" hidden></p>
          </div>
        </div>

        <div class="field">
          <label for="reason">Reason for visit <span class="opt">Optional</span></label>
          <textarea id="reason" name="reason" rows="3"></textarea>
        </div>

        <div class="field field-check">
          <input id="consent" name="consent" type="checkbox" required aria-describedby="consent-err">
          <label for="consent">BelleCare may contact me about this request. We use your details only to schedule your visit.</label>
          <p class="err" id="consent-err" hidden></p>
        </div>

        <div class="hp" aria-hidden="true"><label>Leave this empty<input type="text" name="website" tabindex="-1" autocomplete="off"></label></div>

        <div class="btn-row">
          <button class="btn btn-ink" type="submit">Send request</button>
          <a class="btn btn-line" href="tel:${site.phoneHref}">Call instead</a>
        </div>
      </form>

      <div class="done" id="form-done" tabindex="-1" hidden>
        <p class="eyebrow">Request ready</p>
        <h2 data-done-title>Your request is ready.</h2>
        <p class="lede" data-done-text></p>
        <pre class="summary" data-done-summary></pre>
        <div class="btn-row">
          <button class="btn btn-ink" type="button" data-copy>Copy request</button>
          <button class="btn btn-line" type="button" data-reset>Start a new request</button>
        </div>
        <p class="fine-inline" data-copy-status role="status" aria-live="polite"></p>
      </div>
    </div>

    <aside class="book-side" aria-label="Before you come">
      <div class="side-card">
        <p class="label">Before you come</p>
        <ul class="ticks">
          <li>Bring a valid ID and your referral slip.</li>
          <li>Fasting starts at 10 PM the night before. Water is fine.</li>
          <li>Walk in before 10 AM for same-afternoon results.</li>
        </ul>
      </div>
      <div class="side-card">
        <p class="label">Prefer to call?</p>
        <p><a class="side-phone" href="tel:${site.phoneHref}">${esc(site.phone)}</a></p>
        <p>${dayRange(site.hours.days)}<br>${hoursText()}</p>
      </div>
      <div class="side-card side-plain">
        <p>This is a request, not a confirmed slot. We text you to confirm.</p>
      </div>
    </aside>
  </div>
</section>
`;
  return {
    file: 'book.html',
    title: 'Book a visit',
    description:
      'Request a laboratory test, health package or doctor consult at BelleCare in Bacolod City. Choose a service, a date and a time, and we will text you to confirm.',
    body,
    scripts: ['assets/js/book.js'],
  };
}
