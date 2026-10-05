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
  authoritativeness, trustworthiness: what Google's quality raters look for). It is not a score,
  and Google says it is not a ranking factor by itself. Say which signals are built in
  and which a test checks (structured data present and parsing; links inside the site
  written from the root or with the full address; a link relative to the page only
  where it points to a section; not outside links or profiles); never promise an effect
  on rankings.

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
| Positioning | `/positioning` | how Webcroft works out what a site says before any copy, and how a test keeps each page on it | positioning | Positioning first: what your site says | [x] spec below |
| Stack | `/stack` | the three places a site lives (your computer, GitHub, Cloudflare), what each costs, where Keystatic fits | tech stack | Tech stack: your computer, GitHub, Cloudflare | [ ] spec below |
| Teams | `/teams` | how several people and assistants work on one site: the GitHub flow, `AGENTS.md`, two ways to run a team, the one-time setup | team | Build with a team: one site, several people | [ ] spec below |
| Privacy | `/privacy` | GDPR | — | Privacy Policy | [x] |
| Imprint | `/imprint` | § 5 DDG legal disclosure | — | Imprint | [x] |
| 404 | (not a route in `PAGES`) | not found | — | — | [ ] |

### Page `/positioning` (spec, 2026-10-04; built the same day)

**Why this page (as things stood before it was built).** Tested positioning is what
the comparable kits do not have (`POSITIONING.md`, alternatives). `/checks` explained
the positioning check; no page explained how the positioning is worked out before any
copy, and no page credited the two methods the skills build on. The page is about how Webcroft does it. It is not a summary
of anyone's book.

**Reader.** The owner who is about to be asked for "competitive alternatives" and has
never worked through positioning; and the decision-maker who wonders why the build
starts with questions and not with a design.

**Term and metadata (as built on 2026-10-04).**

- Positioning term: `positioning`. Not "website positioning": a search on 2026-10-04
  showed that phrase means search ranking, so it would file the page under the wrong
  topic.
- Title: "Positioning first: what your site says" (38 characters, 49 rendered).
- H1 on the page: "Decide what your site says. Then build it." The owner has not
  chosen yet; the other candidates are "Say what you offer before you write a word."
  and "Know what your site says first."
- Description: 152 characters, carrying the term (`AGENTS.md` wants 140 to 160; the
  test allows 120 to 160).

**Sections, in this order.**

| # | Section | What it must contain | Source |
|---|---|---|---|
| 1 | Hero | H1, one paragraph with the term, buttons to the quickstart and GitHub | this spec |
| 2 | What positioning is | one paragraph in our own words: what you offer, for whom, what they would use instead, and the category that makes the value obvious; why it comes before keywords and copy | toolkit skill `website-positioning` |
| 3 | The five questions | the five parts by name, each with one line and the question the assistant asks; the sentence "The method is April Dunford's, from her book Obviously Awesome." | same skill |
| 4 | What you get | `POSITIONING.md` in your repo: the five parts, a one-paragraph statement, a 50-word description, one term per page. Worked example: this site's own file, linked, and this site's page-and-term table | this repo's `POSITIONING.md`, `tests/positioning.spec.ts` |
| 5 | How the test keeps it true | what the positioning suite checks (term in the title, the description, and the H1 or the first paragraph; on the home page also the category in the body), one failure message, when it runs | `tests/positioning.spec.ts`, `/checks` |
| 6 | Limits | the test proves the term is present and consistent, not that the positioning is good; it is no keyword-density check; the judgment stays with the owner; the optional skill `website-positioning-check` gives a look from outside | honesty rules above |
| 7 | Then make it believable: trust signals (EEAT) | what EEAT stands for, said once; that it is the framework Google's quality raters use, not a score and not a ranking factor by itself; the signals the skills build in (structured data for the organisation with profiles that resolve, a named author with a bio where there is one, sources cited, imprint, contact and privacy pages, links that resolve); which of these a test checks (structured data is present and parses; links inside the site resolve when they are written from the site root or with the full address; a link written relative to a page is checked only where it points to a section, by the anchors suite) and which a test does not check: other links written relative to a page, and whether a profile or another outside link still works. An outside link that appears as a link on a page is looked at by the link audit; a profile that appears only in the structured data is checked by hand. The facts themselves come from the owner. Short: the content guide owns this layer, not positioning | toolkit skill `website-content-guide`; "EEAT signals" above; Google Search Central, "Creating helpful, reliable, people-first content" (read 2026-10-04) |
| 8 | The story layer (optional) | `website-story`: the home page told as the visitor's story, in seven sections; optional, offered once after positioning; this site does not use it. "Inspired by Donald Miller's StoryBrand framework, in Webcroft's own words." | toolkit skill `website-story` |
| 9 | Sources | the books, with links (below), and the no-endorsement sentence | owner, 2026-10-04 |
| 10 | Next step | quickstart, GitHub | page template |

