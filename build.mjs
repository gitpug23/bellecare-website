// Builds the static site into ./dist. No dependencies.
//   node build.mjs           build once
//   node build.mjs --serve   build, then preview at http://localhost:4173

import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { dirname, extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

import { site } from './src/site.mjs';
import { sampleNotes } from './src/data.mjs';
import { layout } from './src/layout.mjs';
import home from './src/pages/index.mjs';
import services from './src/pages/services.mjs';
import doctors from './src/pages/doctors.mjs';
import packages from './src/pages/packages.mjs';
import results from './src/pages/results.mjs';
import book from './src/pages/book.mjs';
import notFound from './src/pages/notfound.mjs';

const root = dirname(fileURLToPath(import.meta.url));
const dist = join(root, 'dist');

function build() {
  rmSync(dist, { recursive: true, force: true });
  mkdirSync(dist, { recursive: true });
  cpSync(join(root, 'src/assets'), join(dist, 'assets'), { recursive: true });

  const pages = [home, services, doctors, packages, results, book].map((p) => p());
  for (const page of pages) writeFileSync(join(dist, page.file), layout(page));

  // The 404 page can be served from any depth, so its links must not be relative.
  const nf = notFound();
  writeFileSync(
    join(dist, nf.file),
    layout(nf).replace(/(href|src)="(?!https?:|mailto:|tel:|#|\/)/g, '$1="/'),
  );

  const today = new Date().toISOString().slice(0, 10);
  const urls = pages.map((p) => `${site.url}/${p.file === 'index.html' ? '' : p.file}`);
  writeFileSync(
    join(dist, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
      .map((u) => `  <url><loc>${u}</loc><lastmod>${today}</lastmod></url>`)
      .join('\n')}\n</urlset>\n`,
  );
  writeFileSync(join(dist, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${site.url}/sitemap.xml\n`);

  console.log(`Built ${pages.length + 1} pages into dist/`);
  const missing = ['hero', 'doctors/villanueva'].filter(
    (k) => !['jpg', 'jpeg', 'webp', 'png', 'avif'].some((e) => existsSync(join(root, 'src/assets/img', `${k}.${e}`))),
  );
  if (missing.length) console.log('\nPhotos not added yet (placeholders shown): see README, "Adding photos".');
  console.log('\nSample content still in use. Replace before publishing:');
  for (const n of sampleNotes) console.log(`  - ${n}`);
}

build();

if (process.argv.includes('--serve')) {
  const types = {
    '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml',
    '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2',
    '.xml': 'application/xml', '.txt': 'text/plain',
  };
  createServer((req, res) => {
    let path = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname)).replace(/^(\.\.[/\\])+/, '');
    let file = join(dist, path);
    if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html');
    if (!existsSync(file) && existsSync(`${file}.html`)) file = `${file}.html`;
    if (!file.startsWith(dist) || !existsSync(file)) {
      res.writeHead(404, { 'Content-Type': types['.html'] });
      return res.end(readFileSync(join(dist, '404.html')));
    }
    res.writeHead(200, { 'Content-Type': types[extname(file)] || 'application/octet-stream' });
    res.end(readFileSync(file));
  }).listen(4173, () => console.log('\nPreview: http://localhost:4173'));
}
