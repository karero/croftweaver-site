#!/usr/bin/env node
// Makes public/croftweaver-why.pdf, the /why case as slides (README step 5a), or checks that it is current.
//
//   npm run deck              build the site, then make the PDF and scripts/deck.lock.json
//   node scripts/build-deck.mjs --check
//                             no browser: fail unless the PDF still matches its source
//
// The slides come from scripts/deck-slides.mjs and the built /why page (dist/why.html), so a
// figure on the page is a figure in the deck. The lock file holds two hashes: the slides' HTML
// (it changes when a figure, a line of copy, the logo or the site address changes) and the PDF's
// bytes (it changes when someone edits the file by hand). tests/seo.spec.ts runs --check, so a
// run turns red when either hash no longer matches. The check compares hashes; it does not open
// the PDF. Needs Node 22.18 or newer (it imports src/config.ts) and, to make the PDF, Python 3
// with pypdf for the doc-title (the same tool as scripts/set_pdf_title.py).
import { createHash } from 'node:crypto';
import { copyFileSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { makeDeck } from './deck-slides.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const whyPath = join(root, 'dist', 'why.html');
const checksPath = join(root, 'dist', 'checks.html');
const logoPath = join(root, 'src', 'assets', 'brand', 'lockup-horizontal-theme.svg');
const pdfPath = join(root, 'public', 'croftweaver-why.pdf');
const lockPath = join(root, 'scripts', 'deck.lock.json');
const sha = (data) => createHash('sha256').update(data).digest('hex');
const fail = (message) => { console.error(`deck: ${message}`); process.exit(1); };

// src/config.ts is TypeScript. package.json allows a Node from 22.12 on, and one that cannot
// run a .ts file unaided would stop here with "unknown file extension"; say what is needed.
if (!process.features.typescript) fail(`this script imports src/config.ts, so it needs a Node that runs TypeScript files unaided (22.18 or newer). This is Node ${process.versions.node}.`);
const { SITE } = await import('../src/config.ts');

if (!existsSync(whyPath) || !existsSync(checksPath)) fail('dist/why.html or dist/checks.html is missing. Run `npm run build` first (`npm run deck` does).');
const { html, title, slideCount } = makeDeck({
  whyHtml: readFileSync(whyPath, 'utf8'),
  checksHtml: readFileSync(checksPath, 'utf8'),
  site: SITE,
  logoSvg: readFileSync(logoPath, 'utf8'),
});
const source = sha(html);

if (process.argv.includes('--check')) {
  if (!existsSync(lockPath) || !existsSync(pdfPath)) fail('there is no deck yet. Run `npm run deck`.');
  const lock = JSON.parse(readFileSync(lockPath, 'utf8'));
  if (lock.source !== source) fail('the deck is out of date: a figure on /why, a line of the slides, the logo or the site address changed since the PDF was made. Run `npm run deck` and commit public/croftweaver-why.pdf and scripts/deck.lock.json.');
  if (lock.pdf !== sha(readFileSync(pdfPath))) fail('public/croftweaver-why.pdf was changed without scripts/build-deck.mjs. Run `npm run deck` to make it again.');
  console.log(`deck: current (${slideCount} slides).`);
  process.exit(0);
}

const { chromium } = await import('@playwright/test');
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  await page.setContent(html, { waitUntil: 'load' });
  // Measure the layout that gets printed: page.pdf() renders with print media.
  await page.emulateMedia({ media: 'print' });
  // Text that runs past its slide is the layout bug nothing else would catch.
  const overflowing = await page.evaluate(() =>
    [...document.querySelectorAll('.slide')]
      .map((el, i) => (el.scrollHeight > el.clientHeight || el.scrollWidth > el.clientWidth ? i + 1 : 0))
      .filter(Boolean));
  if (overflowing.length) fail(`text runs past the edge of slide ${overflowing.join(', ')}. Shorten it or make the type smaller in scripts/deck-slides.mjs.`);
  await page.pdf({ path: pdfPath, preferCSSPageSize: true, printBackground: true, tagged: true, outline: true });
} finally {
  await browser.close();
}

// The doc-title is what search results print for a hosted PDF; tests/seo.spec.ts checks it.
let titled = false;
for (const [cmd, pre] of [['python3', []], ['py', ['-3']], ['python', []]]) {
  const run = spawnSync(cmd, [...pre, join(root, 'scripts', 'set_pdf_title.py'), pdfPath, title, '--author', SITE.name], { stdio: 'inherit' });
  if (run.error?.code === 'ENOENT') continue;
  if (run.status !== 0) fail('scripts/set_pdf_title.py failed (it needs pypdf: python3 -m pip install pypdf).');
  titled = true;
  break;
}
if (!titled) fail('no Python interpreter found (tried python3, py -3, python); the PDF needs its doc-title.');

writeFileSync(lockPath, JSON.stringify({ source, pdf: sha(readFileSync(pdfPath)) }, null, 2) + '\n');
// `npm run deck` builds the site first, so dist/ holds the PDF from before this run (or none).
// Replace it, so a preview or a publish of this dist/ serves the deck just made.
copyFileSync(pdfPath, join(root, 'dist', 'croftweaver-why.pdf'));
console.log(`deck: wrote ${pdfPath} (${slideCount} slides) and ${lockPath}.`);
