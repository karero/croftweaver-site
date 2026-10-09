import { readFileSync } from 'node:fs';
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
// Site-specific (not in the shipped suite): the skills catalogue's data, which the /skills test at the end of this file reads.
import { SKILLS, RELEASE, ADDED_SINCE, AS_OF } from '../src/data/skills';
import { PAGES, THEMES } from './_helpers';
// Site-specific (not in the shipped suite): the words /proof uses for an AI-check result, called here with numbers of our own.
import { RESULTS_ONLY, sentence } from '../src/data/ai-words';

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
// Names in a sentence, as the page writes them: "A", "A and B", "A, B and C".
const list = (names: string[]) => (names.length < 3 ? names.join(' and ') : `${names.slice(0, -1).join(', ')} and ${names.at(-1)}`);
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
  // Each phrase pins a number to what it is, so a value that also occurs elsewhere in the
  // text (28, 13, 2026) cannot pass for the wrong one.
  for (const part of [`starts at ${start.clicks} clicks`, `${peak.clicks} on ${longDate(peak.date)}`, `ends at ${last.clicks}`, `from ${longDate(start.date)} to ${longDate(last.date)}`]) {
    await expect(svg, `the chart's description does not say "${part}"`).toHaveAccessibleDescription(word(part));
  }
  await expect(svg.locator('.axis-title'), 'the chart does not say what its numbers are').toHaveText(/28 days/);
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
      tickLabels: [...el.querySelectorAll('text[data-tick-label]')].map((t) => ({ value: num(t, 'data-tick-label'), text: t.textContent!.trim(), y: num(t, 'y') })),
      valueLabels: [...el.querySelectorAll('text[data-for]')].map((t) => ({ kind: t.getAttribute('data-for'), text: t.textContent!.trim() })),
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
  expect(ceiling - high, 'the axis reaches more than a step above the highest value').toBeLessThanOrEqual(valueStep);

  // What the reader sees: each gridline has one label that says its value, at its height.
  expect(c.tickLabels.length, 'an axis label has no gridline, or a gridline has none').toBe(ticks.length);
  for (const t of ticks) {
    const labels = c.tickLabels.filter((l) => l.value === t.value);
    expect(labels.length, `the gridline at ${t.value} has ${labels.length} labels`).toBe(1);
    expect(labels[0]!.text, `the label at the ${t.value} gridline reads "${labels[0]!.text}"`).toBe(String(t.value));
    expect(Math.abs(labels[0]!.y - t.y), `the ${t.value} label is not at its gridline`).toBeLessThan(0.05);
  }

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
    expect(c.valueLabels.filter((l) => l.kind === kind).map((l) => l.text), `the number shown for the ${kind} point`).toEqual([String(want.clicks)]);
  }
});

