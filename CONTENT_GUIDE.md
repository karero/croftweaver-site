<!--
  CONTENT_GUIDE.md — per-site voice & content guide (tone of voice + EEAT).
  Copy this into the project root and fill every [BRACKET]. Single source of truth
  for HOW the site says things. POSITIONING (what you offer, for whom, the market
  category) lives in POSITIONING.md — owned by website-positioning and worked out
  first; read it, do not restate it here. Pairs with BRAND.md (how it looks) and is
  enforced by the tone test (tests/tone.spec.ts). Build after POSITIONING.md,
  before any page copy — per the new-website pipeline.
-->
# Webcroft — content guide

## Positioning (owned by website-positioning — read, do not restate)

The positioning statement, target customer, market category and boilerplate live
in **POSITIONING.md** (worked out first, via `website-positioning`). Read them from
there; do not duplicate them here. This guide covers voice, EEAT, and the
page-level content that hangs off that positioning.

- **Top 3 jobs-to-be-done (for copy):** understand in one screen what Webcroft does for being found · judge the proof (dated results, links to re-run them) · get from zero to a first site (quickstart)
- **Primary action we want:** visit the GitHub repo (star / clone).
- **Two audiences:** the home page speaks to builders (developers and technically comfortable owners); `/why` makes the case for decision-makers.

## Tone of voice

Write like a craftsperson showing you around their workshop: warm, concrete,
understated, a little wry. Proof over claims. Active voice. Speak to the reader as "you".

**Hard rules (enforced by the tone test — run after every copy change):**
- **No em dashes (—).** Use a comma, period, or colon.
- **No contractions.** Long form: "cannot", "it is", "you are", "we are".
- **No buzzwords:** supercharge, world-class, leverage, unlock, seamless, robust,
  cutting-edge, empower, holistic, revolutionary, synergy, next-level.
- Genuine quoted customer/human voice is exempt: wrap in `<blockquote>`, `<q>`,
  or add `data-tov-exempt`.

**Do / don't examples**
- Do: "A croft is a small farm, worked and owned by the family that lives on it."
- Don't: "Webcroft empowers you to unlock seamless websites" (three banned buzzwords, zero facts).

## Honesty rules (not enforced by a test; check them in review)

The wording rule in `POSITIONING.md` says what a headline may promise. These rules keep
the body copy true:

- **Say what each check checks.** The positioning test proves the term is present and
  consistent, not that the positioning is good. A green run proves the listed checks
  passed, nothing more.
- **Figures are per named site and dated.** Tool, value, date and a link to re-run it.
  Re-check every figure against the live source before reuse.
- **AI panel scores are assessments** by assistants, not evidence that assistants
  recommend the site.
- **"Twelve test suites" means twelve spec files**, each with several assertions. A
  count in copy is rendered from the suite itself, never typed.
- **Assistants:** write "install guides for three assistants" until there is dated
  end-to-end evidence for Codex and Antigravity; then "runs in".
- **Comparisons** are factual, sourced and dated. Never "the only".
- **"GEO"** is explained once per page where it appears (how AI assistants read and
  cite a site).
