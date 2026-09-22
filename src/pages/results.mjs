import { site } from '../site.mjs';
import { esc, hoursText } from '../lib.mjs';
import { pageHead, ctaBand } from '../components.mjs';

// The hematology report from the brand guide, as a demo of how a BelleCare result reads.
function sampleReport() {
  const rows = [
    ['Hemoglobin', '14.6', '', '13.5 – 17.5', 'g/dL'],
    ['Hematocrit', '43.1', '', '41 – 53', '%'],
    ['WBC Count', '11.8', 'H', '4.5 – 11.0', '10<sup>9</sup>/L'],
    ['Platelet Count', '265', '', '150 – 400', '10<sup>9</sup>/L'],
  ];
  return `
<figure class="report" aria-labelledby="report-cap">
  <div class="report-sheet">
    <img src="assets/logo/bellecare-horizontal.svg" alt="" width="176" height="34" loading="lazy">
    <p class="report-addr">${esc(site.address.street)}, ${esc(site.address.city)}<br>${esc(site.phone)}</p>
    <hr class="report-rule">
    <p class="label report-title">Hematology report</p>
    <dl class="report-meta">
      <div><dt class="label">Patient</dt><dd>Reyes, Juan M.</dd></div>
      <div><dt class="label">Age / Sex</dt><dd>42 / M</dd></div>
      <div><dt class="label">Specimen</dt><dd>Whole blood</dd></div>
      <div><dt class="label">Collected</dt><dd>19 Sep 2026, 7:12 AM</dd></div>
    </dl>
    <table class="report-tbl">
      <thead><tr><th scope="col">Test</th><th scope="col">Result</th><th scope="col">Reference</th><th scope="col">Unit</th></tr></thead>
      <tbody>
        ${rows
          .map(
            ([t, r, f, ref, u]) =>
              `<tr${f ? ' class="flag-row"' : ''}><th scope="row">${t}</th><td>${r}${f ? ` <span class="flag" aria-label="${f === 'H' ? 'High' : 'Low'}">${f}</span>` : ''}</td><td>${ref}</td><td>${u}</td></tr>`,
          )
          .join('\n        ')}
      </tbody>
    </table>
    <p class="report-foot"><span>Verified by A. Sombilon, RMT · Lic. 000000</span><span>Page 1 of 1</span></p>
  </div>
  <figcaption id="report-cap"><strong>Sample report.</strong> The names and numbers are made up.</figcaption>
</figure>`;
}

export default function resultsPage() {
  const body = `
${pageHead({
  eyebrow: 'Results',
  title: 'Getting your results.',
  lede: 'Walk in before 10 AM and most results are released the same afternoon. Bring a valid ID.',
})}

<section class="section section-tight" aria-labelledby="claim-title">
  <div class="wrap">
    <h2 class="sr-only" id="claim-title">Claiming your results</h2>
    <ul class="facts-grid">
      <li>
        <h3>What to bring</h3>
        <p>A valid ID and your official receipt. If you came with a referral slip, bring it too.</p>
      </li>
      <li>
        <h3>When</h3>
        <p>Most tests are released the same afternoon. A few take until the next day. The wait time is listed beside every test on the <a href="services.html">Services page</a>.</p>
      </li>
      <li>
        <h3>Where</h3>
        <p>At the front desk, ${hoursText()}. Want to check first? Call <a href="tel:${site.phoneHref}">${esc(site.phone)}</a>.</p>
      </li>
    </ul>
  </div>
</section>

<section class="section" aria-labelledby="prep-title">
  <div class="wrap two-col">
    <div>
      <p class="eyebrow">Before your test</p>
      <h2 id="prep-title">Fasting starts at 10 PM.</h2>
      <p class="lede">For fasting blood sugar and lipid profile, stop eating at 10 PM the night before. Water is fine.</p>
      <p>CBC, urinalysis, X-ray and ECG need no preparation. Ultrasound has its own steps, so ask us when you book.</p>
      <p><a class="link-arrow" href="services.html#laboratory">See prep for every test</a></p>
    </div>
    <div class="note-box">
      <p class="label">Good to know</p>
      <p>Bring your ID and arrive before 10 AM. Ask us anything before you sign.</p>
      <p>Maupod kami sa imo.</p>
    </div>
  </div>
</section>

<section class="section" aria-labelledby="read-title">
  <div class="wrap two-col two-col-report">
    <div>
      <p class="eyebrow">Reading your report</p>
      <h2 id="read-title">A letter marks what is out of range.</h2>
      <p class="lede">An H means higher than the reference range. An L means lower. The row is tinted grey so it still shows on a photocopy.</p>
      <p>A flag is not a diagnosis. Only your doctor can tell you what a result means for you.</p>
    </div>
    ${sampleReport()}
  </div>
</section>

${ctaBand({ title: 'Need a test?', text: 'Book online and pick a time before 10 AM for same-afternoon results.' })}
`;
  return {
    file: 'results.html',
    title: 'Getting your results',
    description:
      'How to claim your laboratory and imaging results at BelleCare in Bacolod City: what to bring, when they are ready, how to prepare, and how to read your report.',
    body,
  };
}
