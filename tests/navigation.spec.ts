import { readdirSync, readFileSync } from 'node:fs';
import { test, expect } from '@playwright/test';
import { PAGES } from './_helpers';
import { SITE, NAV, NAV_LINKS, FOOTER, isNavGroup, type NavLink } from '../src/config';

// Every route in PAGES returns 200, and every internal link on it resolves to a
// 200 with no redirect hop (clean URLs only). Links written as absolute production
// URLs (https://site.tld/about) are internal too — they get the same check.
// Catches dead links and renamed pages before users do.
for (const path of PAGES) {
  test(`navigation — ${path} loads and its internal links resolve`, async ({ page, request, baseURL }) => {
    const res = await page.goto(path);
    expect(res?.status(), `${path} should return 200`).toBe(200);

    const hrefs = await page.locator('a[href]').evaluateAll((as) =>
      as.map((a) => (a as HTMLAnchorElement).getAttribute('href') ?? ''));
    // Absolute URLs on the production host count as internal — including the
    // www./apex variant of it (a www link on an apex-canonical site is almost
    // always a mistake; checking it beats silently skipping it).
    const stripWww = (host: string) => host.replace(/^www\./, '');
    const siteHost = stripWww(new URL(SITE.url).hostname);
    const internal = [...new Set(hrefs)]
      .map((h) => {
        if (!/^https?:\/\//i.test(h)) return h;
        try {
          const u = new URL(h);
          if (stripWww(u.hostname.toLowerCase()) === siteHost) return u.pathname + u.search + u.hash;
        } catch { /* malformed absolute URL — leave it; the filter drops it */ }
        return h;
      })
      .filter((h) => h.startsWith('/') && !h.startsWith('//') && !h.startsWith('/#'));

    for (const href of internal) {
      const url = new URL(href, baseURL).href;
      const r = await request.get(url, { maxRedirects: 0 });
      expect([200, 304], `internal link ${href} returned ${r.status()} (expected 200, no redirect hop)`).toContain(r.status());
    }
  });
}

// Site-specific (not in the shipped suite): /partner-assets. The code a partner pastes must work. Each HTML snippet
// is parsed as HTML, by the browser's own parser in a document that loads nothing: exactly one link, to the home page,
// around the badge image (or around the word "Croftweaver" in the text-only snippet), and the file each snippet
// names is the one its title promises. The HTML points at files on the partner's OWN site (a relative address):
// the template of a Croftweaver site only allows images from itself (Content-Security-Policy), so a link to
// croftweaver.com would show nothing there. Only the Markdown for a README links to this site. Every address
// answers, every image has the kit's description, a loading setting and the size of the file it names, and the
// previews on the page keep the proportions of their files. Each card offers the files its title names, and the
// files offered as DOWNLOADS are exactly the files in public/brand: a new file cannot go unlisted and a listed file
// cannot be missing. (Previews do not count as offers, or the SVG downloads could vanish unnoticed.)
// The snippets the page offers, by title: the format, and the files each one uses. A new snippet needs a line here.
const SNIPPETS: Record<string, { markdown?: true; img?: string; source?: string }> = {
  'Follows light and dark': { img: 'built-with-croftweaver-light.svg', source: 'built-with-croftweaver-dark.svg' },
  'Light badge': { img: 'built-with-croftweaver-light.svg' },
  'Dark badge': { img: 'built-with-croftweaver-dark.svg' },
  'Small badge': { img: 'built-with-croftweaver-small-light.svg' },
  'Markdown': { markdown: true, img: 'built-with-croftweaver-light.svg' },
  'Text only': {},
};
const snippetsOf = (page: import('@playwright/test').Page) => page.locator('#footer-code .snippet').evaluateAll((els) => els.map((e) => ({
  title: (e.querySelector('h3')?.textContent ?? '').trim(),
  note: (e.querySelector('p')?.textContent ?? '').trim(),
  code: e.querySelector('pre code')?.textContent ?? '',
})));

test('partner assets: the code to paste works, and the downloads are exactly the files of the kit', async ({ page, request }) => {
  await page.goto('/partner-assets');
  const origin = new URL(SITE.url).origin;
  const back = `${origin}/?ref=badge`;
  const snippets = await snippetsOf(page);
  expect(snippets.map((s) => s.title).sort(), 'the snippets on the page differ from the ones this test knows').toEqual(Object.keys(SNIPPETS).sort());
  for (const s of snippets) {
    const u = SNIPPETS[s.title]!;
    expect(s.code.trimStart().startsWith('['), `"${s.title}" must be ${u.markdown ? 'Markdown' : 'HTML'}:\n${s.code}`).toBe(!!u.markdown);
    // The note says which files the partner has to save: the HTML points at them on the partner's own site.
    if (!u.markdown) for (const file of [u.img, u.source]) if (file) expect(s.note, `the note of "${s.title}" does not say that it needs ${file}`).toContain(file);
  }
  const markdown = snippets.filter((s) => SNIPPETS[s.title]!.markdown);
  const html = snippets.filter((s) => !SNIPPETS[s.title]!.markdown);
  const parsed = await page.evaluate((codes) => codes.map((code) => {
    const doc = new DOMParser().parseFromString(code, 'text/html');
    return {
      links: [...doc.querySelectorAll('a')].map((a) => ({
        href: a.getAttribute('href'),
        text: (a.textContent ?? '').trim(),
        imgs: [...a.querySelectorAll('img')].map((i) => ({
          src: i.getAttribute('src'), alt: i.getAttribute('alt'), width: i.getAttribute('width'),
          height: i.getAttribute('height'), loading: i.getAttribute('loading'),
        })),
        sources: [...a.querySelectorAll('picture > source')].map((s) => ({ srcset: s.getAttribute('srcset'), media: s.getAttribute('media') })),
      })),
      imgsOutsideLinks: doc.querySelectorAll('img').length - doc.querySelectorAll('a img').length,
    };
  }), html.map((s) => s.code));

  const toFetch = new Set<string>();
  const toMeasure: { src: string; width: string | null; height: string | null }[] = [];
  for (const [n, p] of parsed.entries()) {
    const { title, code } = html[n]!;
    const uses = SNIPPETS[title]!;
    const where = `HTML snippet "${title}":\n${code}`;
    expect(p.links.length, `${where}\nmust hold exactly one link`).toBe(1);
    const link = p.links[0]!;
    expect(link.href, `${where}\ndoes not link to the home page`).toBe(back);
    expect(p.imgsOutsideLinks, `${where}\nhas an image outside the link`).toBe(0);
    if (!uses.img) {
      expect(link.imgs.length, `${where}\nthe text-only snippet must not hold an image`).toBe(0);
      expect(link.text, `${where}\nthe text link must say Croftweaver`).toBe('Croftweaver');
      continue;
    }
    expect(link.imgs.length, `${where}\nmust hold exactly one image`).toBe(1);
    const img = link.imgs[0]!;
    expect(img.alt, `${where}\nthe image has the wrong description`).toBe('Built with Croftweaver');
    expect(['lazy', 'eager'], `${where}\nthe image has no loading setting`).toContain(img.loading);
    expect(img.src, `${where}\nthe image must be a file of the partner's own site, in /brand/badge/, and the right one`).toBe(`/brand/badge/${uses.img}`);
    toFetch.add(new URL(img.src!, origin).href);
    toMeasure.push({ src: img.src!, width: img.width, height: img.height });
    expect(link.sources.length, `${where}\nthe sources for dark pages`).toBe(uses.source ? 1 : 0);
    for (const s of link.sources) {
      expect(s.media, `${where}\nthe source for dark pages`).toBe('(prefers-color-scheme: dark)');
      expect(s.srcset, `${where}\nthe source for dark pages uses the wrong file`).toBe(`/brand/badge/${uses.source}`);
      toFetch.add(new URL(s.srcset!, origin).href);
    }
  }
  for (const { title, code } of markdown) {
    const m = code.trim().match(/^\[!\[Built with Croftweaver\]\((\S+)\)\]\((\S+)\)$/);
    expect(m, `the Markdown snippet is not an image in a link, with the right description:\n${code}`).not.toBeNull();
    expect(m![2], `the Markdown snippet does not link to the home page:\n${code}`).toBe(back);
    expect(m![1], `the Markdown snippet "${title}" uses the wrong file`).toBe(`${origin}/brand/badge/${SNIPPETS[title]!.img}`);
    toFetch.add(m![1]!);
  }

  const previews = await page.locator('img[src^="/brand/"]').evaluateAll((els) => els.map((e) => ({
    src: e.getAttribute('src')!, width: Number(e.getAttribute('width')), height: Number(e.getAttribute('height')),
  })));
  expect(previews.length, 'the page shows no previews').toBeGreaterThan(0);
  for (const p of previews) toFetch.add(origin + p.src);

  for (const url of toFetch) {
    const u = new URL(url);
    expect(u.origin, `an address points away from this site: ${url}`).toBe(origin);
    const res = await request.get(u.pathname, { maxRedirects: 0 });
    expect(res.status(), `${url} returned ${res.status()}`).toBe(200);
  }
  const attrs = (tag: string) => new Map([...tag.matchAll(/\s([a-z-]+)="([^"]*)"/g)].map((m) => [m[1]!, m[2]!] as const));
  const sizeOf = async (path: string) => {
    const root = attrs((await (await request.get(path)).text()).match(/<svg\b[^>]*>/)![0]);
    return { width: Number(root.get('width')), height: Number(root.get('height')) };
  };
  for (const img of toMeasure) {
    const size = await sizeOf(new URL(img.src, origin).pathname);
    expect([Number(img.width), Number(img.height)], `the size in a snippet differs from the size of ${img.src}`).toEqual([size.width, size.height]);
  }
  for (const p of previews.filter((p) => p.src.endsWith('.svg'))) {
    const size = await sizeOf(p.src);
    const ratio = size.width / size.height;
    expect(Math.abs(p.width / p.height - ratio) / ratio, `the preview ${p.src} is not in the proportions of its file`).toBeLessThan(0.01);
  }

  // The cards: exactly the ones this test knows, each with the preview and the downloads its title and kind name.
  // (The kind comes from the heading above the cards, not from the files, so a logo card full of icon files fails.)
  const cards = await page.locator('article.asset').evaluateAll((els) => els.map((e) => ({
    kind: e.closest('section')?.id === 'badge' ? 'badge' : (e.parentElement?.previousElementSibling?.textContent ?? '').trim().toLowerCase(),
    title: (e.querySelector('h3, h4')?.textContent ?? '').trim(),
    preview: e.querySelector('img')?.getAttribute('src') ?? '',
    downloads: [...e.querySelectorAll('a[download]')].map((a) => a.getAttribute('href') ?? ''),
  })));
  const BADGES: Record<string, string> = { 'Light': 'light', 'Dark': 'dark', 'Small, light': 'small-light', 'Small, dark': 'small-dark' };
  const INKS: Record<string, string> = { 'Dark ink': 'dark', 'Moss': 'moss', 'Light ink': 'light' };
  const FILES: Record<string, string[]> = {
    badge: ['.svg', '.png', '-2x.png'],
    logo: ['.svg', '-480w.png', '-960w.png', '-1920w.png'],
    icon: ['.svg', '-64.png', '-256.png', '-512.png'],
  };
  const TITLES: Record<string, Record<string, string>> = { badge: BADGES, logo: INKS, icon: INKS };
  expect(cards.length, 'the page shows no cards (or the selector no longer finds them)').toBeGreaterThan(0);
  for (const kind of Object.keys(TITLES)) {
    expect(cards.filter((c) => c.kind === kind).map((c) => c.title).sort(), `the ${kind} cards differ from the ones this test knows`).toEqual(Object.keys(TITLES[kind]!).sort());
  }
  expect(cards.length, 'a card of a kind this test does not know').toBe(Object.values(TITLES).reduce((n, t) => n + Object.keys(t).length, 0));
  for (const c of cards) {
    const token = TITLES[c.kind]![c.title]!;
    const base = c.kind === 'badge' ? `/brand/badge/built-with-croftweaver-${token}` : `/brand/${c.kind}/croftweaver-${c.kind}-${token}`;
    expect(c.preview, `the card "${c.title}" (${c.kind}) shows another file`).toBe(`${base}.svg`);
    expect([...c.downloads].sort(), `the card "${c.title}" (${c.kind}) offers other files`).toEqual(FILES[c.kind]!.map((end) => `${base}${end}`).sort());
  }

  const downloads = await page.locator('a[href^="/brand/"][download]').evaluateAll((as) => as.map((a) => a.getAttribute('href')!));
  const walk = (dir: string): string[] =>
    readdirSync(new URL(`../public/${dir}`, import.meta.url), { withFileTypes: true })
      .filter((e) => !e.name.startsWith('.'))   // a .DS_Store from Finder is not part of the kit
      .flatMap((e) => (e.isDirectory() ? walk(`${dir}/${e.name}`) : [`/${dir}/${e.name}`]));
  const kit = walk('brand');
  expect(kit.length, 'public/brand is empty').toBeGreaterThan(0);
  expect([...new Set(downloads)].sort(), 'the downloads on the page differ from the files in public/brand').toEqual(kit.sort());
});

// The HTML snippets, pasted into a page that comes with the Content-Security-Policy of a Croftweaver site (the one in
// public/_headers, which is the template's): each shows its badge, nothing is blocked, and the picture picks the dark
// file for a dark system setting and the light one otherwise. The page is made up in the test (a route that answers
// with the snippet and the policy); the files come from this site, as they would from the partner's own.
test('partner assets: each HTML snippet shows its badge under the security rules of a Croftweaver site', async ({ page }) => {
  const csp = readFileSync(new URL('../public/_headers', import.meta.url), 'utf8').match(/^\s*Content-Security-Policy:\s*(.+)$/m)?.[1];
  expect(csp, 'public/_headers has no Content-Security-Policy').toBeTruthy();
  await page.goto('/partner-assets');
  const html = (await snippetsOf(page)).filter((s) => !SNIPPETS[s.title]!.markdown && SNIPPETS[s.title]!.img);
  expect(html.length, 'no HTML snippet with an image').toBeGreaterThan(0);

  let current = '';
  await page.route('**/__snippet.html', (route) => route.fulfill({
    status: 200,
    contentType: 'text/html; charset=utf-8',
    headers: { 'content-security-policy': csp! },
    body: `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>snippet</title></head><body>${current}</body></html>`,
  }));
  await page.addInitScript(() => {
    (window as unknown as { __blocked: string[] }).__blocked = [];
    document.addEventListener('securitypolicyviolation', (e) => (window as unknown as { __blocked: string[] }).__blocked.push(e.blockedURI));
  });

  for (const { title, code } of html) {
    current = code;
    for (const scheme of ['light', 'dark'] as const) {
      await page.emulateMedia({ colorScheme: scheme });
      await page.goto('/__snippet.html');
      const img = page.locator('img');
      await expect(img, `"${title}": one image`).toHaveCount(1);
      await expect(img, `"${title}": the badge is not visible`).toBeVisible();
      await expect.poll(() => img.evaluate((i) => (i as HTMLImageElement).complete ? (i as HTMLImageElement).naturalWidth : 0), { message: `"${title}": the image did not load under the security rules` }).toBeGreaterThan(0);
      expect(await page.evaluate(() => (window as unknown as { __blocked: string[] }).__blocked), `"${title}": the security rules blocked something`).toEqual([]);
      const want = SNIPPETS[title]!.source && scheme === 'dark' ? SNIPPETS[title]!.source! : SNIPPETS[title]!.img!;
      const shown = await img.evaluate((i) => (i as HTMLImageElement).currentSrc);
      expect(shown.endsWith(`/brand/badge/${want}`), `"${title}" under a ${scheme} setting shows ${shown}, not ${want}`).toBe(true);
    }
  }
});

// Site-specific (not in the shipped suite): the Cache-Control that Cloudflare Pages sends for a file under /brand/.
// `astro preview` does not apply public/_headers, so the test works out what Pages sends from the file, as Pages
// documents it (developers.cloudflare.com/pages/configuration/headers): every rule whose path matches, in file order;
// a splat matching any run of characters; a header set by several rules joined with a comma. What it cannot model it
// refuses, so a rule it cannot read never passes by being ignored: a second splat, a placeholder, a host, an unindented
// header, and a "! Name" that takes away a header the test reads (how Pages orders it against other rules is not
// measured yet; the README's launch check is where it is). The files keep their names when they change, and the
// Markdown snippets on /partner-assets hotlink the badges from other people's READMEs, so they may be cached for a
// while but are never immutable. Pages' own default is "public, max-age=0, must-revalidate", which makes a cache ask
// the server before it reuses a file. Directive names follow RFC 9111 (max-age, s-maxage, private, no-store,
// no-cache), RFC 8246 (immutable) and RFC 5861 (stale-while-revalidate, stale-if-error).
test('headers — the partner kit under /brand/ is cacheable for between an hour and a week, and never immutable', () => {
  const rules = readFileSync(new URL('../public/_headers', import.meta.url), 'utf8');
  const headerFor = (path: string, name: string) => {
    const values: string[] = [];
    let applies = false;
    for (const raw of rules.split('\n')) {
      const line = raw.trim();
      if (!line || line.startsWith('#')) continue;
      if (!/^\s/.test(raw)) {   // a path line starts a rule
        expect(line.startsWith('/') && line.split('*').length <= 2 && !/:\w/.test(line),
          `public/_headers: "${line}" is not a path or header this test models (a second splat, a placeholder, a host or an unindented header); extend the test`).toBe(true);
        const [before, after] = line.split('*');
        applies = after === undefined ? path === before : path.length >= before!.length + after.length && path.startsWith(before!) && path.endsWith(after);
        continue;
      }
      if (!applies) continue;
      if (line.startsWith('!')) {
        expect(line.slice(1).trim().toLowerCase(), `public/_headers: "${line}" takes ${name} away for ${path}; this test does not model how Pages orders "! Name" against other rules, so measure Pages and extend the test`).not.toBe(name);
        continue;
      }
      const colon = line.indexOf(':');
      expect(colon > 0, `public/_headers: "${line}" is neither "Name: value" nor "! Name", so this test cannot read it`).toBe(true);
      if (line.slice(0, colon).trim().toLowerCase() === name) values.push(line.slice(colon + 1).trim());
    }
    return values.join(', ');
  };
  const filesIn = (dir: string): string[] =>
    readdirSync(new URL(`../public/${dir}`, import.meta.url), { withFileTypes: true })
      .filter((e) => !e.name.startsWith('.'))   // a .DS_Store from Finder is not part of the kit
      .flatMap((e) => (e.isDirectory() ? filesIn(`${dir}/${e.name}`) : [`/${dir}/${e.name}`]));
  const kit = filesIn('brand');
  expect(kit.length, 'public/brand is empty').toBeGreaterThan(0);
  for (const path of kit) {
    const sent = headerFor(path, 'cache-control');
    const directives = sent.split(',').map((d) => d.trim().toLowerCase().replace(/\s*=\s*/, '=')).filter(Boolean);
    // The seconds of one lifetime directive: absent is 0 (a failure for max-age, which must be there), a second one is a
    // failure (two rules joined with a comma would send two), and the whole directive must be name=<digits>.
    const seconds = (name: string, required = false) => {
      const found = directives.filter((d) => d.startsWith(name));
      if (required || found.length > 0) {
        expect(found.length, `${path}: Pages would send "${sent}", which has ${found.length} ${name}${found.length > 1 ? ' (two rules joined with a comma?)' : ''}`).toBe(1);
      }
      if (found.length === 0) return 0;
      const match = /^([a-z-]+)=(\d+)$/.exec(found[0]!);
      expect(match?.[1], `${path}: "${found[0]}" is not ${name}=<whole seconds>`).toBe(name);
      return Number(match![2]);
    };
    const maxAge = seconds('max-age', true);
    expect(maxAge, `${path}: cached for less than an hour`).toBeGreaterThanOrEqual(3600);
    // A conservative count, not a claim about what a real cache does: the freshness (a shared cache uses s-maxage instead
    // of max-age) plus both stale windows of RFC 5861 in full, though a real cache may overlap them. The test limits the
    // count to a week, because a longer one would let a corrected file reach partners late.
    const worst = Math.max(maxAge, seconds('s-maxage')) + seconds('stale-while-revalidate') + seconds('stale-if-error');
    expect(worst, `${path}: by this count (the stale windows added in full) a corrected file could stay cached for ${worst} seconds, more than a week`).toBeLessThanOrEqual(7 * 86400);
    expect(directives, `${path}: not public`).toContain('public');
    expect(directives.filter((d) => ['immutable', 'no-store', 'no-cache', 'private'].includes(d.split('=')[0]!)),
      `${path}: a directive that does not suit a file that keeps its name when it changes`).toEqual([]);
    // Other headers that set how long the kit is kept would change the lifetime without showing in the Cache-Control above.
    for (const other of ['cdn-cache-control', 'cloudflare-cdn-cache-control', 'surrogate-control', 'expires', 'pragma']) {
      expect(headerFor(path, other), `${path}: ${other} is set, which this test does not model`).toBe('');
    }
  }
});

// Site-specific (not in the shipped suite): the header. On a phone four links and a button
// already wrapped into three rows, and the page for established sites was in no menu at all.
// So the links fold behind a "Menu" button on a phone, and that page is in the list. The
// button is switched on by a script: without JavaScript the links must simply stay visible,
// or a visitor with scripts off would have no way to any page. Every item stays a 44px tap
// target (BRAND.md), and the open menu must not make a 320px phone scroll sideways.
//
// Some items are groups (NAV in src/config.ts): a button opens a list of links under it. The lists are in the HTML
// at load, hidden by CSS, so the dead-link suite reads their links and they stay reachable without JavaScript. On a
// phone and without JavaScript the group's name is a plain label and its links are always shown, and no group
// button is.
const PHONE = { width: 360, height: 740 };
const DESKTOP = { width: 1280, height: 800 };
type PageT = import('@playwright/test').Page;
const headerLinks = (page: PageT) => page.locator('.site-header nav a');
const groups = NAV.filter(isNavGroup);
const groupButton = (page: PageT, label: string) => page.locator('.site-header nav').getByRole('button', { name: label, exact: true });
const navLink = (page: PageT, href: string) => page.locator(`.site-header nav a[href="${href}"]`);
const openGroups = (page: PageT) => page.locator('.site-header nav .group-button[aria-expanded="true"]');
// How many rows the top-level items stand in: the distinct vertical centres, in 10-pixel bands.
const itemRows = (page: PageT) => page.locator('.site-header nav > ul > li').evaluateAll((lis) =>
  new Set(lis.map((li) => { const b = li.getBoundingClientRect(); return Math.round((b.top + b.height / 2) / 10); })).size);

// `astro preview` does not send public/_headers, so the header tests that open a group run on pages served with the
// site's own Content-Security-Policy, read from that file, and collect what the browser refuses.
//
// The policies are those under the `/*` rule of the file, joined with a comma (the browser enforces each policy of such a
// header). A policy under any other path would need matching logic, so it is refused here instead of being applied to
// pages it is not for.
function siteCspPolicies(): string[] {
  const policies: string[] = [];
  let rule = '';
  for (const line of readFileSync(new URL('../public/_headers', import.meta.url), 'utf8').split('\n')) {
    if (/^\S/.test(line) && !line.startsWith('#')) rule = line.trim();
    const m = line.match(/^\s+Content-Security-Policy:\s*(.+)$/);
    if (!m) continue;
    expect(rule, `public/_headers has a Content-Security-Policy under "${rule || '(no path rule above it)'}": withSiteCsp only handles the global /* rule`).toBe('/*');
    policies.push(m[1]!);
  }
  expect(policies.length, 'public/_headers has no Content-Security-Policy under /*').toBeGreaterThan(0);
  return policies;
}

async function withSiteCsp(page: PageT): Promise<string[]> {
  const csp = siteCspPolicies().join(', ');
  const refused: string[] = [];
  page.on('console', (m) => { if (/content security policy|refused to/i.test(m.text())) refused.push(m.text()); });
  await page.route('**/*', async (route) => {
    if (route.request().resourceType() !== 'document') return route.continue();
    const response = await route.fetch();
    await route.fulfill({ response, headers: { ...response.headers(), 'content-security-policy': csp! } });
  });
  return refused;
}

// The narrowest width, probed in steps of 4 px from 480 up to 1400 (it fails if none unfolds), at which the Menu button is gone and the items stand in the header (the fold).
async function narrowestUnfolded(page: PageT): Promise<number> {
  for (let width = 480; width <= 1400; width += 4) {
    await page.setViewportSize({ width, height: 800 });
    if (await page.evaluate(() => getComputedStyle(document.querySelector('.site-header .menu-button')!).display === 'none')) return width;
  }
  throw new Error('the Menu button shows at every width up to 1400 px');
}

test('header — on a phone the menu is folded, opens on its button and closes on Escape', async ({ page }) => {
  await page.setViewportSize(PHONE);
  await page.goto('/skills');
  const button = page.locator('.site-header .menu-button');
  const nav = page.locator('.site-header nav');
  await expect(button, 'no menu button on a phone').toBeVisible();
  await expect(button).toHaveAttribute('aria-expanded', 'false');
  await expect(nav, 'the menu is open before anyone asked').toBeHidden();

  await button.click();
  await expect(button).toHaveAttribute('aria-expanded', 'true');
  for (const item of NAV_LINKS) {
    await expect(nav.getByRole('link', { name: item.label, exact: true }), `${item.label} is not in the open menu`).toBeVisible();
  }
  for (const group of groups) {
    await expect(nav.locator('.group-label', { hasText: group.label }), `the name "${group.label}" is not shown above its links`).toBeVisible();
    await expect(nav.getByRole('list', { name: group.label, exact: true }), `the list of "${group.label}" has no accessible name`).toBeVisible();
  }
  await expect(nav.locator('.group-button:visible'), 'a group button shows on a phone').toHaveCount(0);
  await expect(nav.getByRole('link', { name: 'Get it on GitHub', exact: true })).toHaveAttribute('href', SITE.repo);
  for (const target of [button, ...(await headerLinks(page).all())]) {
    const box = await target.boundingBox();
    expect(box!.height, `"${await target.innerText()}" is shorter than the 44px tap target (BRAND.md)`).toBeGreaterThanOrEqual(44);
  }

  // The button names the element it opens, and that element exists.
  expect(await page.locator(`#${await button.getAttribute('aria-controls')}`).count(), 'aria-controls names no element').toBe(1);

  // Escape with focus on a link: the link is about to be hidden, so focus goes to the button.
  await headerLinks(page).first().focus();
  await page.keyboard.press('Escape');
  await expect(nav, 'Escape did not close the menu').toBeHidden();
  await expect(button, 'focus was lost with the hidden link').toBeFocused();

  // The button closes what it opened.
  await button.click();
  await expect(nav).toBeVisible();
  await button.click();
  await expect(button).toHaveAttribute('aria-expanded', 'false');
  await expect(nav, 'a second press did not close the menu').toBeHidden();
});

test('header — Escape closes the open menu without taking focus from the page', async ({ page }) => {
  await page.setViewportSize(PHONE);
  await page.goto('/skills');
  await page.locator('.site-header .menu-button').click();
  const link = page.locator('main a[href]').first();
  await link.focus();
  await page.keyboard.press('Escape');
  await expect(page.locator('.site-header nav')).toBeHidden();
  await expect(link, 'Escape moved focus away from where the visitor was').toBeFocused();
});

// The home page and an inner page: both must fit with the claim under the logo.
for (const width of [360, 320]) {
  for (const path of ['/', '/skills']) {
    test(`header — the open menu does not make a ${width} px phone scroll sideways on ${path}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 740 });
      await page.goto(path);
      await page.locator('.site-header .menu-button').click();
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow, `${path} scrolls sideways at ${width} px with the menu open`).toBeLessThanOrEqual(0);
    });
  }
}

test('header — every group in NAV holds at least two links (one page stays a plain link)', () => {
  for (const group of groups) {
    expect(group.items.length, `the "${group.label}" group holds one link: a group needs two pages, one stays a plain link`).toBeGreaterThanOrEqual(2);
  }
});

test('header — on a wide screen the top-level items show, each group opens on its button, and the current page is marked', async ({ page }) => {
  await page.setViewportSize(DESKTOP);
  await page.goto('/');
  const nav = page.locator('.site-header nav');
  await expect(page.locator('.site-header .menu-button')).toBeHidden();
  await expect(nav.locator('.group-label:visible'), 'a group name shows beside its button on a wide screen').toHaveCount(0);
  for (const item of NAV) {
    if (isNavGroup(item)) {
      await expect(groupButton(page, item.label), `the "${item.label}" button is not shown`).toBeVisible();
      await expect(groupButton(page, item.label)).toHaveAttribute('aria-expanded', 'false');
      for (const link of item.items) {
        await expect(navLink(page, link.href), `${link.label} is not in the page at all`).toHaveCount(1);
        await expect(navLink(page, link.href), `${link.label} shows before its group is opened`).toBeHidden();
      }
    } else {
      await expect(nav.getByRole('link', { name: item.label, exact: true })).toBeVisible();
    }
  }
  // Open each group in turn: its links show, and only its.
  for (const group of groups) {
    await groupButton(page, group.label).click();
    await expect(groupButton(page, group.label)).toHaveAttribute('aria-expanded', 'true');
    for (const link of group.items) await expect(navLink(page, link.href), `${link.label} does not show in its open group`).toBeVisible();
    await expect(openGroups(page), 'more than one group is open').toHaveCount(1);
    await expect(page.locator('.site-header nav .group-list:visible'), 'more than one list shows').toHaveCount(1);
    // On a wide screen the group's name is hidden, and the open list is still named by it (aria-labelledby).
    await expect(nav.getByRole('list', { name: group.label, exact: true }), `the open list of "${group.label}" has no accessible name`).toBeVisible();
  }
});

// A link inside a group (every one, read from NAV): on its own page it is the current page, and the group that holds it is
// marked as the current group; no other link or group is.
for (const group of groups) {
  for (const link of group.items) {
    test(`header — ${link.href} is the current page in "${group.label}", and that group is marked`, async ({ page }) => {
      await page.setViewportSize(DESKTOP);
      await page.goto(link.href);
      await expect(page.locator('.site-header nav a[aria-current="page"]')).toHaveText([link.label]);
      await expect(groupButton(page, group.label), 'the group holding the current page is not marked').toHaveAttribute('aria-current', 'true');
      for (const other of groups.filter((g) => g !== group)) {
        await expect(groupButton(page, other.label), `the "${other.label}" group is marked as current on another group's page`).not.toHaveAttribute('aria-current', 'true');
      }
    });
  }
}

