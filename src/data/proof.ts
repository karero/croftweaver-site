// Proof data. PROOF is Google PageSpeed Insights, mobile test, home page of each site,
// shown on /more-proof; PANEL is the AI panel shown on the home page and /more-proof;
// SITE_PROOF is the one-site evidence on /proof. Every figure is per named site and
// dated (CONTENT_GUIDE.md, honesty rules). PageSpeed is one run each, lab data:
// re-measure all three before changing the date.
import searchCsv from '../../public/data/genai-wednesday-de-search-console.csv?raw';
import aiCsv from '../../public/data/genai-wednesday-de-ai-check.csv?raw';
import { sentence } from './ai-words';

export const PROOF_MEASURED = { iso: '2026-10-04', label: '4 October 2026' } as const;

export const PROOF = [
  { site: 'genai-wednesday.de', url: 'https://genai-wednesday.de/', performance: 99, accessibility: 100, bestPractices: 100, seo: 100 },
  { site: 'm-squad.com', url: 'https://m-squad.com/', performance: 99, accessibility: 100, bestPractices: 100, seo: 100 },
  { site: 'apreet.com', url: 'https://apreet.com/', performance: 100, accessibility: 100, bestPractices: 100, seo: 100 },
] as const;

// ── The AI panel, on the home page and on /more-proof ───────────────────────────
// Four AI assistants were given the same prompt about genai-wednesday.de by the Builder
// Lab (https://genai-wednesday.de/builder-lab, second round). Copied from that page on
// 2026-10-08. They are opinions: GEO and E-E-A-T have no official scorer, and the Lab
// says so on its own page, together with a second caveat: scores are not comparable
// across assistants. Scores are stored in tenths so sums are exact; the averages are
// rounded half up, as the Lab shows them.
const panelRows = [
  { assistant: 'ChatGPT', seo: 90, geo: 92, eeat: 91 },
  { assistant: 'Gemini (Antigravity)', seo: 82, geo: 78, eeat: 84 },
  { assistant: 'Codex', seo: 90, geo: 87, eeat: 91 },
  { assistant: 'Perplexity', seo: 70, geo: 65, eeat: 75 },
] as const;
type Column = 'seo' | 'geo' | 'eeat';
const meanOf = (column: Column) => Math.round(panelRows.reduce((n, r) => n + r[column], 0) / panelRows.length);
const average = { seo: meanOf('seo'), geo: meanOf('geo'), eeat: meanOf('eeat') };
// The averages the Lab showed on the day these rows were copied. This is a consistency
// check, not a link to the Lab: the build never reads the Lab, so a later change there,
// or a small slip in a single row, is not seen. A careless edit that moves an average
// stops the build. Re-read the Lab before launch (README launch requirements).
const LAB_AVERAGE = { seo: 83, geo: 81, eeat: 85 } as const;
for (const column of ['seo', 'geo', 'eeat'] as const) {
  if (average[column] !== LAB_AVERAGE[column]) {
    throw new Error(`src/data/proof.ts: the ${column} rows average ${average[column]} but the Builder Lab showed ${LAB_AVERAGE[column]} when they were copied (both in tenths). Re-read the Lab page and update the rows and the averages together.`);
  }
}
/** 82 becomes "8.2". */
export const fmtScore = (tenths: number) => (tenths / 10).toFixed(1);

export const PANEL = {
  lab: 'https://genai-wednesday.de/builder-lab',
  readOn: { iso: '2026-10-08', label: '8 October 2026' },
  date: { iso: '2026-08-20', label: '20 August 2026' },
  firstRound: { iso: '2026-06-19', label: '19 June 2026' },
  rows: panelRows,
  average,
  geoLow: Math.min(...panelRows.map((r) => r.geo)),
  geoHigh: Math.max(...panelRows.map((r) => r.geo)),
  // The Lab's own wording of the prompt, so a visitor can reproduce the panel.
  labPrompt: 'Score genai-wednesday.de for SEO, GEO and E-E-A-T and suggest improvements.',
} as const;

