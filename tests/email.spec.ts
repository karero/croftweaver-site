import { test, expect, type APIRequestContext } from '@playwright/test';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { PAGES, THEMES } from './_helpers';

// Anti-harvest guardrail: the SERVED HTML of every page must contain no plaintext
// email address and no `mailto:` link. Addresses go through <EmailLink>, which
// obfuscates at build time and reassembles the mailto in the browser (the decode
// script is inline in the page; it carries no address). Catches an accidental raw
// address before scrapers do. Fetches the raw HTML (no JS), which is what a bot sees.
// The bare string "mailto:" from EmailLink's reassembly script is fine — it carries
// no address; we flag a harvestable ADDRESS (including one inside a mailto: link).
// The negative lookahead skips asset-style names like "team@2x.webp" (an image
// filename, not an address) — a real TLD is never an image/asset extension.
const EMAIL = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.(?!(?:png|jpe?g|gif|webp|avif|svg|ico|css|js|mjs|json|xml|txt|woff2?)\b)[A-Za-z]{2,}/;

for (const path of PAGES) {
  test(`email — ${path} ships no harvestable address`, async ({ request, baseURL }) => {
    const html = await (await request.get(new URL(path, baseURL!).href)).text();
    const m = html.match(EMAIL);
    expect(m?.[0] ?? null, `${path} ships a plaintext email "${m?.[0]}" — use <EmailLink>`).toBeNull();
  });
}

// The imprint's phone number goes through <PhoneNumber>, which hides it the same way.
// These tests belong to this site, not to the toolkit's template. The imprint must still
// show the number to a person (it is a legal contact channel), so both halves are checked:
// no built page carries this number in a form a simple scraper can read, and a browser
// shows it in both themes. They do not look for other phone numbers, and like the email
// check they do not stop a scraper that runs a page's scripts. The tests never hold the
// number: they decode what the imprint carries, as the browser does.
const imprintPhone = async (request: APIRequestContext, baseURL: string) => {
  const html = await (await request.get(new URL('/imprint', baseURL).href)).text();
  const encoded = html.match(/data-phone="([^"]+)"/)?.[1];
  expect(encoded, '/imprint has no <PhoneNumber>; its phone number must go through that component').toBeTruthy();
  const number = Buffer.from(encoded!, 'base64').toString('utf-8').split('').reverse().join('');
  expect(number.replace(/\D/g, '').length, `"${number}" does not decode to a phone number`).toBeGreaterThanOrEqual(8);
  return number;
};

test("email — the imprint's phone number is in no built page's HTML", async ({ request, baseURL }) => {
  const number = await imprintPhone(request, baseURL!);
  const digits = number.replace(/\D/g, '');
  const lastGroup = number.split(' ').pop()!;
  // The last 8 digits also catch a national form; a long last group needs no separator at all.
  const tails = [digits.slice(-8), ...(lastGroup.length >= 6 ? [lastGroup] : [])];

  // What a scraper can undo: numeric entities (decoded), named entities, and anything
  // between the digits that is neither a letter nor a digit; with the tags (a number in
  // an attribute) and without them (a number split by markup).
  const codePoint = (n: number) => (n <= 0x10ffff ? String.fromCodePoint(n) : '');
  const squeeze = (s: string) =>
    s
      .replace(/&#x([0-9a-f]+);?/gi, (_, hex) => codePoint(parseInt(hex, 16)))
      .replace(/&#(\d+);?/g, (_, dec) => codePoint(Number(dec)))
      .replace(/&(?:nbsp|shy);?|&[a-z][a-z0-9]*;/gi, '')
      .replace(/[^\p{L}\p{N}]/gu, '');

  // Every HTML file of the build, 404.html included: PAGES lists routes, not files.
  const dist = join(process.cwd(), 'dist');
  const files = (readdirSync(dist, { recursive: true }) as string[]).filter((f) => f.endsWith('.html'));
  expect(files.length, 'dist/ holds no HTML file').toBeGreaterThanOrEqual(PAGES.length);
  for (const file of files) {
    const html = readFileSync(join(dist, file), 'utf8');
    for (const view of [squeeze(html), squeeze(html.replace(/<[^>]*>/g, ''))]) {
      const found = tails.some((tail) => view.includes(tail));
      expect(found, `dist/${file} ships the imprint's phone number in plaintext — use <PhoneNumber> only`).toBe(false);
    }
  }
});

for (const theme of THEMES) {
  test(`email — a browser shows the imprint's phone number [${theme}]`, async ({ page, request, baseURL }) => {
    const number = await imprintPhone(request, baseURL!);
    await page.addInitScript((t) => {
      try { localStorage.setItem('theme', t); } catch (e) { /* ignore */ }
    }, theme);
    await page.goto('/imprint');
    const shown = page.locator('.phone-number');
    await expect(shown).toHaveText(number);
    await expect(shown, 'the phone number is on the imprint but hidden').toBeVisible();
    await expect(shown, 'the phone number is on the imprint but transparent').toHaveCSS('opacity', '1');
    await expect(shown).toHaveAttribute('href', `tel:${number.replace(/ /g, '')}`);
    await expect(page.locator('.phone-number[data-phone]')).toHaveCount(0);
  });
}

// Site-specific: a click on an email address reports one "Email Tap" event, and the address is never part of
// it. window.plausible is the live build's stub, so the test stands one in. A page without it must not break.
type Tapped = Window & { __tap?: unknown[][]; plausible?: (...args: unknown[]) => void };
test('email — a click on an email address reports one "Email Tap" event and no address', async ({ page }) => {
  await page.addInitScript(() => {
    const w = window as Tapped;
    w.__tap = [];
    w.plausible = (...args: unknown[]) => { w.__tap!.push(args); };
  });
  await page.goto('/privacy');
  await page.evaluate(() => document.addEventListener('click', (e) => e.preventDefault(), true));
  const link = page.locator('a.email-link').first();
  await expect(link, 'the link is not assembled into a mailto').toHaveAttribute('href', /^mailto:/);
  await link.click();
  const calls = await page.evaluate(() => (window as Tapped).__tap);
  expect(calls).toEqual([['Email Tap']]);
  expect(JSON.stringify(calls), 'the event carries an address').not.toContain('@');
});

test('email — a click on an email address does nothing and breaks nothing without the stub', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/privacy');
  await page.evaluate(() => document.addEventListener('click', (e) => e.preventDefault(), true));
  await page.locator('a.email-link').first().click();
  expect(errors).toEqual([]);
});
