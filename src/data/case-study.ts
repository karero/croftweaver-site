// The case study: Croftweaver used on its own site, croftweaver.com, from launch onwards (owner decisions,
// 2026-10-21: its own page and its own export, counts only). Its figures have three sources and no others:
//   public/data/croftweaver-com-ai-check.csv and croftweaver-com-search-console.csv, both written by
//   scripts/export-own-site.py, and LOG below. Every figure on /case-study comes from one of them; CARDS
//   restates log entries. The hero's screenshot (CAPTURE) is separate evidence, not a figure.
// The page says what was seen after a change, never that the change caused it (CONTENT_GUIDE.md).
// Upkeep, weekly: rerun the export after the weekly AI check, add the week's entries to LOG, set UPDATED.
// `python3 scripts/case-study-audit.py` says what is due (a Monday reminder runs it).
import aiCsv from '../../public/data/croftweaver-com-ai-check.csv?raw';
import searchCsv from '../../public/data/croftweaver-com-search-console.csv?raw';
import { LOG, PR_REPOS, PRIVATE_REPOS, newestTestCount, type Entry } from './case-study-log';

export const UPDATED = { iso: '2026-11-02', label: '2 November 2026' } as const;
export const LAUNCH = { iso: '2026-10-12', label: '12 October 2026' } as const;

const realDay = (s: string) => {
  const d = new Date(`${s}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s;
};
export const dayLabel = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

// ── The log ─────────────────────────────────────────────────────────────────────
// LOG and its types live in case-study-log.ts, which imports nothing, so a test can load them.
export { LOG, PR_REPOS, PRIVATE_REPOS };
export type { Entry };

const PR = /^https:\/\/github\.com\/([A-Za-z0-9-]+\/[A-Za-z0-9.-]+)\/pull\/(\d+)$/;
for (const e of LOG) {
  if (!realDay(e.date)) throw new Error(`src/data/case-study.ts: "${e.title}" has no real day: ${e.date}.`);
  if (e.kind === 'change') {
    const m = e.pr.match(PR);
    if (!m || !(PR_REPOS as readonly string[]).includes(m[1]!)) {
      throw new Error(`src/data/case-study.ts: "${e.title}" needs a pull request of ${PR_REPOS.join(', ')}, got ${e.pr}.`);
    }
    // Without its own checks the page points to the pull request, which a visitor cannot open when the repository is private.
    if ((PRIVATE_REPOS as readonly string[]).includes(m[1]!) && !e.checks) {
      throw new Error(`src/data/case-study.ts: "${e.title}" cites a private repository's pull request, so it needs its own checks.`);
    }
    if (e.next !== undefined && !realDay(e.next)) throw new Error(`src/data/case-study.ts: "${e.title}" has a next measurement that is not a day.`);
  } else if (!e.source.trim()) {
    throw new Error(`src/data/case-study.ts: the observation "${e.title}" needs its source.`);
  }
}
if (LOG.some((e) => e.date > UPDATED.iso)) throw new Error('src/data/case-study.ts: an entry is dated after UPDATED.');

/** Newest first, as the page shows them. */
export const LOG_NEWEST = [...LOG].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
export const prLabel = (url: string) => {
  const m = url.match(PR)!;
  return `${m[1]}#${m[2]}`;
};
export const prPrivate = (url: string) => (PRIVATE_REPOS as readonly string[]).includes(url.match(PR)![1]!);

// ── The hero and the summary cards ──────────────────────────────────────────────
export const SITE_REPO = 'https://github.com/karero/croftweaver-site';
// The day the screenshots in public/images/case-study/ were captured from the live site; the file names carry it.
export const CAPTURE = { iso: '2026-10-27', label: dayLabel('2026-10-27') } as const;

// Card figures the CSV files do not hold are read from the log entry each card cites (named by date and
// title; the tests card takes the newest change that states a test count, newestTestCount), so a card cannot
// disagree with its entry. The build fails when an entry does not say a figure in
// exactly these words. Bing's request is still pending in the log, so its card has no figure.
const cited = (date: string, title: string) => {
  const e = LOG.find((x) => x.date === date && x.title === title);
  if (!e) throw new Error(`src/data/case-study.ts: CARDS cites "${title}" (${date}), which is not in LOG.`);
  return e;
};
const read = (text: string, re: RegExp, what: string) => {
  const m = text.match(re);
  if (!m) throw new Error(`src/data/case-study.ts: the log entry a card cites no longer says ${what} as ${re}.`);
  return Number(m[1]);
};
const indexedEntry = cited('2026-10-25', 'Three new pages, 22 in all, all indexed by Google');
const bingEntry = cited('2026-10-20', 'Bing indexing requested');
const newestTests = newestTestCount(LOG);
if (indexedEntry.kind !== 'observation' || bingEntry.kind !== 'observation') {
  throw new Error('src/data/case-study.ts: CARDS cites an entry of the wrong kind.');
}
if (!bingEntry.seen.includes('The outcome is pending.')) throw new Error('src/data/case-study.ts: the Bing request is no longer pending; give the Bing card its figure.');
export const CARDS = {
  google: {
    date: indexedEntry.date,
    pages: read(indexedEntry.seen, /\bThe site now has (\d+) pages\b/, 'the page count'),
    indexed: read(indexedEntry.seen, /\bGoogle lists all (\d+) as indexed\b/, 'the indexed count'),
  },
  bing: { date: bingEntry.date, indexed: null as number | null },
  tests: { date: newestTests.entry.date, tests: newestTests.tests },
};
export const TESTS_PR = newestTests.entry.pr;
export const measured = (n: number | null, shown: (n: number) => string = String) => (n === null ? 'Not yet measured' : shown(n));

