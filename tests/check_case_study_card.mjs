// The tests card on /case-study takes its figure from the newest change to this site that states a test
// count (plan: docs/reviews/PLAN-2026-11-03-case-study-upkeep.md, scenarios C1 to C5). Moving a citation by
// hand each week let the card stay on an old count without any error. Not a Playwright suite: that would
// add a suite the toolkit template does not have, and so change the suite count shown on /checks.
//
// Part 1 runs newestTestCount (src/data/case-study-log.ts, which imports nothing) on hand-built logs.
// Part 2 reads dist/case-study.html and holds the tests row to newestTestCount(LOG). The reader is run on
// hand-made pages first, so a reader that accepts everything would be caught. Needs Node with type stripping.
import { existsSync, statSync, readFileSync } from 'node:fs';
import { parse } from 'node-html-parser';
import { LOG, newestTestCount } from '../src/data/case-study-log.ts';

const SITE = 'https://github.com/karero/croftweaver-site/pull/';
let failed = 0;
const check = (name, ok, detail = '') => {
  console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${name}${ok ? '' : detail ? `: ${detail}` : ''}`);
  if (!ok) failed++;
};
const throwsWith = (fn, text) => {
  try { fn(); } catch (e) { return String(e.message).includes(text); }
  return false;
};

let n = 0;
const change = (date, checks, prBase = SITE) => ({
  kind: 'change', date, title: `change ${++n}`, asked: 'x', pr: `${prBase}${n}`, ...(checks === undefined ? {} : { checks }),
});
const seen = (date) => ({ kind: 'observation', date, title: `seen ${++n}`, seen: 'x', source: 'x' });

console.log('newestTestCount');
{
  // C1. The shape of the real log around 29 October: #155 has 499; #154 gives no count and #156 says "75 SEO tests".
  const log = [
    change('2026-10-26', '458 tests and a check of the 103 security claims; review by one outside model'),
    change('2026-10-28', 'review by two outside models, 2 rounds; the pull request gives no test count'),
    change('2026-10-29', '499 tests; review by one outside model, 4 rounds'),
    change('2026-10-29', '75 SEO tests, and the full suite passed; review by one outside model, 1 round'),
    seen('2026-11-02'),
  ];
  const got = newestTestCount(log);
  check('C1: the newest count wins, later changes without a leading count do not hide it', got.tests === 499 && got.entry === log[2]);
}
{
  // C2. Same day: the later entry in the list. A later date beats a later place in the list.
  const first = change('2026-10-24', '420 tests; merged without a review');
  const second = change('2026-10-24', '439 tests; review by two outside models');
  const older = change('2026-10-20', '312 tests; review by two outside models');
  check('C2: same day, the later entry wins', newestTestCount([first, second]).tests === 439);
  check('C2: same day, list order decides', newestTestCount([second, first]).tests === 420);
  check('C2: listed last but dated earlier is not newer', newestTestCount([first, older]).tests === 420);
}
{
  // C3. A change to another repository never becomes the entry.
  const log = [
    change('2026-10-24', '439 tests; review by two outside models'),
    change('2026-10-29', '600 tests; one review', 'https://github.com/GenAI-Wednesday/GenAI-Wednesday.de/pull/'),
    change('2026-10-30', '700 tests; review by one outside model', 'https://github.com/karero/croftweaver/pull/'),
    change('2026-10-31', '800 tests; a repository whose name only starts like this one', 'https://github.com/karero/croftweaver-site-extra/pull/'),
  ];
  check('C3: other repositories are skipped', newestTestCount(log).tests === 439);
  check('C3: a count in another repository does not satisfy C5', throwsWith(() => newestTestCount(log.slice(1)), 'no change to this site states a test count'));
}
{
  // C4. A newer change that states a count another way stops the build and names the entry.
  const base = change('2026-10-29', '499 tests; review by one outside model');
  for (const checks of ['458 tests and a check of the 103 security claims; review by one outside model', '499 tests, no flakes']) {
    const wrong = change('2026-11-02', checks);
    check(`C4: stops on "${checks.slice(0, 24)}..."`, throwsWith(() => newestTestCount([base, wrong]), `"${wrong.title}" (2026-11-02) states a test count`));
  }
  const sameDay = change('2026-10-29', '501 tests and a check of the claims');
  check('C4: a newer change on the same day, later in the list, is newer as well', throwsWith(() => newestTestCount([base, sameDay]), 'states a test count'));
  // Wordings it does not catch, named in the plan: a word between the number and "tests", and no count at all.
  check('C4: "75 SEO tests" is not noticed', newestTestCount([base, change('2026-11-02', '75 SEO tests, and the full suite passed')]).tests === 499);
  check('C4: no count at all is not noticed', newestTestCount([base, change('2026-11-02', 'review by two outside models, 2 rounds'), change('2026-11-02', undefined)]).tests === 499);
  // An older change worded another way does not matter: only changes newer than the chosen one are read.
  const oldOdd = change('2026-10-21', '312 and 298 tests; review by two outside models');
  check('C4: an older odd wording is never read', newestTestCount([oldOdd, base]).tests === 499);
}
{
  // C5. No change to this site states a count.
  check('C5: an empty log', throwsWith(() => newestTestCount([]), 'no change to this site states a test count'));
  check('C5: no count anywhere', throwsWith(() => newestTestCount([seen('2026-10-12'), change('2026-10-14', undefined), change('2026-10-15', 'its own check script; review by two outside models')]), 'no change to this site states a test count'));
}

// Part 2. What the built page shows in the tests row, compared with what the data says.
const dayLabel = (iso) => new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
const problems = (html, { entry, tests }) => {
  const row = parse(html).querySelector('[data-row="tests"]');
  if (!row) return ['no element with data-row="tests"'];
  const out = [];
  const figure = row.querySelector('.figure')?.text.trim();
  if (figure !== String(tests)) out.push(`figure is ${figure}, the log says ${tests}`);
  const link = row.querySelector('a');
  const num = entry.pr.match(/\/pull\/(\d+)$/)?.[1];
  if (link?.getAttribute('href') !== entry.pr) out.push(`link is ${link?.getAttribute('href')}, the log says ${entry.pr}`);
  if (link?.text.trim() !== `karero/croftweaver-site#${num}`) out.push(`link text is ${link?.text.trim()}`);
  const time = row.querySelector('time');
  if (time?.getAttribute('datetime') !== entry.date) out.push(`date is ${time?.getAttribute('datetime')}, the log says ${entry.date}`);
  if (time?.text.trim() !== dayLabel(entry.date)) out.push(`date text is ${time?.text.trim()}`);
  return out;
};

