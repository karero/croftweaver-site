import { test, expect } from '@playwright/test';
import { PAGES, THEMES } from './_helpers';

// Enforces the image rules on every rendered <img> AND every <picture><source>:
// a non-empty alt (or an intentional empty alt), explicit width+height (no layout
// shift / CLS), a modern raster format (WebP/AVIF — checked in src, srcset and
// <source>; SVG and the OG image are exempt), and an explicit loading choice:
// `loading="lazy"` for everything below the fold, `loading="eager"` (ideally with
// fetchpriority="high") ONLY for the LCP/above-fold image (website-design-system).
const RASTER = /\.(jpe?g|png|gif)(\?|#|$)/i;
// Simple comma split: srcset URLs containing literal commas (some image-CDN
// transform paths) come out garbled in messages, but raster extensions still match.
const srcsetUrls = (srcset: string) =>
  srcset.split(',').map((c) => c.trim().split(/\s+/)[0]).filter(Boolean);

for (const path of PAGES) {
  test(`images — ${path} uses optimised, dimensioned, described images`, async ({ page }) => {
    await page.goto(path);
    const imgs = await page.locator('img').evaluateAll((els) =>
      els.map((el) => {
        const img = el as HTMLImageElement;
        const sources = Array.from(img.closest('picture')?.querySelectorAll('source') ?? [])
          .map((s) => s.getAttribute('srcset') ?? '');
        const rect = img.getBoundingClientRect();
        return {
          src: img.getAttribute('src') ?? '',
          srcset: img.getAttribute('srcset') ?? '',
          sources,
          loading: img.getAttribute('loading'),
          hasAlt: img.hasAttribute('alt'),                 // alt="" is allowed (decorative)
          w: img.getAttribute('width'),
          h: img.getAttribute('height'),
          renderedWidth: rect.width,
          renderedHeight: rect.height,
          objectFit: getComputedStyle(img).objectFit,
        };
      }));

    const problems: string[] = [];
    for (const i of imgs) {
      if (!i.hasAlt) problems.push(`<img src="${i.src}"> has no alt attribute`);
      if (!i.w || !i.h) problems.push(`<img src="${i.src}"> missing width/height (CLS risk)`);
      // Astro's <Picture formats={['avif','webp']}> intentionally keeps a raster
      // fallback in <img src> for legacy browsers — exempt the fallback src when
      // the sibling <source>s offer a modern format; everything else is checked.
      const sourceCandidates = i.sources.flatMap(srcsetUrls);
      const hasModernSource = sourceCandidates.some((c) => !RASTER.test(c));
      const candidates = [...(hasModernSource ? [] : [i.src]), ...srcsetUrls(i.srcset), ...sourceCandidates];
      for (const c of candidates) {
        if (RASTER.test(c)) problems.push(`"${c}" (via <img src="${i.src}">) is raw JPEG/PNG/GIF — use WebP/AVIF`);
      }
      const loading = i.loading?.toLowerCase();
      if (loading !== 'lazy' && loading !== 'eager') {
        problems.push(`<img src="${i.src}"> has no loading attribute — "lazy" below the fold, "eager" only for the LCP image`);
      }
      // Catches a real regression: when CSS sets only one of width/height (no
      // ratio-preserving object-fit), the browser can't auto-preserve the ratio from
      // the width/height attributes and stretches/squishes the image instead.
      // cover/contain/none/scale-down all preserve the image's own ratio (only the
      // default 'fill' stretches), so anything but 'fill' is exempt.
      const fit = i.objectFit;
      if (i.w && i.h && i.renderedWidth > 0 && i.renderedHeight > 0 && fit === 'fill') {
        const attrRatio = Number(i.w) / Number(i.h);
        if (!Number.isFinite(attrRatio) || attrRatio <= 0) {
          problems.push(`<img src="${i.src}"> has non-numeric or zero width/height attributes (${i.w}x${i.h})`);
        } else {
          const renderedRatio = i.renderedWidth / i.renderedHeight;
          if (Math.abs(renderedRatio - attrRatio) / attrRatio > 0.02) {
            problems.push(`<img src="${i.src}"> renders at ${i.renderedWidth.toFixed(0)}x${i.renderedHeight.toFixed(0)} (ratio ${renderedRatio.toFixed(2)}) but its width/height attributes (${i.w}x${i.h}) imply ratio ${attrRatio.toFixed(2)} — CSS is stretching/squishing it (use height:auto / width:auto to keep the ratio, or object-fit + a matching aspect-ratio for an intentional crop)`);
          }
        }
      }
    }
    expect(problems, `image issues on ${path}:\n${problems.map((p) => '  • ' + p).join('\n')}`).toEqual([]);
  });
}

// Site-specific (not in the shipped suite): the "Built with Croftweaver" badge in the footer (public/brand/badge, the
// partner kit) is on every page and links to /partner-assets, next to a plain text link to the same page. Each
// variant is a pill with its own background; the one that matches the theme is shown, and only that one. (A rule
// that outranked the one hiding the dark badge once showed both.) A visitor's stored theme beats their system
// setting, so all four combinations are tested: a stored light theme under a dark system setting must show the
// light badge, which is what the :not([data-theme]) in the media rules of global.css is for.
test('footer badge: every page carries it, linked to /partner-assets, with the kit\'s description and size', async ({ page }) => {
  for (const path of PAGES) {
    await page.goto(path);
    const badge = page.locator('.site-footer a.badge');
    await expect(badge, `${path}: the footer has no badge`).toHaveCount(1);
    await expect(badge, `${path}: the badge does not link to /partner-assets`).toHaveAttribute('href', '/partner-assets');
    for (const variant of ['light', 'dark']) {
      const img = badge.locator(`img.badge-${variant}`);
      await expect(img, `${path}: the ${variant} badge file`).toHaveAttribute('src', `/brand/badge/built-with-croftweaver-${variant}.svg`);
      await expect(img, `${path}: the ${variant} badge description`).toHaveAttribute('alt', 'Built with Croftweaver');
      await expect(img, `${path}: the ${variant} badge width`).toHaveAttribute('width', '179');
      await expect(img, `${path}: the ${variant} badge height`).toHaveAttribute('height', '32');
    }
    await expect(page.locator('.site-footer a:not(.badge)[href="/partner-assets"]'), `${path}: no text link to the partner assets in the footer`)
      .toHaveText('Partner assets');
  }
});

const shownBadges = (page: import('@playwright/test').Page) =>
  page.locator('.site-footer a.badge img').evaluateAll((imgs) =>
    imgs.filter((i) => (i as HTMLElement).checkVisibility()).map((i) => i.className));

for (const system of ['light', 'dark'] as const) {
  test.describe(`footer badge under a ${system} system setting`, () => {
    test.use({ colorScheme: system });
    for (const theme of THEMES) {
      test(`footer badge: a stored ${theme} theme shows the ${theme} variant and no other, and its file loads`, async ({ page }) => {
        await page.addInitScript((t) => {
          try { localStorage.setItem('theme', t); } catch (e) { /* ignore */ }
        }, theme);
        await page.goto('/');
        await page.locator('.site-footer').scrollIntoViewIfNeeded();
        expect(await shownBadges(page), `a stored ${theme} theme under a ${system} system setting should show exactly the ${theme} badge`).toEqual([`badge-${theme}`]);
        const img = page.locator(`.site-footer img.badge-${theme}`);
        await expect.poll(() => img.evaluate((i) => (i as HTMLImageElement).naturalWidth), { message: 'the badge file did not load' }).toBe(179);
        const box = await page.locator('.site-footer a.badge').boundingBox();
        expect(box, 'the badge link is not rendered').not.toBeNull();
        expect(box!.height, 'the badge link is shorter than the 44px tap target (BRAND.md)').toBeGreaterThanOrEqual(44);
      });
    }
  });
}

// Without JavaScript nothing sets the theme, so the visitor's own setting decides (global.css).
for (const system of ['light', 'dark'] as const) {
  test.describe(`footer badge without JavaScript, ${system} system setting`, () => {
    test.use({ javaScriptEnabled: false, colorScheme: system });
    test(`footer badge: a ${system} system setting shows the ${system} variant`, async ({ page }) => {
      await page.goto('/');
      expect(await shownBadges(page)).toEqual([`badge-${system}`]);
    });
  });
}
