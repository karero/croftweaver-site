import { test, expect } from '@playwright/test';
import { LOG, newestTestCount, type Entry } from '../src/data/case-study-log';

// The tests card on /case-study takes its figure from the newest change to this site that states a
// test count (plan: docs/reviews/PLAN-2026-11-03-case-study-upkeep.md, scenarios C1 to C5). Moving a
// citation by hand each week let the card stay on an old count without any error.

const SITE = 'https://github.com/karero/croftweaver-site/pull/';
const GENAI = 'https://github.com/GenAI-Wednesday/GenAI-Wednesday.de/pull/';
const TOOLKIT = 'https://github.com/karero/croftweaver/pull/';

let n = 0;
const change = (date: string, checks: string | undefined, prBase = SITE): Entry => ({
  kind: 'change', date, title: `change ${++n}`, asked: 'x', pr: `${prBase}${n}`, ...(checks === undefined ? {} : { checks }),
});
const seen = (date: string): Entry => ({ kind: 'observation', date, title: `seen ${++n}`, seen: 'x', source: 'x' });

test('C1: the newest count wins, and later changes without a leading count do not hide it', () => {
  // The shape of the real log around 29 October: #155 has 499; #154 gives no count and #156 says "75 SEO tests".
  const log: Entry[] = [
    change('2026-10-26', '458 tests and a check of the 103 security claims; review by one outside model'),
    change('2026-10-28', 'review by two outside models, 2 rounds; the pull request gives no test count'),
    change('2026-10-29', '499 tests; review by one outside model, 4 rounds'),
    change('2026-10-29', '75 SEO tests, and the full suite passed; review by one outside model, 1 round'),
    seen('2026-11-02'),
  ];
  const got = newestTestCount(log);
  expect(got.tests).toBe(499);
  expect(got.entry).toBe(log[2]);
});

test('C2: the same day is decided by the list order; a later date beats a later place in the list', () => {
  const first = change('2026-10-24', '420 tests; merged without a review');
  const second = change('2026-10-24', '439 tests; review by two outside models');
  expect(newestTestCount([first, second]).tests).toBe(439);
  expect(newestTestCount([second, first]).tests).toBe(420);
  // Listed last, but dated earlier: not newer.
  const older = change('2026-10-20', '312 tests; review by two outside models');
  expect(newestTestCount([first, older]).tests).toBe(420);
});

test('C3: a change to another repository never becomes the entry', () => {
  const log: Entry[] = [
    change('2026-10-24', '439 tests; review by two outside models'),
    change('2026-10-29', '600 tests; one review', GENAI),
    change('2026-10-30', '700 tests; review by one outside model', TOOLKIT),
    change('2026-10-31', '800 tests; a repository whose name only starts like this one', 'https://github.com/karero/croftweaver-site-extra/pull/'),
  ];
  expect(newestTestCount(log).tests).toBe(439);
  // And a count in another repository's entry does not satisfy C5.
  expect(() => newestTestCount(log.slice(1))).toThrow(/no change to this site states a test count/);
});

test('C4: a newer change that states a count another way stops the build and names it', () => {
  const base = change('2026-10-29', '499 tests; review by one outside model');
  for (const checks of ['458 tests and a check of the 103 security claims; review by one outside model', '499 tests, no flakes']) {
    const wrong = change('2026-11-02', checks);
    expect(() => newestTestCount([base, wrong]), checks).toThrow(`"${wrong.title}" (2026-11-02) states a test count`);
  }
  // A newer change on the same day, later in the list, is newer as well.
  const sameDay = change('2026-10-29', '501 tests and a check of the claims');
  expect(() => newestTestCount([base, sameDay])).toThrow(/states a test count/);
  // Wordings it does not catch, named in the plan: a count with a word between, and no count at all.
  expect(newestTestCount([base, change('2026-11-02', '75 SEO tests, and the full suite passed')]).tests).toBe(499);
  expect(newestTestCount([base, change('2026-11-02', 'review by two outside models, 2 rounds'), change('2026-11-02', undefined)]).tests).toBe(499);
  // An older change worded another way does not matter: only the changes newer than the chosen one are read.
  const oldOdd = change('2026-10-21', '312 and 298 tests; review by two outside models');
  expect(newestTestCount([oldOdd, base]).tests).toBe(499);
});

test('C5: no change to this site states a count: the build stops and says so', () => {
  expect(() => newestTestCount([])).toThrow(/no change to this site states a test count/);
  expect(() => newestTestCount([seen('2026-10-12'), change('2026-10-14', undefined), change('2026-10-15', 'its own check script; review by two outside models')])).toThrow(
    /no change to this site states a test count/,
  );
});

test('the tests row on /case-study shows the figure, pull request and day of the newest count in the log', async ({ page }) => {
  const { entry, tests } = newestTestCount(LOG);
  await page.goto('/case-study');
  const row = page.locator('[data-row="tests"]');
  await expect(row.locator('.figure')).toHaveText(String(tests));
  const link = row.locator('a');
  await expect(link).toHaveAttribute('href', entry.pr);
  const [, num] = entry.pr.match(/^https:\/\/github\.com\/karero\/croftweaver-site\/pull\/(\d+)$/)!;
  await expect(link).toHaveText(`karero/croftweaver-site#${num}`);
  const time = row.locator('time');
  await expect(time).toHaveAttribute('datetime', entry.date);
  const label = new Date(`${entry.date}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
  await expect(time).toHaveText(label);
});