console.log('the tests row on the built page');
{
  const want = { entry: { pr: `${SITE}155`, date: '2026-10-29' }, tests: 499 };
  const page = (fig, href, label, iso, text) =>
    `<div data-row="tests"><dd><span class="figure">${fig}</span>, on <a href="${href}">${label}</a>, merged <time datetime="${iso}">${text}</time></dd></div>`;
  const good = page(499, `${SITE}155`, 'karero/croftweaver-site#155', '2026-10-29', '29 October 2026');
  check('reader: a page that matches has no problem', problems(good, want).length === 0, problems(good, want).join('; '));
  check('reader: a wrong figure is found', problems(good.replace('>499<', '>458<'), want).length === 1);
  check('reader: a wrong link is found', problems(good.replace('/155"', '/156"'), want).length >= 1);
  check('reader: a wrong day is found', problems(good.replace('2026-10-29', '2026-10-26'), want).length >= 1);
  check('reader: a page without the row is found', problems('<p>none</p>', want).length === 1);

  const PAGE = 'dist/case-study.html';
  const SOURCES = ['src/data/case-study.ts', 'src/data/case-study-log.ts', 'src/pages/case-study.astro'];
  const built = existsSync(PAGE) ? statSync(PAGE).mtimeMs : null;
  const stale = built === null ? null : SOURCES.find((f) => statSync(f).mtimeMs > built);
  if (built === null) check(`${PAGE} exists`, false, 'run npm run build');
  else if (stale) check(`${PAGE} is newer than ${stale}`, false, 'run npm run build');
  else {
    let expected = null;
    try { expected = newestTestCount(LOG); } catch (e) { check('newestTestCount(LOG) answers', false, e.message); }
    if (expected) {
      const found = problems(readFileSync(PAGE, 'utf8'), expected);
      check('the page shows the figure, pull request and day of newestTestCount(LOG)', found.length === 0, found.join('; '));
    }
  }
}

if (failed) { console.error(`case study card check: ${failed} failed`); process.exit(1); }
console.log('all checks passed');