**Sources section: links.** Plain links, no affiliate tag, no country detection, no
cover images (no third-party request, no copyright question). For each book: the
author's own page first, then Amazon.com and Amazon.de. The German pages later link the
German edition where one exists. Checked on 2026-10-04: all nine links answer the
request the link audit sends with 200, and each page title names the right book. They
are checked again when the page is built.

Open, for the owner: the launch gate in `README.md` wants the external link audit to
report no warning. Today it would report none for these links, but a shop can refuse
automated requests on another day, and the audit then lists the link as unverified.
Either a dated check by hand counts for a link a shop refuses to answer, or the page
links the authors' own pages only.

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
mean"). The same pull request adds the credit for both methods to `/skills`, which named
neither before.

**Scenarios it has to pass.**

| Given | When | Then |
|---|---|---|
| a visitor who has never heard of positioning | they read the first screen | they can say what Webcroft asks before it writes copy, and why |
| the page is built | the test suite runs | the positioning suite finds "positioning" in the title, the description and the H1 or first paragraph |
| someone changes a page's term in the test map | the site is rebuilt | the page-and-term table on `/positioning` shows the new term, with no edit to the page; a map the build cannot read fails the build |
| a reader wants the book | they reach the sources section | they find the author's page and plain Amazon.com and Amazon.de links, with no tag in the address |
| a reader who knows StoryBrand | they read the story section and the sources | the story section says "inspired by" and that the skill is optional; the sources section says neither author endorses Webcroft |
| a reader who has heard of EEAT | they read the trust section | it says what the letters stand for, that it is no score, which signals the skills build in, which of them a test checks, and that outside links and profiles are not among them |
| a reader looks at `/skills` | they read the credits | April Dunford and Donald Miller are named beside the existing credit |
| a phone 360 pixels wide | the page loads | the header is unchanged, and nothing scrolls sideways |

How the page-and-term table gets its rows: the build reads `tests/positioning.spec.ts`
as text and takes the map from it. It never imports the file, because importing it would
run the test registration outside the test runner. Both forms of an entry (one term, or
separate rules per surface) are handled; anything else fails the build, as `/checks`
does for its suite list.

How the two scenarios without a test are checked, when the page is built:

- First screen: the owner reads it and answers two questions without scrolling: what
  does Webcroft ask before it writes copy, and why does that come first?
- Phone: the page is opened 360 pixels wide in a browser; the document is no wider than
  the window, and the header shows the same links as on `main`. The test suite runs at
  desktop width only, so this is a check by hand, recorded in the pull request.

The per-page contract applies as for every page: route in `PAGES`, line in
`public/llms.txt`, own share card, entry in the positioning map and in the spine table
of `POSITIONING.md`, reachable by links from `/`.

### Pages `/stack` and `/teams` (spec, 2026-10-05)

