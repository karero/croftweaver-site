import { test, expect } from '@playwright/test';
import { PAGES } from './_helpers';
import { SITE, COMPANY, ogLocaleFor } from '../src/config';
import { plain } from '../src/data/established-faq';
import { readdirSync, readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import { makeDeck } from '../scripts/deck-slides.mjs';

// SEO contract + tag-consistency guardrail. Base.astro derives <title>, OG,
// Twitter, canonical and the WebPage schema from a single (title, description)
// pair plus the URL path, so they MUST stay in lockstep. Read via the DOM, not
// raw HTML: the browser decodes entities, so a title with "&" compares equal —
// we test the value the way a crawler sees it.

// Limits — keep in sync with the website-seo-geo skill (120 is a hard floor).
const TITLE_MAX = 60, DESC_MAX = 160, DESC_MIN = 120;

async function meta(page: import('@playwright/test').Page, sel: string) {
  return page.locator(sel).getAttribute('content');
}

// Dep-free image dimensions from the raw bytes (PNG IHDR / JPEG SOF marker), so we
// can assert the og:image is really 1200×630 without an image library — mirroring
// the PDF byte-parsing below.
function imageSize(b: Buffer): { w: number; h: number } | null {
  if (b.length > 24 && b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) {
    return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) }; // PNG IHDR
  }
  if (b.length > 4 && b[0] === 0xff && b[1] === 0xd8) {       // JPEG
    let o = 2;
    while (o + 9 < b.length) {
      if (b[o] !== 0xff) { o++; continue; }
      const m = b[o + 1];
      // SOF markers carry the frame size (skip C4=DHT, C8=JPG-ext, CC=DAC)
      if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc) {
        return { h: b.readUInt16BE(o + 5), w: b.readUInt16BE(o + 7) };
      }
      o += 2 + b.readUInt16BE(o + 2); // jump to the next marker segment
    }
  }
  return null;
}

