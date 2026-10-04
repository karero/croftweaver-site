// Proof strip on the home page: Google PageSpeed Insights, mobile test, home page of
// each site. Every figure is per named site and dated (CONTENT_GUIDE.md, honesty
// rules). One run each, lab data. Re-measure all three before changing the date.
import searchCsv from '../../public/data/genai-wednesday-de-search-console.csv?raw';

export const PROOF_MEASURED = { iso: '2026-10-04', label: '4 October 2026' } as const;

export const PROOF = [
  { site: 'genai-wednesday.de', url: 'https://genai-wednesday.de/', performance: 99, accessibility: 100, bestPractices: 100, seo: 100 },
  { site: 'm-squad.com', url: 'https://m-squad.com/', performance: 99, accessibility: 100, bestPractices: 100, seo: 100 },
  { site: 'apreet.com', url: 'https://apreet.com/', performance: 100, accessibility: 100, bestPractices: 100, seo: 100 },
] as const;

// ── /proof: one site with its full evidence (owner decision, 2026-10-04) ────────
// Search figures are computed from the published file, so the page and the download
// cannot disagree. To update: replace the CSV (date,clicks,impressions; one row per
// day, ending on the last day Search Console has data for) and re-check the dates,
// positions and AI results below against their sources.

type Day = { date: string; clicks: number; impressions: number };
const days: Day[] = searchCsv
  .trim()
  .split('\n')
  .slice(1)
  .map((line) => {
    const [date = '', clicks = '', impressions = ''] = line.split(',');
    return { date, clicks: Number(clicks), impressions: Number(impressions) };
  });
if (days.length < 56 || days.some((d) => !/^\d{4}-\d{2}-\d{2}$/.test(d.date) || !Number.isFinite(d.clicks) || !Number.isFinite(d.impressions))) {
  throw new Error('public/data/genai-wednesday-de-search-console.csv is missing rows or has a malformed line.');
}

const label = (iso: string) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
const sum = (slice: Day[]) => ({
  from: label(slice[0]!.date),
  to: label(slice.at(-1)!.date),
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

export const SITE_PROOF = {
  site: 'genai-wednesday.de',
  url: 'https://genai-wednesday.de/',
  lab: 'https://genai-wednesday.de/builder-lab',
  relaunched: { iso: '2026-03-27', label: '27 March 2026' },
  // Stamp in the site's repository (.claude/skills/SUITE-VERSION).
  toolkit: { commit: '41cc760', copied: { iso: '2026-07-09', label: '9 July 2026' } },
  search: {
    csv: '/data/genai-wednesday-de-search-console.csv',
    blocks,
    latest: blocks.at(-1)!,
    peak,
    // Average positions for the latest block (Search Console, pulled 2026-10-04).
    positions: [
      { query: 'ai events munich', position: '8.9', impressions: 105 },
      { query: 'ai events münchen', position: '8.0', impressions: 68 },
    ],
  },
  ai: {
    date: { iso: '2026-09-28', label: '28 September 2026' },
    earlier: '26 September 2026',
    questions: [
      'What are good AI meetups or events in Munich?',
      'Is there a free generative AI community in Munich for founders and builders that meets regularly?',
    ],
    rows: [
      { assistant: 'GPT (OpenAI)', withSearch: 'Named and cited the site in 6 of 6 answers.', withoutSearch: 'Named it in 0 of 6.' },
      { assistant: 'Perplexity', withSearch: 'Named and cited the site in 6 of 6 answers.', withoutSearch: 'Named it in 0 of 5. One call failed.' },
      { assistant: 'Google AI Mode', withSearch: 'Named and cited the site in 2 of 2 answers.', withoutSearch: 'Always searches.' },
      { assistant: 'Google AI Overview', withSearch: 'Named it in 0 of 1. One call failed.', withoutSearch: 'Always searches.' },
      { assistant: 'Gemini (Google)', withSearch: 'Not asked with web search.', withoutSearch: 'Named it in 0 of 6.' },
      { assistant: 'Claude (Anthropic)', withSearch: 'No result: every call failed that day. Two days earlier it named the site in 4 of 6 answers.', withoutSearch: 'No result that day. Two days earlier: 0 of 6.' },
    ],
  },
} as const;
