# Plan: the case study opens with the site itself (phase 1), 2026-10-27

Page: https://croftweaver.com/case-study (`src/pages/case-study.astro`, data in `src/data/case-study.ts`).
Input: ChatGPT's redesign spec of 27 October 2026 (outside the repo, not reviewed itself; this plan
takes from it only what is listed below). Phase 1 of its rollout, one pull request. Written against
`main` at df70d0f.

## What and why

The home page button "See a finished website" leads here, but the page opens with AI-answer zeros,
Google appearances and a long log. A visitor who wants to see a finished site has to scroll past an
analytics journal to find it. Phase 1 puts two things above everything the page has today:

1. **Hero:** kicker, a new H1 and lead, three links (the live home page, the site's public source, a
   jump to the log), a disclosure that this is the maintainer's own site, and a dated screenshot of
   croftweaver.com (desktop and phone).
2. **Four dated summaries:** technical output, indexing, Google search, AI answers. Each gives its
   date or period, its figures and its source; where a figure has a whole (22 of 22 pages, 0 of 22
   answers), the card gives it.

The AI check section, the Google section and the log keep their ids, tables and text. No log entry is
added, edited or removed.

## Copy

- Kicker (first `<p>` in `<main>`): "Case study · live since 12 October 2026" (from `LAUNCH`).
- H1: **"A live website built with Croftweaver. Inspect it."**
- Lead: "croftweaver.com is built and maintained with Croftweaver. You can look at the site, read its
  source, and see the checks that ran on each change and what Google and AI assistants showed after
  it. The early numbers are small, and the zeros stay in."
