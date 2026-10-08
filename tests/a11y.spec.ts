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

// Site-specific (not in the shipped suite): the header logo is an inline SVG whose ink
// is currentColor, so it can follow the theme. Axe does not check a graphic's colours,
// and a logo file exported with a fixed colour would vanish on one theme. So: every
// painted part of the logo must render in the header link's colour, and that colour
// must stand out from the page background (3:1, WCAG 1.4.11 for graphics).
for (const theme of THEMES) {
  test(`a11y — header logo follows the theme [${theme}]`, async ({ page }) => {
    await page.addInitScript((t) => {
      try { localStorage.setItem('theme', t); } catch (e) { /* ignore */ }
    }, theme);
    await page.goto('/');
    const logo = await page.evaluate(() => {
      const brand = document.querySelector('.brand');
      const svg = brand?.querySelector('svg');
      if (!brand || !svg) return null;
      const ink = getComputedStyle(brand).color;
      const paints = [...svg.querySelectorAll('*')].flatMap((el) => {
        const cs = getComputedStyle(el);
        return [cs.fill, cs.stroke].filter((p) => p !== 'none');
      });
      let el: Element | null = brand;
      let bg = 'rgba(0, 0, 0, 0)';
      while (el && /rgba\(.*, 0\)$|transparent/.test(bg)) {
        bg = getComputedStyle(el).backgroundColor;
        el = el.parentElement;
      }
      const lum = (c: string) => {
        const [r, g, b] = (c.match(/[\d.]+/g) || []).slice(0, 3).map((v) => {
          const s = Number(v) / 255;
          return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
        });
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
      };
      const [hi, lo] = [lum(ink), lum(bg)].sort((a, b) => b - a);
      return { ink, paints, contrast: (hi + 0.05) / (lo + 0.05), height: svg.getBoundingClientRect().height };
    });
    expect(logo, 'header logo (.brand svg) is missing').not.toBeNull();
    expect(logo!.paints.length, 'the logo has no painted parts').toBeGreaterThan(0);
    expect(new Set(logo!.paints), `logo paints ${logo!.paints.join(', ')} are not the header colour ${logo!.ink}`).toEqual(new Set([logo!.ink]));
    expect(logo!.contrast, 'logo colour against the page background').toBeGreaterThanOrEqual(3);
    expect(logo!.height, 'logo renders with a height').toBeGreaterThan(0);
  });
}
