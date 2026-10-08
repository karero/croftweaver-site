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
    const logo = await page.evaluate(({ drawing, expected }) => {
      const brand = document.querySelector('.brand');
      const svg = brand?.querySelector<SVGSVGElement>('svg');
      if (!brand || !svg) return null;
      // Parse the file with the page's own HTML parser, so both sides are serialized the
      // same way: equivalent markup (self-closing tags, quoting) compares equal.
      const parsed = document.createElement('template');
      parsed.innerHTML = expected.trim();
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
        const shown = cs.display !== 'none' && cs.visibility === 'visible' && opacity(el) > 0;
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
      return { theme: document.documentElement.dataset.theme, ink, bg, parts,
        svgCount: brand.querySelectorAll('svg').length,
        sameMarkup: svg.outerHTML === parsed.content.firstElementChild?.outerHTML,
        svgShown: opacity(svg) > 0 && getComputedStyle(svg).visibility === 'visible' && rect.height > 0,
        ratio: rect.width / rect.height, vbRatio: vbWidth / vbHeight };
    }, { drawing: DRAWING, expected: brandFile('lockup-horizontal-theme.svg') });
    expect(logo, 'header logo (.brand svg) is missing').not.toBeNull();
    expect(logo!.theme, 'the requested theme was not applied').toBe(theme);
    // The header must show the checked theme copy itself, and nothing beside it.
    expect(logo!.svgCount, 'the header link holds more than the logo').toBe(1);
    expect(logo!.sameMarkup, 'the header logo is not lockup-horizontal-theme.svg').toBe(true);
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

// Site-specific (not in the shipped suite): the two charts on /proof are inline SVG that
// the build draws from the CSV files a visitor can download (src/components/ClicksChart.astro
// and AiCheckChart.astro). Axe cannot read a picture, and a chart can mislead while every
// other test stays green: a line drawn from other numbers than the file holds, an axis that
// hides the low end, a month label under the wrong day. So these tests read the drawing back
// and compare it with the files, then check its colours per theme and its size on a phone.
const csvRows = (file: string) =>
  readFileSync(new URL(`../public/data/${file}`, import.meta.url), 'utf8').trim().split(/\r?\n/).slice(1).map((line) => line.split(','));
const longDate = (iso: string) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
// A whole-word match, so "50" is not found inside "150".
const word = (text: string) => new RegExp(`\\b${text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`);