Asked for by the owner on 2026-10-05: a page on building with a team ("Build with a
team": how `AGENTS.md` works, the ways a team can be organised, people responsible for
parts of the site, the GitHub process), and a page on the tech stack (Cloudflare, GitHub,
a folder on your computer, and where Keystatic fits). One spec for both, because each
links to the other. Built in this order: `/stack` first, then `/teams`, one pull request
each (page pull requests share five files). The `/stack` pull request links to no
`/teams` address, because the navigation test rejects a link to a page that does not
exist yet; the `/teams` pull request adds the links in both directions.

Facts behind both pages were read on 2026-10-05 from the toolkit (`karero/website-builder`
at `1a62629`: `skills/website-team-setup/`, `skills/new-website/templates/AGENTS.md`,
`CLAUDE.md`, `SETUP.md`, `skills/keystatic-setup/`) and from the vendors' own
documentation, listed per section. They are read again when each page is built.

#### Page `/stack`

**Why this page.** `/start` lists the accounts you need; no page shows how the parts fit
together, what each one costs, or the one mistake that breaks a working copy (a folder on
a synced or shared drive).

**Reader.** The owner before the first site, who hears "GitHub" and "Cloudflare" and
wants to know what lives where and what it costs; the decision-maker who asks what the
site depends on.

**Term and metadata.**

- Positioning term: `tech stack`.
- Title: "Tech stack: your computer, GitHub, Cloudflare" (45 characters, 56 rendered).
- H1: "Three places, all in your name." Draft; the owner chooses. Other candidates: "Where
  your site lives." and "Your computer, GitHub, Cloudflare." None of them carries the
  term, so the first paragraph must: the test reads the H1 or the first paragraph.
- Description, 145 characters: "The tech stack behind a Webcroft site: a folder on your
  computer, your code on GitHub, and Cloudflare, which hosts the site and can run your DNS."

**Sections, in this order.**