// A plain link of NAV (not in a group): on its own page it is the current page, and no group is marked. Read from NAV,
// so a link that later moves into a group is covered by the per-link tests above instead.
for (const plain of NAV.filter((item): item is NavLink => !isNavGroup(item))) {
  test(`header — the plain link ${plain.label} is the current page on ${plain.href}, and no group is marked`, async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto(plain.href);
    await expect(page.locator('.site-header nav a[aria-current="page"]')).toHaveText([plain.label]);
    await expect(page.locator('.site-header nav .group-button[aria-current="true"]'), 'a group is marked as current on a plain link\'s page').toHaveCount(0);
  });
}

// The current page shows at a glance: a thick underline on its link, or on the name of the group that holds it, and on no
// other item. Colour and weight alone were easy to miss (owner, 2026-10-24). Read from NAV, so a new link is covered.
const underline = (el: Element) => { const s = getComputedStyle(el); return `${s.textDecorationLine} ${s.textDecorationThickness}`; };
for (const link of NAV_LINKS) {
  test(`header — on ${link.href} the current item is underlined at a glance, and no other item is`, async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto(link.href);
    const group = groups.find((g) => g.items.includes(link));
    if (group) {
      const button = groupButton(page, group.label);
      await expect(button).toBeVisible();
      expect(await button.locator('.group-name').evaluate(underline), `the group name on ${link.href} is not underlined`).toBe('underline 3px');
      // An underline on the button itself would break at the arrow: the name and the arrow are separate boxes.
      expect(await button.evaluate(underline), 'the underline is on the whole button, not on its name').toMatch(/^none /);
      await button.click();
      await expect(navLink(page, link.href), `the "${group.label}" list did not open`).toBeVisible();
      expect(await navLink(page, link.href).evaluate(underline), `the current link in the open "${group.label}" list is not underlined`).toBe('underline 3px');
    } else {
      await expect(navLink(page, link.href)).toBeVisible();
      expect(await navLink(page, link.href).evaluate(underline), `the current link on ${link.href} is not underlined`).toBe('underline 3px');
    }
    // Every item that shows without a click: the top-level links (GitHub included) and the groups' names.
    const items = page.locator('.site-header nav > ul > li > a, .site-header nav .group-name');
    const plainItems = await items.evaluateAll((els) => els
      .filter((el) => !el.closest('[aria-current]'))
      .map((el) => `${el.textContent?.trim()}: ${getComputedStyle(el).textDecorationLine}`));
    expect(plainItems.length, 'no other item was checked').toBeGreaterThan(0);
    for (const item of plainItems) expect(item, 'an item that is not current is underlined').toMatch(/: none$/);
  });
}