test('a11y — the clicks chart on /proof draws the published CSV', async ({ page }) => {
  const days = csvRows('genai-wednesday-de-search-console.csv').map(([date, clicks]) => ({ date: date!, clicks: Number(clicks) }));
  // The clicks in the 28 days up to each date, from the first date with a full 28 days.
  const expected = days.slice(27).map((d, i) => ({ date: d.date, clicks: days.slice(i, i + 28).reduce((n, x) => n + x.clicks, 0) }));
  const high = Math.max(...expected.map((e) => e.clicks));
  const peak = expected.find((e) => e.clicks === high)!;
  const [start, last] = [expected[0]!, expected.at(-1)!];

  await page.goto('/proof');
  const svg = page.locator('svg[data-chart="clicks"]');
  await expect(svg, 'no clicks chart on /proof').toHaveCount(1);

  // A name and a description that say what the picture shows, with the numbers of the data.
  await expect(svg).toHaveAttribute('role', 'img');
  await expect(svg, 'the chart has no accessible name').toHaveAccessibleName(/\S/);
  for (const part of [longDate(start.date), String(peak.clicks), longDate(peak.date), String(last.clicks), longDate(last.date)]) {
    await expect(svg, `the chart's description does not say "${part}"`).toHaveAccessibleDescription(word(part));
  }
  await expect(page.locator('#search p strong').first(), 'the clicks in the text and the end of the line differ').toHaveText(`${last.clicks} clicks`);
  await expect(page.locator('#search table'), 'the same clicks must also be in a table').toHaveCount(1);

  const c = await svg.evaluate((el) => {
    const num = (node: Element, name: string) => Number(node.getAttribute(name));
    const line = el.querySelector('polyline.line');
    return {
      from: line?.getAttribute('data-from'), to: line?.getAttribute('data-to'),
      points: (line?.getAttribute('points') ?? '').trim().split(/\s+/).map((p) => p.split(',').map(Number) as [number, number]),
      ticks: [...el.querySelectorAll('line[data-tick]')].map((l) => ({ value: num(l, 'data-tick'), x1: num(l, 'x1'), x2: num(l, 'x2'), y: num(l, 'y1') })),
      markers: [...el.querySelectorAll('circle[data-marker]')].map((m) => ({ kind: m.getAttribute('data-marker'), date: m.getAttribute('data-date'), clicks: num(m, 'data-clicks'), cx: num(m, 'cx'), cy: num(m, 'cy') })),
      months: [...el.querySelectorAll('text[data-date]')].map((t) => ({ date: t.getAttribute('data-date')!, name: t.textContent!.trim(), x: num(t, 'x') })),
    };
  });

  // One point per date of the series, from the first date to the last.
  expect(c.points.length, 'the line has a different number of points than the CSV gives').toBe(expected.length);
  expect([c.from, c.to]).toEqual([start.date, last.date]);

  // The axis starts at zero, rises in equal steps and reaches the highest value without
  // leaving the line squashed into its lower half.
  const ticks = [...c.ticks].sort((a, b) => a.value - b.value);
  expect(ticks.length, 'the axis has fewer than two gridlines').toBeGreaterThan(1);
  expect(ticks[0]!.value, 'the axis must start at zero').toBe(0);
  const valueStep = ticks[1]!.value - ticks[0]!.value;
  const pixelStep = ticks[0]!.y - ticks[1]!.y;
  ticks.forEach((t, i) => {
    expect(t.value, 'the axis labels rise in unequal steps').toBe(i * valueStep);
    expect(Math.abs(ticks[0]!.y - t.y - i * pixelStep), 'the gridlines are unequally spaced').toBeLessThan(0.05);
  });
  const ceiling = ticks.at(-1)!.value;
  expect(ceiling, 'the axis stops below the highest value').toBeGreaterThanOrEqual(high);
  expect(ceiling - high, 'the axis reaches a whole step above the highest value').toBeLessThan(valueStep);

  // Every point sits at the height its clicks have on the axis, and the points are evenly
  // spaced from one end of the axis to the other.
  const perClick = pixelStep / valueStep;
  const [first, end] = [c.points[0]!, c.points.at(-1)!];
  expect([first[0], end[0]], 'the line does not run the width of the axis').toEqual([ticks[0]!.x1, ticks[0]!.x2]);
  const xStep = (end[0] - first[0]) / (expected.length - 1);
  c.points.forEach(([x, y], i) => {
    const clicks = (ticks[0]!.y - y) / perClick;
    expect(Math.abs(clicks - expected[i]!.clicks), `${expected[i]!.date} is drawn at ${clicks.toFixed(2)} clicks, the CSV gives ${expected[i]!.clicks}`).toBeLessThan(0.05);
    expect(Math.abs(x - (first[0] + i * xStep)), `${expected[i]!.date} is drawn out of place sideways`).toBeLessThan(0.05);
  });

  // The month labels sit under the first day of their month. The two numbers on the line
  // belong to the highest and to the last point, and their markers sit on the line.
  expect(c.months.map((m) => m.date), 'a first of the month has no label, or a label has no date').toEqual(expected.filter((e) => e.date.endsWith('-01')).map((e) => e.date));
  for (const m of c.months) {
    const i = expected.findIndex((e) => e.date === m.date);
    expect(Math.abs(m.x - c.points[i]![0]), `the label ${m.name} is not under ${m.date}`).toBeLessThan(0.05);
    expect(m.name).toBe(new Date(`${m.date}T12:00:00Z`).toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' }));
  }
  for (const [kind, want] of [['peak', peak], ['latest', last]] as const) {
    const m = c.markers.find((x) => x.kind === kind);
    expect(m, `the ${kind} marker is missing`).toBeDefined();
    expect([m!.date, m!.clicks], `the ${kind} marker is for the wrong point`).toEqual([want.date, want.clicks]);
    expect([m!.cx, m!.cy], `the ${kind} marker is not on the line`).toEqual(c.points[expected.findIndex((e) => e.date === want.date)]);
  }
});

test('a11y — the AI check chart on /proof draws the published CSV', async ({ page }) => {
  const rows = csvRows('genai-wednesday-de-ai-check.csv').map(([date, engine, mode, , answers, named, , failed]) =>
    ({ date: date!, engine: engine!, mode: mode!, answers: Number(answers), named: Number(named), failed: Number(failed) }));
  const latest = rows.map((r) => r.date).sort().at(-1)!;
  const today = rows.filter((r) => r.date === latest);
  const counts = (engine: string, mode: string) => {
    const rs = today.filter((r) => r.engine === engine && r.mode === mode);
    if (rs.length === 0) return null;
    const answers = rs.reduce((n, r) => n + r.answers, 0);
    const named = rs.reduce((n, r) => n + r.named, 0);
    return { named, unnamed: answers - named, failed: rs.reduce((n, r) => n + r.failed, 0) };
  };
  const total = (mode: string) => {
    const rs = today.filter((r) => r.mode === mode);
    return `${rs.reduce((n, r) => n + r.named, 0)} of ${rs.reduce((n, r) => n + r.answers, 0)}`;
  };

  await page.goto('/proof');
  const svg = page.locator('svg[data-chart="ai"]');
  await expect(svg, 'no AI check chart on /proof').toHaveCount(1);
  await expect(svg).toHaveAttribute('role', 'img');
  await expect(svg, 'the chart has no accessible name').toHaveAccessibleName(/\S/);
  for (const part of [longDate(latest), total('with_search'), total('without_search')]) {
    await expect(svg, `the chart's description does not say "${part}"`).toHaveAccessibleDescription(word(part));
  }
  await expect(page.locator('#ai table'), 'the same results must also be in a table').toHaveCount(1);

  // Colour alone must not tell the marks apart (WCAG 1.4.1): each kind that is drawn has
  // its own shape or fill.
  const looks = (await svg.evaluate((el) => ['named', 'unnamed', 'failed'].map((kind) => {
    const mark = el.querySelector(`[data-mark="${kind}"]`);
    return mark ? `${mark.tagName} ${getComputedStyle(mark).fill === 'none' ? 'hollow' : 'filled'}` : null;
  }))).filter((look) => look !== null);
  expect(new Set(looks).size, `the marks look alike apart from colour: ${looks.join(', ')}`).toBe(looks.length);

  const cells = await svg.evaluate((el) => {
    const inCell = (g: Element, kind: string) => g.querySelectorAll(`[data-mark="${kind}"]`).length;
    return [...el.querySelectorAll('g[data-engine]')].map((g) => ({
      engine: g.getAttribute('data-engine')!, mode: g.getAttribute('data-mode')!,
      named: inCell(g, 'named'), unnamed: inCell(g, 'unnamed'), failed: inCell(g, 'failed'),
      words: g.querySelector('text')?.textContent?.trim() ?? '',
    }));
  });

  // Every assistant in the CSV has both of its cells, and every cell shows the CSV's counts:
  // marks where the assistant was asked, words where it was not.
  expect(cells.length, 'each assistant needs one cell per mode').toBe(new Set(cells.map((x) => x.engine)).size * 2);
  for (const engine of new Set(today.map((r) => r.engine))) {
    expect(cells.some((x) => x.engine === engine), `${engine} is in the CSV but not in the chart`).toBe(true);
  }
  for (const cell of cells) {
    const want = counts(cell.engine, cell.mode);
    const shown = { named: cell.named, unnamed: cell.unnamed, failed: cell.failed };
    if (want) {
      expect(shown, `${cell.engine}, ${cell.mode}: the marks differ from the CSV`).toEqual(want);
      expect(cell.words, `${cell.engine}, ${cell.mode}: words and marks in one cell`).toBe('');
    } else {
      expect(shown, `${cell.engine}, ${cell.mode}: the CSV has no rows, so no marks`).toEqual({ named: 0, unnamed: 0, failed: 0 });
      expect(cell.words, `${cell.engine}, ${cell.mode}: an empty cell with no words`).not.toBe('');
    }
  }
});

// Colours per theme. Graphics must stand out from the card at 3:1 and text at 4.5:1 (WCAG
// 1.4.11 and 1.4.3). The checked elements are the ones that carry information; the
// gridlines are not among them.
const contrast = (a: string, b: string) => {
  const lum = (c: string) => {
    const [r, g, bl] = (c.match(/[\d.]+/g) || []).slice(0, 3).map((v) => {
      const s = Number(v) / 255;
      return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r! + 0.7152 * g! + 0.0722 * bl!;
  };
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi! + 0.05) / (lo! + 0.05);
};
const CHART_INK: [selector: string, property: 'fill' | 'stroke', minimum: number, what: string][] = [
  ['svg[data-chart="clicks"] .line', 'stroke', 3, 'the clicks line'],
  ['svg[data-chart="clicks"] .dot', 'fill', 3, 'a marker on the clicks line'],
  ['svg[data-chart="clicks"] .base', 'stroke', 3, 'the zero line'],
  ['svg[data-chart="clicks"] text', 'fill', 4.5, 'text in the clicks chart'],
  ['svg[data-chart="ai"] .named', 'fill', 3, 'a mark for an answer that named the site'],
  ['svg[data-chart="ai"] .unnamed', 'stroke', 3, 'a mark for an answer that did not'],
  ['svg[data-chart="ai"] .failed', 'stroke', 3, 'a mark for a failed call'],
  ['svg[data-chart="ai"] text', 'fill', 4.5, 'text in the AI check chart'],
  ['.legend .named', 'fill', 3, 'the legend mark for a named answer'],
  ['.legend .unnamed', 'stroke', 3, 'the legend mark for an answer that did not'],
  ['.legend .failed', 'stroke', 3, 'the legend mark for a failed call'],
];
for (const theme of THEMES) {
  test(`a11y — the charts on /proof are readable [${theme}]`, async ({ page }) => {
    await page.addInitScript((t) => {
      try { localStorage.setItem('theme', t); } catch (e) { /* ignore */ }
    }, theme);
    await page.goto('/proof');
    const seen = await page.evaluate((specs) => specs.map(([selector, property]) => [...document.querySelectorAll(selector)].map((el) => {
      const cs = getComputedStyle(el);
      const card = el.closest('figure');
      return {
        paint: cs[property],
        opacity: Number(property === 'fill' ? cs.fillOpacity : cs.strokeOpacity),
        shown: cs.display !== 'none' && cs.visibility === 'visible',
        card: card ? getComputedStyle(card).backgroundColor : '',
      };
    })), CHART_INK);
    seen.forEach((found, i) => {
      const [, , minimum, what] = CHART_INK[i]!;
      expect(found.length, `nothing matches ${what}`).toBeGreaterThan(0);
      for (const el of found) {
        expect(el.shown && el.opacity === 1, `${what} is hidden or see-through`).toBe(true);
        expect(el.paint, `${what} has no colour of its own (${el.paint})`).toMatch(/^rgb\(/);
        expect(el.card, `${what} sits on a card with no opaque colour`).toMatch(/^rgb\(/);
        expect(contrast(el.paint, el.card), `${what} against the card (${theme})`).toBeGreaterThanOrEqual(minimum);
      }
    });
  });
}

// The chart text is set in the drawing's own units, so it shrinks with the screen: hold it
// to a size on a phone, and the page to its width.
test('a11y — the charts on /proof fit a phone and keep their text readable', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 740 });
  await page.goto('/proof');
  const phone = await page.evaluate(() => ({
    overflow: document.documentElement.scrollWidth - window.innerWidth,
    smallest: ['clicks', 'ai'].map((id) => {
      const svg = document.querySelector<SVGSVGElement>(`svg[data-chart="${id}"]`)!;
      const scale = svg.getBoundingClientRect().width / svg.viewBox.baseVal.width;
      return { id, px: Math.min(...[...svg.querySelectorAll('text')].map((t) => parseFloat(getComputedStyle(t).fontSize) * scale)) };
    }),
  }));
  expect(phone.overflow, '/proof scrolls sideways at 360 px').toBeLessThanOrEqual(0);
  for (const { id, px } of phone.smallest) {
    expect(px, `the ${id} chart's smallest text is ${px.toFixed(1)} px at 360 px`).toBeGreaterThanOrEqual(10);
  }
});