| # | Section | What it must contain | Source |
|---|---|---|---|
| 1 | Hero | H1, one paragraph with the term, buttons to the quickstart and GitHub | this spec |
| 2 | The picture | three boxes, left to right: your computer (the folder, your assistant), GitHub (the code, its history, pull requests, checks), Cloudflare (builds and serves the site, previews, DNS). Arrows: your computer and GitHub exchange changes; Cloudflare builds from GitHub. Drawn in HTML and CSS or inline SVG, no image file; stacks vertically on a phone | this spec |
| 3 | A folder on your computer | the working copy: a folder that mirrors the repository on GitHub, where your assistant reads and changes files and runs the checks before anything leaves the computer. Each person has their own folder; GitHub is where the team meets. The warning, with the reason: never a folder on a shared server or network drive, and never a folder that a sync service such as iCloud Drive, Dropbox, OneDrive or Google Drive copies around. For sync services, git's own documentation gives the reason: they copy a repository file by file and can corrupt it. For a shared folder on a server or network drive, the reason is simpler: two people working in one folder overwrite each other, and the team already shares through GitHub. The page claims no corruption for network drives; no vendor statement says so. Codex in the browser needs no folder: a new task starts from a copy of the repository on GitHub (an older task that is resumed may be behind, as `AGENTS.md` warns). This comes from the toolkit's guide for collaborators and is checked against OpenAI's Codex documentation when the page is built. Tools: the assistant installs what the site needs and asks first (as `/start` says) | owner, 2026-10-05; toolkit `SETUP.md`; git's FAQ on synced folders (see the vendor facts) |
| 4 | GitHub | where the code sits: every file, the full history of every change, pull requests, the checks that run on each one, the people you invite. A free account is enough; the repository can be private or public, and the account is yours | toolkit `SETUP.md`; GitHub's plan pages (see below) |
| 5 | Cloudflare | builds the site from GitHub and serves it; every pull request from a branch in the repository gets its own preview address (a pull request from a fork gets none, and every preview build counts toward the monthly builds). Every request to a Webcroft site, page or file, passes through one small function, the one that keeps preview copies out of search engines, so the free plan's daily function limit applies to the whole site, not only to pages that need a server: the page gives the number and says what happens when it runs out (a project setting decides between serving the pages without the function and an error page). The free plan covers a small static site: its limits, dated and linked. Your domain's DNS can move to Cloudflare on the free plan: you change the name servers at the company where you bought the domain, and the domain stays registered there. The move has traps (mail records, DNSSEC), and the toolkit walks you through them, record by record, before anything is switched. Mail: if that company forwards your mail today, check before the switch whether the forwarding keeps working once the DNS is elsewhere (with some companies it stops, because it depends on their own DNS), and keep or replace the records it needs; Cloudflare Email Routing is one replacement: it forwards incoming mail to a mailbox you already have, at no cost, and needs the DNS at Cloudflare. It is not a mailbox of its own. One sentence, dated: Cloudflare now recommends Workers for new projects; the toolkit deploys to Pages, which Cloudflare still offers on every plan | toolkit `SETUP.md`, `references/CLOUDFLARE_FIRST_DEPLOY.md`; Cloudflare's docs (see below) |
| 6 | Where Keystatic fits | not a fourth place. Keystatic is an optional editing screen for someone who would rather fill in a form than talk to an assistant, chosen when the site is first built. In local mode, the one the toolkit sets up, the editing screen is served by the site's preview on your own computer (you open it in your browser), writes ordinary Markdown files into the same folder, and you send the change to GitHub as usual; the published site contains no Keystatic at all. GitHub mode serves the editing screen from the published site and saves straight to GitHub, so nothing needs to run on the editor's computer; it needs a server part on Cloudflare, a GitHub App and stored secrets, and the toolkit describes it but does not set it up | toolkit `skills/keystatic-setup/SKILL.md` |
| 7 | What it costs | free to start: GitHub's and Cloudflare's free plans, each with its limits next to it, including the daily function limit from section 5. Not free: the domain (the price of whoever registers it) and your AI assistant's own plan. No prices typed except a vendor's, with the date it was read | vendor pages (see below) |
| 8 | What you can swap | the pages themselves are static files that any host can serve. Written for Cloudflare Pages: the publish script, the previews, the headers file, the middleware that keeps previews out of search engines, any serverless function, and Keystatic's GitHub mode if a site adds it. Another host means replacing those parts or doing without them | toolkit templates (`scripts/ship.sh`, `public/_headers`, `functions/_middleware.ts`); `skills/keystatic-setup` |
| 9 | Next step | quickstart, GitHub; the link to `/teams` is added by the `/teams` pull request | page template |

**Vendor facts, read on 2026-10-05.** Figures for the page come from these pages, and the page shows the date
next to them.

- Cloudflare Pages on the free plan (developers.cloudflare.com/pages/platform/limits/):
  500 builds a month, one build at a time, 20,000 files per site, 25 MiB per file, 100
  projects per account, 100 custom domains per project. "On both free and paid plans,
  requests to static assets are free and unlimited" (…/pages/functions/pricing/), but
  "once you add Functions on a Pages project, all requests by default will invoke your
  Function" (…/pages/functions/routing/), and a middleware file at the root of
  `functions/` runs "in front of static files" (…/pages/functions/middleware/). Every
  Webcroft site has one (`functions/_middleware.ts`) and no `_routes.json`, so its
  requests are not the free and unlimited kind: they count toward the daily function
  limit below. When that limit is used up, the project's "Fail open / closed" setting
  decides between serving the static files without the function and an error page
  (routing page). No bandwidth figure is given, so the page says "requests", not "bandwidth" (the toolkit's
  `SETUP.md` says "unmetered bandwidth").
- Pages Functions count against the Workers free quota of 100,000 requests a day, reset
  at midnight UTC (same page).
