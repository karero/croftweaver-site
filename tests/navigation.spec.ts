import { readdirSync, readFileSync } from 'node:fs';
import { test, expect } from '@playwright/test';
import { PAGES } from './_helpers';
import { SITE } from '../src/config';

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
// is parsed as HTML, by the browser's own parser in a document that loads nothing: exactly one link, to this page,
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
  const back = `${origin}/partner-assets?ref=badge`;
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
    expect(link.href, `${where}\ndoes not link back to this page`).toBe(back);
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
    expect(m![2], `the Markdown snippet does not link back to this page:\n${code}`).toBe(back);
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
// a splat matching any run of characters; a header set by several rules joined with a comma; "! Name" taking the
// header away. Syntax the test does not model (a second splat, a placeholder, a host, an unindented header) fails it,
// so a rule it cannot read never passes by being ignored. The files keep their names when they change, and the
// Markdown snippets on /partner-assets hotlink the badges from other people's READMEs, so they may be cached for a
// while but are never immutable. Pages' own default is "public, max-age=0, must-revalidate", which makes a cache ask
// the server before it reuses a file.
test('headers — the partner kit under /brand/ is cacheable for between an hour and a week, and never immutable', () => {
  const rules = readFileSync(new URL('../public/_headers', import.meta.url), 'utf8');
  const headerFor = (path: string, name: string) => {
    let values: string[] = [];
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
      if (line.startsWith('!')) { if (line.slice(1).trim().toLowerCase() === name) values = []; continue; }
      const colon = line.indexOf(':');
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
    const directives = sent.split(',').map((d) => d.trim().toLowerCase()).filter(Boolean);
    const maxAge = directives.filter((d) => d.startsWith('max-age'));
    expect(maxAge.length, `${path}: Pages would send "${sent}", which is not exactly one max-age`).toBe(1);
    expect(maxAge[0], `${path}: the max-age is not a whole number of seconds`).toMatch(/^max-age=\d+$/);
    expect(Number(maxAge[0]!.slice('max-age='.length)), `${path}: cached for less than an hour`).toBeGreaterThanOrEqual(3600);
    // No lifetime of any kind above a week (max-age, the shared-cache s-maxage, stale-while-revalidate, stale-if-error):
    // a corrected file would reach partners late.
    for (const d of directives.filter((x) => /^(max-age|s-maxage|stale-while-revalidate|stale-if-error)=/.test(x))) {
      expect(d, `${path}: "${d}" is not a whole number of seconds`).toMatch(/^[a-z-]+=\d+$/);
      expect(Number(d.split('=')[1]), `${path}: "${d}" is more than a week, so a corrected file would reach partners late`).toBeLessThanOrEqual(7 * 86400);
    }
    expect(directives, `${path}: not public`).toContain('public');
    expect(directives.filter((d) => ['immutable', 'no-store', 'no-cache', 'private'].includes(d.split('=')[0]!)),
      `${path}: a directive that does not suit a file that keeps its name when it changes`).toEqual([]);
    // Other headers that set how long the kit is kept would change the lifetime without showing in the Cache-Control above.
    for (const other of ['cdn-cache-control', 'cloudflare-cdn-cache-control', 'surrogate-control', 'expires', 'pragma']) {
      expect(headerFor(path, other), `${path}: ${other} is set, which this test does not model`).toBe('');
    }
  }
});
