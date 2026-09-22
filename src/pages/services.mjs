import { esc, peso, allGroups } from '../lib.mjs';
import { pageHead, plate, ctaBand } from '../components.mjs';

function row(g, it) {
  const price = it.price == null ? 'Ask us' : peso(it.price);
  return `<tr>
        <th scope="row" data-label="${g.id === 'consults' ? 'Consult' : 'Test'}">${esc(it.name)}${it.note ? `<span class="tbl-note">${esc(it.note)}</span>` : ''}</th>
        <td data-label="${esc(g.prepLabel)}">${esc(it.prep)}</td>
        <td data-label="Results">${esc(it.results)}</td>
        <td data-label="Price" class="num">${price}</td>
        <td class="tbl-act"><a class="link-arrow" href="book.html?service=${it.id}">Book<span class="sr-only"> ${esc(it.name)}</span></a></td>
      </tr>`;
}

function group(g) {
  return `
<section class="svc" id="${g.id}" aria-labelledby="${g.id}-title">
  <div class="wrap svc-grid">
    <div class="svc-head">
      <h2 id="${g.id}-title">${g.name}</h2>
      <p class="lede">${esc(g.intro)}</p>
      ${g.plate ? plate(g.plate) : ''}
    </div>
    <div class="svc-body">
      <table class="tbl">
        <caption class="sr-only">${g.name} prices and result times</caption>
        <thead>
          <tr><th scope="col">${g.id === 'consults' ? 'Consult' : 'Test'}</th><th scope="col">${esc(g.prepLabel)}</th><th scope="col">Results</th><th scope="col" class="num">Price</th><th scope="col"><span class="sr-only">Book</span></th></tr>
        </thead>
        <tbody>
      ${g.items.map((it) => row(g, it)).join('\n      ')}
        </tbody>
      </table>
    </div>
  </div>
</section>`;
}

export default function services() {
  const groups = allGroups();
  const body = `
${pageHead({
  eyebrow: 'Services',
  title: 'Lab, imaging, consults and certificates.',
  lede: 'Every price and wait time is listed. Ask us anything before you sign.',
})}
<nav class="subnav" aria-label="Services">
  <div class="wrap">
    <ul>
      ${groups.map((g) => `<li><a href="#${g.id}">${g.name}</a></li>`).join('\n      ')}
    </ul>
  </div>
</nav>
${groups.map(group).join('\n')}
<p class="wrap fine">Prices are in Philippine pesos. Wait times are for patients who walk in before 10 AM.</p>
${ctaBand()}
`;
  return {
    file: 'services.html',
    title: 'Services and prices',
    description:
      'Laboratory tests, X-ray, ultrasound, ECG, doctor consults and medical certificates at BelleCare in Bacolod City, with the price and wait time for each.',
    body,
  };
}