// ── /proof: one site with its full evidence (owner decision, 2026-10-04) ────────
// Search figures are computed from the published file, so the page and the download
// cannot disagree. To update: replace the CSV (date,clicks,impressions; one row per
// day, ending on the last day Search Console has data for) and re-check the dates,
// positions and AI results below against their sources.

type Day = { date: string; clicks: number; impressions: number };
const dayAfter = (iso: string) => new Date(Date.parse(`${iso}T00:00:00Z`) + 86_400_000).toISOString().slice(0, 10);
// A real calendar day: 2026-02-31 parses, but as 3 March.
const realDay = (iso: string) => {
  const t = Date.parse(`${iso}T00:00:00Z`);
  return !Number.isNaN(t) && new Date(t).toISOString().slice(0, 10) === iso;
};
const searchLines = searchCsv.trim().split(/\r?\n/);
if (searchLines[0] !== 'date,clicks,impressions') {
  throw new Error('genai-wednesday-de-search-console.csv: the first line must be "date,clicks,impressions".');
}
const days: Day[] = searchLines.slice(1).map((line, i, all) => {
  const m = line.match(/^(\d{4}-\d{2}-\d{2}),(\d+),(\d+)$/);
  // One row per calendar day, in order, with no gap: the 28-day blocks rely on it.
  const expected = i === 0 ? undefined : dayAfter(all[i - 1]!.slice(0, 10));
  if (!m || !realDay(m[1]!) || (expected !== undefined && m[1] !== expected)) {
    throw new Error(`genai-wednesday-de-search-console.csv, line ${i + 2}: expected "${expected ?? 'YYYY-MM-DD'},clicks,impressions", got "${line}".`);
  }
  return { date: m[1]!, clicks: Number(m[2]), impressions: Number(m[3]) };
});
if (days.length < 56) throw new Error('genai-wednesday-de-search-console.csv needs at least 56 days.');

const label = (iso: string) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
const sum = (slice: Day[]) => ({
  from: label(slice[0]!.date),
  to: label(slice.at(-1)!.date),
  fromIso: slice[0]!.date,
  toIso: slice.at(-1)!.date,
  clicks: slice.reduce((n, d) => n + d.clicks, 0),
  impressions: slice.reduce((n, d) => n + d.impressions, 0),
});

// Consecutive 28-day blocks, counted back from the last day in the file.
const blocks: ReturnType<typeof sum>[] = [];
for (let end = days.length; end - 28 >= 0; end -= 28) blocks.unshift(sum(days.slice(end - 28, end)));
// The best 28 days anywhere in the file.
let peak = sum(days.slice(0, 28));
for (let start = 1; start + 28 <= days.length; start++) {
  const w = sum(days.slice(start, start + 28));
  if (w.clicks > peak.clicks) peak = w;
}
// The clicks in the 28 days up to each date, from the first date with a full 28 days.
// This is the line in the chart on /proof: its last point is the latest block and its
// highest is the peak. tests/a11y.spec.ts recomputes it from the CSV and compares.
const rolling = days.slice(27).map((d, i) => ({
  iso: d.date,
  clicks: days.slice(i, i + 28).reduce((n, x) => n + x.clicks, 0),
}));
// The first day with an impression: the chart caption says the file has none before it.
const firstSeen = days.find((d) => d.impressions > 0);
if (!firstSeen) throw new Error('genai-wednesday-de-search-console.csv has no impressions at all.');

