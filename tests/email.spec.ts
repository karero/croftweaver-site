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
// The imprint must still show the number to a person (it is a legal contact channel), so
// both halves are checked: a scraper reading the HTML finds no digits, a browser shows
// them. The test never holds the number: it decodes what the page carries, as the browser does.
test('email — /imprint ships no harvestable phone number, and a browser shows it', async ({ page, request, baseURL }) => {
  const html = await (await request.get(new URL('/imprint', baseURL!).href)).text();
  const encoded = html.match(/data-phone="([^"]+)"/)?.[1];
  expect(encoded, '/imprint has no <PhoneNumber>; its phone number must go through that component').toBeTruthy();
  const number = Buffer.from(encoded!, 'base64').toString('utf-8').split('').reverse().join('');
  const digits = number.replace(/\D/g, '');
  expect(digits.length, `"${number}" does not decode to a phone number`).toBeGreaterThanOrEqual(8);
  // A scraper can drop the spaces, dots, dashes and brackets a number is written with.
  const flat = html.replace(/[\s().\/-]/g, '');
  expect(flat.includes(digits.slice(-8)), '/imprint ships its phone number in plaintext — use <PhoneNumber> only').toBe(false);

  await page.goto('/imprint');
  await expect(page.locator('.phone-number')).toHaveText(number);
  await expect(page.locator('.phone-number[data-phone]')).toHaveCount(0);
});
