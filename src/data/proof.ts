// Proof data. PROOF is Google PageSpeed Insights, mobile test, home page of each site,
// shown on /more-proof; PANEL is the AI panel shown on the home page and /more-proof;
// SITE_PROOF is the one-site evidence on /proof. Every figure is per named site and
// dated (CONTENT_GUIDE.md, honesty rules). PageSpeed is one run each, lab data:
// re-measure all three before changing the date.
import searchCsv from '../../public/data/genai-wednesday-de-search-console.csv?raw';
import aiCsv from '../../public/data/genai-wednesday-de-ai-check.csv?raw';

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

// ── The weekly AI check, from the published export ───────────────────────────────
// One row per assistant, mode and question: how many calls answered, how many of the
// answers named the site, how many cited it, how many calls failed. The table on
// /proof is computed from this file, so its cells cannot drift from the download.
type Mode = 'with_search' | 'without_search';
type Check = { date: string; engine: string; mode: Mode; answers: number; named: number; cited: number; failed: number };
const aiLines = aiCsv.trim().split(/\r?\n/);
if (aiLines[0] !== 'date,engine,mode,question,answers,named,cited,failed') {
  throw new Error('genai-wednesday-de-ai-check.csv: unexpected header line.');
}
const checks: Check[] = aiLines.slice(1).map((line, i) => {
  const m = line.match(/^(\d{4}-\d{2}-\d{2}),([a-z-]+),(with_search|without_search),[12],(\d+),(\d+),(\d+),(\d+)$/);
  if (!m) throw new Error(`genai-wednesday-de-ai-check.csv, line ${i + 2} is malformed: "${line}".`);
  return { date: m[1]!, engine: m[2]!, mode: m[3] as Mode, answers: Number(m[4]), named: Number(m[5]), cited: Number(m[6]), failed: Number(m[7]) };
});
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
const earlierDate = checkDates.at(-2);
const total = (rows: Check[]) =>
  rows.length === 0
    ? null
    : rows.reduce(
        (t, c) => ({ answers: t.answers + c.answers, named: t.named + c.named, cited: t.cited + c.cited, failed: t.failed + c.failed }),
        { answers: 0, named: 0, cited: 0, failed: 0 },
      );
const on = (date: string, mode: Mode, engine?: string) =>
  total(checks.filter((c) => c.date === date && c.mode === mode && (!engine || c.engine === engine)));
const answers = (n: number) => `${n} ${n === 1 ? 'answer' : 'answers'}`;
const sentence = (t: NonNullable<ReturnType<typeof total>>, start: 'Named' | 'named') =>
  t.named > 0 && t.cited === t.named
    ? `${start} and cited the site in ${t.named} of ${answers(t.answers)}.`
    : `${start} it in ${t.named} of ${answers(t.answers)}.`;
const cell = (engine: string, mode: Mode) => {
  const now = on(checkDate, mode, engine);
  // No row at all: the assistant is not asked in this mode.
  if (!now) return mode === 'without_search' ? 'Always searches.' : 'Not asked with web search.';
  if (now.answers === 0) {
    const before = earlierDate ? on(earlierDate, mode, engine) : null;
    return before && before.answers > 0
      ? `No result: every call failed that day. On ${label(earlierDate!)} it ${sentence(before, 'named')}`
      : 'No result: every call failed that day.';
  }
  return sentence(now, 'Named') + (now.failed ? ` ${now.failed} ${now.failed === 1 ? 'call' : 'calls'} failed.` : '');
};
const overall = (mode: Mode) => {
  const t = on(checkDate, mode);
  if (!t) throw new Error(`genai-wednesday-de-ai-check.csv has no ${mode} rows for ${checkDate}.`);
  return { named: t.named, answers: t.answers };
};
// The same counts as the table, for the chart: one mark per answer that named the site,
// one per answer that did not, one per failed call. A string where the assistant is not
// asked in this mode (the same two cases as `cell`).
const marks = (engine: string, mode: Mode) => {
  const now = on(checkDate, mode, engine);
  if (!now) return mode === 'without_search' ? 'Always searches' : 'Not asked';
  if (now.named > now.answers) {
    throw new Error(`genai-wednesday-de-ai-check.csv: ${engine} (${mode}) names the site in more answers than it gave.`);
  }
  return { named: now.named, unnamed: now.answers - now.named, failed: now.failed };
};

// /proof and /why both say the relaunch falls inside the first block. The blocks are
// counted back from the last day in the file, so a new export can shift them.
const RELAUNCHED = '2026-03-27';
if (!(blocks[0]!.fromIso <= RELAUNCHED && RELAUNCHED <= blocks[0]!.toIso)) {
  throw new Error(`The first 28-day block (${blocks[0]!.fromIso} to ${blocks[0]!.toIso}) no longer contains the relaunch on ${RELAUNCHED}. Change the first day of the search export, or reword /proof and /why.`);
}

const POSITIONS_PERIOD = { from: '2 September 2026', to: '29 September 2026' };
if (POSITIONS_PERIOD.from !== blocks.at(-1)!.from || POSITIONS_PERIOD.to !== blocks.at(-1)!.to) {
  throw new Error('The search positions on /proof were pulled for another period than the latest 28-day block. Pull them again for the new block and update POSITIONS_PERIOD and the positions.');
}

export const SITE_PROOF = {
  site: 'genai-wednesday.de',
  url: 'https://genai-wednesday.de/',
  lab: 'https://genai-wednesday.de/builder-lab',
  relaunched: { iso: RELAUNCHED, label: label(RELAUNCHED) },
  // Stamp in the site's repository (.claude/skills/SUITE-VERSION).
  toolkit: { commit: '41cc760', copied: { iso: '2026-07-09', label: '9 July 2026' } },
  search: {
    csv: '/data/genai-wednesday-de-search-console.csv',
    blocks,
    latest: blocks.at(-1)!,
    peak,
    rolling,
    rollingFrom: { iso: rolling[0]!.iso, label: label(rolling[0]!.iso) },
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
    withSearch: overall('with_search'),
    withoutSearch: overall('without_search'),
  },
} as const;