// The real image format from the magic bytes, to enforce og-images rule 3 / BRAND.md
// ("extension must match the bytes"): a PNG renamed .jpg trips strict scrapers.
function imageType(b: Buffer): 'png' | 'jpeg' | null {
  if (b.length > 3 && b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return 'png';
  if (b.length > 1 && b[0] === 0xff && b[1] === 0xd8) return 'jpeg';
  return null;
}

// The default share card (Base.astro's default `image`). Keep in sync with Base.astro.
const DEFAULT_OG_CARD = '/images/og/default.jpg';
// Pages allowed to use the default card instead of their own per-page card. Everything
// else MUST have a dedicated /images/og/<slug>.jpg card — a CONTENT page silently sharing
// the generic default is the failure this guards. Opt-OUT model: as you add content pages
// (uncomment them in _helpers PAGES), do NOT list them here, and the guard makes sure each
// gets its own card. The starter ships only '/', '/privacy' + '/impressum', so it stays green from commit 1.
//   - '/'          home: the default card IS the home card.
//   - '/privacy'   legal/utility — nobody shares it with a custom preview.
//   - '/impressum' legal/utility — same reasoning as /privacy.
// (A noindex 404 isn't here: it's excluded from PAGES entirely, so the guard never runs on it.)
const OWN_CARD_EXEMPT = new Set<string>(['/', '/privacy', '/imprint']);

for (const path of PAGES) {
  test(`seo — head contract on ${path}`, async ({ page }) => {
    await page.goto(path);

    const title = await page.title();
    const description = (await meta(page, 'meta[name="description"]')) ?? '';
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');

    expect(title.length, '<title> must not be empty').toBeGreaterThan(0);
    expect(title.length, `<title> "${title}" is ${title.length} chars > ${TITLE_MAX}`).toBeLessThanOrEqual(TITLE_MAX);
    expect(description.length, `meta description ${description.length} chars < ${DESC_MIN} (wastes SERP space — the website-seo-geo floor)`).toBeGreaterThanOrEqual(DESC_MIN);
    expect(description.length, `meta description ${description.length} chars > ${DESC_MAX}`).toBeLessThanOrEqual(DESC_MAX);

    // og:locale contract: when config.ogLocaleFor derives a value for the
    // page's lang (mapped base, or any regioned tag), the tag must be present
    // and correct — a German page silently shipping og:locale en_US (or none)
    // is invisible drift otherwise. Languages with no derivation legitimately
    // omit the tag (no assertion). Same function as Base.astro's emission, so
    // the two cannot drift.
    const htmlLang = (await page.locator('html').getAttribute('lang')) ?? '';
    const expectedOgLocale = ogLocaleFor(htmlLang);
    if (expectedOgLocale) {
      expect(await meta(page, 'meta[property="og:locale"]'), `og:locale must match <html lang="${htmlLang}">`).toBe(expectedOgLocale);
    }

    expect(await meta(page, 'meta[property="og:title"]'), 'og:title must equal <title>').toBe(title);
    expect(await meta(page, 'meta[name="twitter:title"]'), 'twitter:title must equal <title>').toBe(title);
    expect(await meta(page, 'meta[property="og:description"]'), 'og:description must equal meta description').toBe(description);
    expect(await meta(page, 'meta[name="twitter:description"]'), 'twitter:description must equal meta description').toBe(description);

    // og:image is the share preview. WhatsApp drops images > ~300 KB and crops
    // anything that isn't 1.91:1, so every page's card must be an ON-SITE 1200×630
    // JPEG/PNG ≤ 300 KB. Read the bytes (not the URL) — generate cards with `npm run og`.
    const ogImage = await meta(page, 'meta[property="og:image"]');
    expect(ogImage, 'og:image missing').toBeTruthy();
    expect(await meta(page, 'meta[name="twitter:image"]'), 'twitter:image must equal og:image').toBe(ogImage);
    // The card must be hosted ON-SITE (og-images: "keep cards on-site in public/ so the
    // repo can verify them") — otherwise a remote/CDN URL whose pathname happens to exist
    // locally would pass the disk check below.
    const ogUrl = new URL(ogImage!, SITE.url);
    expect(ogUrl.origin, `og:image must be hosted on SITE.url (${SITE.url}), not ${ogUrl.origin}`).toBe(new URL(SITE.url).origin);
    const ogPath = ogUrl.pathname;
    const ogFile = join(process.cwd(), 'public', ogPath);
    let ogBytes: Buffer;
    try { ogBytes = readFileSync(ogFile); }
    catch { throw new Error(`og:image ${ogPath} not found in public/ — run \`npm run og\` to generate it`); }
    const ogKb = ogBytes.length / 1024;
    expect(ogKb, `og:image ${ogPath} is ${ogKb.toFixed(0)} KB > 300 (WhatsApp drops the preview)`).toBeLessThanOrEqual(300);
    const dim = imageSize(ogBytes);
    expect(dim, `og:image ${ogPath} is not a readable JPEG/PNG`).toBeTruthy();
    expect(`${dim!.w}×${dim!.h}`, `og:image ${ogPath} must be 1200×630 (1.91:1) — it's ${dim!.w}×${dim!.h}`).toBe('1200×630');
    // Extension must match the bytes (og-images rule 3): a PNG renamed .jpg trips strict scrapers.
    const extMatch = ogPath.toLowerCase().match(/\.(png|jpe?g)$/);
    expect(extMatch, `og:image ${ogPath} must end in .png/.jpg/.jpeg`).toBeTruthy();
    const wantType = extMatch![1] === 'png' ? 'png' : 'jpeg';
    expect(imageType(ogBytes), `og:image ${ogPath} has a .${extMatch![1]} extension but its bytes are ${imageType(ogBytes) ?? 'neither PNG nor JPEG'} — extension must match the bytes`).toBe(wantType);

    // Every non-exempt page must have its OWN card, not the generic default.
    if (!OWN_CARD_EXEMPT.has(path)) {
      expect(
        ogPath,
        `${path} has no dedicated OG card (uses the default ${DEFAULT_OG_CARD}). Add it to scripts/generate_og_cards.py PAGES + set image="/images/og/<slug>.jpg" on the page, or add ${path} to OWN_CARD_EXEMPT.`,
      ).not.toBe(DEFAULT_OG_CARD);
    }

    expect(canonical, 'canonical missing').toBeTruthy();
    expect(await meta(page, 'meta[property="og:url"]'), 'og:url must equal canonical').toBe(canonical);
    // canonical is always the PRODUCTION URL (Astro.site), even when previewing on
    // localhost — compare to SITE.url, not the runtime origin.
    // decodeURI both sides: a non-ASCII route (/über-uns) percent-encodes in the
    // browser-read canonical but not in PAGES — comparing raw strings produces a
    // look-identical failure. (ASCII slugs stay the house rule — site-architecture,
    // website-seo-geo — this just makes the failure mode honest, not the rule.)
    expect(decodeURI(canonical ?? ''), 'canonical must be the absolute production URL for this path').toBe(decodeURI(`${SITE.url}${path}`));

    await expect(page.locator('h1'), 'each page must have exactly one <h1>').toHaveCount(1);

    const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
    expect(blocks.length, 'page should emit JSON-LD (WebPage/Organization/WebSite)').toBeGreaterThan(0);
    for (const b of blocks) expect(() => JSON.parse(b), 'JSON-LD must parse').not.toThrow();
  });
}

// The structured data keeps three things apart: the operator (an Organization, M-Squad GmbH),
// this website, and the software (Croftweaver). Owner decision, 2026-10-13, and this site's own
// test: the starter does not have it. The starter's layout gives the Organization the site's name
// as alternateName and the site's description, which is right where a site is the company's own
// and wrong here: Croftweaver is a product, not a trading name, so the markup would say that the
// company IS the toolkit. This fails if a sync of the layout brings that back, or if a node that
// another node points at goes missing.
type Node = Record<string, any>;
async function jsonLd(page: import('@playwright/test').Page): Promise<Node[]> {
  return (await page.locator('script[type="application/ld+json"]').allTextContents()).map((b) => JSON.parse(b));
}
const one = (nodes: Node[], type: string): Node => {
  const found = nodes.filter((n) => n['@type'] === type);
  expect(found.length, `exactly one ${type} node`).toBe(1);
  return found[0]!;
};
// Every { "@id": … } that stands alone is a reference to a node described somewhere else.
const references = (value: unknown): string[] => {
  if (Array.isArray(value)) return value.flatMap(references);
  if (!value || typeof value !== 'object') return [];
  const node = value as Node;
  const keys = Object.keys(node);
  if (keys.length === 1 && keys[0] === '@id') return [node['@id']];
  return keys.flatMap((k) => references(node[k]));
};
const SOFTWARE_ID = `${SITE.url}/#software`;

test('seo — structured data keeps the operator, the website and the software apart', async ({ page }) => {
  await page.goto('/');
  const nodes = await jsonLd(page);

  const org = one(nodes, 'Organization');
  expect(org.name, 'the Organization is the operator named in the imprint').toBe(COMPANY.legalName);
  expect(org.url, "the operator's address is the company's own site, not this one").toBe(COMPANY.url);
  for (const key of ['alternateName', 'description', 'logo']) {
    expect(org[key], `the Organization must not carry "${key}": on this site that would be a fact about the product`).toBeUndefined();
  }
  expect(org.sameAs ?? [], "the toolkit's repository identifies the software, not the company").not.toContain(SITE.repo);

  const software = one(nodes, 'SoftwareSourceCode');
  expect(software['@id'], 'the software has its own identifier, and it must not change once published').toBe(SOFTWARE_ID);
  expect(software['@id']).not.toBe(org['@id']);
  expect(software.name).toBe(SITE.name);
  expect(software.codeRepository).toBe(SITE.repo);

  const website = one(nodes, 'WebSite');
  expect(website.publisher?.['@id'], 'the operator publishes the website').toBe(org['@id']);
  expect(website.about?.['@id'], 'the website is about the software').toBe(SOFTWARE_ID);
  expect(one(nodes, 'WebPage').mainEntity?.['@id'], 'the home page is mainly about the software').toBe(SOFTWARE_ID);

  const person = one(nodes, 'Person');
  expect(software.author?.['@id'], 'the author is the Person node on the page').toBe(person['@id']);
  expect(software.maintainer?.['@id']).toBe(person['@id']);
  expect(person.worksFor?.['@id']).toBe(org['@id']);
  await expect(page.locator(new URL(person.url).hash), "the Person's address is a section of this page").toHaveCount(1);

  const described = new Set(nodes.map((n) => n['@id']).filter(Boolean));
  for (const ref of references(nodes)) expect(described.has(ref), `"${ref}" is pointed at, so a node on the home page must describe it`).toBe(true);
});

// Off the home page the software node is not repeated. The one reference to it must use the
// same identifier, and the operator's node must be the same as on the home page.
test('seo — every page describes the same operator and points at the same software', async ({ page }) => {
  await page.goto('/');
  const home = one(await jsonLd(page), 'Organization');
  for (const path of PAGES.filter((p) => p !== '/')) {
    await page.goto(path);
    const nodes = await jsonLd(page);
    expect(one(nodes, 'Organization'), `the Organization on ${path}`).toEqual(home);
    expect(one(nodes, 'WebSite').about?.['@id'], `WebSite.about on ${path}`).toBe(SOFTWARE_ID);
    expect(one(nodes, 'WebPage').mainEntity, `${path} is not mainly about the software`).toBeUndefined();
  }
});

// FAQPage markup must state what the page shows: that is Google's rule for FAQ markup, and the reason
// a machine can trust it. Every question in the markup is a heading on the page, and its answer text is
// the text of the element right after that heading, word for word. A page without FAQPage markup passes.
async function faqMarkup(page: import('@playwright/test').Page) {
  const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
  return blocks.map((b) => JSON.parse(b)).filter((o) => o['@type'] === 'FAQPage');
}

for (const path of PAGES) {
  test(`seo — FAQPage markup matches the visible questions on ${path}`, async ({ page }) => {
    await page.goto(path);
    const faqs = await faqMarkup(page);
    expect(faqs.length, 'a page may carry only one FAQPage').toBeLessThanOrEqual(1);
    for (const faq of faqs) {
      expect(faq.mainEntity.length, 'FAQPage markup should hold at least one question').toBeGreaterThan(0);
      for (const q of faq.mainEntity) {
        const shown = await page.evaluate((name: string) => {
          const h = [...document.querySelectorAll('h2, h3, h4, h5, h6')].find((el) => el.textContent?.trim() === name);
          if (!h) return null;
          return ((h.nextElementSibling as HTMLElement | null)?.innerText ?? '').replace(/\s+/g, ' ').trim();
        }, q.name);
        expect(shown, `question "${q.name}" must be a heading on ${path}`).not.toBeNull();
        expect(q.acceptedAnswer.text.length, `the markup answer to "${q.name}" must not be empty`).toBeGreaterThan(0);
        expect(q.acceptedAnswer.text, `the markup answer to "${q.name}" must be the answer shown right after its heading`).toBe(shown);
      }
    }
  });
}

// plain() turns an answer's HTML into the text of the FAQPage markup. The cases below are ones that
// went wrong: a line break joined two words, and entities were left encoded or decoded twice.
test('seo — plain() keeps line breaks apart and decodes each entity once', () => {
  expect(plain('<p>A<br>B</p>')).toBe('A B');
  expect(plain('<p>One</p><ul><li>Two</li><li>Three</li></ul>')).toBe('One Two Three');
  expect(plain('Q&amp;A, it&#39;s &quot;fine&quot; &copy; 2026&nbsp;ok')).toBe('Q&A, it\'s "fine" © 2026 ok');
  expect(plain('&#38;quot; stays text, &#x41; is A')).toBe('&quot; stays text, A is A');
});

// The check above passes for a page with no FAQ markup, so a deleted schema would quietly drop the
// coverage. /established-sites carries its questions in markup: the same questions as the visible ones,
// in the same order, each once, so a missing question fails here, and so does one copied into the data twice
// (the markup and the page would repeat it together, and the comparison alone would pass).
test('seo — /established-sites keeps its FAQPage markup, the same questions as the visible ones', async ({ page }) => {
  await page.goto('/established-sites');
  const [faq] = await faqMarkup(page);
  expect(faq, '/established-sites must carry FAQPage markup').toBeTruthy();
  const visible = (await page.locator('#faq h4').allTextContents()).map((q) => q.trim());
  expect(new Set(visible).size, 'a question appears twice in the FAQ').toBe(visible.length);
  expect(faq.mainEntity.map((q: { name: string }) => q.name)).toEqual(visible);
});

// "Its own" means DISTINCT: two non-exempt pages pointing at the same card is a wiring
// copy-paste error (the share preview would misrepresent one of them). No-op until the
// scaffold grows past its exempt starter pages.
test('every non-exempt page has a DISTINCT og:image card', async ({ page }) => {
  const seen = new Map<string, string>();
  for (const path of PAGES) {
    if (OWN_CARD_EXEMPT.has(path)) continue;
    await page.goto(path);
    const og = new URL((await meta(page, 'meta[property="og:image"]'))!, SITE.url).pathname;
    const prev = seen.get(og);
    expect(prev, `${path} and ${prev} share the same OG card (${og}) — each page needs its own`).toBeUndefined();
    seen.set(og, path);
  }
});

// Drift alarm: the sitemap is built from src/pages/**, PAGES is hand-maintained.
// If they differ, a page was added without a PAGES entry — and EVERY suite
// (a11y/seo/navigation/images/tone/email) would silently skip it. noindex pages:
// exclude them from the sitemap (filter in astro.config.mjs) AND from PAGES.
test('sitemap matches PAGES (drift alarm)', async ({ request, baseURL }) => {
  const idx = await request.get(`${baseURL}/sitemap-index.xml`);
  expect(idx.status(), 'sitemap-index.xml should exist (@astrojs/sitemap)').toBe(200);
  const children = [...(await idx.text()).matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  expect(children.length, 'sitemap index should reference at least one sitemap').toBeGreaterThan(0);

  const built: string[] = [];
  for (const child of children) {
    // The <loc> values carry the production origin; fetch via the preview server.
    const res = await request.get(new URL(new URL(child).pathname, baseURL!).href);
    expect(res.status(), `child sitemap ${child} should fetch (otherwise the comparison below lies)`).toBe(200);
    const xml = await res.text();
    for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
      const p = decodeURI(new URL(m[1]).pathname); // non-ASCII routes: compare decoded (see canonical note)
      built.push(p === '/' ? '/' : p.replace(/\/$/, ''));
    }
  }
  expect(
    built.sort(),
    'sitemap pages ≠ PAGES — add the new route to tests/_helpers.ts PAGES (or remove the stale entry)',
  ).toEqual([...PAGES].sort());
});

// Twin-page hreflang reciprocity (the LIGHT i18n path — Base.astro's `alternates`
// prop; the heavy locale-prefix path gets the fuller tests/i18n.spec.ts from the
// astro-i18n-setup skill instead). Opt-in: pages without `alternates` emit no
// hreflang and are skipped, so this is a no-op until a page opts in. Three rules:
//   • self — the cluster must contain an entry equal to the page's own canonical
//   • no dead targets — a same-site alternate must be a PAGES route (the sitemap
//     drift alarm guarantees PAGES is complete, so "same-site but not in PAGES"
//     is always a typo'd href, not a skip)
//   • reciprocity — the target page must link back to this page's canonical
//     (one-sided clusters are IGNORED by Google and shipped silently — the
//     exact live bug this check exists to prevent)
test('twin-page hreflang alternates are self-consistent and reciprocal', async ({ page }) => {
  type Alt = { hreflang: string; href: string };
  const seen = new Map<string, { alts: Alt[]; canonical: string | null }>();
  for (const path of PAGES) {
    await page.goto(path);
    const alts: Alt[] = await page.$$eval('link[rel="alternate"][hreflang]', (els) =>
      els.map((e) => ({ hreflang: e.getAttribute('hreflang') || '', href: e.getAttribute('href') || '' })),
    );
    if (!alts.length) continue; // page doesn't use the twin-pages pattern
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
    seen.set(path, { alts, canonical });
  }
  if (!seen.size) return; // no page on this site opts in

  // encodeURI: DOM hrefs come back percent-encoded for non-ASCII routes (see
  // the canonical note above) — key the lookup the same way.
  const urlToPath = new Map(PAGES.map((p) => [encodeURI(p === '/' ? `${SITE.url}/` : `${SITE.url}${p}`), p]));
  for (const [path, { alts, canonical }] of seen) {
    expect(
      alts.some((a) => a.href === canonical),
      `${path}: alternates must include a self-referencing entry equal to the canonical (${canonical})`,
    ).toBe(true);
    // One entry per hreflang code — duplicates send crawlers conflicting signals.
    const codes = alts.map((a) => a.hreflang);
    expect(codes.length, `${path}: duplicate hreflang codes in the cluster (${codes.join(', ')})`).toBe(new Set(codes).size);
    // x-default must exist and repeat one of the cluster's locale entries — a
    // missing/typo'd x-default otherwise ships unvalidated (reciprocity skips it).
    const xd = alts.find((a) => a.hreflang === 'x-default');
    expect(xd, `${path}: cluster has no x-default entry (pass one in alternates)`).toBeDefined();
    expect(
      alts.some((a) => a.hreflang !== 'x-default' && a.href === xd?.href),
      `${path}: x-default (${xd?.href}) must equal one of the cluster's locale entries`,
    ).toBe(true);
    for (const a of alts) {
      if (a.hreflang === 'x-default') continue; // validated above; reciprocity covers its target transitively
      if (!a.href.startsWith(SITE.url)) continue; // external target: out of scope
      const target = urlToPath.get(a.href);
      expect(
        target,
        `${path}: alternate "${a.hreflang}" → ${a.href} is same-site but not a PAGES route — typo'd href?`,
      ).toBeDefined();
      const targetAlts = seen.get(target!)?.alts ?? [];
      expect(
        targetAlts.some((b) => b.href === canonical),
        `${path}: alternate "${a.hreflang}" → ${a.href} does not link back — ` +
          `${target} declares no alternate pointing at ${canonical} (non-reciprocal hreflang; ` +
          `add the full cluster to BOTH twins' <Base alternates={…}>)`,
      ).toBe(true);
    }
  }
});

// The crawlers a whole-site block shuts the site to search for: everyone (`*`), the search
// engines and the AI search bots. A group for training bots only (GPTBot, ClaudeBot,
// Google-Extended) is the owner's choice and does not fail the guard below.
const SEARCH_CRAWLERS = ['*', 'googlebot', 'bingbot', 'oai-searchbot', 'claude-searchbot', 'perplexitybot'];

// The search crawlers a robots.txt closes the whole site to. Lines end at CR, LF or CRLF (RFC
// 9309). A group is one or more User-agent lines followed by its Allow and Disallow rules, and
// its rules count only for the agents of that group. This is a best-effort smoke test: it
// recognises the two usual whole-site rules, `/` and `/*` (not every spelling that closes the
// site, such as `/**`), and it weighs each group on its own, so a robots.txt that repeats an
// agent in two groups is read as two. Of two whole-site rules the longer pattern wins, and an
// Allow wins a tie (RFC 9309, section 2.2.2). A line that is neither a User-agent nor a rule
// (Sitemap) is skipped and does not end the group.
function wholeSiteBlockedFor(robotsTxt: string): string[] {
  const blocked = new Set<string>();
  let agents: string[] = [];
  let allowLen = 0;
  let disallowLen = 0;
  let inRules = false;
  const endGroup = () => {
    if (disallowLen > allowLen) for (const a of agents) if (SEARCH_CRAWLERS.includes(a)) blocked.add(a);
    agents = [];
    allowLen = 0;
    disallowLen = 0;
    inRules = false;
  };
  for (const raw of robotsTxt.split(/\r\n|\r|\n/)) {
    const m = raw.replace(/#.*/, '').trim().match(/^([A-Za-z-]+)\s*:\s*(.*)$/);
    if (!m) continue;
    const field = m[1].toLowerCase();
    const value = m[2].trim();
    if (field === 'user-agent') {
      if (inRules) endGroup();
      agents.push(value.toLowerCase());
    } else if (field === 'allow' || field === 'disallow') {
      inRules = true;
      if (value === '/' || value === '/*') {
        if (field === 'allow') allowLen = Math.max(allowLen, value.length);
        else disallowLen = Math.max(disallowLen, value.length);
      }
    }
  }
  endGroup();
  return [...blocked];
}

test('robots.txt guard — a whole-site Disallow closes the site for a search crawler, not for a training bot', () => {
  const open = 'User-agent: *\nAllow: /\n';
  expect(wholeSiteBlockedFor(open), 'open').toEqual([]);
  expect(wholeSiteBlockedFor('User-agent: *\nDisallow: /\n'), 'blanket').toEqual(['*']);
  expect(
    wholeSiteBlockedFor(`${open}\nUser-agent: GPTBot\nUser-agent: ClaudeBot\nUser-agent: Google-Extended\nDisallow: /\n`),
    'training bots only',
  ).toEqual([]);
  expect(
    wholeSiteBlockedFor(`${open}\nUser-agent: GPTBot\nUser-agent: OAI-SearchBot\nDisallow: /\n`),
    'a search bot in the group',
  ).toEqual(['oai-searchbot']);
  expect(wholeSiteBlockedFor('User-agent: Googlebot\r\nDisallow: / # closed\r\n'), 'CRLF and a comment').toEqual(['googlebot']);
  expect(wholeSiteBlockedFor('User-agent: Googlebot\rDisallow: /\r'), 'CR only').toEqual(['googlebot']);
  expect(wholeSiteBlockedFor('User-agent: *\nDisallow: /private/\n'), 'a sub-path').toEqual([]);
  expect(wholeSiteBlockedFor('User-agent: *\nDisallow:\n'), 'an empty Disallow').toEqual([]);
  // A rule line ends the group: the Disallow below belongs to GPTBot, not to the * above it.
  expect(wholeSiteBlockedFor('User-agent: *\nAllow: /\nUser-agent: GPTBot\nDisallow: /\n'), 'a new group').toEqual([]);
  expect(wholeSiteBlockedFor('User-agent: *\nSitemap: https://example.com/s.xml\nDisallow: /\n'), 'a Sitemap line').toEqual(['*']);
  // `/*` covers the whole site too; of two whole-site rules the longer pattern wins, an Allow wins a tie.
  expect(wholeSiteBlockedFor('User-agent: *\nDisallow: /*\n'), 'a wildcard').toEqual(['*']);
  expect(wholeSiteBlockedFor('User-agent: *\nDisallow: /\nAllow: /\n'), 'a tie, Disallow first').toEqual([]);
  expect(wholeSiteBlockedFor('User-agent: *\nAllow: /\nDisallow: /\n'), 'a tie, Allow first').toEqual([]);
  expect(wholeSiteBlockedFor('User-agent: *\nAllow: /\nDisallow: /*\n'), 'the longer Disallow').toEqual(['*']);
  expect(wholeSiteBlockedFor('User-agent: *\nAllow: /*\nDisallow: /\n'), 'the longer Allow').toEqual([]);
});

// Indexability guard: the site is useless if a future edit silently closes it to
// crawlers. Cloudflare's "Disable robots.txt configuration" leaves THIS file
// authoritative, so it must stay open and point at the real domain. A blanket
// `Disallow: /` for everyone or for a search crawler (or a llms.txt that 404s) is the
// failure we refuse to ship; a `Disallow: /` for training bots alone is allowed.
test('robots.txt stays open and llms.txt exists', async ({ request, baseURL }) => {
  const robots = await request.get(`${baseURL}/robots.txt`);
  expect(robots.status(), 'public/robots.txt must be served').toBe(200);
  const body = await robots.text();

  expect(
    wholeSiteBlockedFor(body),
    'robots.txt blocks the whole site (Disallow: /) for these search crawlers — crawlers and AI engines can\'t index it',
  ).toEqual([]);

  // Two sources of truth (SITE.url and the static Sitemap line) must agree, or the
  // declared sitemap 404s — the classic "forgot to set the domain before launch".
  // Compare full origin (not just host) so http→https and the like are caught too.
  const sitemap = body.match(/^\s*Sitemap:\s*(\S+)/im)?.[1];
  expect(sitemap, 'robots.txt must declare a Sitemap: line').toBeTruthy();
  expect(
    new URL(sitemap!).origin,
    `robots.txt Sitemap origin ≠ SITE.url origin (${SITE.url}) — update public/robots.txt`,
  ).toBe(new URL(SITE.url).origin);

  const llms = await request.get(`${baseURL}/llms.txt`);
  expect(llms.status(), 'public/llms.txt (the AI answer-engine index) must be served').toBe(200);

  // Once the real domain is set, the llms.txt scaffold must be filled in too —
  // leftover `example.com` means stale placeholder content shipped to crawlers.
  if (new URL(SITE.url).host !== 'example.com') {
    expect(
      (await llms.text()).includes('example.com'),
      'llms.txt still contains example.com placeholders — replace them with real content',
    ).toBe(false);
  }
});

// ── Hosted PDFs: the doc-title IS the search-result title ──────────────────────
// A PDF has no <title>; Bing/Google print its embedded doc-title in results.
// Authoring tools leave a placeholder ("PowerPoint-Präsentation") or a filename
// slug, which Bing flags as "page title too short". Crawlers read the title from
// TWO places — the Info dict /Title and the XMP dc:title — so we check both.
// Set a good one with scripts/set_pdf_title.py. No-op when public/ has no PDFs.
// Dep-free: parses the bytes directly (no PDF library), mirroring website-seo-geo.
const PDF_TITLE_MIN = 15;
const PDF_PLACEHOLDERS = new Set([
  'powerpoint-präsentation', 'powerpoint presentation', 'präsentation', 'präsentation1',
  'presentation1', 'microsoft word', 'untitled', 'folie 1', 'slide 1', 'dokument1', 'keynote',
]);

function findPdfs(dir: string): string[] {
  const out: string[] = [];
  let entries: import('node:fs').Dirent[];
  try { entries = readdirSync(dir, { withFileTypes: true }); } catch { return out; }
  for (const e of entries) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...findPdfs(p));
    else if (e.name.toLowerCase().endsWith('.pdf')) out.push(p);
  }
  return out;
}