// On a phone the open menu shows the current link with the same underline, under its group's name.
for (const link of NAV_LINKS) {
  test(`header — on a phone the open menu underlines the current link on ${link.href}`, async ({ page }) => {
    await page.setViewportSize(PHONE);
    await page.goto(link.href);
    await page.locator('.site-header .menu-button').click();
    const current = navLink(page, link.href);
    await expect(current).toBeVisible();
    expect(await current.evaluate(underline)).toBe('underline 3px');
  });
}

// Where the top-level items sit: the Menu button is shown and they are folded behind it, or they stand in ONE row.
// Rows, not pixels: the height of a row depends on the machine's fonts.
for (const width of [768, 800, 900, 960, 1024, 1280]) {
  test(`header — at ${width} px the items are folded behind the Menu button or stand in one row`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 });
    await page.goto('/');
    if (await page.locator('.site-header .menu-button').isVisible()) return;
    const rows = await itemRows(page);
    expect(rows, `the header items wrap onto ${rows} rows at ${width} px`).toBe(1);
  });
}

// The tightest width: the narrowest at which the items are not folded, wherever the fold is. The fixed widths above can all
// sit on one side of it.
test('header — at the narrowest width where the items are not folded they stand in one row', async ({ page }) => {
  await page.goto('/');
  const width = await narrowestUnfolded(page);
  const rows = await itemRows(page);
  expect(rows, `the header items wrap onto ${rows} rows at ${width} px, the narrowest width where they are not folded`).toBe(1);
});

