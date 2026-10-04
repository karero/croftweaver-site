<!--
  POSITIONING.md — per-site positioning, worked out FIRST (before SEO, before any
  page copy). Single source of truth for WHAT we offer, FOR WHOM, and the MARKET
  CATEGORY. Built on April Dunford's framework. Enforced by tests/positioning.spec.ts.
-->
# Webcroft — positioning

Reworked 2026-10-03 after a market scan and a brainstorm with two independent models.
Owner decision: lead with being found by search engines and AI assistants; the test
gate is the proof; ownership is the brand voice. The routes that were not chosen are
recorded at the end.

## 1. Competitive alternatives

- Hosted builders with SEO controls and AI-visibility dashboards (Wix, Webflow,
  Squarespace, Framer, Durable): the controls are there; doing the work on every page
  and keeping it done stays your job. Rented platform, monthly fee.
- AI app builders (Lovable, Bolt, v0): great for interactive apps, heavier than a
  content site needs.
- SEO and GEO audit skill packs (claude-seo, geo-seo-claude, marketingskills): they
  audit a site and advise. They do not build it, and they do not re-test it after a
  change.
- Other website kits for AI coding assistants (website-build-kit, wondelai
  create-website): they build or guide a site. Neither tests message and tone, and
  neither feeds search data back into tested edits (checked in their code, 2026-10-03).
- A web agency: quality, but slow and expensive for a small site.
- Hand-building an Astro site with an AI assistant and no guardrails: fast start,
  silent gaps in accessibility, search basics, links and tone.

Sources, checked 2026-10-03 (statements cover only what was inspected then):
github.com/nurkamol/website-build-kit and github.com/wondelai/skills (README and the
check scripts in the repository); github.com/AgriciDaniel/claude-seo,
github.com/zubair-trabzada/geo-seo-claude and github.com/coreyhaines31/marketingskills
(README); for the hosted builders and app builders, their product pages and release
announcements. `/compare` carries a link and a date for every statement it makes.

## 2. Unique attributes

- The search and AI-readability work is done by default at build time: metadata within
  limits, schema.org JSON-LD, llms.txt, share cards, clean internal links.
- Every generated site ships with its own test gate: 12 suites today (accessibility in
  light and dark, SEO consistency, navigation, anchors, orphans, images, links, email,
  llms.txt coverage, tone, positioning, preview handling). The push hook runs it before
  every push, and CI runs it on pull requests and on `main` and `production`.
- After launch, real data drives the edits: Search Console insights, a ranking history
  and a weekly check of whether four AI assistants name the site (toolkit skill
  `search-console-insights`, releases 0.25 to 0.29). Every edit goes back through the
  same gate. That weekly check is a different thing from the panel in which assistants
  rate a site; the copy keeps the two apart. This site itself gets the loop once Search
  Console is registered at launch.
- A suite of skills for AI coding assistants, not a hosted product. The output is a
  static-first Astro repo the user fully owns, and the skills travel inside it.

## 3. Value + proof

| Unique attribute | Value it enables | Proof |
|---|---|---|
| Search work done by default | Fast, accessible, and the search basics in place from the first build | genai-wednesday.de: Lighthouse 98/100/100/100 on mobile (16 July 2026). Re-run: pagespeed.web.dev with that address. This measures speed, accessibility and SEO basics, not AI readability |
| AI-readability work done by default | Pages an assistant can read and quote | `llms.txt`, schema.org JSON-LD and the `llms-coverage` suite in every generated repo |
| Built-in test gate | The work cannot silently decay on page one hundred | The suites ship in every generated repo; this site runs them before every push and in CI |
| Weekly loop from real data | Edits follow what people actually search for | genai-wednesday.de, relaunched 27 March 2026: Google Search Console badges for 50 clicks in 28 days (17 June 2026) and 90 clicks in 28 days (2 July 2026), shown on genai-wednesday.de/builder-lab |
| Skill suite, static Astro output | No platform rent, no lock-in, cheap to host | Public MIT repo; Cloudflare Pages free tier |

Every figure is per named site and dated. Fresh figures for at least three sites are a
launch requirement (README status table, step 0b); the figures above are the last
published ones and are re-checked before reuse.

## 4. Target customer

- **Best-fit customer:** founders, community organizers, experts and small teams who
  need their website to be found, and the developers and technically comfortable owners
  who build for them.
- **Why they care most:** a site nobody finds earns nothing, and the search and AI work
  is exactly what gets skipped when a site is built fast.
- **Where they are:** global, English-speaking, GitHub-native; discovery via the repo,
  search, word of mouth and the GenAI Wednesday Builder Lab.

## 5. Market category

- **Market category:** website skills for search and AI visibility
- "For AI coding assistants" stays in the lead sentence as the form factor.

## Positioning statement (one paragraph)

