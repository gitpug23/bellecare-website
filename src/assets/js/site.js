/* BelleCare site behaviour. Everything here is an enhancement: the pages read fine without it. */
(() => {
  'use strict';

  const data = JSON.parse(document.getElementById('site-data')?.textContent || '{}');
  const DAY_LONG = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const DAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Clinic time, whatever the visitor's timezone. Manila has no daylight saving.
  function manilaNow() {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Manila', weekday: 'short', hour: 'numeric', minute: 'numeric', hourCycle: 'h23',
    }).formatToParts(new Date());
    const o = Object.fromEntries(parts.map((p) => [p.type, p.value]));
    return { day: DAY_SHORT.indexOf(o.weekday), minutes: Number(o.hour) * 60 + Number(o.minute) };
  }
  const toMinutes = (t) => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
  function fmtTime(t) {
    const [h, m] = t.split(':').map(Number);
    if (h === 12 && m === 0) return '12 NN';
    const h12 = h % 12 || 12;
    return `${h12}${m ? ':' + String(m).padStart(2, '0') : ''} ${h < 12 ? 'AM' : 'PM'}`;
  }

  const now = manilaNow();

  /* ---- Mobile menu ---- */
  const menuBtn = document.querySelector('.menu-btn');
  const nav = document.getElementById('site-nav');
  if (menuBtn && nav) {
    const setOpen = (open) => {
      nav.classList.toggle('open', open);
      menuBtn.setAttribute('aria-expanded', String(open));
      menuBtn.textContent = open ? 'Close' : 'Menu';
    };
    menuBtn.addEventListener('click', () => setOpen(!nav.classList.contains('open')));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('open')) { setOpen(false); menuBtn.focus(); }
    });
    matchMedia('(min-width: 861px)').addEventListener('change', (e) => e.matches && setOpen(false));
  }

  /* ---- Open now / closed now ---- */
  const status = document.querySelector('[data-status]');
  if (status && data.hours) {
    const { days, open, close } = data.hours;
    const isOpen = days.includes(now.day) && now.minutes >= toMinutes(open) && now.minutes < toMinutes(close);
    let text;
    if (isOpen) {
      text = `Open now · until ${fmtTime(close)}`;
    } else {
      let when = null;
      if (days.includes(now.day) && now.minutes < toMinutes(open)) when = 'today';
      for (let i = 1; !when && i <= 7; i++) {
        const d = (now.day + i) % 7;
        if (days.includes(d)) when = i === 1 ? 'tomorrow' : DAY_LONG[d];
      }
      text = `Closed now · opens ${when} at ${fmtTime(open)}`;
    }
    status.dataset.state = isOpen ? 'open' : 'closed';
    status.querySelector('[data-status-text]').textContent = text;
  }

  /* ---- Doctors who are in today ---- */
  document.querySelectorAll('[data-doctor]').forEach((card) => {
    const blocks = JSON.parse(card.dataset.schedule || '[]');
    const block = blocks.find((b) => b.days.includes(now.day) && now.minutes < toMinutes(b.to));
    card.dataset.today = block ? 'true' : 'false';
    const badge = card.querySelector('[data-badge]');
    if (block && badge) {
      badge.textContent = now.minutes >= toMinutes(block.from) ? 'In now' : 'In today';
      badge.hidden = false;
    }
  });

  /* ---- Highlight today's column in the weekly table ---- */
  document.querySelectorAll(`.tbl-week [data-day="${now.day}"]`).forEach((el) => el.classList.add('is-today'));

  /* ---- Doctor filters ---- */
  const grid = document.querySelector('[data-doc-grid]');
  if (grid) {
    const chips = [...document.querySelectorAll('.filters .chip[data-filter]')];
    const todayChip = document.querySelector('[data-in-today-filter]');
    const empty = document.querySelector('[data-empty]');
    const live = document.querySelector('[data-filter-status]');
    let specialty = 'all';
    let todayOnly = false;

    const apply = () => {
      let shown = 0;
      grid.querySelectorAll('[data-doctor]').forEach((card) => {
        const show = (specialty === 'all' || card.dataset.specialty === specialty) && (!todayOnly || card.dataset.today === 'true');
        card.hidden = !show;
        if (show) shown++;
      });
      if (empty) empty.hidden = shown > 0;
      if (live) live.textContent = `Showing ${shown} ${shown === 1 ? 'doctor' : 'doctors'}.`;
    };

    chips.forEach((chip) => chip.addEventListener('click', () => {
      specialty = chip.dataset.filter;
      chips.forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));
      apply();
    }));
    todayChip?.addEventListener('click', () => {
      todayOnly = !todayOnly;
      todayChip.setAttribute('aria-pressed', String(todayOnly));
      apply();
    });
  }
})();