test('header — a group closes on Escape, on a click elsewhere and when another opens, and a link in it is followed', async ({ page }) => {
  await page.setViewportSize(DESKTOP);
  const refused = await withSiteCsp(page);
  await page.goto('/');
  const [first, second] = groups;
  const b1 = groupButton(page, first!.label);
  const b2 = groupButton(page, second!.label);
  const firstLink = navLink(page, first!.items[0]!.href);

  await b1.click();
  await expect(b1).toHaveAttribute('aria-expanded', 'true');
  await expect(firstLink).toBeVisible();

  // Escape with focus on the button, then with focus on a link in the list: focus ends on the button.
  await page.keyboard.press('Escape');
  await expect(b1, 'Escape did not close the group').toHaveAttribute('aria-expanded', 'false');
  await expect(firstLink).toBeHidden();
  await b1.click();
  await firstLink.focus();
  await page.keyboard.press('Escape');
  await expect(b1).toHaveAttribute('aria-expanded', 'false');
  await expect(b1, 'focus was lost with the hidden link').toBeFocused();

  // A click elsewhere closes it.
  await b1.click();
  await expect(b1).toHaveAttribute('aria-expanded', 'true');
  await page.locator('.site-header .claim').click();
  await expect(b1, 'a click elsewhere did not close the group').toHaveAttribute('aria-expanded', 'false');

  // Opening another group closes the first: never two open.
  await b1.click();
  await b2.click();
  await expect(b1, 'the first group stayed open when the second opened').toHaveAttribute('aria-expanded', 'false');
  await expect(b2).toHaveAttribute('aria-expanded', 'true');
  await expect(openGroups(page)).toHaveCount(1);
  // The button closes what it opened.
  await b2.click();
  await expect(b2).toHaveAttribute('aria-expanded', 'false');

  // A click on a link in the list follows the link.
  await b1.click();
  await firstLink.click();
  await expect(page, 'the link in the open group was not followed').toHaveURL(new RegExp(`${first!.items[0]!.href}$`));
  expect(refused, 'the browser refused something under the site\'s Content-Security-Policy').toEqual([]);
});