- Previews: every branch other than the production branch gets its own preview address, with no limit on the number of previews on the free plan (each one is still a build);
  pull-request previews come from branches in the same repository, not from forks
  (…/pages/configuration/preview-deployments/).
- The Pages overview (developers.cloudflare.com/pages/) now says Workers "is Cloudflare's
  primary platform for building applications. Start new projects with Workers." Pages is
  "Available on all plans", and the toolkit deploys to it. The page says this in one
  sentence; whether the toolkit should move is a question for the toolkit, not for this
  page.
- DNS: the full setup, where you change the name servers at your registrar, is available
  on the free plan; "You do not need to move away from your registrar"
  (…/dns/faq/). Cloudflare Registrar is optional and sells domains at cost, so it is not
  free (…/registrar/).
- Email Routing is available on the Workers free and paid plans, forwards incoming mail
  to existing mailboxes, and requires Cloudflare DNS. Sending to any recipient needs the
  paid plan and is in beta, so the page does not offer it
  (…/email-service/platform/pricing/, …/email-service/get-started/route-emails/).
- GitHub Free (docs.github.com/en/get-started/learning-about-github/githubs-plans):
  unlimited public and private repositories, unlimited collaborators. Actions, which run
  the checks: free on public repositories with GitHub's standard runners; 2,000 minutes a
  month for private repositories, and without a payment method on file they stop when
  the minutes are used up (docs.github.com/en/billing/concepts/product-billing/github-actions).
