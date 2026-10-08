import { readFileSync } from 'node:fs';
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { PAGES, THEMES } from './_helpers';

// Accessibility (WCAG 2.0/2.1 A + AA + best practice) on every page, in BOTH
// light and dark themes. Contrast that passes in light can fail in dark, so the
// full matrix runs.
for (const path of PAGES) {
  for (const theme of THEMES) {
    test(`a11y — ${path} [${theme}]`, async ({ page }) => {
      await page.addInitScript((t) => {
        try { localStorage.setItem('theme', t); } catch (e) { /* ignore */ }
      }, theme);
      await page.goto(path);
      await page.evaluate(() => document.fonts.ready);

      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'])
        .analyze();

      const summary = results.violations.map((v) => ({
        id: v.id, impact: v.impact, nodes: v.nodes.length,
      }));
      expect(JSON.stringify(summary, null, 2)).toBe('[]');
    });
  }
}

// Site-specific (not in the shipped suite): the header logo is an inline SVG whose ink is
// currentColor, so it follows the theme. Axe checks text contrast, not a graphic's
// colours, and a logo file exported with a fixed colour would vanish on one theme. So, per
// theme: every drawing element of the logo is visible, has a size, and paints only in the
// header link's colour, and that colour stands out from the page background at 3:1 (the
// WCAG threshold for graphics; logos are exempt, we hold ours to it anyway).
const DRAWING = 'path, rect, circle, ellipse, line, polyline, polygon, text, use, image';
const brandFile = (f: string) => readFileSync(new URL(`../src/assets/brand/${f}`, import.meta.url), 'utf8');
for (const theme of THEMES) {
  test(`a11y — header logo follows the theme [${theme}]`, async ({ page }) => {
    await page.addInitScript((t) => {
      try { localStorage.setItem('theme', t); } catch (e) { /* ignore */ }
    }, theme);
    await page.goto('/');
    const logo = await page.evaluate((drawing) => {
      const brand = document.querySelector('.brand');
      const svg = brand?.querySelector<SVGSVGElement>('svg');
      if (!brand || !svg) return null;
      const ink = getComputedStyle(brand).color;
      // Opacity does not inherit, so multiply it up the whole chain: a transparent group
      // or header hides the logo as surely as a transparent path.
      const opacity = (el: Element | null) => {
        let product = 1;
        for (; el; el = el.parentElement) product *= Number(getComputedStyle(el).opacity);
        return product;
      };
      const parts = [...svg.querySelectorAll<SVGGraphicsElement>(drawing)].map((el) => {
        const cs = getComputedStyle(el);
        let box = { width: 0, height: 0 };
        try { box = el.getBBox(); } catch { /* not rendered: stays 0 x 0 */ }
        const paints = [
          cs.fill !== 'none' && Number(cs.fillOpacity) > 0 ? cs.fill : null,
          cs.stroke !== 'none' && Number(cs.strokeOpacity) > 0 && parseFloat(cs.strokeWidth) > 0 ? cs.stroke : null,
        ].filter((p): p is string => p !== null);
        const shown = cs.display !== 'none' && cs.visibility !== 'hidden' && opacity(el) > 0;
        return { tag: el.tagName, paints, shown, sized: box.width > 0 && box.height > 0 };
      });
      let el: Element | null = brand;
      let bg = 'rgba(0, 0, 0, 0)';
      while (el && /rgba\(.*, 0\)$|transparent/.test(bg)) {
        bg = getComputedStyle(el).backgroundColor;
        el = el.parentElement;
      }
      const rect = svg.getBoundingClientRect();
      const { width: vbWidth, height: vbHeight } = svg.viewBox.baseVal;
      return { theme: document.documentElement.dataset.theme, ink, bg, parts, markup: svg.outerHTML,
        svgShown: opacity(svg) > 0 && getComputedStyle(svg).visibility !== 'hidden' && rect.height > 0,
        ratio: rect.width / rect.height, vbRatio: vbWidth / vbHeight };
    }, DRAWING);
    expect(logo, 'header logo (.brand svg) is missing').not.toBeNull();
    expect(logo!.theme, 'the requested theme was not applied').toBe(theme);
    // The header must show the checked theme copy itself, not some other artwork.
    expect(logo!.markup.trim(), 'the header logo is not lockup-horizontal-theme.svg').toBe(brandFile('lockup-horizontal-theme.svg').trim());
    expect(logo!.svgShown, 'the logo is hidden or has no height').toBe(true);
    expect(Math.abs(logo!.ratio / logo!.vbRatio - 1), 'the logo is drawn out of proportion').toBeLessThan(0.02);
    expect(logo!.parts.length, 'the logo has no drawing elements').toBeGreaterThan(0);
    for (const part of logo!.parts) {
      expect(part.shown && part.sized, `a <${part.tag}> in the logo is hidden or has no size`).toBe(true);
      expect(part.paints.length, `a <${part.tag}> in the logo paints nothing`).toBeGreaterThan(0);
      for (const paint of part.paints) expect(paint, `a <${part.tag}> paints ${paint}, not the header colour`).toBe(logo!.ink);
    }
    expect(logo!.ink, 'header colour is not an rgb() value').toMatch(/^rgb\(/);
    expect(logo!.bg, 'page background is not an opaque rgb() value').toMatch(/^rgb\(/);
    const lum = (c: string) => {
      const [r, g, b] = (c.match(/[\d.]+/g) || []).slice(0, 3).map((v) => {
        const s = Number(v) / 255;
        return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
      });
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };
    const [hi, lo] = [lum(logo!.ink), lum(logo!.bg)].sort((a, b) => b - a);
    expect((hi + 0.05) / (lo + 0.05), 'logo colour against the page background').toBeGreaterThanOrEqual(3);
  });
}

// The header's theme copy must stay the dark-ink design file with only the documented
// edits (BRAND.md, Logo), so a new logo from the designer cannot leave the old one in
// the header unnoticed. Any difference fails: remake the copy, or update this recipe.
test('a11y — header logo copy matches the design file', () => {
  const made = brandFile('lockup-horizontal-dark-ink.svg')
    .replace(/<metadata>[\s\S]*?<\/metadata>/, '')
    .replace(/ xmlns:c2pa="[^"]*"/, '')
    .replace(/ width="\d+" height="\d+"/, '')
    .replace(' role="img" aria-label="Croftweaver"', ' aria-hidden="true"')
    .replaceAll('#1a1f1b', 'currentColor');
  expect(brandFile('lockup-horizontal-theme.svg').trim()).toBe(made.trim());
});