test('header — with the keyboard: Enter or Space opens a group, Tab goes through its links, and Tab past the last closes it', async ({ page }) => {
  await page.setViewportSize(DESKTOP);
  await page.goto('/');
  const first = groups[0]!;
  const button = groupButton(page, first.label);
  await button.focus();
  await page.keyboard.press('Enter');
  await expect(button).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Enter');
  await expect(button, 'a second Enter did not close the group').toHaveAttribute('aria-expanded', 'false');
  await page.keyboard.press('Space');
  await expect(button, 'Space did not open the group').toHaveAttribute('aria-expanded', 'true');
  for (const link of first.items) {
    await page.keyboard.press('Tab');
    await expect(navLink(page, link.href), `${link.label} did not take focus in turn`).toBeFocused();
  }
  await page.keyboard.press('Tab');
  await expect(button, 'Tab past the last link did not close the group').toHaveAttribute('aria-expanded', 'false');
});

test('header — an open group sits inside the window at every width where the items are not folded', async ({ page }) => {
  await page.goto('/');
  const narrowest = await narrowestUnfolded(page);
  const last = groups[groups.length - 1]!;
  for (const width of [narrowest, 900, 960, 1024, 1280].filter((w) => w >= narrowest)) {
    await page.setViewportSize({ width, height: 800 });
    await groupButton(page, last.label).click();
    const box = await page.locator(`.site-header nav a[href="${last.items[0]!.href}"]`).locator('xpath=ancestor::ul[1]').boundingBox();
    expect(box, `the open "${last.label}" list is not drawn at ${width} px`).not.toBeNull();
    expect(box!.x, `the open list starts left of the window at ${width} px`).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width, `the open list runs past the right edge at ${width} px`).toBeLessThanOrEqual(width);
    for (const link of last.items) {
      const target = await navLink(page, link.href).boundingBox();
      expect(target!.height, `${link.label} in the open list is shorter than the 44px tap target (BRAND.md) at ${width} px`).toBeGreaterThanOrEqual(44);
    }
    await groupButton(page, last.label).click();
  }
});

test('header — a press on the open list itself (not on a link) does not close it', async ({ page }) => {
  // The press moves focus off the button to nothing (a null relatedTarget). Closing a group on that would remove the list
  // before a click lands in browsers that do not focus a link on click (Safari, Firefox on macOS).
  await page.setViewportSize(DESKTOP);
  await page.goto('/');
  const first = groups[0]!;
  await groupButton(page, first.label).click();
  const list = await page.locator(`.site-header nav a[href="${first.items[0]!.href}"]`).locator('xpath=ancestor::ul[1]').boundingBox();
  await page.mouse.click(list!.x + 3, list!.y + list!.height / 2);
  await expect(groupButton(page, first.label), 'a press on the open list closed it').toHaveAttribute('aria-expanded', 'true');
});

