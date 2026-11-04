// The case study's log and the figure the tests card takes from it. This module imports nothing, so a
// Playwright spec can load it; src/data/case-study.ts (which imports CSV files with ?raw) re-exports it.
// A change has a merged pull request, dated by its merge day. Merge is not publication: croftweaver.com
// goes live when main is shipped to its production branch (scripts/ship.sh); genai-wednesday.de and the
// toolkit README follow their own repositories. An observation is something seen, with its source.
// `checks` states a suite count first, as "N tests;": newestTestCount reads it, and stops the build when a newer change
// writes "N tests" anywhere else. Other wordings ("N passing tests", "75 SEO tests") are not noticed.
export type Change = { kind: 'change'; date: string; title: string; asked: string; pr: string; checks?: string; next?: string };
export type Observation = { kind: 'observation'; date: string; title: string; seen: string; source: string };
export type Entry = Change | Observation;

export const PR_REPOS = ['karero/croftweaver', 'karero/croftweaver-site', 'GenAI-Wednesday/GenAI-Wednesday.de'] as const;
// A visitor gets a 404 from a private repository's pull request, so the page names these without a link.
export const PRIVATE_REPOS: readonly (typeof PR_REPOS)[number][] = ['GenAI-Wednesday/GenAI-Wednesday.de'];

// Entries are added in merge order: of two changes dated the same day, the one later in the list is the newer
// (newestTestCount relies on it).
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
  { kind: 'change', date: '2026-10-25', title: 'The site’s tests brought up to Croftweaver 0.33',
    asked: 'Take the toolkit’s new table tests into the site, count them on /checks, /why and the home page, and run the SEO checklist’s eighteen breaks again on release 0.33.',
    pr: 'https://github.com/karero/croftweaver-site/pull/141', checks: '457 tests; review by one outside model, 3 rounds; the second model could not run' },
  { kind: 'change', date: '2026-10-25', title: 'WordPress, Joomla and Drupal on /compare',
    asked: 'Add a group for WordPress, Joomla and Drupal to /compare, and say plainly, for content sites, that Croftweaver is an alternative to WordPress.',
    pr: 'https://github.com/karero/croftweaver-site/pull/144', checks: '458 tests; review by two outside models, 4 rounds' },
  { kind: 'change', date: '2026-10-26', title: 'This page stops linking a private repository',
    asked: 'On this page, name the three pull requests of the private genai-wednesday.de repository without a link, since the link gave visitors a 404; and drop “no free plan” from the Squarespace row on /compare.',
    pr: 'https://github.com/karero/croftweaver-site/pull/145', checks: '458 tests; review by Codex in 3 rounds, with GLM 5.3 in round 1 only' },
  { kind: 'change', date: '2026-10-26', title: 'A new headline on the home page',
    asked: 'Make “Build a complete website with AI.” the home page headline with “Weave websites that rank.” above it, and lead the second button to the case study.',
    pr: 'https://github.com/karero/croftweaver-site/pull/147', checks: '459 tests; review by two outside models, 2 rounds; round 1 by Codex alone' },
  { kind: 'change', date: '2026-10-26', title: 'Clearer openings on three pages',
    asked: 'Open /compare with a guide by situation, add a “who does what” table to /from-wordpress and an “in short” section to /security, and link the three pages to each other and to the case study.',
    pr: 'https://github.com/karero/croftweaver-site/pull/146', checks: '458 tests and a check of the 103 security claims; review by one outside model, 2 rounds, a re-gate and a confirmation' },
  { kind: 'change', date: '2026-10-26', title: 'Claude Code on its own, or with Croftweaver',
    asked: 'Add a section to /compare that says Croftweaver does not replace Claude Code, what its skills add, and when to use which.',
    pr: 'https://github.com/karero/croftweaver-site/pull/149', checks: '459 tests; review by two outside models, 2 rounds' },
  { kind: 'change', date: '2026-10-26', title: 'A handout for companies, and a line on keeping WordPress up to date',
    asked: 'Make a six-slide PDF for companies that will not build their site themselves, drawn from the built pages, and ask on /from-wordpress that a WordPress site you keep stays up to date.',
    pr: 'https://github.com/karero/croftweaver-site/pull/148', checks: '470 tests; review by two outside models, 5 rounds and a wording pass; GLM 5.3 took part from round 2' },
  { kind: 'observation', date: '2026-10-26', title: 'Claude names Croftweaver once',
    seen: 'In the weekly AI check, Claude with web search named Croftweaver in 1 of its 3 answers to the broad question, which does not name it, as a free, open-source set of website skills. croftweaver.com was not among the sources it returned. No other answer that day named it: 1 of 45 in all, one call having failed.',
    source: 'the weekly AI check, run of 26 October; the answers are saved in full' },
  { kind: 'change', date: '2026-10-26', title: 'One test port per copy of the site, and an “Own build” check',
    asked: 'Stop two copies of the site from testing on the same port, and add a test that fails if the tests ever run against another copy’s build.',
    pr: 'https://github.com/karero/croftweaver-site/pull/150', checks: '472 tests; review by one outside model, 3 rounds' },
  { kind: 'change', date: '2026-10-27', title: 'The home page leads with measured figures',
    asked: 'Under the hero, show the AI check and the PageSpeed range first, and keep the four AI assistants’ scores for /more-proof.',
    pr: 'https://github.com/karero/croftweaver-site/pull/151', checks: '473 tests; review by two outside models, 2 rounds; the plan had 2 rounds by Codex alone' },
  { kind: 'change', date: '2026-10-28', title: 'This page opens with the live site',
    asked: 'Open the case study with the live site, its source, two screenshots and four dated summaries, before the evidence and this log.',
    pr: 'https://github.com/karero/croftweaver-site/pull/152', checks: '474 tests; review by two outside models, 4 rounds; the plan had 4 rounds and a wording pass' },
  { kind: 'change', date: '2026-10-28', title: 'One comparison, side by side',
    asked: 'On /compare, show what came of giving one brief to Claude Code twice, on its own and with Croftweaver: time, cost, errors, structured data and PageSpeed.',
    pr: 'https://github.com/karero/croftweaver-site/pull/153', checks: '472 tests; review by two outside models, 3 rounds' },
  { kind: 'change', date: '2026-10-28', title: 'The site brought up to release 0.34',
    asked: 'Say 0.34 wherever the site names the current release: 39 skills, the new launch-check skill and a “Done in release 0.34” section on the roadmap.',
    pr: 'https://github.com/karero/croftweaver-site/pull/154', checks: 'review by two outside models, 2 rounds; the pull request gives no test count' },
  { kind: 'change', date: '2026-10-29', title: 'Tests up to 0.34, and a smaller screenshot for phones',
    asked: 'Take the toolkit’s 0.34 tests into the site; its new image test found that phones got the 1600 px desktop screenshot on this page, so give them an 800 px copy.',
    pr: 'https://github.com/karero/croftweaver-site/pull/155', checks: '499 tests; review by one outside model, 4 rounds, at the higher depth because a publish script changed' },
  { kind: 'change', date: '2026-10-29', title: 'Share cards match the pages',
    asked: 'Redraw the share cards of the home page and this page so they show the pages’ current wording.',
    pr: 'https://github.com/karero/croftweaver-site/pull/156', checks: '75 SEO tests, and the full suite passed; review by one outside model, 1 round' },
  { kind: 'observation', date: '2026-11-02', title: 'No assistant names it this week',
    seen: 'In the weekly AI check of 2 November, none of 46 answers to the two questions that do not name Croftweaver named it, Claude’s included. By then croftweaver.com was serving every change to it in this log.',
    source: 'the weekly AI check, run of 2 November; the live site’s build, read on 2 November' },
];

