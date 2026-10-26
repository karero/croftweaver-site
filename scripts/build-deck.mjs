#!/usr/bin/env node
// Makes the slide decks listed in scripts/decks.mjs (the /why case, README step 5a, and the deck
// for companies), or checks that their PDFs are current.
//
//   npm run deck              build the site, then remake each deck whose PDF is not current
//   node scripts/build-deck.mjs --check
//                             no browser: fail unless every deck's PDF matches its source
//   --deck why|company        remake that deck even if it is current
//   --out <folder>            write the PDFs there and touch no lock (every deck, or the one named)
//
// The slides come from the built pages in dist/, so a figure on a page is a figure in a deck. Each
// deck's lock file holds two hashes: the slides' HTML and the PDF's bytes. tests/seo.spec.ts runs
// --check, so a run turns red when either no longer matches. The check compares hashes; it does not
// open the PDF. Needs Node 22.18 or newer (it imports src/config.ts) and, to make a PDF, Python 3
// with pypdf for the doc-title (the same tool as scripts/set_pdf_title.py).
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DECKS, checkDeck, decksToMake, sha } from './decks.mjs';
import { overflowingSlides } from './deck-slides.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const logoPath = join(root, 'src', 'assets', 'brand', 'lockup-horizontal-theme.svg');
const fail = (message) => { console.error(`deck: ${message}`); process.exit(1); };
const arg = (flag) => {
  const i = process.argv.indexOf(flag);
  if (i === -1) return null;
  const value = process.argv[i + 1];
  if (!value || value.startsWith('--')) fail(`${flag} needs a value.`);
  return value;
};

// src/config.ts is TypeScript. A Node with type stripping off or missing (too old, or run with
// --no-experimental-strip-types) would stop here with "unknown file extension"; say what is needed.
if (!process.features.typescript) fail(`this script imports src/config.ts, so it needs a Node that runs TypeScript files unaided (22.18 or newer). This is Node ${process.versions.node}.`);
const { SITE, COMPANY } = await import('../src/config.ts');

const known = ['--check', '--deck', '--out'];
const unknown = process.argv.slice(2).filter((a, i, all) => a.startsWith('-') ? !known.includes(a) : !['--deck', '--out'].includes(all[i - 1]));
if (unknown.length) fail(`unknown argument ${unknown.join(' ')}; the options are --check, --deck <name>, --out <folder>.`);
const named = arg('--deck');
if (named && !DECKS.some((d) => d.name === named)) fail(`there is no deck "${named}"; the decks are ${DECKS.map((d) => d.name).join(', ')}.`);
const out = arg('--out');

const dist = (name) => {
  const path = join(root, 'dist', name);
  if (!existsSync(path)) fail(`dist/${name} is missing. Run \`npm run build\` first (\`npm run deck\` does).`);
  return readFileSync(path, 'utf8');
};
const readOrNull = (path, encoding) => (existsSync(join(root, path)) ? readFileSync(join(root, path), encoding) : null);
const logoSvg = readFileSync(logoPath, 'utf8');
// Remaking one named deck reads only its own pages, so a reshaped page another deck reads does not block it.
const wanted = named && !process.argv.includes('--check') ? DECKS.filter((d) => d.name === named) : DECKS;
const results = wanted.map((deck) => {
  const built = deck.make({ dist, site: SITE, company: COMPANY, logoSvg });
  const problem = checkDeck({ deck, html: built.html, lockText: readOrNull(deck.lock, 'utf8'), pdfBytes: readOrNull(deck.pdf) });
  return { deck, built, problem };
});

if (process.argv.includes('--check')) {
  for (const r of results) console[r.problem ? 'error' : 'log'](`deck ${r.deck.name}: ${r.problem ?? `current (${r.built.slideCount} slides).`}`);
  process.exit(results.some((r) => r.problem) ? 1 : 0);
}

const todo = out ? results.filter((r) => !named || r.deck.name === named) : decksToMake(results, named);
if (todo.length === 0) {
  console.log('deck: every deck is current; nothing to make.');
  process.exit(0);
}

// Every deck is rendered and measured before any file is written, so a slide that is too long in
// one deck leaves every PDF and lock as it was.
const { chromium } = await import('@playwright/test');
const browser = await chromium.launch();
const made = [];
try {
  for (const { deck, built } of todo) {
    const pdfPath = out ? join(resolve(out), basename(deck.pdf)) : join(root, deck.pdf);
    const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
    await page.setContent(built.html, { waitUntil: 'load' });
    // Measure the layout that gets printed: page.pdf() renders with print media.
    await page.emulateMedia({ media: 'print' });
    // Text that runs past its slide is the layout bug nothing else would catch.
    const overflowing = await page.evaluate(overflowingSlides);
    if (overflowing.length) fail(`the ${deck.name} deck: text runs past the edge of slide ${overflowing.join(', ')}. Shorten it or make the type smaller in its slide script.`);
    const bytes = await page.pdf({ preferCSSPageSize: true, printBackground: true, tagged: true, outline: true });
    await page.close();
    made.push({ deck, built, pdfPath, bytes });
  }
} finally {
  await browser.close();
}
for (const { pdfPath, bytes } of made) {
  mkdirSync(dirname(pdfPath), { recursive: true });
  writeFileSync(pdfPath, bytes);
}

// The doc-title is what search results print for a hosted PDF; tests/seo.spec.ts checks it.
function setTitle(pdfPath, title) {
  for (const [cmd, pre] of [['python3', []], ['py', ['-3']], ['python', []]]) {
    const run = spawnSync(cmd, [...pre, join(root, 'scripts', 'set_pdf_title.py'), pdfPath, title, '--author', SITE.name], { stdio: 'inherit' });
    if (run.error?.code === 'ENOENT') continue;
    if (run.status !== 0) fail('scripts/set_pdf_title.py failed (it needs pypdf: python3 -m pip install pypdf).');
    return;
  }
  fail('no Python interpreter found (tried python3, py -3, python); the PDF needs its doc-title.');
}

for (const { deck, built, pdfPath } of made) {
  setTitle(pdfPath, built.title);
  if (!out) {
    writeFileSync(join(root, deck.lock), JSON.stringify({ source: sha(built.html), pdf: sha(readFileSync(pdfPath)) }, null, 2) + '\n');
    // `npm run deck` builds the site first, so dist/ holds the PDF from before this run (or none).
    // Replace it, so a preview or a publish of this dist/ serves the deck just made.
    if (deck.served) copyFileSync(pdfPath, join(root, 'dist', basename(deck.pdf)));
  }
  console.log(`deck ${deck.name}: wrote ${pdfPath} (${built.slideCount} slides)${out ? '' : ` and ${deck.lock}`}.`);
}