test('header — an open group closes when the window goes below the fold, and when the page is restored from the cache', async ({ page }) => {
  await page.setViewportSize(DESKTOP);
  await page.goto('/');
  const button = groupButton(page, groups[0]!.label);
  // The same button by CSS: a role query does not match it while it is hidden (below the fold).
  const raw = page.locator('.site-header nav .group-button').first();
  await button.click();
  await expect(button).toHaveAttribute('aria-expanded', 'true');
  await page.setViewportSize(PHONE);
  await expect(raw, 'narrowing the window below the fold did not close the open list').toHaveAttribute('aria-expanded', 'false');
  await page.setViewportSize(DESKTOP);
  await expect(raw, 'the list opened again by itself after the window was narrowed and widened').toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('.site-header nav .group-list:visible'), 'a list shows after the window was widened again').toHaveCount(0);
  // The browser's back/forward cache brings a page back with its state: pageshow with persisted set.
  await button.click();
  await page.evaluate(() => window.dispatchEvent(new PageTransitionEvent('pageshow', { persisted: false })));
  await expect(button, 'a pageshow of a freshly loaded page closed the list').toHaveAttribute('aria-expanded', 'true');
  await page.evaluate(() => window.dispatchEvent(new PageTransitionEvent('pageshow', { persisted: true })));
  await expect(button, 'a page restored from the cache came back with its list open').toHaveAttribute('aria-expanded', 'false');
});

// The two media queries in Header.astro (the phone block and the wide block) must name the same width, or a viewport between
// them gets neither. Playwright viewports are whole pixels and the gap would be a fraction of one, so the numbers are read.
test('header — the wide block is the exact complement of the phone query', () => {
  const css = readFileSync(new URL('../src/components/Header.astro', import.meta.url), 'utf8');
  const phone = [...css.matchAll(/@media \(max-width: ([\d.]+rem)\)/g)].map((m) => m[1]);
  const wide = [...css.matchAll(/@media not all and \(max-width: ([\d.]+rem)\)/g)].map((m) => m[1]);
  expect(phone.length, 'the phone block is gone from Header.astro').toBe(1);
  expect(wide.length, 'the wide block is gone from Header.astro').toBe(1);
  expect(wide[0], 'the wide block and the phone block name different widths').toBe(phone[0]);
});

// A control for withSiteCsp: it must see a violation when there is one, or the "nothing refused" checks above prove nothing.
test('header — the CSP check sees a violation (control)', async ({ page }) => {
  const refused = await withSiteCsp(page);
  await page.goto('/');
  await page.evaluate(() => { const img = new Image(); img.src = 'https://example.invalid/x.png'; document.body.appendChild(img); });
  await expect.poll(() => refused.length, 'the site policy let an image load from another origin, or the check does not see it').toBeGreaterThan(0);
});

// Site-specific (not in the shipped suite): the checklist table on /ai-website-seo-checklist. On a wide
// screen it is a four-column table. On a phone four columns of prose would share 320px or less, so below
// 40rem each row stacks, the check as a title and each cell under its own label, and the page must not
// scroll sideways. The labels come from data-label; the test reads them as the visitor sees them and
// holds them to the header cells' own text, so a renamed column cannot leave a stale label behind.
for (const width of [360, 320]) {
  test(`checklist table — at ${width} px each row stacks, each cell has its label, and nothing scrolls sideways`, async ({ page }) => {
    await page.setViewportSize({ width, height: 740 });
    await page.goto('/ai-website-seo-checklist');
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow, `the page scrolls sideways at ${width} px`).toBeLessThanOrEqual(0);
    const wrap = await page.locator('#checklist .table-wrap').evaluate((el) => el.clientWidth);
    const cells = page.locator('#checklist tbody tr').first().locator('td');
    const widths = await cells.evaluateAll((tds) => tds.map((td) => td.getBoundingClientRect().width));
    for (const w of widths) {
      expect(w, `a cell is squeezed to ${Math.round(w)} px in a ${Math.round(wrap)} px table`).toBeGreaterThan(wrap * 0.8);
    }
    const labels = await cells.evaluateAll((tds) => tds.map((td) => getComputedStyle(td, '::before').content));
    const headers = (await page.locator('#checklist thead th').allTextContents()).map((h) => h.trim());
    expect(headers.length, 'the table has four columns').toBe(4);
    expect(labels, 'a cell shows no label, or one that is not its column header').toEqual(headers.slice(1).map((h) => `"${h}"`));
  });
}

test('checklist table — on a wide screen it is still a table: the header row shows and the cells sit side by side', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/ai-website-seo-checklist');
  const head = await page.locator('#checklist thead').boundingBox();
  expect(head?.height ?? 0, 'the header row is hidden or clipped on a wide screen').toBeGreaterThan(20);
  const tops = await page.locator('#checklist tbody tr').first().locator('th, td').evaluateAll((els) => els.map((e) => Math.round(e.getBoundingClientRect().top)));
  expect(new Set(tops).size, `the cells of a row are stacked on a wide screen (tops ${tops.join(', ')})`).toBe(1);
});

// Site-specific (not in the shipped suite): every table on the site. One style (src/styles/global.css,
// "Tables"), two kinds. A text table (sentences in its cells) is a table above 40rem and stacks below it,
// each row a title with every cell under its own label. A table of figures without "stack" stays a table, and has to fit.
// Phones come first (BRAND.md: design at 360px up), and the phone cases run on every page.
//
// The text tables, by page. A page that gains or loses one must say so here: the count is the guard against
// a table that silently falls back to a scroll bar.
const STACKED: Record<string, number> = {
  '/established-sites': 2,
  '/from-wordpress': 2,
  '/security': 3,
  '/positioning': 1,
  '/proof': 1,
  '/case-study': 1,
  '/ai-website-seo-checklist': 1,
};

const stacked = (page: import('@playwright/test').Page) => page.locator('.table-wrap.stack');

test('tables — every table is in a labelled scroll region of the shared style', async ({ page }) => {
  for (const path of PAGES) {
    await page.goto(path);
    const bad = await page.evaluate(() =>
      [...document.querySelectorAll('table')].flatMap((t, i) => {
        const wrap = t.closest('.table-wrap');
        if (!wrap) return [`table ${i} is not inside a .table-wrap`];
        const problems: string[] = [];
        if (wrap.getAttribute('role') !== 'region') problems.push(`table ${i}: its .table-wrap has no role="region"`);
        if (!wrap.getAttribute('aria-label')) problems.push(`table ${i}: its .table-wrap has no aria-label`);
        if (wrap.getAttribute('tabindex') !== '0') problems.push(`table ${i}: its .table-wrap has no tabindex="0"`);
        if (!wrap.classList.contains('stack') && !wrap.classList.contains('figures')) problems.push(`table ${i}: its .table-wrap is neither "stack" nor "figures"`);
        if (t.querySelectorAll('thead th[scope="col"]').length === 0) problems.push(`table ${i} has no column headers`);
        return problems;
      }));
    expect(bad, `${path}: ${bad.join('; ')}`).toEqual([]);
    expect(await stacked(page).count(), `${path}: the number of text tables that stack has changed (see STACKED)`).toBe(STACKED[path] ?? 0);
  }
});

test('tables — a stacked table keeps its table meaning: roles on every part, a label on every cell', async ({ page }) => {
  for (const path of Object.keys(STACKED)) {
    await page.goto(path);
    const bad = await page.evaluate(() =>
      [...document.querySelectorAll('.table-wrap.stack table')].flatMap((t, i) => {
        const problems: string[] = [];
        const want: [string, string, string][] = [
          ['table', 'role', 'table'], ['thead', 'role', 'rowgroup'], ['tbody', 'role', 'rowgroup'],
          ['tr', 'role', 'row'], ['thead th', 'role', 'columnheader'], ['tbody th', 'role', 'rowheader'], ['td', 'role', 'cell'],
        ];
        for (const [sel, attr, value] of want) {
          const els = sel === 'table' ? [t] : [...t.querySelectorAll(sel)];
          const wrong = els.filter((e) => e.getAttribute(attr) !== value).length;
          if (wrong > 0) problems.push(`table ${i}: ${wrong} of ${els.length} "${sel}" lack ${attr}="${value}"`);
        }
        const unlabelled = [...t.querySelectorAll('td')].filter((td) => !td.getAttribute('data-label')).length;
        if (unlabelled > 0) problems.push(`table ${i}: ${unlabelled} cells have no data-label`);
        return problems;
      }));
    expect(bad, `${path}: ${bad.join('; ')}`).toEqual([]);
  }
});

