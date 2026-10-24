<!--
  POSITIONING.md — per-site positioning, worked out FIRST (before SEO, before any
  page copy). Single source of truth for WHAT we offer, FOR WHOM, and the MARKET
  CATEGORY. Built on April Dunford's framework. Enforced by tests/positioning.spec.ts.
-->
# Croftweaver — positioning

Reworked 2026-10-03 after a market scan and a brainstorm with two independent models.
Owner decision: lead with being found by search engines and AI assistants; the test
gate is the proof; ownership is the brand voice. The routes that were not chosen are
recorded at the end.

Updated 2026-10-08: the hero takes the weaving image of the name and stays in the
active voice; the customer's starting point is named (an old site, or none, where every
change waits on someone else); and rebuilding as a way to learn working with an AI
assistant is recorded as a secondary benefit, never the lead. The home page's proof
strip now leads with the AI panel's SEO and GEO scores for genai-wednesday.de and a
prompt to try on your own site; PageSpeed for three sites and the E-E-A-T scores moved
to `/more-proof`.

Updated 2026-10-13: the panel stays first (owner decision the same day). Under it, the
strip now states two measured figures and links to the page behind each: the PageSpeed
range for the three sites (`/more-proof`), and how many answers named genai-wednesday.de
with and without web search in the AI check (`/proof`). Both are read from
`src/data/proof.ts`. An outside audit had asked for measured evidence before opinions.

