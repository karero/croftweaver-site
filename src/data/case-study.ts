// The case study: Croftweaver used on its own site, croftweaver.com, from launch onwards (owner decisions,
// 2026-10-21: its own page and its own export, counts only). Three sources and no others:
//   public/data/croftweaver-com-ai-check.csv and croftweaver-com-search-console.csv, both written by
//   scripts/export-own-site.py, and LOG below. Every figure on /case-study comes from one of them.
// The page says what was seen after a change, never that the change caused it (CONTENT_GUIDE.md).
// Upkeep, weekly: rerun the export after the weekly AI check, add the week's entries to LOG, set UPDATED.
import aiCsv from '../../public/data/croftweaver-com-ai-check.csv?raw';
import searchCsv from '../../public/data/croftweaver-com-search-console.csv?raw';

export const UPDATED = { iso: '2026-10-25', label: '25 October 2026' } as const;
export const LAUNCH = { iso: '2026-10-12', label: '12 October 2026' } as const;

const realDay = (s: string) => {
  const d = new Date(`${s}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s;
};
export const dayLabel = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

// ── The log ─────────────────────────────────────────────────────────────────────
// A change has a merged pull request, dated by its merge day. Merge is not publication: croftweaver.com
// goes live when main is shipped to its production branch (scripts/ship.sh); genai-wednesday.de and the
// toolkit README follow their own repositories. An observation is something seen, with its source.
type Change = { kind: 'change'; date: string; title: string; asked: string; pr: string; checks?: string; next?: string };
type Observation = { kind: 'observation'; date: string; title: string; seen: string; source: string };
export type Entry = Change | Observation;

export const PR_REPOS = ['karero/croftweaver', 'karero/croftweaver-site', 'GenAI-Wednesday/GenAI-Wednesday.de'] as const;
// A visitor gets a 404 from a private repository's pull request, so the page names these without a link.
export const PRIVATE_REPOS: readonly (typeof PR_REPOS)[number][] = ['GenAI-Wednesday/GenAI-Wednesday.de'];

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
  { kind: 'change', date: '2026-10-22', title: 'A checklist of SEO checks for sites an AI assistant built',
    asked: 'Add a page for people whose site an AI assistant built: eight SEO checks, the Croftweaver test behind each, what happened when each was broken on purpose, and what a passing test does not prove.',
    pr: 'https://github.com/karero/croftweaver-site/pull/112', checks: '337 tests; review by two outside models, 2 rounds' },
  { kind: 'change', date: '2026-10-22', title: 'A security.txt that says where to report a flaw',
    asked: 'Publish a security.txt with a contact for reporting a security flaw, and add a check that keeps the file valid.',
    pr: 'https://github.com/karero/croftweaver-site/pull/114', checks: 'its own check script; review by two outside models, 3 rounds' },
  { kind: 'change', date: '2026-10-22', title: 'A page on what a static website changes for security',
    asked: 'Answer “Is Croftweaver safer than WordPress?” on a page of its own, with a source and a reading date for every claim.',
    pr: 'https://github.com/karero/croftweaver-site/pull/118', checks: '352 tests and a check of its 67 claims; review by two outside models, 3 rounds' },
  { kind: 'change', date: '2026-10-23', title: 'A footer that lists the pages in four columns',
    asked: 'Draw the footer as four labelled columns that list every page except the home page and the error page once, and add a test that fails when one is missing.',
    pr: 'https://github.com/karero/croftweaver-site/pull/119', checks: '361 tests; review by two outside models, 2 rounds' },
  { kind: 'change', date: '2026-10-23', title: 'A header with groups of links',
    asked: 'Group the header links under names that open a list, such as “Skills & checks” and “For your site”.',
    pr: 'https://github.com/karero/croftweaver-site/pull/122', checks: '387 tests; review by two outside models, 3 rounds; Codex took part in round 2 only' },
  { kind: 'change', date: '2026-10-23', title: 'A page on what a Croftweaver site runs on',
    asked: 'Explain the technology behind a Croftweaver site in plain words: the three places it lives, what each costs and its limits, and what can be swapped.',
    pr: 'https://github.com/karero/croftweaver-site/pull/121', checks: '379 tests; review by two outside models, 4 rounds, with the last additions read by Codex alone' },
  { kind: 'change', date: '2026-10-23', title: 'One table style, stacked on a phone',
    asked: 'Give every table on the site one style, and turn text tables into labelled rows on a phone instead of letting them scroll sideways.',
    pr: 'https://github.com/karero/croftweaver-site/pull/124', checks: '376 tests; review by one outside model, 3 rounds' },
  { kind: 'change', date: '2026-10-23', title: 'A Technology group in the header',
    asked: 'Put Security and What It Runs On together in the header, as a group named Technology.',
    pr: 'https://github.com/karero/croftweaver-site/pull/128', checks: '421 tests; review by two outside models, 1 round' },
  { kind: 'change', date: '2026-10-24', title: 'A Croftweaver site next to a shop',
    asked: 'Say that a shop needs a shop platform, and that a Croftweaver site can sit next to it with guides and articles on the topics of its products.',
    pr: 'https://github.com/karero/croftweaver-site/pull/130', checks: '420 tests; merged without a review, which was still owed on 24 October' },
  { kind: 'change', date: '2026-10-24', title: 'Two more AI check days on /proof',
    asked: 'Add the AI check runs of 12 and 19 October for genai-wednesday.de to the page that measures that site.',
    pr: 'https://github.com/karero/croftweaver-site/pull/132', checks: '420 tests; review by two outside models, 1 round' },
  { kind: 'change', date: '2026-10-24', title: 'The WordPress trial, said more exactly',
    asked: 'On /from-wordpress, say only what the trial recorded: 54 media items, not files, and a file that the old site’s local sitemap listed.',
    pr: 'https://github.com/karero/croftweaver-site/pull/134', checks: '421 tests; review by two outside models, 1 round' },
  { kind: 'change', date: '2026-10-24', title: 'The current page, underlined in the header',
    asked: 'Underline the current menu item, and its group, so the current page shows at a glance.',
    pr: 'https://github.com/karero/croftweaver-site/pull/136', checks: '439 tests; review by two outside models, 2 rounds' },
  { kind: 'change', date: '2026-10-24', title: 'The site brought up to release 0.33',
    asked: 'Say 0.33 wherever the site names the current release, and correct what 0.33 changed: the skill count, the roadmap, the WordPress forwarding and the Node a build needs.',
    pr: 'https://github.com/karero/croftweaver-site/pull/137', checks: '439 tests; review by two outside models, 2 rounds' },
  { kind: 'change', date: '2026-10-24', title: 'genai-wednesday.de: what Search Console shows now',
    asked: 'Replace “keeps climbing” on the Croftweaver pages of genai-wednesday.de with the figures Search Console shows now, and say “launch”, not “relaunch”.',
    pr: 'https://github.com/GenAI-Wednesday/GenAI-Wednesday.de/pull/57', checks: '300 tests; one review, not by an outside model' },
  { kind: 'change', date: '2026-10-24', title: 'genai-wednesday.de: skills for AI coding assistants',
    asked: 'Call Croftweaver “website skills for AI coding assistants” on four more pages of genai-wednesday.de, instead of “Claude Code skills”.',
    pr: 'https://github.com/GenAI-Wednesday/GenAI-Wednesday.de/pull/58', checks: '300 tests; reviewed together with the change above' },
  { kind: 'observation', date: '2026-10-24', title: 'What went live, and when',
    seen: 'The checklist page and security.txt went live on 22 October; /security, /what-it-runs-on, the new header and footer and the table style on 23 October; the Technology group, the shop wording, the two check days on /proof and the WordPress wording on 24 October. The underlined current page and the 0.33 update were merged but not yet live when this was read.',
    source: 'Cloudflare Pages, production deployments, read on 24 October' },
  { kind: 'observation', date: '2026-10-24', title: 'Croftweaver 0.33 is released',
    seen: 'Release 0.33 of the toolkit came out. Three of its changes are also on this site: one table style, monthly Dependabot updates with a read-only token for the checks, and a publish script that can take main straight from GitHub.',
    source: 'the 0.33 release notes on GitHub; this site’s pull requests 124, 111 and 127' },
  { kind: 'observation', date: '2026-10-25', title: 'Three new pages, 22 in all, all indexed by Google',
    seen: 'Three pages went live: the SEO checklist (/ai-website-seo-checklist) on 22 October, and /security and /what-it-runs-on on 23 October. The site now has 22 pages, up from 19 on 21 October, and Google lists all 22 as indexed. Its last crawl of /what-it-runs-on came less than three hours after the page went live, of /security about a day after and of the checklist about two days after. Indexing of all three was requested in Search Console, on days this entry does not give.',
    source: 'the owner, for the indexing requests; the site’s sitemap, and its page list at the last publish of 21 October; Cloudflare Pages, production deployments; Google Search Console, URL inspection of every page, read on 25 October' },
];

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