test('a11y — the AI check chart on /proof draws the published CSV', async ({ page }) => {
  const rows = csvRows('genai-wednesday-de-ai-check.csv').map(([date, engine, mode, , answers, named, cited, failed]) =>
    ({ date: date!, engine: engine!, mode: mode!, answers: Number(answers), named: Number(named), cited: Number(cited), failed: Number(failed) }));
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
  const failedCalls = (mode: string) => {
    const n = today.filter((r) => r.mode === mode).reduce((sum, r) => sum + r.failed, 0);
    return n === 0 ? 'no call failed' : `${n} ${n === 1 ? 'call' : 'calls'} failed`;
  };

  await page.goto('/proof');
  const svg = page.locator('svg[data-chart="ai"]');
  await expect(svg, 'no AI check chart on /proof').toHaveCount(1);
  await expect(svg).toHaveAttribute('role', 'img');
  await expect(svg, 'the chart has no accessible name').toHaveAccessibleName(/\S/);
  for (const part of [longDate(latest), `${total('with_search')} answers named the site, and ${failedCalls('with_search')}`, `${total('without_search')} did, and ${failedCalls('without_search')}`]) {
    await expect(svg, `the chart's description does not say "${part}"`).toHaveAccessibleDescription(word(part));
  }
  await expect(page.locator('#ai table'), 'the same results must also be in a table').toHaveCount(1);

  // Colour alone must not tell the marks apart (WCAG 1.4.1): the three kinds differ in shape
  // or fill, in the legend and in the chart, and a mark in the chart looks like its legend entry.
  const KINDS = ['named', 'unnamed', 'failed'];
  const look = (scope: string, kind: string) => page.locator(`${scope} .${kind}`).first().evaluate((el) => {
    // The shape (box and outline length), the fill, and the stroke that draws it.
    const shape = el as SVGGeometryElement;
    const box = shape.getBBox();
    const cs = getComputedStyle(el);
    return [el.tagName, cs.fill === 'none' ? 'hollow' : 'filled', `${box.width.toFixed(1)} x ${box.height.toFixed(1)}`, `outline ${shape.getTotalLength().toFixed(1)}`,
      cs.stroke === 'none' ? 'no stroke' : `stroke ${cs.strokeWidth} ${cs.strokeLinecap} ${cs.strokeLinejoin} dashes ${cs.strokeDasharray} ${cs.strokeDashoffset}`].join(', ');
  });
  // The words next to each legend mark, so a swapped legend cannot misname a mark.
  const SAYS = { named: /^\s*Named the site\s*$/, unnamed: /^\s*Answered, did not name it\s*$/, failed: /^\s*Call failed\s*$/ };
  for (const kind of KINDS) {
    await expect(page.locator('.legend li').filter({ has: page.locator(`.${kind}`) }), `the legend entry for the ${kind} mark says something else`).toHaveText(SAYS[kind as keyof typeof SAYS]);
  }
  const legend = await Promise.all(KINDS.map((kind) => look('.legend', kind)));
  expect(new Set(legend).size, `the legend marks look alike apart from colour: ${legend.join(', ')}`).toBe(KINDS.length);
  for (const [i, kind] of KINDS.entries()) {
    if ((await svg.locator(`[data-mark="${kind}"]`).count()) > 0) {
      expect(await look('svg[data-chart="ai"]', kind), `a ${kind} mark in the chart does not look like its legend entry`).toBe(legend[i]);
    }
  }

  const { cells, labels, heads } = await svg.evaluate((el) => {
    const inCell = (g: Element, kind: string) => g.querySelectorAll(`[data-mark="${kind}"]`).length;
    // Where a mark is drawn, not what it says about itself: its box and the centre of it.
    // A stroke and its round caps reach half a stroke width beyond the box, so a dash (a box of
    // no height) still has a size and two dashes drawn on one spot still overlap.
    const box = (m: Element) => {
      const b = (m as SVGGraphicsElement).getBBox();
      const cs = getComputedStyle(m);
      const half = cs.stroke === 'none' ? 0 : parseFloat(cs.strokeWidth) / 2;
      return [b.x - half, b.y - half, b.x + b.width + half, b.y + b.height + half];
    };
    return {
      cells: [...el.querySelectorAll('g[data-engine]')].map((g) => ({
        engine: g.getAttribute('data-engine')!, mode: g.getAttribute('data-mode')!,
        named: inCell(g, 'named'), unnamed: inCell(g, 'unnamed'), failed: inCell(g, 'failed'),
        words: g.querySelector('text')?.textContent?.trim() ?? '',
        marks: [...g.querySelectorAll('[data-mark]')].map((m) => box(m)),
      })),
      labels: [...el.querySelectorAll('text.label')].map((t) => ({ engine: t.getAttribute('data-engine')!, text: t.textContent!.trim(), y: Number(t.getAttribute('y')) })),
      heads: [...el.querySelectorAll('text.head')].map((t) => ({ text: t.textContent!.trim(), x: Number(t.getAttribute('x')) })),
    };
  });

  // The names and the column headings are the table's: the same words, in the same order.
  expect(labels.map((l) => l.text), 'the assistants in the chart and in the table differ').toEqual((await page.locator('#ai tbody th').allTextContents()).map((t) => t.trim()));
  expect([`${heads[0]!.text} ${heads[1]!.text}`, `${heads[2]!.text} ${heads[3]!.text}`], 'the column headings in the chart and in the table differ')
    .toEqual((await page.locator('#ai thead th').allTextContents()).slice(1).map((t) => t.trim()));

  // An assistant whose every call failed is named in the description and in the caption: a
  // row of dashes must not be read as a verdict on the site.
  // The cell of an assistant in a mode, found by the assistant's name in the table.
  const tableCellOf = (engine: string, mode: string) => page.locator('#ai tbody tr')
    .filter({ has: page.locator('th', { hasText: new RegExp(`^${labels.find((l) => l.engine === engine)!.text.replace(/[()]/g, '\\$&')}$`) }) })
    .locator('td').nth(mode === 'with_search' ? 0 : 1);
  // The three lists about who was asked or run, which the page reads in src/data/proof.ts, read here as text.
  const source = readFileSync(new URL('../src/data/proof.ts', import.meta.url), 'utf8');
  const listIn = (pattern: string) => (source.match(new RegExp(pattern))?.[1]?.match(/['"][a-z-]+['"]/g) ?? []).map((s) => s.slice(1, -1));
  // "Named and cited" says that the same answers did both. The file's totals show it only when each is all of the
  // answers; equal totals short of that could come from different answers. So a result says it if and only if the
  // totals prove it, and never for an assistant in RESULTS_ONLY (its count is not a citation count). Said of text that
  // sentence() built from the file's counts, stated here from the numbers and not from the text's own: a rule that
  // merges on equal totals, or never merges, fails here whatever it prints.
  const mergedIffProved = (text: string, what: string, engine: string, t: { answers: number; named: number; cited: number }) => {
    const proved = !RESULTS_ONLY.includes(engine) && t.answers > 0 && t.named === t.answers && t.cited === t.answers;
    expect(/and cited the site/i.test(text), proved
      ? `${what}: every answer named and cited the site, so the text should say so`
      : `${what}: the text says "named and cited", but the file's totals (${t.named} named, ${t.cited} cited, of ${t.answers} answers) do not show that every answer did both`).toBe(proved);
  };
  // The last result of an assistant in a mode as the table gives it: the most recent earlier day on
  // which it answered, and whether the answers also cited the site and whether calls failed.
  const lastResult = (engine: string, mode: string) => {
    const earlier = rows.filter((r) => r.engine === engine && r.mode === mode && r.date < latest);
    const day = [...new Set(earlier.map((r) => r.date))].sort().reverse()
      .find((d) => earlier.filter((r) => r.date === d).reduce((n, r) => n + r.answers, 0) > 0);
    if (!day) return '';
    const rs = earlier.filter((r) => r.date === day);
    const sum = (key: 'answers' | 'named' | 'cited' | 'failed') => rs.reduce((n, r) => n + r[key], 0);
    const failed = sum('failed');
    const counts = { answers: sum('answers'), named: sum('named'), cited: sum('cited') };
    const said = sentence({ engine, ...counts }, 'named');
    mergedIffProved(said, `${engine}, ${mode}, last result`, engine, counts);
    return ` On ${longDate(day)} it ${said}${failed ? ` ${failed} ${failed === 1 ? 'call' : 'calls'} failed.` : ''}`;
  };
  const failedAll = [...new Set(today.map((r) => r.engine))].filter((e) => {
    const modes = [...new Set(today.filter((r) => r.engine === e).map((r) => r.mode))];
    return modes.every((m) => {
      const rs = today.filter((r) => r.engine === e && r.mode === m);
      return rs.reduce((n, r) => n + r.answers, 0) === 0 && rs.reduce((n, r) => n + r.failed, 0) > 0;
    });
  });
  if (failedAll.length > 0) {
    const said = `Every call to ${list(labels.filter((l) => failedAll.includes(l.engine)).map((l) => l.text))} failed`;
    await expect(svg, `the chart's description does not say "${said}"`).toHaveAccessibleDescription(word(said));
    await expect(page.locator('#ai figcaption'), `the caption does not say "${said}"`).toContainText(said);
    for (const engine of failedAll) {
      for (const mode of ['with_search', 'without_search']) {
        if (!today.some((r) => r.engine === engine && r.mode === mode)) continue;
        await expect(tableCellOf(engine, mode), `${engine}, ${mode}: the cell of an assistant whose every call failed`)
          .toHaveText(`No result: every call failed that day.${lastResult(engine, mode)}`);
      }
    }
  }

  // Every table cell that has answers says what the file says, in the words of sentence() (src/data/ai-words.ts:
  // the test further down pins those words with numbers of its own, for Perplexity and for the rest). Not read
  // here: a cell with no rows (not asked, or not run: the block below), and a cell whose every call failed (only
  // an assistant that failed in every mode is read, above; no day of the file has one that failed in one mode).
  for (const { engine } of labels) {
    for (const mode of ['with_search', 'without_search']) {
      const rs = today.filter((r) => r.engine === engine && r.mode === mode);
      const sum = (key: 'answers' | 'named' | 'cited' | 'failed') => rs.reduce((n, r) => n + r[key], 0);
      const failed = sum('failed');
      if (rs.length === 0 || sum('answers') === 0) continue;
      const counts = { answers: sum('answers'), named: sum('named'), cited: sum('cited') };
      const said = sentence({ engine, ...counts }, 'Named');
      mergedIffProved(said, `${engine}, ${mode}`, engine, counts);
      await expect(tableCellOf(engine, mode), `${engine}, ${mode}: the cell does not say what the file says`)
        .toHaveText(said + (failed ? ` ${failed} ${failed === 1 ? 'call' : 'calls'} failed.` : ''));
    }
  }

  // An assistant with rows on earlier days and none on the latest was not run that day: the
  // description and the page say so, and its table cell gives its last result with the day it
  // comes from. (Not the same as one the check never asks in that mode.)
  const ranOnLatest = new Set(today.map((r) => r.engine));
  // Every assistant in the chart with no rows on the latest day was declared not run (the build stops
  // otherwise), one that has no earlier rows either included.
  const notRunEngines = labels.map((l) => l.engine).filter((e) => !ranOnLatest.has(e));
  // The three lists the page reads in src/data/proof.ts, read here as text: the search products (no
  // mode without web search), the assistants the check does not ask with web search, and the
  // assistants declared not run on the latest day. The last must be exactly those with no rows.
  const searchOnly = listIn('const SEARCH_ONLY = \\[([^\\]]*)\\]');
  const notAsked = listIn('const NOT_ASKED_WITH_SEARCH = \\[([^\\]]*)\\]');
  const declared = listIn(`['"]${latest}['"]: \\[([^\\]]*)\\]`);
  expect([...declared].sort(), 'NOT_RUN in src/data/proof.ts differs from the assistants with no rows on the latest day').toEqual([...notRunEngines].sort());
  let notRunSaid = '';
  if (notRunEngines.length > 0) {
    // In the order of the chart's rows, which is the order the page uses.
    const names = labels.filter((l) => notRunEngines.includes(l.engine)).map((l) => l.text);
    const said = `${list(names)} ${names.length === 1 ? 'was' : 'were'} not run that day`;
    notRunSaid = said;
    await expect(svg, `the chart's description does not say "${said}"`).toHaveAccessibleDescription(word(said));
    // A paragraph of the page, not the section's text: the chart's hidden description says it too.
    await expect(page.locator('#ai p').filter({ hasText: said }), `the paragraph about the assistants not run reads otherwise`)
      .toHaveText(`${said}. The table shows ${names.length === 1 ? 'its last result, if it has one' : 'their last results, where they have any'}.`);
    for (const engine of notRunEngines) {
      for (const mode of ['with_search', 'without_search']) {
        const expectedCell = mode === 'without_search' && searchOnly.includes(engine) ? 'Always searches.'
          : mode === 'with_search' && notAsked.includes(engine) ? 'Not asked with web search.'
          : `Not run that day.${lastResult(engine, mode)}`;
        await expect(tableCellOf(engine, mode), `${engine}, ${mode}: the cell of an assistant that was not run`).toHaveText(expectedCell);
      }
    }
  }

  // Nobody named the site from memory: the page says why, next to the number, and only while that is
  // true as written (owner, 2026-10-08): some answers came from memory, none named the site, and with
  // web search some did. The check does not test why, so the text ends by saying so and calls the reason likely.
  // The date is the one the page gives in its section about the site.
  const sumOf = (mode: string, key: 'answers' | 'named') => today.filter((r) => r.mode === mode).reduce((n, r) => n + r[key], 0);
  const explainsZero = sumOf('without_search', 'answers') > 0 && sumOf('without_search', 'named') === 0 && sumOf('with_search', 'named') > 0;
  const why = page.locator('#ai p').filter({ hasText: 'Why the second number is zero' });
  if (explainsZero) {
    const launched = (await page.locator('#site time').first().textContent())!.trim();
    await expect(why, 'the page does not say why the number from memory is zero').toHaveText(
      'Why the second number is zero: an assistant recalls a name from memory mostly when it met that name often in the text it was trained on, '
      + 'and a name reaches that memory only when a new version of the model is trained. '
      + `The site launched on ${launched}, which is recent for that. `
      + 'Web search does not rely on that memory, which is the likely reason the first number is higher. '
      + 'The check only counts who names the site. It does not test why, and it asks one model per assistant, not always the largest.',
    );
  } else {
    await expect(why, 'the page explains a zero that is not there').toHaveCount(0);
  }

  // The sentence that introduces the questions names who was asked.
  await expect(page.locator('#ai > p').first(), 'the sentence that introduces the questions names the wrong assistants')
    .toContainText(notRunEngines.length > 0 ? 'the assistants it ran' : 'each assistant');

  // Every assistant in the CSV is drawn, with exactly one cell for each mode (a second cell
  // for one mode and none for the other would leave the count right and the chart wrong).
  const engines = [...new Set(cells.map((x) => x.engine))];
  for (const engine of engines) {
    for (const mode of ['with_search', 'without_search']) {
      expect(cells.filter((x) => x.engine === engine && x.mode === mode).length, `${engine} needs exactly one ${mode} cell`).toBe(1);
    }
  }
  for (const engine of new Set(today.map((r) => r.engine))) {
    expect(engines, `${engine} is in the CSV but not in the chart`).toContain(engine);
  }
  // Every cell shows the CSV's counts: marks where the assistant was asked, words where it was not.
  for (const cell of cells) {
    const want = counts(cell.engine, cell.mode);
    const shown = { named: cell.named, unnamed: cell.unnamed, failed: cell.failed };
    if (want) {
      expect(shown, `${cell.engine}, ${cell.mode}: the marks differ from the CSV`).toEqual(want);
      expect(cell.words, `${cell.engine}, ${cell.mode}: words and marks in one cell`).toBe('');
    } else {
      expect(shown, `${cell.engine}, ${cell.mode}: the CSV has no rows, so no marks`).toEqual({ named: 0, unnamed: 0, failed: 0 });
      // No rows on the latest day: by design (a search product has no mode without web search, one
      // assistant is not asked with it) or because the assistant was declared not run.
      const byDesign = cell.mode === 'without_search' && searchOnly.includes(cell.engine) ? 'Always searches'
        : cell.mode === 'with_search' && notAsked.includes(cell.engine) ? 'Not asked'
        : declared.includes(cell.engine) ? 'Not run' : null;
      expect(cell.words, `${cell.engine}, ${cell.mode}: the words for a cell with no rows`).toBe(byDesign);
    }
  }

  // Where the marks sit: each assistant's marks on its own row, next to its name; the rows
  // differ; the marks of one mode start in one column; and no two marks overlap, which
  // also shows a cell with more marks than the layout has room for.
  expect(new Set(labels.map((l) => l.engine)).size, 'an assistant is named twice').toBe(labels.length);
  expect(new Set(labels.map((l) => l.y)).size, 'two assistants share a row').toBe(labels.length);
  for (const cell of cells) {
    const label = labels.find((l) => l.engine === cell.engine);
    expect(label, `${cell.engine} has no name in the chart`).toBeDefined();
    for (const b of cell.marks) expect(Math.abs((b[1]! + b[3]!) / 2 - label!.y), `a mark of ${cell.engine} is not on its row`).toBeLessThan(0.05);
  }
  for (const mode of ['with_search', 'without_search']) {
    const starts = new Set(cells.filter((x) => x.mode === mode && x.marks.length > 0).map((x) => Math.min(...x.marks.map((b) => (b[0]! + b[2]!) / 2)).toFixed(1)));
    expect(starts.size, `the ${mode} marks do not start in one column`).toBe(1);
  }
  // Each column's marks start under its own heading (within one mark's width of where the
  // heading starts), and the with-search marks end before the other heading: swapped columns
  // would reverse which result belongs to which kind of question.
  const headAt: Record<string, number> = { with_search: heads[0]!.x, without_search: heads[2]!.x };
  for (const cell of cells.filter((x) => x.marks.length > 0)) {
    const start = Math.min(...cell.marks.map((b) => (b[0]! + b[2]!) / 2)) - headAt[cell.mode]!;
    expect(start, `the ${cell.mode} marks of ${cell.engine} do not start under their heading`).toBeGreaterThanOrEqual(0);
    expect(start, `the ${cell.mode} marks of ${cell.engine} start far from their heading`).toBeLessThanOrEqual(12);
    if (cell.mode === 'with_search') {
      expect(Math.max(...cell.marks.map((b) => b[2]!)), `the with_search marks of ${cell.engine} run into the next column`).toBeLessThan(headAt.without_search!);
    }
  }
  const all = cells.flatMap((x) => x.marks.map((b) => ({ box: b, who: `${x.engine} ${x.mode}` })));
  const clashes = all.flatMap((a, i) => all.slice(i + 1)
    .filter((b) => a.box[0]! < b.box[2]! && b.box[0]! < a.box[2]! && a.box[1]! < b.box[3]! && b.box[1]! < a.box[3]!)
    .map((b) => `${a.who} and ${b.who}`));
  expect(clashes, 'marks overlap').toEqual([]);

  // /why carries the same fact in one clause, after its figures.
  if (notRunSaid) {
    await page.goto('/why');
    await expect(page.locator('li', { hasText: 'AI assistants.' }), 'the summary on /why leaves out who was not run').toContainText(`${notRunSaid}.`);
  }
  // ... and points to the explanation while there is one.
  await page.goto('/why');
  const whyPoint = page.locator('li', { hasText: 'AI assistants.' });
  if (explainsZero) await expect(whyPoint, '/why does not point to the explanation').toContainText('The proof page says why the second number is zero.');
  else await expect(whyPoint, '/why points to an explanation that is not there').not.toContainText('says why the second number is zero');
});

// genai-wednesday.de launched on 27 March 2026; it was not relaunched (owner, 2026-10-09). The pages said
// "relaunched" until then, and that wording is one paste away from POSITIONING.md or an older note, so the
// pages that describe the site are checked for the word, in their text and in their descriptions.
test('proof — the pages about genai-wednesday.de say it launched, and none says it was relaunched', async ({ page }) => {
  const relaunch = /re-?launch/i;
  await page.goto('/proof');
  const launched = (await page.locator('#site time').first().textContent())!.trim();
  const siteSays = (await page.locator('#site p:has(time)').first().textContent())!.replace(/\s+/g, ' ');
  expect(siteSays, 'the section about the site does not say that the site launched on that date').toContain(`The site launched on ${launched}`);
  for (const path of ['/proof', '/why', '/more-proof']) {
    await page.goto(path);
    expect(await page.locator('body').textContent(), `${path} calls the launch a relaunch`).not.toMatch(relaunch);
    expect(await page.locator('meta[name="description"]').getAttribute('content'), `the description of ${path} calls the launch a relaunch`).not.toMatch(relaunch);
  }
  // /why says it in one line. The space before "launched" is what keeps "relaunched on" from matching.
  await page.goto('/why');
  const evidence = (await page.locator('#evidence p', { hasText: 'One site, measured' }).textContent())!.replace(/\s+/g, ' ');
  expect(evidence, '/why does not say that the site launched on that date').toContain(` launched on ${launched}`);
  // llms.txt is read by assistants; its line about this site is checked too.
  const llms = readFileSync(new URL('../public/llms.txt', import.meta.url), 'utf8');
  expect(llms.split('\n').filter((l) => l.includes('genai-wednesday.de')).join('\n'), 'public/llms.txt calls the launch a relaunch').not.toMatch(relaunch);
});

// Site-specific (not in the shipped suite): the words /proof uses for one assistant's totals from the AI check
// (src/data/ai-words.ts). The published file cannot pin them: on every day of it Perplexity's results count equals its
// naming count, so a rule that used one for the other would print the same cells. These cases separate the two. For an
// assistant in RESULTS_ONLY (the toolkit's geo_check.py has the same list) the tracker's "cited" is how often the site
// was among the sources it returned. That is independent of whether the answer names the site, so it can be
// higher, equal or lower than "named", and it is never worded as a citation. For the others the page words it as a
// citation, as the toolkit does (it calls the lists of Claude through OpenRouter and of the Google surfaces unverified),
// and it says "named and cited" only where the totals prove that the same answers did both: each total is all of the
// answers. Equal totals short of that could come from different answers (one only named, one only cited, one both
// also gives 2 and 2), so the two counts are stated apart.
test('proof — the words for a result: Perplexity counts the sources it returned, the others count citations', () => {
  expect(RESULTS_ONLY, 'RESULTS_ONLY in src/data/ai-words.ts is the toolkit\'s list (geo_check.py): Perplexity only. Change it when the toolkit does').toEqual(['perplexity']);
  type Counts = { answers: number; named: number; cited: number };
  const results: [string, Counts, string][] = [
    ['named, and among the sources every time', { answers: 6, named: 5, cited: 5 }, 'Named it in 5 of 6 answers. The site was among the sources it returned in 5 of 6 answers.'],
    ['among the sources, never named', { answers: 3, named: 0, cited: 2 }, 'Named it in 0 of 3 answers. The site was among the sources it returned in 2 of 3 answers.'],
    ['among the sources more often than named', { answers: 5, named: 2, cited: 4 }, 'Named it in 2 of 5 answers. The site was among the sources it returned in 4 of 5 answers.'],
    ['named more often than among the sources', { answers: 5, named: 4, cited: 1 }, 'Named it in 4 of 5 answers. The site was among the sources it returned in 1 of 5 answers.'],
    ['named, among none of the sources', { answers: 3, named: 2, cited: 0 }, 'Named it in 2 of 3 answers.'],
    ['one answer', { answers: 1, named: 1, cited: 1 }, 'Named it in 1 of 1 answer. The site was among the sources it returned in 1 of 1 answer.'],
  ];
  for (const [what, counts, said] of results) {
    expect(sentence({ engine: 'perplexity', ...counts }, 'Named'), `Perplexity, ${what}`).toBe(said);
    expect(sentence({ engine: 'perplexity', ...counts }, 'Named'), `Perplexity, ${what}: the sentence says cited`).not.toMatch(/cited/i);
  }
  expect(sentence({ engine: 'perplexity', answers: 3, named: 0, cited: 2 }, 'named'), 'the form after "On <day> it"')
    .toBe('named it in 0 of 3 answers. The site was among the sources it returned in 2 of 3 answers.');
  const others: [string, Counts, string][] = [
    ['every answer named and cited', { answers: 3, named: 3, cited: 3 }, 'Named and cited the site in 3 of 3 answers.'],
    ['one answer, named and cited', { answers: 1, named: 1, cited: 1 }, 'Named and cited the site in 1 of 1 answer.'],
    ['equal totals short of every answer', { answers: 6, named: 5, cited: 5 }, 'Named it in 5 of 6 answers. Cited the site in 5 of 6 answers.'],
    ['every answer named, cited in fewer', { answers: 3, named: 3, cited: 2 }, 'Named it in 3 of 3 answers. Cited the site in 2 of 3 answers.'],
    ['every answer cited, named in fewer', { answers: 3, named: 2, cited: 3 }, 'Named it in 2 of 3 answers. Cited the site in 3 of 3 answers.'],
    ['cited in fewer answers than named', { answers: 3, named: 2, cited: 1 }, 'Named it in 2 of 3 answers. Cited the site in 1 of 3 answers.'],
    ['cited in answers that do not name the site', { answers: 3, named: 1, cited: 2 }, 'Named it in 1 of 3 answers. Cited the site in 2 of 3 answers.'],
    ['cited, never named', { answers: 3, named: 0, cited: 2 }, 'Named it in 0 of 3 answers. Cited the site in 2 of 3 answers.'],
    ['named, never cited', { answers: 3, named: 2, cited: 0 }, 'Named it in 2 of 3 answers.'],
    ['neither named nor cited', { answers: 3, named: 0, cited: 0 }, 'Named it in 0 of 3 answers.'],
  ];
  for (const [what, counts, said] of others) expect(sentence({ engine: 'openai', ...counts }, 'Named'), `an assistant with citations, ${what}`).toBe(said);
  // The form after "On <day> it": the second sentence needs a subject of its own, the merged form needs none.
  expect(sentence({ engine: 'google-ai-mode', answers: 2, named: 1, cited: 1 }, 'named'), 'the form after "On <day> it", totals short of every answer')
    .toBe('named it in 1 of 2 answers. It cited the site in 1 of 2 answers.');
  expect(sentence({ engine: 'google-ai-mode', answers: 2, named: 2, cited: 2 }, 'named'), 'the form after "On <day> it", every answer')
    .toBe('named and cited the site in 2 of 2 answers.');
  // The edges: no answers, nothing cited in the form after "On <day> it", and the totals of several assistants, which
  // the page never builds and which cannot be worded (whether "cited" counts citations depends on the assistant).
  expect(sentence({ engine: 'openai', answers: 0, named: 0, cited: 0 }, 'Named'), 'no answers').toBe('Named it in 0 of 0 answers.');
  expect(sentence({ engine: 'openai', answers: 3, named: 2, cited: 0 }, 'named'), 'the form after "On <day> it", nothing cited').toBe('named it in 2 of 3 answers.');
  expect(sentence({ engine: 'perplexity', answers: 3, named: 2, cited: 0 }, 'named'), 'Perplexity, the form after "On <day> it", among none of the sources').toBe('named it in 2 of 3 answers.');
  expect(() => sentence({ engine: undefined, answers: 3, named: 1, cited: 2 }, 'Named'), 'the totals of several assistants').toThrow(/one assistant/);
  expect(() => sentence({ engine: 'openai', answers: 6, named: 1, cited: 7 }, 'Named'), 'cited above the answers').toThrow(/cannot be more than/);
  expect(() => sentence({ engine: 'openai', answers: 6, named: 7, cited: 1 }, 'Named'), 'named above the answers').toThrow(/cannot be more than/);
});

// Site-specific (not in the shipped suite): nothing on /proof or /established-sites calls Perplexity's count a citation,
// and /proof says what the file's column called cited holds. Said as a citation, the count would claim more than the
// check measures: through Perplexity's own API the check reads the list of search results and nothing in the text, and
// through OpenRouter it reads the list of sources and not the [n] marks in the text, so it cannot tell which sources the
// answer quotes. The pages say "the sources it returned" for both routes.
test('proof — Perplexity\'s count is the sources it returned, not citations, on /proof and on /established-sites', async ({ page }) => {
  await page.goto('/proof');
  const row = page.locator('#ai tbody tr').filter({ has: page.locator('th', { hasText: /^Perplexity/ }) });
  await expect(row, 'no Perplexity row in the table').toHaveCount(1);
  for (const cell of await row.locator('td').allTextContents()) expect(cell, 'a Perplexity cell says cited').not.toMatch(/cited/i);
  await expect(page.locator('#ai p.note').filter({ hasText: 'The counts behind the table' }), 'the page does not say what the cited column holds')
    .toContainText('cited counts the answers that listed the site among their sources, whether or not the answer names it. For Perplexity those sources are the ones it returned, and the check does not tell which of them the answer quotes.');
  await page.goto('/established-sites');
  const bullet = page.locator('li:not(:has(li))').filter({ hasText: 'Where an engine allows it' });   // the bullet itself, not the step around it
  await expect(bullet, 'the check is not described as counting the sources it returned for Perplexity').toContainText('among the sources it returned, not how often it was cited');
  await expect(bullet, 'the old wording is back').not.toContainText('sources cited in its text');
  await expect(page.locator('#success'), 'the page promises which sites the assistants cite, which the check cannot say for Perplexity').not.toContainText('which sites they cite');
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
// A mark of a kind that the day's data does not have is not in the chart (there may be no failed
// call), so those entries are optional; the legend always shows all three kinds and is not.
const CHART_INK: [selector: string, property: 'fill' | 'stroke', minimum: number, what: string, optional?: true][] = [
  ['svg[data-chart="clicks"] .line', 'stroke', 3, 'the clicks line'],
  ['svg[data-chart="clicks"] .dot', 'fill', 3, 'a marker on the clicks line'],
  ['svg[data-chart="clicks"] .base', 'stroke', 3, 'the zero line'],
  ['svg[data-chart="clicks"] text', 'fill', 4.5, 'text in the clicks chart'],
  ['svg[data-chart="ai"] .named', 'fill', 3, 'a mark for an answer that named the site', true],
  ['svg[data-chart="ai"] .unnamed', 'stroke', 3, 'a mark for an answer that did not', true],
  ['svg[data-chart="ai"] .failed', 'stroke', 3, 'a mark for a failed call', true],
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
    const { applied, seen } = await page.evaluate((specs) => {
      // Opacity does not inherit, so multiply it up the whole chain: a faded wrapper hides a
      // chart as surely as a transparent line.
      const faded = (el: Element | null) => { let product = 1; for (; el; el = el.parentElement) product *= Number(getComputedStyle(el).opacity); return product; };
      return {
        applied: document.documentElement.dataset.theme,
        seen: specs.map(([selector, property]) => [...document.querySelectorAll(selector)].map((el) => {
          const cs = getComputedStyle(el);
          const card = el.closest('figure');
          return {
            paint: cs[property],
            opacity: Number(property === 'fill' ? cs.fillOpacity : cs.strokeOpacity) * faded(el),
            shown: cs.display !== 'none' && cs.visibility === 'visible',
            card: card ? getComputedStyle(card).backgroundColor : '',
          };
        })),
      };
    }, CHART_INK);
    expect(applied, 'the requested theme was not applied').toBe(theme);
    seen.forEach((found, i) => {
      const [, , minimum, what, optional] = CHART_INK[i]!;
      if (optional && found.length === 0) return;
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

// The chart text is set in the drawing's own units, so it shrinks with the screen. The aim is
// 11 px on a 360 px phone (about 10 px at 320 px, the width that WCAG 1.4.10 asks content to
// reflow to), and the page must not scroll sideways at either width.
for (const [width, floor] of [[360, 11], [320, 9.5]] as const) {
  test(`a11y — the charts on /proof fit a ${width} px phone and keep their text readable`, async ({ page }) => {
    await page.setViewportSize({ width, height: 740 });
    await page.goto('/proof');
    const phone = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth - window.innerWidth,
      smallest: ['clicks', 'ai'].map((id) => {
        const svg = document.querySelector<SVGSVGElement>(`svg[data-chart="${id}"]`)!;
        const scale = svg.getBoundingClientRect().width / svg.viewBox.baseVal.width;
        return { id, px: Math.min(...[...svg.querySelectorAll('text')].map((t) => parseFloat(getComputedStyle(t).fontSize) * scale)) };
      }),
    }));
    expect(phone.overflow, `/proof scrolls sideways at ${width} px`).toBeLessThanOrEqual(0);
    for (const { id, px } of phone.smallest) {
      expect(px, `the ${id} chart's smallest text is ${px.toFixed(1)} px at ${width} px`).toBeGreaterThanOrEqual(floor);
    }
  });
}

// Text in a drawing is cut off at the edge of its box, and a visitor's font can be wider than
// the one the layout was drawn in. So set the chart text in Verdana (macOS and Windows) or
// DejaVu Sans (Linux), the widest common system fonts, and check that no text or mark leaves
// the drawing and no two texts touch. Verdana is about as wide as a sans-serif system font gets;
// a wider one is not tried. (Letter-spacing on top of the machine's own font was
// tried first and gave a different test on each machine: this one failed on the Linux CI
// image, whose default font is already wide.) A longer series of months fails here first:
// see MAX_MONTH_LABELS in ClicksChart.astro.
test('a11y — text in the /proof charts stays inside its drawing and clear of other text', async ({ page }) => {
  await page.goto('/proof');
  await expect(page.locator('svg[data-chart]'), 'the charts are missing').toHaveCount(2);
  await page.addStyleTag({ content: 'svg[data-chart] text { font-family: Verdana, "DejaVu Sans", sans-serif !important; }' });
  // The test proves nothing in a font as narrow as the one the layout was drawn in. At 17 px
  // "Google AI Overview" takes 149 units in the system font of macOS (the font in global.css
  // there) and about 1.13 times that in Verdana; DejaVu Sans on the Linux CI image passes this
  // bar too. If the font stack in global.css changes, measure the label again and update 149.
  const widest = await page.evaluate(() => [...document.querySelectorAll<SVGTextElement>('svg[data-chart="ai"] text.label')]
    .find((t) => t.textContent?.trim() === 'Google AI Overview')?.getBBox().width ?? 0);
  expect(widest, 'no font wider than the design font took effect: install Verdana or DejaVu Sans').toBeGreaterThan(149 * 1.05);
  const problems = await page.evaluate(() => [...document.querySelectorAll<SVGSVGElement>('svg[data-chart]')].flatMap((svg) => {
    const { width, height } = svg.viewBox.baseVal;
    const name = (el: Element) => `${svg.dataset.chart}: "${el.textContent?.trim() || el.getAttribute('data-mark') || el.tagName}"`;
    // A mark is measured with its stroke (and round caps), as in the AI chart test; text as it is.
    const grow = (el: SVGGraphicsElement) => {
      const b = el.getBBox();
      const cs = getComputedStyle(el);
      const half = el.tagName === 'text' || cs.stroke === 'none' ? 0 : parseFloat(cs.strokeWidth) / 2;
      return { x: b.x - half, y: b.y - half, width: b.width + 2 * half, height: b.height + 2 * half };
    };
    const boxes = [...svg.querySelectorAll<SVGGraphicsElement>('text, circle, path')].map((el) => ({ el, b: grow(el) }));
    const outside = boxes.filter(({ b }) => b.x < 0 || b.y < 0 || b.x + b.width > width || b.y + b.height > height)
      .map(({ el, b }) => `${name(el)} spans ${Math.round(b.x)} to ${Math.round(b.x + b.width)} of ${width}`);
    // A text box is taller than its letters (it includes the line spacing), so two boxes
    // may share a few units without the letters touching.
    const overlap = (a0: number, a1: number, b0: number, b1: number) => Math.min(a1, b1) - Math.max(a0, b0);
    const texts = boxes.filter(({ el }) => el.tagName === 'text');
    const touching = texts.flatMap(({ el, b }, i) => texts.slice(i + 1)
      .filter(({ b: o }) => overlap(b.x, b.x + b.width, o.x, o.x + o.width) > 0 && overlap(b.y, b.y + b.height, o.y, o.y + o.height) > 4)
      .map(({ el: other }) => `${name(el)} touches ${name(other)}`));
    // A word or a name must not run into a mark either: the dots on the clicks line and the marks
    // of the AI chart. A mark has to overlap by half its own height at most (a dash is 2.4 units high).
    const marks = boxes.filter(({ el }) => el.hasAttribute('data-mark') || el.hasAttribute('data-marker'));
    const crossing = texts.flatMap(({ el, b }) => marks
      .filter(({ b: o }) => overlap(b.x, b.x + b.width, o.x, o.x + o.width) > 0 && overlap(b.y, b.y + b.height, o.y, o.y + o.height) > Math.min(4, o.height / 2))
      .map(({ el: mark }) => `${name(el)} crosses a ${mark.getAttribute('data-mark') ?? mark.getAttribute('data-marker')} mark`));
    return [...outside, ...touching, ...crossing];
  }));
  expect(problems, 'a chart has text that is cut off or runs into other text').toEqual([]);
});

// Site-specific (not in the shipped suite): /skills states how many skills there are, and says which toolkit release its
// list describes and which skills were added since (src/data/skills.ts: RELEASE, ADDED_SINCE, AS_OF). The page counts
// the list it is given, so a skill whose stage is not on the page would be counted in the lead and in the description
// and shown nowhere; and a list that goes past its release without saying so would claim a release it does not match.
test('skills — the catalogue lists every skill it counts and says what it is as of', async ({ page }) => {
  await page.goto('/skills');
  await expect(page.locator('main'), `the lead does not say there are ${SKILLS.length} skills`).toContainText(`Croftweaver is ${SKILLS.length} website skills`);
  await expect(page.locator('meta[name="description"]'), 'the description does not say how many skills there are')
    .toHaveAttribute('content', new RegExp(`^The ${SKILLS.length} website skills`));
  const shown = await page.locator('#build dt, #verify dt, #launch dt, #grow dt').evaluateAll((els) => els.map((e) => e.querySelector('code')?.textContent));
  expect(shown.sort(), 'the skills the page lists are not the skills it counts').toEqual(SKILLS.map((s) => s.name).sort());
  const asOf = ADDED_SINCE.length === 0
    ? `As of toolkit release ${RELEASE.version}, ${RELEASE.label}.`
    : `As of ${AS_OF.label}: toolkit release ${RELEASE.version} (${RELEASE.label}) and ${ADDED_SINCE.length} ${ADDED_SINCE.length === 1 ? 'skill' : 'skills'} added since, ${list([...ADDED_SINCE])}.`;
  await expect(page.locator('p.note').first(), 'the page does not say which release the list describes and what was added since')
    .toHaveText(asOf);
});
