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
| Skills | `/skills` | catalogue by lifecycle: Build, Verify, Launch, Grow | website skills | Website skills catalogue | [ ] |
| Start | `/start` | zero to a first site | quickstart | Quickstart: your first site | [ ] |
| Proof | `/proof` | sites built with it, with re-runnable results | built with Webcroft | Sites built with Webcroft | [ ] |
| Why | `/why` | the case for decision-makers, with the deck as PDF | search and AI visibility | Why build for search and AI visibility | [ ] |
| Compare | `/compare` | honest alternatives, "choose X when" | alternatives | Webcroft and its alternatives | [ ] |
| Roadmap | `/roadmap` | what is missing, planned, deliberately out | roadmap | Roadmap | [ ] |
| Privacy | `/privacy` | GDPR | — | Privacy Policy | [x] |
| Imprint | `/imprint` | § 5 DDG legal disclosure | — | Imprint | [x] |
| 404 | (not a route in `PAGES`) | not found | — | — | [ ] |

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