const SITE_PR = 'https://github.com/karero/croftweaver-site/pull/';
const COUNT_FIRST = /^(\d+) tests;/;
const COUNT_ANYWHERE = /\b\d+ tests\b/;

/**
 * The tests card's figure: the newest croftweaver-site change whose checks start with "N tests;".
 * Newer means a later date, or the same date and later in the log. A newer change of this site that
 * says "N tests" any other way stops the build, so a count written differently is never skipped silently.
 */
export const newestTestCount = (log: readonly Entry[]): { entry: Change; tests: number } => {
  const changes = log
    .map((entry, i) => ({ entry, i }))
    .filter((x): x is { entry: Change; i: number } => x.entry.kind === 'change' && x.entry.pr.startsWith(SITE_PR))
    .sort((a, b) => (a.entry.date === b.entry.date ? b.i - a.i : a.entry.date < b.entry.date ? 1 : -1));
  for (const { entry } of changes) {
    const m = entry.checks?.match(COUNT_FIRST);
    if (m) return { entry, tests: Number(m[1]) };
    if (entry.checks && COUNT_ANYWHERE.test(entry.checks)) {
      throw new Error(`src/data/case-study-log.ts: "${entry.title}" (${entry.date}) states a test count, but not first as "N tests;". Write it that way.`);
    }
  }
  throw new Error('src/data/case-study-log.ts: no change to this site states a test count as "N tests;".');
};
