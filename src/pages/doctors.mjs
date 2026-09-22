import { doctors } from '../data.mjs';
import { esc, timeRange } from '../lib.mjs';
import { pageHead, doctorCard, ctaBand } from '../components.mjs';

// Monday to Saturday columns for the week-at-a-glance table.
const WEEK = [1, 2, 3, 4, 5, 6];
const WEEK_LABEL = { 1: 'Mon', 2: 'Tue', 3: 'Wed', 4: 'Thu', 5: 'Fri', 6: 'Sat' };

function weekTable() {
  const cell = (d, day) => {
    const blocks = d.schedule.filter((b) => b.days.includes(day));
    return blocks.length ? blocks.map((b) => timeRange(b.from, b.to)).join('<br>') : '<span class="off" aria-label="Not in">–</span>';
  };
  return `
<div class="table-scroll" tabindex="0" role="region" aria-label="Weekly schedule">
  <table class="tbl tbl-week">
    <caption class="sr-only">Doctor schedule by day of the week</caption>
    <thead>
      <tr><th scope="col">Doctor</th>${WEEK.map((d) => `<th scope="col" data-day="${d}">${WEEK_LABEL[d]}</th>`).join('')}</tr>
    </thead>
    <tbody>
      ${doctors
        .map(
          (d) => `<tr>
        <th scope="row"><a href="#${d.id}">${esc(d.short)}</a><span class="tbl-note">${esc(d.specialty)}</span></th>
        ${WEEK.map((day) => `<td data-day="${day}">${cell(d, day)}</td>`).join('')}
      </tr>`,
        )
        .join('\n      ')}
    </tbody>
  </table>
</div>`;
}

export default function doctorsPage() {
  const specialties = [...new Map(doctors.map((d) => [d.slug, d.specialty])).entries()];
  const body = `
${pageHead({
  eyebrow: 'Doctors',
  title: 'Doctors and schedules.',
  lede: 'See who is in today, then book a consult for the day that suits you.',
})}

<section class="section section-tight" aria-labelledby="directory-title">
  <div class="wrap">
    <h2 class="sr-only" id="directory-title">Our doctors</h2>
    <div class="filters js-only" role="group" aria-label="Filter doctors">
      <button type="button" class="chip" data-filter="all" aria-pressed="true">All</button>
      ${specialties.map(([slug, name]) => `<button type="button" class="chip" data-filter="${slug}" aria-pressed="false">${esc(name)}</button>`).join('\n      ')}
      <span class="filters-sep" aria-hidden="true"></span>
      <button type="button" class="chip" data-in-today-filter aria-pressed="false">In today</button>
    </div>
    <p class="sr-only" role="status" aria-live="polite" data-filter-status></p>
    <div class="doc-grid" data-doc-grid>
      ${doctors.map((d, i) => doctorCard(d, { eager: i < 2 })).join('\n')}
    </div>
    <p class="empty" data-empty hidden>No doctors match that filter right now. Try another filter, or check the weekly schedule below.</p>
  </div>
</section>

<section class="section" aria-labelledby="week-title">
  <div class="wrap">
    <div class="section-head"><div><p class="eyebrow">Schedule</p><h2 id="week-title">The week at a glance.</h2><p class="lede">Times are clinic hours in Bacolod City. Call us if you are unsure about a day.</p></div></div>
    ${weekTable()}
  </div>
</section>

${ctaBand({ title: 'Book a consult.', text: 'Pick a doctor and a day. We will text you to confirm.' })}
`;
  return {
    file: 'doctors.html',
    title: 'Doctors and schedules',
    description:
      'Meet the doctors at BelleCare in Bacolod City. See specialties, consult fees and weekly schedules for internal medicine, OB-GYN, pediatrics and radiology.',
    body,
  };
}