> For founders, communities and small teams who need their website to be found,
> Webcroft is a suite of open-source website skills for AI coding assistants that
> builds fast, accessible Astro sites with the search and AI-visibility work done by
> default, unlike design-first builders that hand you the controls and audit tools that
> only report, because every site carries its own test gate and a weekly loop from real
> search data keeps improving it.

- **Core positioning term:** website skills
- **Kicker (above the H1):** Website skills for search and AI visibility
- **Hero (H1):** Build websites that rank.
- **Subline:** Keep improving SEO and GEO, week by week.
- **Brand line, used as sign-off (≤ 12 words):** Your own plot of the web.
- **~50-word boilerplate:** Webcroft is a suite of open-source website skills for AI coding assistants. It turns an assistant such as Claude Code into a careful website builder: fast, accessible Astro sites built to rank on Google and show up in AI answers, tested on every change, in a repo you fully own.

## Wording rule (owner decision, 2026-10-03)

A line may promise what the product is intended for, in active voice. Three limits keep
that honest:

1. No guarantee, and no achieved rank stated for the reader's site ("you will rank",
   "number one", "top of Google").
2. The proof strip sits directly under the hero and carries the evidence: named site,
   figure, tool, date, verification link.
3. A line that says "top scores" is followed on the page by which tool and which date.
   There is no public "GEO score"; where the term appears, the page says what is
   measured (the weekly AI check and the assistant panel).

Further rules for copy live in `CONTENT_GUIDE.md` (honesty rules).

## Reference lines (approved, for headings, the README and the deck)

The wording rule applies to all of them.

- "Search finds you. AI names you." Only directly above dated proof; never alone on a
  share card.
- "Build for search and AI." README headline, GitHub description.
- "Build high-ranking websites." Deck and `/why`, with proof beside it.
- "Twelve test suites check every change." · "Four AI assistants check who names you." ·
  "Open-source skills turn briefs into tested sites."

Held back: "No pass, no publish." The default publish path runs the build and the tests
first, but the hook can be bypassed and nothing blocks a failing deploy server-side.
Usable once required status checks protect `production`.

## The positioning spine (per-page terms → tests/positioning.spec.ts)

A row marked "planned" is not in the test map yet: the test visits every entry, so each
entry lands in the same pull request as its page. Planned terms are fixed when the page
is built.

| Page | URL | Positioning term | Market category (home only) | State |
|---|---|---|---|---|
| Home | `/` | website skills | website skills for search and AI visibility | live; the category clause changes with the home rewrite |
| Checks | `/checks` | test gate | — | planned |
| Skills | `/skills` | website skills | — | planned |
| Start | `/start` | quickstart | — | planned |
| Proof | `/proof` | built with Webcroft | — | planned |
| Why | `/why` | search and AI visibility | — | planned |
| Compare | `/compare` | alternatives | — | planned |
| Roadmap | `/roadmap` | roadmap | — | planned |
| Privacy | `/privacy` | exempt (legal) | — | live |
| Imprint | `/imprint` | exempt (legal) | — | live |

## Differentiation contract (vs genai-wednesday.de/builder-lab)

- The Builder Lab is the community showcase and owns GenAI Wednesday's own evidence:
  its scorecard, the AI score table and the FAQPage schema.
- webcroft.dev is the project home: the promise, the test gate, the skills catalogue,
  the quickstart and a cross-site proof index (`/proof`), with SoftwareSourceCode
  schema. Each `/proof` entry is written fresh from new measurements and approved by
  that site's owner; the Lab's detailed evidence is linked, not copied.
- No copy is shared between the two, apart from one third-party testimonial quoted
  verbatim with attribution. Each links to the other.

## Routes considered and not chosen

- **Lead with the test gate** ("The website that has to pass."). Recommended by both
  models and the assistant as the claim today's evidence carries best. Not chosen as the
  lead because buyers want to be found, not to own tests. Its lines stay in reserve:
  "Website skills with a test gate." · "Your site carries its checks." ·
  "Built. Checked. Yours."
- **Lead with ownership** ("Your own plot of the web.", the previous positioning).
  Ownership is the most crowded claim among comparable products; it stays as the brand
  voice and sign-off.
- The risk accepted with the chosen route: search and AI visibility is a crowded field
  with large audit packs and hosted dashboards, and proof is thin until several sites
  are published. The wording rule and the three-site launch requirement are the guard.

## Hand-off to the rest of the pipeline

- **Voice + EEAT + page copy:** `website-content-guide` (owns tone, not positioning).
- **Keyword / SERP research:** `seo-audit` — positioning leads, keywords follow.
- **AI / answer-engine phrasing (GEO):** `ai-seo`.
- **Schema description + head metadata:** `website-seo-geo` (50-word boilerplate verbatim).
