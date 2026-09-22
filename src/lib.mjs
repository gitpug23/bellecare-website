import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { site } from './site.mjs';
import { doctors, groups } from './data.mjs';

const here = dirname(fileURLToPath(import.meta.url));

export const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

export const peso = (n) => '₱' + n.toLocaleString('en-PH');

// '09:00' -> '9 AM', '12:00' -> '12 NN', '13:30' -> '1:30 PM'
export function fmtTime(t) {
  const [h, m] = t.split(':').map(Number);
  if (h === 12 && m === 0) return '12 NN';
  const ap = h < 12 ? 'AM' : 'PM';
  const h12 = h % 12 || 12;
  return m ? `${h12}:${String(m).padStart(2, '0')} ${ap}` : `${h12} ${ap}`;
}
export const timeRange = (from, to) => `${fmtTime(from)} – ${fmtTime(to)}`;

const LONG = ['Sundays', 'Mondays', 'Tuesdays', 'Wednesdays', 'Thursdays', 'Fridays', 'Saturdays'];
const FULL = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
export const DAY_LETTERS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
export const DAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export const DAY_FULL = FULL;

// [2, 4] -> 'Tuesdays and Thursdays'
export function daysText(days) {
  const n = days.map((d) => LONG[d]);
  return n.length < 2 ? n[0] : `${n.slice(0, -1).join(', ')} and ${n.at(-1)}`;
}

// [1,2,3,4,5,6] -> 'Monday to Saturday'
export function dayRange(days) {
  const d = [...days].sort((a, b) => a - b);
  const consecutive = d.every((v, i) => i === 0 || v === d[i - 1] + 1);
  if (consecutive && d.length > 2) return `${FULL[d[0]]} to ${FULL[d.at(-1)]}`;
  const n = d.map((x) => FULL[x]);
  return n.length < 2 ? n[0] : `${n.slice(0, -1).join(', ')} and ${n.at(-1)}`;
}

export const hoursText = () => timeRange(site.hours.open, site.hours.close);
export const scheduleText = (blocks) => blocks.map((b) => `${daysText(b.days)}, ${timeRange(b.from, b.to)}`).join(' · ');

export const addressLine = () => `${site.address.street}, ${site.address.city} ${site.address.postal}`;

/**
 * A photo slot. If src/assets/img/<key>.(jpg|jpeg|webp|png|avif) exists it renders the image,
 * otherwise a labelled placeholder in the brand guide's style. Drop a file in and rebuild.
 */
export function photo({ key, label, alt = '', ratio = '3 / 2', eager = false, cls = '' }) {
  for (const ext of ['jpg', 'jpeg', 'webp', 'png', 'avif']) {
    if (existsSync(join(here, 'assets', 'img', `${key}.${ext}`))) {
      return `<div class="photo ${cls}" style="--ratio:${ratio}"><img src="assets/img/${key}.${ext}" alt="${esc(alt)}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async"></div>`;
    }
  }
  return `<div class="photo is-empty ${cls}" style="--ratio:${ratio}" aria-hidden="true"><span>${esc(label)}</span></div>`;
}

// Consult rows on the Services page and the booking form come straight from the doctors list.
export function consultRows() {
  return doctors
    .filter((d) => d.consult)
    .map((d) => ({
      id: `consult-${d.id}`,
      name: `${d.specialty} · ${d.short}`,
      price: d.fee,
      prep: scheduleText(d.schedule),
      results: 'Same visit',
      days: [...new Set(d.schedule.flatMap((b) => b.days))],
      doctor: d,
    }));
}

export function groupItems(g) {
  return g.id === 'consults' ? consultRows() : g.items;
}

export function allGroups() {
  return groups.map((g) => ({ ...g, items: groupItems(g) }));
}
