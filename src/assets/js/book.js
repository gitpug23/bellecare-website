/* Booking request form.
   This is a static site, so nothing is stored. On submit the request either goes to the
   configured form endpoint, or opens the visitor's email app with the message filled in. */
(() => {
  'use strict';

  const data = JSON.parse(document.getElementById('site-data').textContent);
  const form = document.getElementById('book-form');
  const done = document.getElementById('form-done');
  const alertBox = document.getElementById('form-alert');
  if (!form || !done) return;

  const $ = (id) => document.getElementById(id);
  const f = {
    name: $('name'), phone: $('phone'), email: $('email'), service: $('service'),
    date: $('date'), slot: $('slot'), reason: $('reason'), consent: $('consent'),
  };
  const hint = $('service-hint');
  const DAY_LONG = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  /* ---- Dates: Manila calendar, so "today" is right wherever the visitor is ---- */
  const ymd = (d) => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Manila' }).format(d);
  const weekday = (value) => new Date(`${value}T00:00:00Z`).getUTCDay();
  f.date.min = ymd(new Date());
  f.date.max = ymd(new Date(Date.now() + 120 * 864e5));

  /* ---- Service hint and prefill (?service=cbc) ---- */
  const selected = () => f.service.selectedOptions[0];
  function showHint() {
    const text = selected()?.dataset.hint || '';
    hint.textContent = text;
    hint.hidden = !text;
  }
  f.service.addEventListener('change', showHint);
  const wanted = new URLSearchParams(location.search).get('service');
  if (wanted && [...f.service.options].some((o) => o.value === wanted)) {
    f.service.value = wanted;
    showHint();
  }

  /* ---- Validation ---- */
  const errEl = (key) => $(`${key}-err`);
  function setError(key, msg) {
    const input = f[key];
    const el = errEl(key);
    if (!el) return;
    input.setAttribute('aria-invalid', msg ? 'true' : 'false');
    el.textContent = msg || '';
    el.hidden = !msg;
  }

  function validate() {
    const errors = {};
    if (f.name.value.trim().length < 2) errors.name = 'Enter your full name.';
    if (f.phone.value.replace(/\D/g, '').length < 7) errors.phone = 'Enter a mobile number we can text.';
    if (f.email.value && !f.email.validity.valid) errors.email = 'Check the email address.';
    if (!f.service.value) errors.service = 'Choose what you need.';

    if (!f.date.value) {
      errors.date = 'Choose a date.';
    } else if (f.date.value < f.date.min) {
      errors.date = 'Choose today or a later date.';
    } else {
      const day = weekday(f.date.value);
      const opt = selected();
      const doctorDays = opt?.dataset.days ? opt.dataset.days.split(',').map(Number) : null;
      if (!data.hours.days.includes(day)) {
        errors.date = `We are closed on ${DAY_LONG[day]}s. Choose another day.`;
      } else if (doctorDays && !doctorDays.includes(day)) {
        errors.date = `Choose a day the doctor is in. ${opt.dataset.hint}`;
      }
    }
    if (!f.slot.value) errors.slot = 'Choose a time.';
    if (!f.consent.checked) errors.consent = 'Tick the box so we can contact you.';
    return errors;
  }

  const keys = Object.keys(f).filter((k) => errEl(k));
  keys.forEach((k) => {
    const clear = () => setError(k, '');
    f[k].addEventListener('input', clear);
    f[k].addEventListener('change', clear);
  });
  f.service.addEventListener('change', () => setError('date', ''));

  /* ---- Building the request ---- */
  const prettyDate = (value) =>
    new Intl.DateTimeFormat('en-PH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })
      .format(new Date(`${value}T00:00:00Z`));

  function buildRequest() {
    const serviceName = selected().textContent.trim();
    const fields = {
      name: f.name.value.trim(),
      phone: f.phone.value.trim(),
      email: f.email.value.trim(),
      service: serviceName,
      date: f.date.value,
      slot: f.slot.value,
      reason: f.reason.value.trim(),
    };
    const lines = [
      `Name: ${fields.name}`,
      `Mobile: ${fields.phone}`,
      fields.email && `Email: ${fields.email}`,
      `Service: ${fields.service}`,
      `Preferred date: ${prettyDate(fields.date)}`,
      `Preferred time: ${fields.slot}`,
      fields.reason && `Reason for visit: ${fields.reason}`,
    ].filter(Boolean);
    return { fields, text: lines.join('\n'), subject: `Booking request: ${serviceName.split(' — ')[0]}, ${fields.date}` };
  }

  /* ---- Result panel ---- */
  const doneTitle = done.querySelector('[data-done-title]');
  const doneText = done.querySelector('[data-done-text]');
  const doneSummary = done.querySelector('[data-done-summary]');
  const copyStatus = done.querySelector('[data-copy-status]');
  let lastRequest = '';

  function showDone(mode, req) {
    lastRequest = req.text;
    doneSummary.textContent = req.text;
    copyStatus.textContent = '';
    if (mode === 'sent') {
      doneTitle.textContent = 'Request sent.';
      doneText.textContent = `We will text you to confirm your time. Need it sooner? Call ${data.phone}.`;
    } else {
      doneTitle.textContent = 'One more step.';
      doneText.textContent = `Your email app should open with your request. Press send to finish. Nothing opened? Copy the request below and email it to ${data.email}, or call ${data.phone}.`;
    }
    form.hidden = true;
    done.hidden = false;
    done.focus();
    done.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function showAlert(html) {
    alertBox.innerHTML = html;
    alertBox.hidden = false;
  }

  /* ---- Submit ---- */
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    alertBox.hidden = true;

    const errors = validate();
    keys.forEach((k) => setError(k, errors[k]));
    const firstBad = keys.find((k) => errors[k]);
    if (firstBad) {
      showAlert('<p>Check the marked fields and try again.</p>');
      f[firstBad].focus();
      return;
    }

    // Honeypot: bots fill the hidden field. Pretend it worked.
    if (form.elements.website.value) return showDone('sent', buildRequest());

    const req = buildRequest();
    if (data.endpoint) {
      const button = form.querySelector('button[type="submit"]');
      button.disabled = true;
      try {
        const res = await fetch(data.endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ ...req.fields, message: req.text }),
        });
        if (!res.ok) throw new Error(String(res.status));
        showDone('sent', req);
      } catch {
        showAlert(`<p>We could not send your request. Call <a href="tel:${data.phoneHref}">${data.phone}</a> or email <a href="mailto:${data.email}">${data.email}</a>.</p>`);
      } finally {
        button.disabled = false;
      }
      return;
    }

    showDone('mailto', req);
    location.href = `mailto:${data.email}?subject=${encodeURIComponent(req.subject)}&body=${encodeURIComponent(req.text)}`;
  });

  /* ---- Copy and reset ---- */
  done.querySelector('[data-copy]').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(lastRequest);
      copyStatus.textContent = 'Copied.';
    } catch {
      const range = document.createRange();
      range.selectNodeContents(doneSummary);
      const sel = getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
      copyStatus.textContent = 'Press Ctrl+C or Cmd+C to copy.';
    }
  });

  done.querySelector('[data-reset]').addEventListener('click', () => {
    form.reset();
    keys.forEach((k) => setError(k, ''));
    showHint();
    done.hidden = true;
    form.hidden = false;
    f.name.focus();
  });
})();