- **"EEAT"** is explained once per page where it appears (experience, expertise,
  authoritativeness, trust: what Google's quality raters look for). It is not a score,
  and Google says it is not a ranking factor by itself. Say which signals are built in
  and which a test checks; never promise an effect on rankings.

## EEAT signals (build in from the start)

Search + AI answer engines reward Experience, Expertise, Authoritativeness,
Trust. Ship these, not just claims:
- **Experience / Expertise:** named authors with a real bio + `@id`; first-hand
  detail, specifics, dates; cite primary sources inline for claim-heavy copy.
- **Authoritativeness:** real `sameAs` profiles (LinkedIn, GitHub, register
  entry) that resolve; corroborating external mentions; Organization schema.
- **Trust:** legal entity / imprint page; clear contact; privacy page;
  last-updated timestamps on substantive pages; HTTPS; no broken links.

## Page inventory

Planned pages are built in the order of the status table in `README.md`. A planned
title is a draft: at most 49 characters, because the layout appends " | Webcroft". The
home page is the exception: it passes `title={SITE.name}` to the layout, which then
uses `SITE.titleHome` as the whole title, so that one may be up to 60 characters.

| Page | URL | Purpose | Primary keyword | Target `<title>` (≤60 rendered) | Status |
|---|---|---|---|---|---|
| Home | `/` | the promise, the proof, the gate, the loop | website skills for search and AI visibility | Webcroft: website skills for search and AI visibility | [x] |
| Checks | `/checks` | the test gate in detail, suite by suite | website test gate | The test gate in every Webcroft site | [x] |
| Skills | `/skills` | catalogue by lifecycle: Build, Verify, Launch, Grow | website skills | Website skills catalogue | [x] |
| Start | `/start` | zero to a first site | quickstart | Quickstart: your first site | [x] |
| Proof | `/proof` | one site built with it, measured; re-runnable where possible | built with Webcroft | Built with Webcroft: one site, measured | [x] |
| Why | `/why` | the case for decision-makers, with the deck as PDF | search and AI visibility | Why build for search and AI visibility | [x] page; the PDF follows with the deck refresh |
| Compare | `/compare` | honest alternatives, "choose X when" | alternatives | Webcroft and its alternatives | [x] |
| Roadmap | `/roadmap` | what is missing, planned, deliberately out | roadmap | Roadmap: what is missing, what comes next | [x] |
| Positioning | `/positioning` | how Webcroft works out what a site says before any copy, and how a test keeps each page on it | positioning | Positioning first: what your site says | [ ] spec below |
| Privacy | `/privacy` | GDPR | — | Privacy Policy | [x] |
| Imprint | `/imprint` | § 5 DDG legal disclosure | — | Imprint | [x] |
| 404 | (not a route in `PAGES`) | not found | — | — | [ ] |

### Planned page: `/positioning` (spec, 2026-10-04)

**Why this page.** Tested positioning is what the comparable kits do not have
(`POSITIONING.md`, alternatives). No page explains it yet, and no page credits the two
methods the skills build on. The page is about how Webcroft does it. It is not a summary
of anyone's book.

**Reader.** The owner who is about to be asked for "competitive alternatives" and has
never worked through positioning; and the decision-maker who wonders why the build
starts with questions and not with a design.

**Term and metadata (drafts, fixed when the page is built).**

- Positioning term: `positioning`. Not "website positioning": a search on 2026-10-04
  showed that phrase means search ranking, so it would file the page under the wrong
  topic.
- Title: "Positioning first: what your site says" (38 characters, 49 rendered).
- H1, three candidates for the owner: "Decide what your site says. Then build it." ·
  "Say what you offer before you write a word." · "Know what your site says first."
- Description, 120 to 160 characters, carrying the term.

**Sections, in this order.**

| # | Section | What it must contain | Source |
|---|---|---|---|
| 1 | Hero | H1, one paragraph with the term, buttons to the quickstart and GitHub | this spec |
| 2 | What positioning is | one paragraph in our own words: what you offer, for whom, what they would use instead, and the category that makes the value obvious; why it comes before keywords and copy | toolkit skill `website-positioning` |
| 3 | The five questions | the five parts by name, each with one line and the question the assistant asks; the sentence "The method is April Dunford's, from her book Obviously Awesome." | same skill |
| 4 | What you get | `POSITIONING.md` in your repo: the five parts, a one-paragraph statement, a 50-word description, one term per page. Worked example: this site's own file, linked, and this site's page-and-term table | this repo's `POSITIONING.md`, `tests/positioning.spec.ts` |
| 5 | How the test keeps it true | what the positioning suite checks (term in the title, the description, and the H1 or the first paragraph; on the home page also the category in the body), one failure message, when it runs | `tests/positioning.spec.ts`, `/checks` |
| 6 | Limits | the test proves the term is present and consistent, not that the positioning is good; it is no keyword-density check; the judgment stays with the owner; the optional skill `website-positioning-check` gives a look from outside | honesty rules above |
| 7 | Then make it believable: trust signals (EEAT) | what EEAT stands for, said once; that it is the framework Google's quality raters use, not a score and not a ranking factor by itself; the signals the skills build in (structured data for the organisation with profiles that resolve, a named author with a bio where there is one, sources cited, imprint, contact and privacy pages, links that resolve); which of these a test checks (structured data present, links resolve) and which stay a checklist the owner fills with real facts. Short: the content guide owns this layer, not positioning | toolkit skill `website-content-guide`; "EEAT signals" above; Google Search Central, "Creating helpful, reliable, people-first content" (read 2026-10-04) |
| 8 | The story layer (optional) | `website-story`: the home page told as the visitor's story, in seven sections; optional, offered once after positioning; this site does not use it. "Inspired by Donald Miller's StoryBrand framework, in Webcroft's own words." | toolkit skill `website-story` |
| 9 | Sources | the books, with links (below), and the no-endorsement sentence | owner, 2026-10-04 |
| 10 | Next step | quickstart, GitHub | page template |

**Sources section: links.** Plain links, no affiliate tag, no country detection, no
cover images (no third-party request, no copyright question). For each book: the
author's own page first, then Amazon.com and Amazon.de. The German pages later link the
German edition where one exists. Every link is opened by hand when the page is built;
Amazon often refuses automated link checks, so the external link audit may warn there.

| Book | Role on the page | Author's page | Amazon (as supplied by the owner, 2026-10-04) |
|---|---|---|---|
| April Dunford, *Obviously Awesome* | the method the positioning skill uses | aprildunford.com/books | amazon.com/dp/B0GLHYWFT9 · amazon.de/dp/B0GLHYWFT9 |
| April Dunford, *Sales Pitch* | further reading; Webcroft does not use it, and the page says so | aprildunford.com/books | amazon.com/dp/B0CHY6BNDN · amazon.de/dp/B0CHY6BNDN |
| Donald Miller, *Building a StoryBrand 2.0* | the idea behind the optional story skill | storybrand.com/building-a-storybrand-book-new/ | amazon.com/dp/B0CWTNCZCH · amazon.de/dp/B0CWTNCZCH; German edition for the German page: amazon.de/dp/3800676621 |

No-endorsement sentence, on the page and next to the credit on `/skills`: "Webcroft is
not affiliated with April Dunford or Donald Miller, and neither endorses it. StoryBrand
is a trademark of its owner."

**What the page must not do.**

- Retell a book. Our own words throughout; no quoted passages, no diagrams, no
  framework graphics. The five parts are named, as the skill names them.
- Use an author's name or "StoryBrand" in the address, the title or the H1.
- Claim what the test cannot prove (honesty rules).
- Promise a better "EEAT score" or a ranking effect. There is no such score.
- Add a header link. The header takes no more links until it has a compact phone menu.

**Where it is linked from.** `/skills` (the `website-positioning` entry and the
credits), `/checks` (the positioning suite), the home page (the group "It says what you
mean"). The same pull request adds the credit for both methods to `/skills`, which names
neither today.

**Scenarios it has to pass.**

| Given | When | Then |
|---|---|---|
| a visitor who has never heard of positioning | they read the first screen | they can say what Webcroft asks before it writes copy, and why |
| the page is built | the test suite runs | the positioning suite finds "positioning" in the title, the description and the H1 or first paragraph |
| someone changes a page's term in the test map | the site is rebuilt | the page-and-term table on `/positioning` shows the new term, with no edit to the page |
| a reader wants the book | they reach the sources section | they find the author's page and plain Amazon.com and Amazon.de links, with no tag in the address |
| a reader who knows StoryBrand | they read the story section | it says "inspired by", says the skill is optional, and says neither author endorses Webcroft |
| a reader who has heard of EEAT | they read the trust section | it says what the letters stand for, that it is no score, which signals the skills build in, and which of them a test checks |
| a reader looks at `/skills` | they read the credits | April Dunford and Donald Miller are named beside the existing credit |
| a phone 360 pixels wide | the page loads | the header is unchanged, and nothing scrolls sideways |

The per-page contract applies as for every page: route in `PAGES`, line in
`public/llms.txt`, own share card, entry in the positioning map and in the spine table
of `POSITIONING.md`, reachable by links from `/`.

## Per-page-type copy template

**Product page** (`/checks`, `/skills`, `/start`, `/why`, `/compare`, `/roadmap`):
- **Section order:** hero → what this is, in one paragraph → the substance (list or table) → limits (what it does not do or prove) → next step.
- **Hero:** H1 states the reader benefit in active voice; the first paragraph carries the page's positioning term; primary CTA.
- **Body sections:** concrete and checkable: what it does, how to see it for yourself, where it stops.
- **Proof block:** figures only with named site, tool, date and link; quotes verbatim with attribution.
- **CTA:** "Get Webcroft on GitHub", repeated once at the end; secondary: "Quickstart".

**Proof entry** (one per site on `/proof`):
- Site name and address, owner, when it was built and with which toolkit release.
- Figures: tool, value, date, link to re-run or the published export.
- One or two sentences on what was done, written fresh for this site.
- Approved by the site's owner (date).

## New-page checklist

- [ ] Positioning term threaded (positioning.spec.ts) + ToV applied; tone + positioning tests green
- [ ] One `<h1>`; headings nest without skips
- [ ] Rendered `<title>` at most 60 characters (the test enforces the maximum; 50–60 is the editorial target where the page title allows it), `<meta description>` 120–160 (see website-seo-geo)
- [ ] og/twitter inherit title/description; canonical set
- [ ] Required JSON-LD present (WebPage + page-specific)
- [ ] Images: WebP, sized to display, descriptive alt, lazy below the fold
- [ ] Any linked PDF in `public/` has a descriptive doc-title set via
      `scripts/set_pdf_title.py` — not the authoring placeholder (see website-seo-geo)
- [ ] In sitemap; internal links clean (no `.html`)
- [ ] EEAT: author/date where relevant; sources cited
