import { site } from '../site.mjs';
import { esc } from '../lib.mjs';
import { pageHead } from '../components.mjs';

export default function notFound() {
  return {
    file: '404.html',
    title: 'Page not found',
    description: 'That page does not exist. Go back to the BelleCare home page.',
    body: `
${pageHead({
  eyebrow: 'Page not found',
  title: 'We cannot find that page.',
  lede: `Try the menu above, or call us on <a href="tel:${site.phoneHref}">${esc(site.phone)}</a>.`,
})}
<section class="section section-tight"><div class="wrap"><div class="btn-row"><a class="btn btn-ink" href="index.html">Back to home</a><a class="btn btn-line" href="book.html">Book a visit</a></div></div></section>
`,
    noindex: true,
  };
}