// ── Google Search Console, daily ────────────────────────────────────────────────
const searchLines = searchCsv.trim().split(/\r?\n/);
if (searchLines[0] !== 'date,clicks,impressions') throw new Error('croftweaver-com-search-console.csv: unexpected header line.');
export const DAILY = searchLines.slice(1).map((line, i) => {
  const m = line.match(/^(\d{4}-\d{2}-\d{2}),(\d+),(\d+)$/);
  if (!m || !realDay(m[1]!)) throw new Error(`croftweaver-com-search-console.csv, line ${i + 2} is malformed: "${line}".`);
  const row = { date: m[1]!, clicks: Number(m[2]), impressions: Number(m[3]) };
  if (row.clicks > row.impressions) throw new Error(`croftweaver-com-search-console.csv, line ${i + 2}: more clicks than impressions.`);
  return row;
});
DAILY.forEach((r, i) => {
  if (i > 0 && r.date <= DAILY[i - 1]!.date) throw new Error('croftweaver-com-search-console.csv: days out of order or repeated.');
});
export const SEARCH = {
  from: DAILY[0]!.date,
  to: DAILY[DAILY.length - 1]!.date,
  clicks: DAILY.reduce((n, r) => n + r.clicks, 0),
  impressions: DAILY.reduce((n, r) => n + r.impressions, 0),
};

// ── The weekly AI check ─────────────────────────────────────────────────────────
// Totals per day and mode over all assistants. "Among the sources returned" counts answers whose
// returned sources include croftweaver.com; the page never calls it "cited": for some assistants the
// check cannot tell which sources the answer's text uses (the toolkit's geo_check.py says so).
const AI_HEAD = 'date,engine,mode,question,run_id,rev,question_text,config_rev,models_reported,route,answers,named,sources_listed,failed,no_answer';
const aiLines = aiCsv.trim().split(/\r?\n/);
if (aiLines[0] !== AI_HEAD) throw new Error('croftweaver-com-ai-check.csv: unexpected header line.');
type Row = { date: string; engine: string; mode: string; question: string; marker: string; model: string; answers: number; named: number; sources: number; failed: number; noAnswer: number };
const rows: Row[] = aiLines.slice(1).map((line, i) => {
  // run_id, rev, question_text, config_rev, models_reported, route: plain values the export checks; models_reported
  // is empty when every call failed.
  const m = line.match(/^(\d{4}-\d{2}-\d{2}),([a-z-]+),(with_search|without_search),([12]),([A-Za-z0-9-]+),(\d+),([0-9a-f]{8}),([A-Za-z0-9]*),([A-Za-z0-9._\/:|-]*),([a-z]+),(\d+),(\d+),(\d+),(\d+),([01])$/);
  if (!m || !realDay(m[1]!)) throw new Error(`croftweaver-com-ai-check.csv, line ${i + 2} is malformed: "${line}".`);
  const row = {
    date: m[1]!, engine: m[2]!, mode: m[3]!, question: m[4]!,
    marker: [m[6], m[7], m[8], m[10]].join(','), model: m[9]!,
    answers: Number(m[11]), named: Number(m[12]), sources: Number(m[13]), failed: Number(m[14]), noAnswer: Number(m[15]),
  };
  if (row.named > row.answers || row.sources > row.answers) throw new Error(`croftweaver-com-ai-check.csv, line ${i + 2}: counts above the answers.`);
  return row;
});

export const AI_DAYS = [...new Set(rows.map((r) => r.date))].sort().map((date) => {
  const sum = (mode: string) => {
    const rs = rows.filter((r) => r.date === date && r.mode === mode);
    return {
      answers: rs.reduce((n, r) => n + r.answers, 0),
      named: rs.reduce((n, r) => n + r.named, 0),
      sources: rs.reduce((n, r) => n + r.sources, 0),
      failed: rs.reduce((n, r) => n + r.failed, 0),
      noAnswer: rs.reduce((n, r) => n + r.noAnswer, 0),
      assistants: new Set(rs.map((r) => r.engine)).size,
    };
  };
  return { date, label: dayLabel(date), withSearch: sum('with_search'), withoutSearch: sum('without_search') };
});

// A break: the question (its revision or its text), the settings, the model or the route differs from the
// series' previous day. Series = one assistant, mode and question, as geo_check.py --trend groups them.
// Every day counts here, answered or not (stricter than the trend), so a change on a day with no answer is
// still marked and the page's "nothing changed" sentence stays true. No movement is read across a break.
const series = new Map<string, Row[]>();
for (const r of rows) {
  const k = `${r.engine}|${r.mode}|${r.question}`;
  series.set(k, [...(series.get(k) ?? []), r]);
}
// The model is compared only between days that name one: when every call failed, geo_check.py writes
// no model, which says nothing about whether the model changed.
export const BREAKS = [...series.values()].flatMap((rs) => {
  const sorted = [...rs].sort((a, b) => (a.date < b.date ? -1 : 1));
  let lastModel = '';
  return sorted.flatMap((r, i) => {
    const prev = sorted[i - 1];
    const modelChanged = r.model !== '' && lastModel !== '' && r.model !== lastModel;
    if (r.model !== '') lastModel = r.model;
    return prev && (r.marker !== prev.marker || modelChanged) ? [{ date: r.date, engine: r.engine }] : [];
  });
});
export const BREAK_DAYS = new Set(BREAKS.map((b) => b.date));