// ── The weekly AI check, from the published export ───────────────────────────────
// One row per assistant, mode and question: how many calls answered, how many of the
// answers named the site, how many listed it among their sources ("cited"; for Perplexity
// those are its search results, see ai-words.ts), how many calls failed. The table on
// /proof is computed from this file, so its cells cannot drift from the download.
// Make the file with scripts/export-ai-check.py: it keeps this one site and nothing else.
// The check is not always run for every assistant. When it was not run for one on a day,
// declare it in NOT_RUN below: the page then says so and shows its last result. An assistant
// that is missing on any day and not declared stops the build, because it may be a gap in the export.
type Mode = 'with_search' | 'without_search';
type Check = { date: string; engine: string; mode: Mode; answers: number; named: number; cited: number; failed: number };
const aiLines = aiCsv.trim().split(/\r?\n/);
if (aiLines[0] !== 'date,engine,mode,question,answers,named,cited,failed') {
  throw new Error('genai-wednesday-de-ai-check.csv: unexpected header line.');
}
const questionsOf = new Map<string, string[]>();
const checks: Check[] = aiLines.slice(1).map((line, i) => {
  const m = line.match(/^(\d{4}-\d{2}-\d{2}),([a-z-]+),(with_search|without_search),([12]),(\d+),(\d+),(\d+),(\d+)$/);
  // The shape and a real calendar day: the export script checks both, and this is the page's own guard.
  if (!m || !realDay(m[1]!)) throw new Error(`genai-wednesday-de-ai-check.csv, line ${i + 2} is malformed: "${line}".`);
  const group = `${m[1]},${m[2]},${m[3]}`;
  questionsOf.set(group, [...(questionsOf.get(group) ?? []), m[4]!]);
  return { date: m[1]!, engine: m[2]!, mode: m[3] as Mode, answers: Number(m[5]), named: Number(m[6]), cited: Number(m[7]), failed: Number(m[8]) };
});
// Each assistant, mode and day has question 1 and question 2, once each: a missing or a repeated row
// would change a total without anyone noticing.
for (const [group, questions] of questionsOf) {
  if (questions.slice().sort().join() !== '1,2') {
    throw new Error(`genai-wednesday-de-ai-check.csv: ${group} has question ${questions.join(' and ')}; each assistant, mode and day needs question 1 and question 2, once each.`);
  }
}
const ENGINES = [
  ['openai', 'GPT (OpenAI)'],
  ['perplexity', 'Perplexity'],
  ['google-ai-mode', 'Google AI Mode'],
  ['google-overview', 'Google AI Overview'],
  ['gemini', 'Gemini (Google)'],
  ['anthropic', 'Claude (Anthropic)'],
] as const;
const unknown = checks.filter((c) => !ENGINES.some(([id]) => id === c.engine));
if (unknown.length) throw new Error(`genai-wednesday-de-ai-check.csv names an assistant /proof does not list: ${unknown[0]!.engine}.`);

const checkDates = [...new Set(checks.map((c) => c.date))].sort();
const checkDate = checkDates.at(-1)!;
const total = (rows: Check[]) =>
  rows.length === 0
    ? null
    : rows.reduce(
        (t, c) => ({ answers: t.answers + c.answers, named: t.named + c.named, cited: t.cited + c.cited, failed: t.failed + c.failed }),
        { answers: 0, named: 0, cited: 0, failed: 0 },
      );
const on = (date: string, mode: Mode, engine?: string) =>
  total(checks.filter((c) => c.date === date && c.mode === mode && (!engine || c.engine === engine)));