Updated 2026-10-14, after a broader competitive review (`docs/competitors.md`, "Broader
review (14 October 2026)", added in karero/croftweaver-site#76). Owner decisions the same day, four of them:

1. **Start with positioning, and keep your pages on it.** Starting with the message is
   shared with other skill kits. Keeping pages on their terms with a test is not: none of
   the three that start with the message ships such a test (read in their code on
   2026-10-14). The copy says "keeps your pages on it", not
   "keeps every page true to it", for two reasons. The positioning test checks that a
   page carries its term in its title, description and opening, which is not proof that
   the page is true to the positioning (see the wording rule and `/checks`). And it
   checks only the pages in its map: legal pages are exempt, and a page with no term
   raises a warning, not a failure (`tests/positioning.spec.ts`).
2. **Sell the fix, not the watching.** Checking whether AI assistants name a site is now
   cheap or free in many tools, and Google and Bing report AI impressions and citations
   themselves. Croftweaver's part is the next edit, made with your assistant, that goes
   back through the site's tests by default. The weekly AI check stays, as the trigger
   for an edit, never as the lead.
3. **Next to marketingskills, not against it.** marketingskills covers marketing beyond
   the website and builds no site; seven Croftweaver skills come from it. `/compare`
   says to use them together.
4. **Safe to install is a point of its own.** For now one answer on the home page,
   limited to what is checked: plain text skills in a public repository, Claude Code
   asks before running a command in its default settings, a static site with no database and no
   user accounts. A fuller account of what the skills run waits for the toolkit's own
   document; nothing more is claimed until it exists.

Also decided the same day: the contact form stays the visitor's own email program. A
form that sends through a server moves to "Out, on purpose" on `/roadmap`.

## 1. Competitive alternatives

- The status quo: an old site, or none, and someone else to ask for every update (an
  agency or a developer). Each change means a brief, a wait and often a bill, so changes
  pile up and the site falls behind.
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
- Every generated site ships with its own test gate: 16 suites at release 0.33 (accessibility in
  light and dark, SEO consistency, navigation, anchors, orphans, images, links, email,
  llms.txt coverage, tone, positioning, placeholders, privacy host, preview handling,
  server-side analytics, tables). The push hook runs it before
  every push, and CI runs it on pull requests and on `main` and `production`.
- After launch, real data drives the edits: Search Console insights, a ranking history
  and a weekly check of whether four AI assistants name the site (toolkit skill
  `search-console-insights`, releases 0.25 to 0.29). Every edit goes back through the
  same gate. That weekly check is a different thing from the panel in which assistants
  rate a site; the copy keeps the two apart. This site itself gets the loop once Search
  Console is registered at launch.
- The owner and their assistant make the everyday changes themselves, in plain language:
  text, pages, images and layout of a static content site. By default the test gate runs
  on each change (before every push, and in CI on pull requests). Owners can make
  everyday updates without waiting for an agency or a developer, though a stubborn
  problem can still need outside help; anything that needs a database or an account
  system is outside what Croftweaver is for (see "Not a fit" on the home page).
- A suite of skills for AI coding assistants, not a hosted product. The output is a
  static-first Astro repo the user fully owns, and the skills travel inside it.

## 3. Value + proof

| Unique attribute | Value it enables | Proof |
|---|---|---|
| Search work done by default | Fast, accessible, and the search basics in place from the first build | PageSpeed Insights, mobile, home page, 4 October 2026 (performance / accessibility / best practices / SEO): genai-wednesday.de 99/100/100/100, m-squad.com 99/100/100/100, apreet.com 100/100/100/100. Re-run: pagespeed.web.dev with each address. This measures speed, accessibility and SEO basics, not rankings and not AI readability |
| AI-readability work done by default | Pages an assistant can read and quote | `llms.txt`, schema.org JSON-LD and the `llms-coverage` suite in every generated repo. AI panel, genai-wednesday.de, second round of 20 August 2026 (SEO and GEO on the home page, E-E-A-T on `/more-proof`): AI opinions with no official scorer, not a measurement and not evidence that an assistant would recommend the site (`src/data/proof.ts`) |
| Built-in test gate | The work cannot silently decay on page one hundred | The suites ship in every generated repo; this site runs them before every push and in CI |
| Weekly loop from real data | Edits follow what people actually search for | genai-wednesday.de, launched 27 March 2026: clicks from Google per 28 days rose from 3 around the launch to a best 28 days of 99 (16 June to 13 July 2026) and stood at 50 in the 28 days to 29 September 2026. The daily figures are published on `/proof` |
| Skill suite, static Astro output | No platform rent, no lock-in, cheap to host | Public MIT repo; Cloudflare Pages free tier |
| The owner and the assistant make the everyday changes | Everyday updates (text, pages, images, layout) need no agency or developer: a change is a conversation with your assistant, and the tests run on it by default. A stubborn problem can still need outside help | The output is plain files in your own repository; no account, no subscription, nothing runs on our servers (home page, "The site is yours"). Not measured: how long a change takes compared with an agency. Not covered: anything that needs a database or accounts. Built and used with Claude Code; Codex and Antigravity each tested from start to finish on one site (the maintainer's word, 18 October 2026; no written record yet; `/roadmap`) |
| A real project to learn with | A rebuild is a real learning curve: hands-on practice for you and your team in directing and checking an AI assistant, on a site you know. The maintainer offers to help with questions along the way (best effort) | None measured. The owner's experience with one team he works with: they work with an AI assistant happily and keep learning, improving and fixing (anecdotal; the team is not named here). A secondary benefit: never the lead, never on a share card |

Every figure is per named site and dated. The PageSpeed figures were measured on
4 October 2026 and are the ones on `/more-proof` (`src/data/proof.ts`). The AI panel's
SEO and GEO scores are on the home page, and its SEO, GEO and E-E-A-T scores on
`/more-proof` (the second round of 20 August 2026, copied from the Builder Lab on
2026-10-08). They are AI opinions, and the Lab itself says they are not comparable across
assistants. `src/data/proof.ts` checks that the rows still average to the figures the Lab
showed that day; it never reads the Lab, so a later change there, or a small slip in one
row, is not seen. Re-read the Lab before launch (README). The Search Console figures
were re-checked on 4 October 2026 and are published on `/proof`, with
the daily numbers behind them. Owner decision, 2026-10-04: `/proof` shows one site,
genai-wednesday.de. This replaces the earlier launch requirement of three sites.

## 4. Target customer

- **Best-fit customer:** founders, community organizers, experts and small teams who
  need their website to be found, and the developers and technically comfortable owners
  who build for them.
- **Why they care most:** people who do not know them yet have to find the site before
  it can win them (the second of the two jobs below), and the search and AI work is
  exactly what gets skipped when a site is built fast. Many start from an old site, or
  none, where every change waits on someone else, so that work never gets done.
- **The site's two jobs (owner, 2026-10-12):** first, people who already know your name
  look you up, from a business card, an email footer or a LinkedIn link, and the site
  helps to win them. Second, the site attracts people who do not know you yet: prospects,
  partners, employees. Serving existing customers is a minor third job for a small site.
  On the home page, copy about what is at stake names both jobs, not only being found;
  `/why` and `/established-sites` keep their own wording.
- **Secondary reason to start:** rebuilding a site you know is a good project for
  learning to work with an AI assistant, alone or with a team. Never the lead (see the
  value table).
- **Where they are:** global, English-speaking, GitHub-native; discovery via the repo,
  search, word of mouth and the GenAI Wednesday Builder Lab.

## 5. Market category

- **Market category:** website skills for search and AI visibility
- "For AI coding assistants" stays in the lead sentence as the form factor.

## Positioning statement (one paragraph)

> For founders, communities and small teams who need their website to be found,
> Croftweaver is a suite of open-source website skills for AI coding assistants that
> builds fast, accessible Astro sites with the search and AI-visibility work done by
> default, unlike design-first builders that hand you the controls and audit tools that
> only report, because every site carries its own test gate and a weekly loop from real
> search data keeps improving it.

- **Core positioning term:** website skills
- **Kicker (above the H1):** Your AI assistant, guided by website skills. Owner decision, 2026-10-12. Until then it read "Website skills for search and AI visibility", which repeated the header line once that line showed on the home page. The kicker now says how the site gets built. It was picked from ten candidates: two outside models and the assistant each wrote lines, then scored all ten without authors' names, and all three put this one first. The market category sentence moved to the first paragraph of "What Croftweaver is" on the home page.
- **Header line (under the logo, on every page):** Build for search and AI. Owner decision, 2026-10-12: a visitor who lands on any page reads what Croftweaver is for before the page's own headline. It is the line that opens the toolkit's README, so site and repository say the same. Tried first and dropped: "Website skills for search and AI", which lost the building and read like an SEO tool. Not the brand line: that stays the sign-off (see "Lead with ownership" below).
- **Hero (H1):** Weave websites that rank. (Until 2026-10-08: "Build websites that
  rank.", the plain fallback if "weave" tests badly with strangers.)
- **Subline:** retired from the home page on 2026-10-08. The one-liner and three short outcomes replace it, since it said SEO and GEO, which strangers do not know. Its words were "Keep improving SEO and GEO, week by week."
- **Definition line (home page, under the one-liner):** Croftweaver is a free, open-source suite of website skills: instructions your AI coding assistant follows to build and test a site you own. Owner decision, 2026-10-13. An outside audit of that day said a stranger cannot tell from the hero what Croftweaver is, a toolkit and not a hosted builder or an agency; a second model (Kimi K3), shown that point and the argument against it, agreed. The sentence says what a skill is and carries the core term. It claims nothing that §2 does not. The one-liner above it stays as approved, and the market category stays in "What Croftweaver is".
- **Brand line, used as sign-off (≤ 12 words):** Your own plot of the web.
- **~50-word boilerplate:** Croftweaver is a suite of open-source website skills for AI coding assistants. It turns an assistant such as Claude Code into a careful website builder: fast, accessible Astro sites built to rank on Google and show up in AI answers, tested on every change, in a repo you fully own.

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

Counts in these lines are typed by hand: when the number of test suites changes, update them with the suite count (`SUITE_COUNT`).

The wording rule applies to all of them.

- "Search finds you. AI names you." Only directly above dated proof; never alone on a
  share card.
- "Build for search and AI." README headline, GitHub description.
- "Stop waiting on someone else for every change." The villain line: the first sentence
  of the home page one-liner (owner-approved 2026-10-08). The villain is the situation,
  never a named agency.
- "Build high-ranking websites." Deck and `/why`, with proof beside it.
- "Start with your positioning. Keep your pages on it." (2026-10-14) Never "true to it",
  and never "every page": the test checks the term, not the truth, and only on the pages
  in its map.
- "The next edit, tested." (2026-10-14) The after-launch line: the edit is the point, the
  watching is the trigger.
- "Fourteen test suites check every change." · "Four AI assistants check who names you." ·
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
| Home | `/` | website skills | website skills for search and AI visibility | live |
| Checks | `/checks` | test gate | — | live |
| Skills | `/skills` | website skills | — | live |
| Start | `/start` | quickstart | — | live |
| Proof | `/proof` | built with Croftweaver | — | live |
| More proof | `/more-proof` | more proof | — | live |
| Why | `/why` | search and AI visibility | — | live |
| Compare | `/compare` | alternatives | — | live |
| Roadmap | `/roadmap` | roadmap | — | live |
| From WordPress | `/from-wordpress` | WordPress to Astro | — | live |
| AI-built website SEO checklist | `/ai-website-seo-checklist` | SEO checklist for AI-built websites (and "vibe coded website SEO issues" in the body) | — | live |
| What it runs on | `/what-it-runs-on` | what it runs on (and "tech stack" in the body) | — | live |
| Positioning | `/positioning` | positioning | — | live |
| Partner assets | `/partner-assets` | partner assets | — | live |
| About | `/about` | maintainer | — | live |
| Security | `/security` | static website | — | live |
| Privacy | `/privacy` | exempt (legal) | — | live |
| Imprint | `/imprint` | exempt (legal) | — | live |

## Differentiation contract (vs genai-wednesday.de/builder-lab)

- The Builder Lab is the community showcase and owns GenAI Wednesday's own evidence:
  its scorecard, the AI score table and the FAQPage schema.
- croftweaver.com is the project home: the promise, the test gate, the skills catalogue,
  the quickstart and a proof page (`/proof`) for one site, genai-wednesday.de, with
  SoftwareSourceCode schema. `/proof` is written fresh from new measurements (speed,
  clicks from Google, the weekly AI check) and approved by the site's owner; the Lab's
  scorecard is linked, not copied. The panel's scores are the one exception, below.
- Exception, owner decision 2026-10-08: the home page and `/more-proof` show the
  panel's scores for genai-wednesday.de (SEO and GEO on the home page; SEO, GEO and
  E-E-A-T on `/more-proof`), each with its date, a link to the Lab, and the Lab's own
  caveats: AI opinions with no official scorer, and not comparable across assistants.
  `/more-proof` also shows the Lab's one-line prompt, attributed, so a visitor can
  reproduce the panel. The Lab keeps the full scorecard, both rounds and the notes for
  each assistant.
- No copy is shared between the two, apart from one third-party testimonial quoted
  verbatim with attribution, and those scores and that prompt, which are shown with
  their source. This site links to the Lab; the Lab links back when its page is
  reworked (README status table, step 9).

## Routes considered and not chosen

- **Lead with the test gate** ("The website that has to pass."). Recommended by both
  models and the assistant as the claim today's evidence carries best. Not chosen as the
  lead because buyers want to be found, not to own tests. Its lines stay in reserve:
  "Website skills with a test gate." · "Your site carries its checks." ·
  "Built. Checked. Yours."
- **Lead with ownership** ("Your own plot of the web.", the previous positioning).
  Ownership is the most crowded claim among comparable products; it stays as the brand
  voice and sign-off.
- **A hero built on "woven by people and AI"** ("Websites woven to be found by people
  and AI.", "Websites woven by people and AI."). Not chosen, 2026-10-08. "Woven by" and
  "to be found" are passive, and the wording rule asks for the active voice; "people and
  AI" puts the audience and a channel on one level when it describes finding; and the
  second has no purpose. "Websites built to rank." and "Built to rank. Woven with AI."
  are passive for the same reason. The chosen hero keeps the weaving image, in the
  active voice, with the purpose.
- **Naming agencies as the villain.** Not chosen. The villain is the situation, waiting
  on someone else for every change. Agencies are also customers: the home page lists
  small studio and agency sites as a good fit.
- The risk accepted with the chosen route: search and AI visibility is a crowded field
  with large audit packs and hosted dashboards, and proof is thin: one site. The
  wording rule and the limits that `/proof` states about itself are the guard.

## Hand-off to the rest of the pipeline

- **Voice + EEAT + page copy:** `website-content-guide` (owns tone, not positioning).
- **Keyword / SERP research:** `seo-audit` — positioning leads, keywords follow.
- **AI / answer-engine phrasing (GEO):** `ai-seo`.
- **Schema description + head metadata:** `website-seo-geo` (50-word boilerplate verbatim).
- **The home page as the visitor's story:** `STORY.md`, derived from this file. This file
  wins on any conflict.