- Synced folders: git's FAQ, "It is important not to use a cloud syncing service to sync
  any portion of a Git repository, since this can cause corruption"
  (git-scm.com/docs/gitfaq#sync-working-tree). It names no service; the page may name
  iCloud Drive, Dropbox, OneDrive and Google Drive as examples of one. No vendor statement
  was found about network shares.

**What the page must not do.**

- Say "free" without the plan's limits close by, or "free forever".
- Type a price that no vendor page states, or leave a vendor figure without its date and
  link.
- Say every host works the same (section 8 says what is Cloudflare-specific).
- Present editing on the published site (Keystatic's GitHub mode) as set up: it is described, not wired.
- Recommend a registrar or a mail provider.
- Add a header link (the header takes no more links until it has a compact phone menu).

**Where it is linked from.** `/start` ("What you need"), the home page (one sentence in
"The site is yours"; the `/teams` pull request extends it), the footer (proposed:
"Stack"), and later `/teams`.

**Scenarios it has to pass.**

| Given | When | Then |
|---|---|---|
| a reader who has never published a website | they read the first screen | they can name the three places and say what each one does |
| someone about to put the site folder in Dropbox or on the office server | they read the section on the folder | they learn not to, why, and that GitHub is where the team shares |
| an owner whose domain company forwards their mail today | they read the Cloudflare section | they learn to check, before the switch, whether that forwarding survives the move, and what can replace it |
| a reader who asks where Keystatic fits | they read its section | they learn it runs on the computer in the mode the toolkit sets up, that the live site contains none of it, and that editing on the published site, with nothing running on the editor's computer, needs more and is not set up |
| a reader who asks what it costs | they read the cost section | they find what is free, with the limits, the date and a link, and what is not free |
| the page is built | the test suite runs | the positioning suite finds "tech stack" in the title, the description and the H1 or first paragraph |
| a reader on `/start` | they read "What you need" | it links to `/stack` |
| a phone 360 pixels wide | the page loads | the header is unchanged, the picture stacks, and nothing scrolls sideways |

#### Page `/teams`

**Why this page.** "Small teams" are named in the best-fit customer (`POSITIONING.md`),
and the toolkit has a setup for them (`website-team-setup`, release 0.27), but the site
gives it one line on `/skills`. No page explains how several people and several
assistants work on one site without overwriting each other.

**Reader.** The owner whose colleague, client or business partner starts working on the
site soon; the small studio deciding whether its people can share one site; a team
member who has never used GitHub.

**Term and metadata.**

- Positioning term: `team`.
- Title: "Build with a team: one site, several people" (43 characters, 54 rendered).
- H1: "Build with a team." The owner's words, in the site's sentence case. Other candidates:
  "One site, several people, the same checks." and "Work on one site together." The
  first paragraph carries the term whichever H1 is chosen.
- Description, 145 characters: "How a team builds one Webcroft site: the GitHub flow step
  by step, the AGENTS.md rule file for assistants, and who merges and who publishes
  live."

**Sections, in this order.**

| # | Section | What it must contain | Source |
|---|---|---|---|
| 1 | Hero | H1, one paragraph with the term: several people and several AI assistants can work on one site at the same time. Three things do the work: a rule file that Codex and Claude Code load when they start (section 3 says what that does and does not do), checks that run on every change, and GitHub's pull requests, where each change waits to be looked at. No protective force is claimed for the rule file (section 3); buttons to the quickstart and GitHub | template `AGENTS.md` (its opening paragraph) |
| 2 | How a change travels | the GitHub process as numbered steps, each term explained once: get the newest state; work on your own copy (a branch); change and check; propose it (a pull request); the checks run (green tick or red); look at the preview address; merge; on a two-stage site, publish with `npm run ship`. Two situations: someone merged first ("Update branch" runs the checks again on the new state, then merge); the change clashes with someone else's (a conflict: stop and ask, never force). Codex in the browser: a new task starts from a copy of the repository on GitHub, and Codex creates the branch and the pull request when you press "Create PR"; from the checks on, the steps are the same. A resumed older task may be behind, and the file tells Codex to compare its copy with GitHub when it can (`AGENTS.md` §1). This comes from the toolkit's guide for collaborators and the site the setup came from, and is checked against OpenAI's Codex documentation when the page is built. The section repeats the boundary from `/start`: Webcroft has not been tested from start to finish with Codex | template `AGENTS.md` §§1 and 2; `TEAM-GUIDE.md`; `website-team-setup` §3 |
| 3 | `AGENTS.md`: one rule file for your assistants | what it is: a plain text file in the repository, in an open format for coding assistants that the Agentic AI Foundation under the Linux Foundation looks after. Who reads it and when, as each vendor documents it: OpenAI's Codex documentation says Codex reads it when it starts, and does not say the same for tasks in the browser (Webcroft's file has a part written for that case); Claude Code reads `CLAUDE.md` at the start of every session, and in every Webcroft site that file is one line that imports `AGENTS.md`. What it says, section by section (get the newest state first; how work happens; where content lives; how texts are written; who may change what; the checklist for a new page). What it is not: a lock. Its rules apply to everyone on the team, the owner included, but the file cannot stop anyone: an assistant is told to follow it, which is not a guarantee, and a person editing by hand may never open it. What does more: the tests report problems on every pull request; GitHub refuses the merge only where it is set to require the checks (a ruleset or a branch-protection rule, which depends on the plan, section 4); the push block on a free private repository is a local check that can be skipped (section 8). Link the template in the toolkit | template `AGENTS.md` and `CLAUDE.md`; agents.md; OpenAI, "AGENTS.md" in the Codex docs; Anthropic, "How Claude remembers your project" in the Claude Code docs (all read 2026-10-05) |
| 4 | Two ways to run a team | a table with two columns. **One gatekeeper:** collaborators propose, one person looks at every preview and merges, and only that person publishes. Good when one person answers for every word; the cost is waiting for them. **Equal rights:** everyone merges their own pull request once the checks are green and they have looked at the preview, and asks before merging someone else's; publishing stays with the owner or is open to all. Good when people own their own pages; the cost is no second pair of eyes unless someone asks for one. On a two-stage site there are two gates, merge (the preview) and publish (the live site), and they can belong to different people: the toolkit's default is equal rights for merging and the owner alone for publishing. On a single-stage site connected to Cloudflare by git, a merge is the publish, so the merge rule is the only gate; the table says which column applies to which. Then what GitHub enforces: on a repository in a personal account every collaborator has write access and can press merge, so "only the gatekeeper merges" is a rule in `AGENTS.md` that the team agrees to and the assistants are told to follow, not a lock. GitHub can require an approval by someone other than the author before any merge (a ruleset or a branch-protection rule; free on a public repository, a paid plan for a private one). GitHub also documents a ruleset rule that lets only those allowed to bypass it update a branch, which could make the gatekeeper real where rulesets are available; the setup has not tried it on a real site, so the page says so and promises nothing. Finer roles need a GitHub organization | `website-team-setup` §1 (questions 3 and 4) and §5; GitHub docs "Permission levels for a personal account repository" and the plan notes for rulesets (read 2026-10-05) |
| 5 | What each person may change | the three levels from `AGENTS.md` §5: content (texts, images, entries); content and design (also navigation, components, layouts, styles); everything (also new pages, tests, scripts, settings). Written rules: the team agrees to them and the assistants are told to follow them; one line to change later | template `AGENTS.md` §5 |
| 6 | Responsible for a part of the site | the owner's question: one person for the events pages, another for the blog. Depends on the owner decision below; in every option the page says plainly whether Webcroft sets it up. What exists: a line in `AGENTS.md` naming who looks after which part (every plan; the assistants are told to respect it and to say so in the pull request; GitHub does not enforce it); and GitHub's code owners file, which maps folders and files to people and asks those people for a review whenever a pull request touches their part (free on public repositories, a paid plan for private ones; a code owner needs write access; their approval becomes required only when a ruleset or a branch-protection rule demands it, on the same plans). A menu item is several files (the page, its content folder, its images); the shared parts (navigation, layout, styles, site settings) stay with the owner | GitHub docs "About code owners" and the plan notes (read 2026-10-05); `website-team-setup` §3b ("Skipped on purpose") |
| 7 | The setup, once, when the second person joins | `website-team-setup`: the five decisions (who joins; what they may change; who merges; who publishes; Codex in the browser or on their own computer); then the steps, each with who does it: invite people, set the repository (the "Update branch" button, merged branches deleted, one merge method, automatic merging off), prove the checks start on their own with a test pull request, block direct changes to `main`, connect Cloudflare so every pull request from a branch in the repository gets a preview, write the rules into `AGENTS.md`, hand the team a one-page guide. The steps that touch your accounts are yours (invitations, the Cloudflare dashboard, settings that depend on your GitHub plan); the assistant prepares every value, runs what it can, and never handles your password or second factor. Where it comes from: one client site that went from one owner to three people, working with Codex in the browser and on their computers and with Claude Code, on the same day; the site is not named | `website-team-setup` §§1 to 9; `docs/reviews/SKILL-PLAN-website-team-setup.md` |
| 8 | Limits | on a private repository on GitHub's free plan there is no server-side block: the block is a local check (a hook) on each computer, and it is skipped by `git push --no-verify`, by `ALLOW_MAIN_PUSH=1`, and by a copy where `npm install` never ran; who may publish stays a written rule in the setup: GitHub documents a rule that could enforce it where rulesets are available, but the setup has not tried it on a real site yet; built for a repository in a personal account, not an organization; no live co-editing, comments or approval flow beyond GitHub's own; two-factor sign-in is recommended to every collaborator but cannot be required on a personal account; `AGENTS.md` states rules the whole team agrees to and tells the assistants to follow them; it cannot stop anyone | `website-team-setup` §§3b and 5, the hook's own comments |
| 9 | Next step | quickstart, `/stack`, GitHub | page template |

**What the page must not do.**

- Promise what Webcroft does not have: live co-editing, comments, roles beyond the three
  written levels, an approval flow beyond GitHub's, seats, single sign-on, audit logs.
- Call a written rule or a local hook "enforced".
- Name the client site or its people.
- Say Webcroft runs in Codex: Webcroft has not been tested from start to finish with
  Codex (`/start`). The page may say that the guide for collaborators covers Codex in the
  browser, and that the site the setup came from used it.
- Use this site's repository as the example of a team setup: it is a one-owner repository
  that has not run it (checked on 2026-10-05: no ruleset on `main`, "Update branch" and
  automatic deletion of merged branches both off).
- Claim that it works the same for an organization account.
- Add a header link.

**Where it is linked from.** `/skills` (the `website-team-setup` entry; today the link
text of a skill entry is fixed to "How positioning works", so the link text moves into the
data), the home page (one sentence in "The site is yours", with `/stack`), the footer
(proposed: "Teams"), and `/stack`.

**Scenarios it has to pass.**

| Given | When | Then |
|---|---|---|
| an owner whose colleague starts next week | they read the first screen | they can say what keeps two people from overwriting each other |
| a reader who has never used GitHub | they read how a change travels | they can name the steps from "newest state" to "merge", and what to do when GitHub shows "Update branch" or a conflict |
| a reader who asks whether `AGENTS.md` enforces anything | they read its section | they learn that the assistants read it at the start and are told to follow it, that this is no guarantee, that the tests report problems, and that GitHub refuses a merge only where it is set to |
| an owner who wants to approve every change | they read the two ways to run a team | they learn that on a personal account the gatekeeper is a written rule, that every collaborator can press merge, and what GitHub can require instead, on which plan |
| a team that wants one person responsible for the events pages | they read that section | they learn what works today, what GitHub enforces on which plan, and whether Webcroft sets it up |
| a team on a private repository on GitHub's free plan | they read the limits | the local push block and the ways around it are named |
| the page is built | the test suite runs | the positioning suite finds "team" in the title, the description and the H1 or first paragraph |
| a reader on `/skills` | they read the `website-team-setup` entry | it links to `/teams`, with link text that names the page |
| a phone 360 pixels wide | the page loads | the header is unchanged, the tables fit or scroll inside their own box, and the page does not scroll sideways |

#### Both pages

How the scenarios without a test are checked, when each page is built: the owner reads
the page and answers the scenario questions without help; the phone check is done in a
browser 360 pixels wide (the test suite runs at desktop width only) and recorded in the
pull request.

The per-page contract applies as for every page: route in `PAGES`, line in
`public/llms.txt`, own share card, entry in the positioning map and in the spine table of
`POSITIONING.md`, reachable by links from `/`. The toolkit release each page describes is
read from `RELEASE` in `src/data/skills.ts`, never typed.

**Open, for the owner.**

1. Responsible for a part of the site (`/teams` section 6). (A) The page explains both
   ways as something a team sets up itself, says Webcroft does not set it up today, and
   `/roadmap` gets a row. (B) The toolkit's team setup learns it first (its own pull
   request and release), and the page then describes it as part of the setup. (C) Leave
   it off the page. Recommended: A now, B later if teams ask for it.
2. The H1 of each page.
3. The two footer links.

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
- [ ] Rendered `<title>` at most 60 characters (the test enforces the maximum; 50–60 is the editorial target where the page title allows it), `<meta description>` 140–160 (the test allows 120–160; see website-seo-geo)
- [ ] og/twitter inherit title/description; canonical set
- [ ] Required JSON-LD present (WebPage + page-specific)
- [ ] Images: WebP, sized to display, descriptive alt, lazy below the fold
- [ ] Any linked PDF in `public/` has a descriptive doc-title set via
      `scripts/set_pdf_title.py` — not the authoring placeholder (see website-seo-geo)
- [ ] In sitemap; internal links clean (no `.html`)
- [ ] EEAT: author/date where relevant; sources cited