// Phone widths. 360 is the design width (BRAND.md), 320 the narrowest phone still in use.
for (const width of [360, 320]) {
  test(`tables — at ${width} px no page scrolls sideways and no table scrolls inside its region`, async ({ page }) => {
    await page.setViewportSize({ width, height: 740 });
    for (const path of PAGES) {
      await page.goto(path);
      // Open any <details> so that nothing a visitor can unfold is left out of the measure (none is folded today).
      await page.evaluate(() => document.querySelectorAll('details').forEach((d) => { d.open = true; }));
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow, `${path} scrolls sideways at ${width} px`).toBeLessThanOrEqual(0);
      const scrolling = await page.locator('.table-wrap').evaluateAll((wraps) =>
        wraps.map((w, i) => ({ i, by: w.scrollWidth - w.clientWidth })).filter((w) => w.by > 1));
      expect(scrolling, `${path}: a table scrolls sideways inside its region at ${width} px (by how many px, per table)`).toEqual([]);
    }
  });

  test(`tables — at ${width} px every text table stacks: full-width cells, each with the label of its column`, async ({ page }) => {
    await page.setViewportSize({ width, height: 740 });
    for (const path of Object.keys(STACKED)) {
      await page.goto(path);
      await page.evaluate(() => document.querySelectorAll('details').forEach((d) => { d.open = true; }));
      const tables = stacked(page);
      for (let i = 0; i < (await tables.count()); i++) {
        const wrap = tables.nth(i);
        const where = `${path}, text table ${i}`;
        const wrapWidth = await wrap.evaluate((el) => el.clientWidth);
        const widths = await wrap.locator('tbody th, tbody td').evaluateAll((cells) => cells.map((c) => c.getBoundingClientRect().width));
        expect(widths.length, `${where} has no cells`).toBeGreaterThan(0);
        for (const w of widths) {
          expect(w, `${where}: a cell is squeezed to ${Math.round(w)} px in a ${Math.round(wrapWidth)} px table`).toBeGreaterThan(wrapWidth * 0.8);
        }
        const headers = (await wrap.locator('thead th').allTextContents()).map((h) => h.trim());
        const rows = await wrap.locator('tbody tr').evaluateAll((trs) =>
          trs.map((tr) => [...tr.querySelectorAll('td')].map((td) => getComputedStyle(td, '::before').content)));
        for (const labels of rows) {
          expect(labels, `${where}: a cell shows no label, or one that is not its column header`).toEqual(headers.slice(1).map((h) => `"${h}"`));
        }
      }
    }
  });
}

// On a phone a link that stands alone in a cell is something to tap. A link inside a sentence is not held to it:
// it would break the line (the same exception the rest of the site makes for links in text).
test('tables — on a phone a link that stands alone in a cell is a 44px tap target', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 740 });
  let standalone = 0;
  for (const path of Object.keys(STACKED)) {
    await page.goto(path);
    const links = await page.locator('.table-wrap.stack a').evaluateAll((as) =>
      as.map((a) => {
        const cell = a.closest('td, th')!;
        const rest = [...cell.querySelectorAll('a')].reduce((t, l) => t.replace(l.textContent ?? '', ''), cell.textContent ?? '');
        const box = a.getBoundingClientRect();
        return { text: (a.textContent ?? '').trim(), alone: rest.replace(/\band\b/g, '').trim() === '', height: box.height, width: box.width };
      }));
    for (const l of links.filter((x) => x.alone)) {
      standalone++;
      expect(l.height, `${path}: the link "${l.text}" is ${Math.round(l.height)} px tall, under the 44px tap target (BRAND.md)`).toBeGreaterThanOrEqual(44);
      expect(l.width, `${path}: the link "${l.text}" is ${Math.round(l.width)} px wide, under the 44px tap target (BRAND.md)`).toBeGreaterThanOrEqual(44);
    }
  }
  expect(standalone, 'too few standalone links were found in tables, so the check has lost its target').toBeGreaterThan(10);
});

// Wide screens. The same text tables are tables again, the header row shows, and the cells of a row sit side by side.
// No word is split across two lines (the body hyphenates, which squeezed the first column of /established-sites
// down to "An-thropic"), and a row header takes few lines: three for a short one, four for a long one.
for (const width of [641, 768, 1280, 1920]) {
  test(`tables — at ${width} px every text table is a table again: the header row shows and the cells sit side by side`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const path of Object.keys(STACKED)) {
      await page.goto(path);
      await page.evaluate(() => document.querySelectorAll('details').forEach((d) => { d.open = true; }));
      const tables = stacked(page);
      for (let i = 0; i < (await tables.count()); i++) {
        const wrap = tables.nth(i);
        const where = `${path}, text table ${i}`;
        const head = await wrap.locator('thead').boundingBox();
        expect(head?.height ?? 0, `${where}: the header row is hidden or clipped at ${width} px`).toBeGreaterThan(20);
        expect(await wrap.locator('thead').evaluate((el) => getComputedStyle(el).clipPath), `${where}: the header row is clipped at ${width} px`).toBe('none');
        const tops = await wrap.locator('tbody tr').first().locator('th, td').evaluateAll((els) => els.map((e) => Math.round(e.getBoundingClientRect().top)));
        expect(new Set(tops).size, `${where}: the cells of a row are stacked at ${width} px (tops ${tops.join(', ')})`).toBe(1);
      }
    }
  });

  test(`tables — at ${width} px no word in any table is broken across lines, and a row header takes few lines`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const path of PAGES) {
      await page.goto(path);
      await page.evaluate(() => document.querySelectorAll('details').forEach((d) => { d.open = true; }));
      const found = await page.evaluate(() => {
        const broken: string[] = [];
        const tall: string[] = [];
        for (const cell of document.querySelectorAll('.table-wrap th, .table-wrap td')) {
          const walker = document.createTreeWalker(cell, NodeFilter.SHOW_TEXT);
          for (let n = walker.nextNode(); n; n = walker.nextNode()) {
            // A word is split at a hyphen or a space on purpose; what is left is one piece that must stay on one line.
            for (const m of (n.textContent ?? '').matchAll(/[^\s\-–]+/g)) {
              const range = document.createRange();
              range.setStart(n, m.index!);
              range.setEnd(n, m.index! + m[0].length);
              if (range.getClientRects().length > 1) broken.push(m[0]);
            }
          }
        }
        for (const th of document.querySelectorAll('.table-wrap tbody th')) {
          // The lines of the text itself: a row header is as tall as its row, so its own height says nothing.
          const range = document.createRange();
          range.selectNodeContents(th);
          const lines = new Set([...range.getClientRects()].map((r) => Math.round(r.top))).size;
          const text = (th.textContent ?? '').trim();
          if (lines > (text.length <= 40 ? 3 : 4)) tall.push(`"${text.slice(0, 40)}" (${lines} lines)`);
        }
        return { broken, tall };
      });
      expect(found.broken, `${path}: words broken across lines at ${width} px`).toEqual([]);
      expect(found.tall, `${path}: row headers with too many lines at ${width} px`).toEqual([]);
    }
  });
}

for (const [name, viewport] of [['phone', PHONE], ['desktop', DESKTOP]] as const) {
  test(`header — without JavaScript a ${name} still shows every link, and no button`, async ({ browser, baseURL }) => {
    const context = await browser.newContext({ javaScriptEnabled: false, viewport, baseURL });
    const page = await context.newPage();
    await page.goto('/skills');
    await expect(page.locator('.site-header button:visible'), 'a button that cannot work is showing').toHaveCount(0);
    for (const item of NAV_LINKS) {
      await expect(page.locator('.site-header nav').getByRole('link', { name: item.label, exact: true }), `${item.label} is not shown`).toBeVisible();
    }
    for (const group of groups) {
      await expect(page.locator('.site-header nav .group-label', { hasText: group.label }), `the name "${group.label}" is not shown above or beside its links`).toBeVisible();
    }
    await context.close();
  });
}

