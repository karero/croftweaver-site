// The case study: Croftweaver used on its own site, croftweaver.com, from launch onwards (owner decisions,
// 2026-10-21: its own page and its own export, counts only). Three sources and no others:
//   public/data/croftweaver-com-ai-check.csv and croftweaver-com-search-console.csv, both written by
//   scripts/export-own-site.py, and LOG below. Every figure on /case-study comes from one of them.
// The page says what was seen after a change, never that the change caused it (CONTENT_GUIDE.md).
// Upkeep, weekly: rerun the export after the weekly AI check, add the week's entries to LOG, set UPDATED.
import aiCsv from '../../public/data/croftweaver-com-ai-check.csv?raw';
import searchCsv from '../../public/data/croftweaver-com-search-console.csv?raw';

export const UPDATED = { iso: '2026-10-21', label: '21 October 2026' } as const;
export const LAUNCH = { iso: '2026-10-12', label: '12 October 2026' } as const;

const realDay = (s: string) => {
  const d = new Date(`${s}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s;
};
export const dayLabel = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

// ── The log ─────────────────────────────────────────────────────────────────────
// A change has a merged pull request; "live" is its merge day (both sites publish from main, the
// toolkit README is live on GitHub when merged). An observation is something seen, with its source.
type Change = { kind: 'change'; date: string; title: string; asked: string; pr: string; checks?: string; next?: string };
type Observation = { kind: 'observation'; date: string; title: string; seen: string; source: string };
export type Entry = Change | Observation;

export const PR_REPOS = ['karero/croftweaver', 'karero/croftweaver-site', 'GenAI-Wednesday/GenAI-Wednesday.de'] as const;

export const LOG: readonly Entry[] = [
  { kind: 'observation', date: '2026-10-12', title: 'The site goes live',
    seen: 'croftweaver.com is live on Cloudflare Pages, built with Croftweaver from its starter. The first Google impressions arrive the same day.',
    source: 'the site launch; Google Search Console, daily figures above' },
  { kind: 'observation', date: '2026-10-13', title: 'A first AI check, run by an outside reviewer',
    seen: 'An outside review asked ChatGPT and Perplexity (with web search) and Gemini (without) six questions that do not name Croftweaver: 0 of 18 answers named it.',
    source: 'a one-off run through the assistants’ APIs, a different method from the weekly check below' },
  { kind: 'change', date: '2026-10-14', title: 'README: who maintains it, and what works on a live site',
    asked: 'Say who maintains Croftweaver and which parts work on a site that is already live, near the top of the README.',
    pr: 'https://github.com/karero/croftweaver/pull/284', next: '2026-10-18' },
  { kind: 'change', date: '2026-10-14', title: 'An About page with a note from the maintainer',
    asked: 'Add a page that says who is behind Croftweaver and how to reach the maintainer.',
    pr: 'https://github.com/karero/croftweaver-site/pull/75', next: '2026-10-18' },
  { kind: 'change', date: '2026-10-18', title: 'README: the first paragraph matches the home page',
    asked: 'Open the README with the home page’s definition, and say exactly which assistants were tested from start to finish.',
    pr: 'https://github.com/karero/croftweaver/pull/355', next: '2026-10-18' },
  { kind: 'observation', date: '2026-10-18', title: 'Bing could not crawl the home page',
    seen: 'Bing Webmaster Tools listed the home page as discovered but not crawled: its fetch failed. Cloudflare’s security log for the week shows no request from Bing that was blocked.',
    source: 'Bing Webmaster Tools, URL inspection; Cloudflare security events, last 7 days, read on 20 October' },
  { kind: 'observation', date: '2026-10-20', title: '14 of 15 pages indexed by Google',
    seen: 'Google has indexed 14 of the 15 pages it knows about.',
    source: 'Google Search Console, page indexing report, read on 20 October' },
  { kind: 'observation', date: '2026-10-20', title: 'Asking the assistants again',
    seen: 'Four more questions that do not name Croftweaver, asked in the ChatGPT app and through Perplexity’s API, and six in the Gemini app: 0 of 14 answers named it. Asked by name, Gemini said Croftweaver cannot improve an existing website; it was citing genai-wednesday.de, which never said that it can.',
    source: 'a one-off run, signed in, a different method from the weekly check below' },
  { kind: 'change', date: '2026-10-20', title: 'The roadmap says when it was last read through',
    asked: 'Show the date and release the roadmap was last checked against, and add a contents line to the page for established sites.',
    pr: 'https://github.com/karero/croftweaver-site/pull/102', checks: '312 tests; review by two outside models, 2 rounds' },
  { kind: 'change', date: '2026-10-20', title: 'The ranking answer on the home page',
    asked: 'Keep the headline “Weave websites that rank.” and answer “Will it rank my site?” without a promise; say on the About page how AI is used.',
    pr: 'https://github.com/karero/croftweaver-site/pull/105', checks: '312 tests; review by two outside models, 1 round' },
  { kind: 'observation', date: '2026-10-20', title: 'Bing indexing requested',
    seen: 'Indexing of the home page was requested in Bing Webmaster Tools. The outcome is pending.',
    source: 'Bing Webmaster Tools' },
  { kind: 'change', date: '2026-10-21', title: 'Saying plainly that it works on a site you already have',
    asked: 'Answer “Can it improve a website I already have?” on the home page, and say the same on genai-wednesday.de, the page Gemini was citing.',
    pr: 'https://github.com/karero/croftweaver-site/pull/107', checks: '312 and 298 tests; review by two outside models, 1 round' },
  { kind: 'change', date: '2026-10-21', title: 'The same, on genai-wednesday.de',
    asked: 'Add “Already have a website?” to the Croftweaver page on genai-wednesday.de, in English and German.',
    pr: 'https://github.com/GenAI-Wednesday/GenAI-Wednesday.de/pull/53', checks: '298 tests; reviewed together with the change above' },
];

const PR = /^https:\/\/github\.com\/([A-Za-z0-9-]+\/[A-Za-z0-9.-]+)\/pull\/(\d+)$/;
for (const e of LOG) {
  if (!realDay(e.date)) throw new Error(`src/data/case-study.ts: "${e.title}" has no real day: ${e.date}.`);
  if (e.kind === 'change') {
    const m = e.pr.match(PR);
    if (!m || !(PR_REPOS as readonly string[]).includes(m[1]!)) {
      throw new Error(`src/data/case-study.ts: "${e.title}" needs a pull request of ${PR_REPOS.join(', ')}, got ${e.pr}.`);
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
type Row = { date: string; engine: string; mode: string; question: string; marker: string; answers: number; named: number; sources: number; failed: number; noAnswer: number };
const rows: Row[] = aiLines.slice(1).map((line, i) => {
  // run_id, rev, question_text, config_rev, models_reported, route: plain values the export checks; models_reported
  // is empty when every call failed.
  const m = line.match(/^(\d{4}-\d{2}-\d{2}),([a-z-]+),(with_search|without_search),([12]),([A-Za-z0-9-]+),(\d+),([0-9a-f]{8}),([A-Za-z0-9]*),([A-Za-z0-9._\/:|-]*),([a-z]+),(\d+),(\d+),(\d+),(\d+),([01])$/);
  if (!m || !realDay(m[1]!)) throw new Error(`croftweaver-com-ai-check.csv, line ${i + 2} is malformed: "${line}".`);
  const row = {
    date: m[1]!, engine: m[2]!, mode: m[3]!, question: m[4]!,
    marker: [m[6], m[7], m[8], m[9], m[10]].join(','),
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
// series' previous answered day. Series = one assistant, mode and question, as geo_check.py --trend groups
// them; like the trend, a day with no answer (every call failed, or Google showed no AI answer) is not
// compared. No movement is read across a break.
const series = new Map<string, Row[]>();
for (const r of rows.filter((x) => x.answers > 0 && x.noAnswer === 0)) {
  const k = `${r.engine}|${r.mode}|${r.question}`;
  series.set(k, [...(series.get(k) ?? []), r]);
}
export const BREAKS = [...series.values()].flatMap((rs) => {
  const sorted = [...rs].sort((a, b) => (a.date < b.date ? -1 : 1));
  return sorted.slice(1).filter((r, i) => r.marker !== sorted[i]!.marker).map((r) => ({ date: r.date, engine: r.engine }));
});
export const BREAK_DAYS = new Set(BREAKS.map((b) => b.date));