// Failed calls, as a clause after a result sentence.
const failedClause = (t: NonNullable<ReturnType<typeof total>>) => (t.failed ? ` ${t.failed} ${t.failed === 1 ? 'call' : 'calls'} failed.` : '');
// The assistants the check was not run for on a day, declared by hand when the file is made (the
// tracker records no skipped run). Whole assistants only: one that has rows on that day in one mode
// and not in another is a gap in the export, not a skipped run. The page names who was not run on the
// latest day; a declaration for an earlier day only keeps the build from calling that day's gap a fault.
const NOT_RUN: Record<string, string[]> = {
  '2026-10-08': ['google-ai-mode', 'google-overview'],
};
const skipped = NOT_RUN[checkDate] ?? [];
for (const [day, engines] of Object.entries(NOT_RUN)) {
  if (!checkDates.includes(day)) throw new Error(`src/data/proof.ts: NOT_RUN has ${day}, which is not a check day in the CSV (a typo?).`);
  for (const engine of engines) {
    if (!ENGINES.some(([id]) => id === engine)) throw new Error(`src/data/proof.ts: NOT_RUN names ${engine} on ${day}, which /proof does not list.`);
    if (checks.some((c) => c.date === day && c.engine === engine)) {
      throw new Error(`src/data/proof.ts: ${engine} is declared not run on ${day}, but the CSV has rows for it that day.`);
    }
  }
}
// The most recent earlier day on which the assistant answered in this mode.
const lastAnswered = (engine: string, mode: Mode) => {
  for (const date of checkDates.slice(0, -1).reverse()) {
    const t = on(date, mode, engine);
    if (t && t.answers > 0) return { date, t };
  }
  return null;
};
// An assistant can have no rows in a mode on purpose: Google's two assistants are search
// products, so they have no "without web search" mode, and the check does not ask Gemini
// with web search. Any other gap means rows are missing from the export, and the page must
// not explain it away as a property of the assistant.
const SEARCH_ONLY = ['google-ai-mode', 'google-overview'];
const NOT_ASKED_WITH_SEARCH = ['gemini'];
const absent = (engine: string, mode: Mode, date = checkDate): 'search-only' | 'not-asked' | 'not-run' => {
  if (mode === 'without_search' && SEARCH_ONLY.includes(engine)) return 'search-only';
  if (mode === 'with_search' && NOT_ASKED_WITH_SEARCH.includes(engine)) return 'not-asked';
  if ((NOT_RUN[date] ?? []).includes(engine)) return 'not-run';
  throw new Error(`genai-wednesday-de-ai-check.csv has no ${mode} rows for ${engine} on ${date}. If the check was not run for it that day, declare it in NOT_RUN in src/data/proof.ts. If the check does not ask it that way, add it to SEARCH_ONLY or NOT_ASKED_WITH_SEARCH. Otherwise the export is missing rows.`);
};
// Every check day, not only the latest: each assistant has each mode the check asks it in, or is
// declared not run that day. A mode or an assistant dropped from the middle of the file would
// otherwise pass unseen, and the last result shown for an assistant declared not run later would
// quietly come from an older day.
for (const date of checkDates) {
  for (const [engine] of ENGINES) {
    for (const mode of ['with_search', 'without_search'] as const) {
      if (!on(date, mode, engine)) absent(engine, mode, date);
    }
  }
}
const cell = (engine: string, mode: Mode) => {
  const now = on(checkDate, mode, engine);
  if (!now) {
    const why = absent(engine, mode);
    if (why === 'not-run') {
      const last = lastAnswered(engine, mode);
      return last ? `Not run that day. On ${label(last.date)} it ${sentence(last.t, 'named', engine)}${failedClause(last.t)}` : 'Not run that day.';
    }
    return why === 'search-only' ? 'Always searches.' : 'Not asked with web search.';
  }
  if (now.answers === 0) {
    const last = lastAnswered(engine, mode);
    return last
      ? `No result: every call failed that day. On ${label(last.date)} it ${sentence(last.t, 'named', engine)}${failedClause(last.t)}`
      : 'No result: every call failed that day.';
  }
  return sentence(now, 'Named', engine) + failedClause(now);
};
const overall = (mode: Mode) => {
  const t = on(checkDate, mode);
  if (!t) throw new Error(`genai-wednesday-de-ai-check.csv has no ${mode} rows for ${checkDate}.`);
  return { named: t.named, answers: t.answers, failed: t.failed };
};
const withSearch = overall('with_search');
const withoutSearch = overall('without_search');
// The same counts as the table, for the chart: one mark per answer that named the site,
// one per answer that did not, one per failed call. A string instead of marks where the
// assistant has nothing to count in this mode: it is not asked that way, the check does not
// ask it that way, or it was not run that day (the same three cases as `cell`, through `absent`).
const marks = (engine: string, mode: Mode) => {
  const now = on(checkDate, mode, engine);
  if (!now) {
    const why = absent(engine, mode);
    return why === 'not-run' ? 'Not run' : why === 'search-only' ? 'Always searches' : 'Not asked';
  }
  if (now.named > now.answers) {
    throw new Error(`genai-wednesday-de-ai-check.csv: ${engine} (${mode}) names the site in more answers than it gave.`);
  }
  return { named: now.named, unnamed: now.answers - now.named, failed: now.failed };
};
// Assistants whose every call failed that day: the chart shows only dashes for them, and the
// page says so, because a row of dashes must not be read as a verdict on the site.
const allFailed = ENGINES.filter(([engine]) => {
  const cells = (['with_search', 'without_search'] as const).map((mode) => on(checkDate, mode, engine)).filter((c) => c !== null);
  return cells.length > 0 && cells.every((c) => c.answers === 0 && c.failed > 0);
}).map(([, assistant]) => assistant);
// The assistants declared not run on the latest day: the page names them, and their cells give
// their last result.
const notRun = ENGINES.filter(([engine]) => skipped.includes(engine)).map(([, assistant]) => assistant);
/** Names in a sentence: "A", "A and B", "A, B and C". */
export const nameList = (names: readonly string[]) => (names.length < 3 ? names.join(' and ') : `${names.slice(0, -1).join(', ')} and ${names.at(-1)}`);