// The line under the logo says what Croftweaver is for, on every page a visitor can land on.
// It is the line that opens the toolkit's README (POSITIONING.md, header line).
for (const path of ['/', '/skills', '/established-sites']) {
  test(`header — the claim shows under the logo on ${path}`, async ({ page }) => {
    await page.goto(path);
    await expect(page.locator('.site-header .claim')).toHaveText('Build for search and AI.');
    await expect(page.locator('.site-header .claim')).toHaveText(SITE.claim);
  });
}

// Site-specific (not in the shipped suite): what running a site costs. The home page says
// hosting is free before it asks anyone to start, so the block stands above the Quickstart.
// It names the two accounts with a link each, and what still costs money. A figure or a
// price on this site carries the day it was read (CONTENT_GUIDE.md, honesty rules), so the
// block and the Plausible recommendation on /start must each hold a date and their source.
test('cost — the home page says hosting is free, above the Quickstart, with its sources and a date', async ({ page }) => {
  await page.goto('/');
  const ids = await page.locator('main section[id]').evaluateAll((els) => els.map((e) => e.id));
  expect(ids.indexOf('cost'), 'no #cost section on the home page').toBeGreaterThanOrEqual(0);
  expect(ids.indexOf('cost'), '#cost does not stand directly above #quickstart').toBe(ids.indexOf('quickstart') - 1);
  const cost = page.locator('#cost');
  for (const href of ['https://github.com/about', 'https://www.cloudflare.com/what-is-cloudflare/',
    'https://github.com/pricing', 'https://developers.cloudflare.com/pages/platform/limits/']) {
    await expect(cost.locator(`a[href="${href}"]`), `#cost does not link ${href}`).toHaveCount(1);
  }
  await expect(cost, 'the block does not say what still costs money').toContainText('You still pay for your domain');
  await expect(cost.locator('time[datetime]'), 'the 20% figure and the free plans carry no date').toHaveCount(1);
});

test('cost — no page says hosting can still cost money while the home page says it is free', async ({ page }) => {
  for (const path of ['/', '/why']) {
    await page.goto(path);
    await expect(page.locator('main'), `${path} still lists hosting among the costs`).not.toContainText(/your hosting and your AI assistant can still cost money/i);
  }
});

test('cost — the Plausible price on /start has its source and the day it was read', async ({ page }) => {
  await page.goto('/start');
  const note = page.locator('#analytics');
  await expect(note.locator('a[href="https://plausible.io"]')).toHaveCount(1);
  await expect(note.locator('a[href="https://plausible.io/#pricing"]'), 'the price has no source').toHaveCount(1);
  await expect(note.locator('time[datetime]'), 'the price has no date').toHaveCount(1);
});

// Someone who rebuilds an existing site may cancel the old hosting plan and lose the domain
// or the mail with it. The home page says so in one sentence and sends them to the three
// checks on /start: the domain's registration, the mailboxes, and the mail records when the
// domain's DNS moves. The sentence without the checks, or a link to nowhere, helps nobody.
test('cost — the rebuild note on the home page leads to the three checks on /start', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#cost a[href="/start#rebuild"]'), 'the rebuild note links no checks').toHaveCount(1);
  await page.goto('/start');
  const checks = page.locator('#rebuild li');
  await expect(checks).toHaveCount(3);
  await expect(checks.nth(0)).toContainText('domain registered');
  await expect(checks.nth(1)).toContainText('mailboxes');
  await expect(checks.nth(2)).toContainText('mail records');
});

// Croftweaver grew out of the first site built this way, genai-wednesday.de, in March 2026
// (owner, 2026-10-12). Every page says so in its footer and links to that site, so the
// credit cannot drop off one page, lose its link, or point somewhere else unnoticed.
test('footer credit: every page names GenAI Wednesday as the origin and links to its site', async ({ page }) => {
  for (const path of PAGES) {
    await page.goto(path);
    const credit = page.locator('.site-footer .credit');
    await expect(credit, `${path}: the footer has no credit line`).toHaveCount(1);
    await expect(credit, `${path}: the credit line is hidden`).toBeVisible();
    await expect(credit, `${path}: the credit line`).toHaveText('Croftweaver grew out of building the GenAI Wednesday website in March 2026.');
    const link = credit.locator('a');
    await expect(link, `${path}: the credit line needs exactly one link`).toHaveCount(1);
    await expect(link, `${path}: the credit link`).toHaveText('GenAI Wednesday');
    await expect(link, `${path}: the credit does not link to genai-wednesday.de`).toHaveAttribute('href', 'https://genai-wednesday.de/');
  }
});

// Site-specific (not in the shipped suite): the footer. Its links are the FOOTER list in src/config.ts, in
// labelled columns. orphans.spec.ts passes when any link anywhere reaches a page, so a page left out of the
// footer would go unnoticed: this test fails it. PAGES is tied to the built pages by the sitemap drift alarm
// in seo.spec.ts, so checking PAGES covers every indexable page. The header is a curated subset of the pages: no test
// requires a particular page in it: the header tests read NAV. Because the
// footer links every page, orphans.spec.ts and scripts/check_internal_links.sh can no longer flag a page that has no
// in-body link: the contextual-link rows in CONTENT_GUIDE.md are kept by people, not by those two.
const footerLinks = (page: import('@playwright/test').Page) => page.locator('.site-footer .footer-nav a[href]');

test('footer — every page except home is linked from the footer, each once', async ({ page }) => {
  await page.goto('/');
  const hrefs = await footerLinks(page).evaluateAll((as) => as.map((a) => a.getAttribute('href') ?? ''));
  const problems = PAGES.filter((r) => r !== '/').flatMap((route) => {
    const n = hrefs.filter((h) => h === route).length;
    if (n === 1) return [];
    return [n === 0 ? `${route} is not linked from the footer (add it to FOOTER in src/config.ts)` : `${route} is linked ${n} times from the footer (once is enough)`];
  });
  expect(problems, 'the footer must link every page except home exactly once').toEqual([]);
});

test('footer — the columns and links are the ones in FOOTER, each list named by its heading, the badge above them', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.site-footer nav.footer-nav'), 'the footer nav needs its own name next to the header nav').toHaveAttribute('aria-label', 'Footer');
  const lists = page.locator('.site-footer .footer-nav ul');
  await expect(lists, 'the footer shows a different number of columns than FOOTER lists').toHaveCount(FOOTER.length);
  for (const [i, column] of FOOTER.entries()) {
    const list = lists.nth(i);
    const labelId = await list.getAttribute('aria-labelledby');
    expect(labelId, `the "${column.heading}" list has no accessible name`).toBeTruthy();
    await expect(page.locator(`#${labelId}`), `the heading that names the "${column.heading}" list`).toHaveText(column.heading);
    await expect(list.locator('a'), `the "${column.heading}" column's link texts`).toHaveText(column.links.map((l) => l.label));
    expect(
      await list.locator('a').evaluateAll((as) => as.map((a) => a.getAttribute('href'))),
      `the "${column.heading}" column's link targets`,
    ).toEqual(column.links.map((l) => l.href));
  }
  for (const label of ['Imprint', 'Privacy Policy', 'Terms of Use']) {
    await expect(page.locator('.site-footer .footer-nav').getByRole('link', { name: label, exact: true }), `the footer has no "${label}" link`).toHaveCount(1);
  }
  const badge = await page.locator('.site-footer a.badge').boundingBox();
  const columns = await page.locator('.site-footer .footer-nav').boundingBox();
  expect(badge, 'the badge is not drawn').not.toBeNull();
  expect(columns, 'the footer columns are not drawn').not.toBeNull();
  expect(badge!.y + badge!.height, 'the badge sits above the footer columns').toBeLessThanOrEqual(columns!.y + 1);
});

// The columns must not push the page sideways on a small phone ("Privacy Policy" and "Terms of Use" are the longest labels).
for (const width of [360, 320]) {
  test(`footer — a ${width} px phone does not scroll sideways`, async ({ page }) => {
    await page.setViewportSize({ width, height: 740 });
    await page.goto('/');
    await page.locator('.site-footer').scrollIntoViewIfNeeded();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow, `the page scrolls sideways at ${width} px`).toBeLessThanOrEqual(0);
  });
}
