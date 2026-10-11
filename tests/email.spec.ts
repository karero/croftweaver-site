import { test, expect } from '@playwright/test';
import { PAGES } from './_helpers';

// Anti-harvest guardrail: the SERVED HTML of every page must contain no plaintext
// email address and no `mailto:` link. Addresses go through <EmailLink>, which
// obfuscates at build time and reassembles the mailto in the browser (the decode
// logic lives in an external bundle, not the page HTML). Catches an accidental raw
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
// This test belongs to this site, not to the toolkit's template. The imprint must still
// show the number to a person (it is a legal contact channel), so both halves are checked:
// a scraper reading the HTML of any page does not find this number, and a browser shows it.
// It does not look for other phone numbers. The test never holds the number: it decodes
// what the page carries, as the browser does.
test('email — the imprint\'s phone number is in no page\'s HTML, and a browser shows it', async ({ page, request, baseURL }) => {
  const fetchHtml = async (path: string) => (await request.get(new URL(path, baseURL!).href)).text();
  const encoded = (await fetchHtml('/imprint')).match(/data-phone="([^"]+)"/)?.[1];
  expect(encoded, '/imprint has no <PhoneNumber>; its phone number must go through that component').toBeTruthy();
  const number = Buffer.from(encoded!, 'base64').toString('utf-8').split('').reverse().join('');
  const digits = number.replace(/\D/g, '');
  const lastGroup = number.split(' ').pop()!;
  expect(digits.length, `"${number}" does not decode to a phone number`).toBeGreaterThanOrEqual(8);
  expect(lastGroup.length, `"${number}" ends in a group too short to search for`).toBeGreaterThanOrEqual(6);

  // What a scraper can undo: numeric entities, then named entities (&nbsp;), spaces, dots,
  // slashes, brackets and dashes between the digits; with the tags (a number in an
  // attribute) and without them (a number split by markup).
  const squeeze = (s: string) =>
    s
      .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
      .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(Number(dec)))
      .replace(/&\w+;|[\s().\/\-‐-―]/g, '');
  for (const path of PAGES) {
    const html = await fetchHtml(path);
    for (const view of [squeeze(html), squeeze(html.replace(/<[^>]*>/g, ''))]) {
      // The last group needs no separator at all; the longer run also catches a national form.
      const found = view.includes(lastGroup) || view.includes(digits.slice(-8));
      expect(found, `${path} ships the imprint's phone number in plaintext — use <PhoneNumber> only`).toBe(false);
    }
  }

  await page.goto('/imprint');
  const shown = page.locator('.phone-number');
  await expect(shown).toHaveText(number);
  await expect(shown, 'the phone number is on the imprint but hidden').toBeVisible();
  await expect(shown).toHaveAttribute('href', `tel:${number.replace(/ /g, '')}`);
  await expect(page.locator('.phone-number[data-phone]')).toHaveCount(0);
});