function decodeLiteral(s: string): string {
  return s.replace(/\\([nrtbf()\\]|[0-7]{1,3})/g, (_, c) => {
    const map: Record<string, string> = { n: '\n', r: '\r', t: '\t', b: '\b', f: '\f', '(': '(', ')': ')', '\\': '\\' };
    if (c in map) return map[c];
    return String.fromCharCode(parseInt(c, 8) & 0xff); // octal escape → byte
  }).trim();
}

function decodeHex(hex: string): string {
  const bytes = Buffer.from(hex.replace(/\s/g, ''), 'hex');
  if (bytes[0] === 0xfe && bytes[1] === 0xff) {        // UTF-16BE BOM
    const be = bytes.subarray(2);
    const le = Buffer.allocUnsafe(be.length);          // swap pairs → UTF-16LE for Node
    for (let i = 0; i + 1 < be.length; i += 2) { le[i] = be[i + 1]; le[i + 1] = be[i]; }
    return le.toString('utf16le').trim();
  }
  return bytes.toString('latin1').trim();
}

// Every doc-title a crawler might read: Info dict /Title (resolved via the trailer
// /Info ref, so per-page "(Slide N)" structure titles are ignored) + XMP dc:title.
function pdfTitles(buf: Buffer): string[] {
  const titles: string[] = [];
  const utf = buf.toString('utf8');
  const xm = utf.match(/<dc:title>[\s\S]*?<rdf:li[^>]*>([\s\S]*?)<\/rdf:li>/);
  if (xm) titles.push(xm[1].replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').trim());

  const raw = buf.toString('latin1');
  const refs = [...raw.matchAll(/\/Info\s+(\d+)\s+(\d+)\s+R/g)];
  if (refs.length) {
    const [, num, gen] = refs[refs.length - 1];
    const om = raw.match(new RegExp(`(?:^|[^0-9])${num}\\s+${gen}\\s+obj([\\s\\S]*?)endobj`));
    const body = om ? om[1] : '';
    const lit = body.match(/\/Title\s*\(((?:\\.|[^\\()])*)\)/);
    const hex = body.match(/\/Title\s*<([0-9A-Fa-f\s]+)>/);
    if (lit) titles.push(decodeLiteral(lit[1]));
    else if (hex) titles.push(decodeHex(hex[1]));
  }
  return titles.filter(Boolean);
}

test('seo — hosted PDFs carry a descriptive doc-title', () => {
  const pdfs = findPdfs(join(process.cwd(), 'public'));
  for (const file of pdfs) {
    const titles = pdfTitles(readFileSync(file));
    expect(titles.length, `${file}: no readable doc-title (set Info /Title + XMP dc:title via scripts/set_pdf_title.py)`).toBeGreaterThan(0);
    for (const t of titles) {
      expect(PDF_PLACEHOLDERS.has(t.toLowerCase()), `${file}: doc-title is an authoring placeholder ("${t}") — run scripts/set_pdf_title.py`).toBe(false);
      expect(t.length, `${file}: doc-title too short ("${t}", ${t.length} chars, need ≥${PDF_TITLE_MIN})`).toBeGreaterThanOrEqual(PDF_TITLE_MIN);
    }
  }
});

// ── The /why slide deck: public/croftweaver-why.pdf (README step 5a) ───────────
// Made by `npm run deck` from the built /why and /checks pages. A PDF is a frozen copy, and
// /why promises that its figures come from the same data as /proof, so a stale copy must be a
// red run: the first test asks the real script (the command the owner runs) whether the PDF
// still matches its source; the others pin what that check depends on. Files in dist/ are read
// inside the tests, not at load: Playwright loads this file before its web server has built the site.
const distFile = (name: string) => readFileSync(join(process.cwd(), 'dist', name), 'utf8');
const deckFrom = (whyHtml = distFile('why.html'), checksHtml = distFile('checks.html')) =>
  makeDeck({ whyHtml, checksHtml, site: SITE, logoSvg: readFileSync(join(process.cwd(), 'src', 'assets', 'brand', 'lockup-horizontal-theme.svg'), 'utf8') });

test('seo — the /why slide deck still matches the /why and /checks pages it was made from', () => {
  let output = '';
  try {
    output = execFileSync(process.execPath, ['scripts/build-deck.mjs', '--check'], { encoding: 'utf8', stdio: 'pipe' });
  } catch (error) {
    const e = error as { stderr?: string; message: string };
    throw new Error(e.stderr || e.message);
  }
  expect(output).toContain('current');
});

test('seo — /why offers the slide deck and the site serves it', async ({ page, request }) => {
  await page.goto('/why');
  await expect(page.locator('a[href="/croftweaver-why.pdf"]'), '/why has no download link to the deck').toHaveCount(1);
  const response = await request.get('/croftweaver-why.pdf');
  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toContain('application/pdf');
  const body = await response.body();
  expect(body.subarray(0, 5).toString('latin1'), 'the file is not a PDF').toBe('%PDF-');
  expect(body.length, 'the deck is too big to download comfortably').toBeLessThan(2_000_000);
});

test('seo — a changed figure on /why changes the slide deck, which is what makes the PDF check fail', () => {
  const why = distFile('why.html');
  expect(deckFrom().html, 'the deck is not deterministic').toBe(deckFrom().html);
  const changed = why.replace('out of 100 for performance', 'out of 100 for speed');
  expect(changed, '/why no longer says "out of 100 for performance"; update this test').not.toBe(why);
  expect(deckFrom(changed).html).not.toBe(deckFrom().html);
  // Astro stamps every element with a hash of its page's styles; the deck keeps text and links only.
  const restyled = why.replace(/data-astro-cid-[a-z0-9]+/g, 'data-astro-cid-restyled');
  expect(restyled).not.toBe(why);
  expect(deckFrom(restyled).html).toBe(deckFrom().html);
});

test('seo — the slide deck refuses to build when /why or /checks change shape or disagree', () => {
  const why = distFile('why.html');
  const checks = distFile('checks.html');
  expect(() => deckFrom(why.replace('id="evidence"', 'id="gone"'))).toThrow(/evidence section/);
  // Hide the first group of suites on /checks: it then lists fewer than /why claims.
  expect(checks, 'the suites on /checks changed shape; update this test').toContain('class="suites"');
  expect(() => deckFrom(why, checks.replace('class="suites"', 'class="hidden"'))).toThrow(/\/checks lists \d+/);
});

test('seo — every link in the slide deck to this site points at a page that exists', () => {
  const hrefs = [...deckFrom().html.matchAll(/href="([^"]+)"/g)].map((m) => m[1]);
  const own = hrefs.filter((h) => h.startsWith(SITE.url));
  expect(own.length, 'the deck links to no page of this site').toBeGreaterThan(0);
  const known = new Set<string>(PAGES);
  const dead = own.map((h) => h.slice(SITE.url.length).split('#')[0] || '/').filter((p) => !known.has(p));
  expect(dead, `the deck links to pages that are not routes: ${dead.join(', ')}`).toEqual([]);
});