// /proof and /why both say the site's launch falls inside the first block. The blocks are
// counted back from the last day in the file, so a new export can shift them.
// The site launched on 27 March 2026 (owner, 2026-10-09; the pages called it a relaunch until then).
const LAUNCHED = '2026-03-27';
if (!(blocks[0]!.fromIso <= LAUNCHED && LAUNCHED <= blocks[0]!.toIso)) {
  throw new Error(`The first 28-day block (${blocks[0]!.fromIso} to ${blocks[0]!.toIso}) no longer contains the site's launch on ${LAUNCHED}. Change the first day of the search export, or reword /proof and /why.`);
}

const POSITIONS_PERIOD = { from: '2 September 2026', to: '29 September 2026' };
if (POSITIONS_PERIOD.from !== blocks.at(-1)!.from || POSITIONS_PERIOD.to !== blocks.at(-1)!.to) {
  throw new Error('The search positions on /proof were pulled for another period than the latest 28-day block. Pull them again for the new block and update POSITIONS_PERIOD and the positions.');
}

export const SITE_PROOF = {
  site: 'genai-wednesday.de',
  url: 'https://genai-wednesday.de/',
  lab: 'https://genai-wednesday.de/builder-lab',
  launched: { iso: LAUNCHED, label: label(LAUNCHED) },
  // Stamp in the site's repository (.claude/skills/SUITE-VERSION).
  toolkit: { commit: '41cc760', copied: { iso: '2026-07-09', label: '9 July 2026' } },
  search: {
    csv: '/data/genai-wednesday-de-search-console.csv',
    blocks,
    latest: blocks.at(-1)!,
    peak,
    rolling,
    rollingFrom: { iso: rolling[0]!.iso, label: label(rolling[0]!.iso) },
    fileFrom: { iso: days[0]!.date, label: label(days[0]!.date) },
    firstImpression: { iso: firstSeen.date, label: label(firstSeen.date) },
    // Average positions from Search Console's query report for exactly this period
    // (whole site, all countries; pulled 2026-10-04). Checked against `latest` below.
    positionsPeriod: POSITIONS_PERIOD,
    positions: [
      { query: 'ai events munich', position: '8.9' },
      { query: 'ai events münchen', position: '8.0' },
    ],
  },
  ai: {
    csv: '/data/genai-wednesday-de-ai-check.csv',
    date: { iso: checkDate, label: label(checkDate) },
    // Question 1 and question 2 in the export.
    questions: [
      'What are good AI meetups or events in Munich?',
      'Is there a free generative AI community in Munich for founders and builders that meets regularly?',
    ],
    rows: ENGINES.map(([engine, assistant]) => ({
      assistant,
      withSearch: cell(engine, 'with_search'),
      withoutSearch: cell(engine, 'without_search'),
    })),
    chart: ENGINES.map(([engine, assistant]) => ({
      engine,
      assistant,
      withSearch: marks(engine, 'with_search'),
      withoutSearch: marks(engine, 'without_search'),
    })),
    allFailed,
    notRun,
    withSearch,
    withoutSearch,
    // /proof says why nobody named the site from memory, and /why points to it, only while that is
    // true as written: some answers came from memory, none named the site, and with web search some did.
    explainZero: withoutSearch.answers > 0 && withoutSearch.named === 0 && withSearch.named > 0,
  },
} as const;