- Links: "Open the live site" (`/`), "Read its source on GitHub"
  (https://github.com/karero/croftweaver-site), "Jump to the log" (`#log`).
- Disclosure: "This is the [maintainer](/about)'s own website, not an independent customer project. It
  shows what Croftweaver produced here, not what it will produce for every site or every AI
  assistant."
- Hero aside (`<p class="aside">` in the hero, not the log's note in `#log`): "The log was last
  updated <date from `UPDATED`>." in place of "Last updated …", then its existing sentence on cause
  and its link to `/proof`, unchanged.
- The old lead goes. Its "It is a log, not a finished story" argues with the home page button that
  leads here; its description of what an entry holds is dropped, and the new lead says in one clause
  what the log holds. The log's note stays as it is.
- Meta description, 155 characters: "A Croftweaver case study you can inspect: croftweaver.com, its
  public source, the checks that ran on each change, and what Google and AI assistants showed."

## Where the spec and the repo disagree (the repo wins)

- **"Open-source example" (kicker):** wrong for this site. karero/croftweaver-site is public but has
  no licence file, and `gh api repos/karero/croftweaver-site` returned `license: null` on 27 October;
  the toolkit's licence is MIT. The page says "public source" about the site.
- **Title** `Croftweaver Case Study: Live Astro Website, Source & Results`: 60 characters, and the
  layout adds " | Croftweaver" (limit 46 for a page title, AGENTS.md §6). The title stays
  "Croftweaver case study: its own site".
- **Meta description:** the spec's lacks "case study", which `tests/positioning.spec.ts` requires in
  the description; replaced as above.
- **H1:** the spec's "A real website built with Croftweaver. Inspect the result." makes no ranking
  promise and names no GEO score, so POSITIONING.md's wording rule allows it. The plan proposes "live"
  in place of "real" because a visitor can check it. The positioning test for `/case-study`
  (`{ term: 'case study' }`) accepts the term in the H1 or in the first `<p>` in `<main>`; the kicker
  is that paragraph. Daniel may prefer the spec's wording.
- **"22 indexed pages (owner-reported)":** the log entry of 25 October gives Google Search Console,
  URL inspection of every page, as the source of the count; "the owner" is the source only of the
  indexing requests. The card cites Search Console.
- **"Seven tracked phrases reporting zero impressions":** no such figure is in this page's data. Not
  used.
- **"31 entries":** matches `main` (22 changes, 9 observations) and the live build a6bb676, whose
  `/build.txt` read on 27 October; nothing to change.

## Figures checked against the data files (27 October)

| Spec figure | Data | Result |
|---|---|---|
| 11 appearances, 1 click, 11 to 17 October | `croftweaver-com-search-console.csv`, sum of 7 rows | matches |
| 0 of 22 named with search, 19 October | AI check CSV, 19 Oct, `with_search`: 5 assistants, 22 answers, 0 named | matches |
| 0 of 22 with croftweaver.com among sources | same rows, `sources_listed` 0 | matches |
| 0 of 24 named without search | 19 Oct, `without_search`: 4 assistants, 24 answers, 0 named | matches |
| 22 pages indexed, 25 October | `LOG`, observation of 2026-10-25 | matches; source corrected above |
| Last updated 25 October | `UPDATED` | matches |

## How

- **Search and AI cards** are computed from `SEARCH` and the newest `AI_DAYS` row, as the sections
  below them already are; the weekly refresh updates them with no extra step.
- **Indexing and technical cards** restate two log entries, so every figure still comes from the
  page's three sources (the two CSV files and `LOG`). `src/data/case-study.ts` gets `CARDS`: for each,
  the cited entry's date and title, the figures (Google 22 of 22 pages on 25 October; 439 tests on
  karero/croftweaver-site#137, 24 October; Bing `null`) and the exact phrase of that entry the figures
  come from ("Google lists all 22 as indexed", "439 tests"). A build-time check refuses a card whose
  entry is missing or whose phrase is not in that entry's text. That check proves traceability only:
  it cannot tell that the figures match the phrase, so the review reads the two side by side.
- **Missing data** renders as "Not yet measured", never 0. Bing row: "Not yet measured since indexing
  was requested on 20 October" (the log of 18 and 20 October has the last Bing facts).
- **Layout:** a `#summary` section with an `h2` and four `.card` articles with `h3` headings, in a
  grid (one column on a phone). No tables, so the stacked-table count in `tests/navigation.spec.ts`
  stays; no percentages; figures in the body text colour.
- **Screenshot:** Playwright against https://croftweaver.com/, light theme, viewport only, desktop
  1280×800 and phone 390×844 at device scale 2, converted to WebP with `cwebp`, saved as
  `public/images/case-study/croftweaver-com-home-{desktop,phone}-<date>.webp`. Caps: desktop 200 KB,
  phone 120 KB. `<img>` with width, height and `height: auto`; desktop `loading="eager"`, phone
  `loading="lazy"`. Alt text written after looking at the captures. The caption gives the capture
  date only: matching reads of `/build.txt` before and after do not prove which build served the home
  page, so the SHA goes in the PR as context, not on the page. One-off command, recorded in the PR.
- **Comments that would turn false:** the header of `src/data/case-study.ts` ("Three sources and no
  others … Every figure on /case-study comes from one of them") and the comment above the existing
  test (`tests/a11y.spec.ts`, "shows only what its three sources say") are narrowed to the page's
  figures, name the screenshot as separate evidence, and say `CARDS` restates log entries; the page
  header names the screenshot. The
  owner decision of 2026-10-21 (its own page, its own export, counts only) is otherwise unchanged; the
  screenshot is the one new kind of evidence, and Daniel's go confirms it.
- Not touched: the AI and Google sections, the log (entries and note), the title, the OG card, `llms.txt` (its "dated log" stays true).

## Tests, written first and run red before the page changes (`tests/a11y.spec.ts`, next to the existing case-study test)

1. **Hero** (1280×800): the H1, the three links and the disclosure sit above 800 px. Links go to `/`,
   https://github.com/karero/croftweaver-site and `#log`, and `#log` holds an `h2`. The disclosure
   contains "maintainer" and "not an independent customer project". The test lists
   `public/images/case-study/` itself: exactly one desktop and one phone file, both dated the caption's
   `<time datetime>`, and the two `img` elements point at them. This catches a caption that disagrees
   with the file names and an old file left behind; it cannot tell when the pixels were captured
   (new bytes under old names pass). The capture date is checked at capture and recorded in the PR
   with the command and both files' sizes. Both images have non-empty alt, finish loading, and have a
   natural width above 0.
2. **Summaries:** `#summary` has an `h2` and four cards with the four names; each card has at least
   one `<time>` (the search card's period is two) and a "Source:" line; no "%" in the section; each figure's computed colour equals the body text
   colour. The test reads the CSV files itself: the search card's two numbers and two dates, and the
   AI card's three "n of m" and its date, which must be the newest date in the file. The indexing
   card's date and the technical card's pull request must each name an entry in the log on the page,
   with the same date. The Bing row says "Not yet measured".
3. **Log unchanged:** not a test. The existing case-study test stays as it is and must pass, and the
   DIFF review checks that the diff touches no line inside `LOG`.

Then `npm ci`, `npm run check`, `npm run build`, `npm test` (each checkout has its own test port).

## Status (updated as each step finishes)

| Step | State | Evidence |
|---|---|---|
| Plan reviewed (PLAN gate) | done: 4 rounds and a wording pass, no BUG open | `docs/reviews/REVIEW-plan-2026-10-27-case-study-showcase.md` |
| Daniel's go | given 2026-10-27 | relayed word for word: "Ok, then let's build and ship it"; "publish it" typed in this session |
| Tests written, red | not started | — |
| Screenshot captured | not started | — |
| Page built, tests green | not started | — |
| DIFF review clean | not started | — |
| PR open, CI green, merged | not started | — |
| Publish (`npm run ship`) | Daniel's call | — |

## Phase 2 outline (not built here)

- "What it built" table: pages, skills used, checks, hosting, each linked to the file or PR.
- "What you can inspect" panel: evidence, where, what it proves, what it does not; private evidence
  named as private, never linked.
- "What was manual" note: what the maintainer directed, edited, approved, tested and published.
- Five short chapters (500 to 900 words): the starting problem, the build, the first checks (a real
  failing-then-passing run only if one exists), after launch, what changed next. Links to real commits.
- Links to public CI runs and to representative pull requests.
- Optional `Article` structured data, only with true dates and author; no ratings.
- A `/case-study` row in POSITIONING.md's page table, with the H1 and kicker decision.
- Later, phase 3: one methodology note in place of "Next measurement" on every change, and optional
  category anchors over the log (default shows all, works without JavaScript); only after reader
  feedback. Outbound-click event names once counts justify them.

## Cost

PLAN gate: Codex, with GLM 5.3 when melious has balance; round 1 cost about 171 k tokens (Codex
75 k, fresh-eyes 97 k). No red team: the change touches no box, user data, login, money, deletion or
schema. DIFF gate after the build at Normal depth, similar cost.
