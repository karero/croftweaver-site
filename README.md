# croftweaver.com

Project homepage for **Croftweaver**, the open-source suite of website skills for AI
coding assistants (https://github.com/karero/croftweaver). Built with Croftweaver itself.

## Decision record (new-website interview, 2026-07-02)

1. **Pages:** three flat pages (`/`, `/privacy`, `/imprint`) — no collections.
   Extended 2026-10-03: seven more flat pages are planned (`/checks`, `/skills`,
   `/start`, `/proof`, `/why`, `/compare`, `/roadmap`) plus a 404. Inventory:
   `CONTENT_GUIDE.md`.
2. **Dynamic:** Tier 1, fully static pages, no forms. One Cloudflare Pages middleware
   (`functions/_middleware.ts`) sets noindex on previews and and, once CANONICAL_URL is set in Cloudflare, redirects the production alias to the live domain.
3. **Editors:** owner + AI assistant via git. No CMS.
4. **Language:** English only, unprefixed default (German stays additive later).
5. **Analytics:** Google Search Console, and (configured 2026-10-12) cookieless Plausible
   on M-Squad's own instance, analytics.m-squad.com. The script loads on the live build
   only (`CF_PAGES_BRANCH` equals `PROD_BRANCH` in `src/config.ts`). No cookies, no banner
   (a position to have confirmed; see "Launch requirements" and the header of
   `src/pages/privacy.astro`).
6. **Publish model:** two-stage. `main` = noindexed preview (`*.pages.dev`),
   `production` = live at https://croftweaver.com. Publish with `npm run ship`.

## Decisions (owner, 2026-10-03, 2026-10-04 and 2026-10-08)

- **Positioning:** lead with being found by search engines and AI assistants; the test
  gate is the proof; ownership is the brand voice. Hero: "Weave websites that rank."
  (from 2026-10-08; before: "Build websites that rank."). The subline "Keep improving
  SEO and GEO, week by week." is retired; the one-liner replaces it. Details, the wording
  rule and the routes not chosen: `POSITIONING.md`; the home page story: `STORY.md`.
- **Name in text:** "Croftweaver". Lower case only in code contexts (domain, repo).
- **GitHub:** rename `karero/website-builder` to `karero/croftweaver` in place. The old
  name is never created again, or its redirect stops working.
- **Name and trademark check:** commissioned before the rename; the rename (release
  v0.31) waits for its result.
- **Pitch deck:** rebuilt as the page `/why`, with the deck as a PDF download.
- **Colour:** an own moss palette with green-tinted neutrals; the values land in
  `BRAND.md` in step 2.
- **Logo:** designed by the owner; the site is built with the name as text until it
  lands.
- **Languages:** English first; German is the last step.
- **Proof:** `/proof` shows one site, genai-wednesday.de (owner, 2026-10-04). This
  replaces the earlier launch requirement of three sites.

## Differentiation contract

genai-wednesday.de/builder-lab is the community showcase and owns GenAI Wednesday's own
evidence (its scorecard, the AI score table, FAQPage schema). This site is the project
home (the promise, the test gate, skills catalogue, quickstart, a proof page for one
site, SoftwareSourceCode schema). No shared copy apart from one attributed
testimonial and, by owner decision on 2026-10-08, the panel's scores and its one-line
prompt, shown with their date, a link and the Lab's caveats. This site links to the Lab;
the Lab links back in step 9. Details:
`POSITIONING.md`.

## Working on the site

```bash
npm install          # once
npm run dev          # local dev server
npm run build        # static build into dist/ (+ anchor ids + build marker)
npm test             # a11y / seo / navigation / anchors / orphans / images /
                     # tone / positioning / email / links / llms-coverage /
                     # middleware (preview handling)
npm run og           # regenerate OG share cards after brand/copy changes
npm run deck         # remake the /why slide deck (public/croftweaver-why.pdf)
```

The slide deck reads three things from the built pages, so they are never typed: the
evidence section of `/why`, the sentence with the test-suite count in its "Check" step,
and the suite groups and names on `/checks`. When one of those, the slides in
`scripts/deck-slides.mjs`, the logo or the site address changes, `npm test` fails until
you run `npm run deck` and commit the new `public/croftweaver-why.pdf` and
`scripts/deck.lock.json`. The rest of the slides is copy written for the deck, and no
test compares it with the pages: after changing an argument on `/why` or a description
on `/checks`, read `scripts/deck-slides.mjs` and change it by hand. The deck needs Node
22.18 or newer, and making it needs Python 3 with `pypdf` for the PDF's title.

Add a page: add the route to `tests/_helpers.ts` `PAGES` first (suite goes red),
build the page until green, update `public/llms.txt`, commit. Voice rules live in
`CONTENT_GUIDE.md`, positioning in `POSITIONING.md`, visuals in `BRAND.md`.

## Status: rename and launch

One row per step. Update the row as part of finishing the step; evidence is a commit, a
pull request or an explicit "—". "Owner" steps need Daniel; the rest arrive as pull
requests.

| # | Step | Who | State | Evidence |
|---|---|---|---|---|
| 0 | Decisions (positioning, lines, name, rename route, deck, palette) | owner | done | section "Decisions" above; positioning in `POSITIONING.md` |
| 0a | Name and trademark check for "Croftweaver" | owner | open: no search for "Croftweaver" recorded here yet. The earlier check was for the dropped name "Webcroft" (owner's own searches, 2026-10-04: no identical hit in TMview, USPTO, the UK register and EUIPO; similar marks "webcraft", "web craft" and "croft" in classes 9, 35 and 42, no legal opinion). Webcroft was then dropped as too close to an existing company | — |
| 0b | Fresh, publishable proof figures | owner | PageSpeed for three sites is on `/more-proof` (step 4b). Owner, 2026-10-04: `/proof` uses genai-wednesday.de only; its Search Console figures (28 days to 29 September 2026) and the AI check (five check days, 26 September to 8 October 2026) are on `/proof` (step 5) | karero/croftweaver-site#7, merged 2026-10-04 (`646bcd1`) |
| 1 | Requirements: `POSITIONING.md`, `CONTENT_GUIDE.md`, this table | PR | done | karero/croftweaver-site#3, merged 2026-10-04 (`f304bef`) |
| 2 | Brand: palette tokens, share-card colours, 404 page, `_headers` placeholder, `llms.txt` licence wording | PR | done | karero/croftweaver-site#4, merged 2026-10-04 (`0d38a11`) |
| 2a | Legal address into `imprint.astro` and `privacy.astro` | owner fact + PR | in review: the operator is M-Squad GmbH, with the address, managing director, register entry and VAT ID the owner gave on 2026-10-09. The structured data (`legalName` in `src/config.ts`) names the same company | karero/croftweaver-site#39 (open, draft) |
| 2b | Dependency: sharp 0.35.5, to clear an npm audit advisory | PR | done | karero/croftweaver-site#28, merged 2026-10-09 (`03992f3`); dependabot's pull request for the same bump (karero/croftweaver-site#29) was closed |
| 3 | Logo, favicon and app icons, schema logo | owner + PR | done | karero/croftweaver-site#18, merged 2026-10-08 (`48b1738`) |
| 4 | Header and navigation; home page rewrite | PR | done | karero/croftweaver-site#5, merged 2026-10-04 (`f7e7eb1`) |
| 4a | Home page as the visitor's story: hero "Weave websites that rank.", the villain, the one-liner, the plan, a short learning section (`STORY.md`) | PRs | done; a fresh-eyes check of the page then led to three fixes: the Quickstart leads with the one-prompt route; the hero says who the site is for; one scene shows life after, and two long sections became one | karero/croftweaver-site#19, merged 2026-10-08 (`d98ff84`); `STORY.md` and the page: karero/croftweaver-site#20, merged 2026-10-08 (`bfe7b0b`); the three fixes: karero/croftweaver-site#31, merged 2026-10-09 (`4f3f604`) |
| 4b | Home proof strip: the AI panel's SEO and GEO scores first, a try-it prompt, and a `/more-proof` page for PageSpeed and E-E-A-T | PR | done | karero/croftweaver-site#21, merged 2026-10-08 (`24b3738`) |
| 5 | Pages `/proof` + `/checks`, then `/skills` + `/start` | PRs | done | karero/croftweaver-site#6 (`40c6031`), karero/croftweaver-site#7 (`646bcd1`), karero/croftweaver-site#8 (`2ea1bd2`), all merged 2026-10-04 |
| 5a | Deck refresh and PDF export | owner + assistant | in review: the deck is made in this repository (`npm run deck`), 11 slides as `public/croftweaver-why.pdf`. The owner has not read the slide wording yet. The Google Slides decks are not part of this and are not refreshed | karero/croftweaver-site#40 (open) |
| 5b | Page `/why` with the PDF | PR | page done; the download button and the PDF are in review | page: karero/croftweaver-site#10, merged 2026-10-04 (`bea52e7`); PDF: karero/croftweaver-site#40 (open) |
| 5c | Pages `/compare` + `/roadmap` | PR | done (built before 5b: `/why` waited for the deck) | karero/croftweaver-site#9, merged 2026-10-04 (`fe7a5dc`) |
| 5d | Page `/positioning`: how the positioning is worked out and tested, with credits for both source methods (also on `/skills`) | PR | done | spec: karero/croftweaver-site#14, merged 2026-10-04 (`268fbe4`); page: karero/croftweaver-site#15, merged 2026-10-04 (`98f30be`) |
| 5e | Page `/partner-assets`: the partner kit (badge, logo, icon) to download, the code for a footer, the rules for using it and the request to credit Croftweaver; the badge in every footer | PR | done | karero/croftweaver-site#26, merged 2026-10-09 (`60fcbf4`) |
| 5f | Charts on `/proof`: Search Console clicks as a rolling 28-day total, and the AI check as one mark per call | PR | done | karero/croftweaver-site#23, merged 2026-10-09 (`fd45b44`) |
| 5g | The AI check of 8 October 2026 on `/proof` and as a published CSV file, for genai-wednesday.de only (`scripts/export-ai-check.py` makes the file) | PR | done | karero/croftweaver-site#24, merged 2026-10-09 (`904b69a`) |
| 5h | Page `/established-sites`: Croftweaver for sites that already exist | PR | done | karero/croftweaver-site#25, merged 2026-10-09 (`a4969ff`) |
| 5i | Launch wording: genai-wednesday.de launched on 27 March 2026 and was not relaunched (`/proof`, `/more-proof`, `/why`, `STORY.md`, `public/llms.txt`) | PR | done | karero/croftweaver-site#27, merged 2026-10-09 (`c48b39e`) |
| 5j | Perplexity's count in the AI check is worded as what it measures, not as a citation; the export script no longer stops on a valid row | PR | done | karero/croftweaver-site#30, merged 2026-10-09 (`fb2b415`) |
| 5k | `/skills` lists 34 skills: 31 in toolkit release 0.29 and three added since. At release 0.30, update `RELEASE` and `SKILLS` in `src/data/skills.ts` and clear `ADDED_SINCE` | PRs | done | 33 skills: karero/croftweaver-site#32, merged 2026-10-09 (`dc4b20f`); the 34th, `facts-check`, and the `/established-sites` answers that no longer call it "in review": karero/croftweaver-site#37, merged 2026-10-11 (`2020179`) |
| 6 | Toolkit rename pull request (in the toolkit repo) | PR | draft, reviewed; merges right after the rename in step 7. Replaces karero/website-builder#147, which used the dropped name Webcroft | karero/website-builder#212 (draft) |
| 7 | GitHub rename `website-builder` → `croftweaver`, release v0.31 (site links assume it; v0.30 ships first under the old name) | owner | open, waits for 0a and v0.30 | — |
| 8 | Launch: mailbox `hello@croftweaver.com` (set up, owner, 2026-10-08), Pages project, `production` branch, domain, Search Console, `npm run ship` | owner | open | — |
| 9 | Builder Lab, footers and other sites point at the new name | PRs | open | — |
| 10 | German translation | PRs | open | — |

Launch requirements that no test enforces:

- No unfilled slot in `src` or `public`. The `[STREET AND NUMBER]` and `[POSTCODE]`
  slots in `src/pages/imprint.astro` and `src/pages/privacy.astro` were filled in
  karero/croftweaver-site#39 (step 2a). CI only catches `[MISSING:`.
- The privacy page names M-Squad GmbH as controller and calls Cloudflare "our
  processor". That holds while the Cloudflare account that serves the site is the
  company's: the owner confirmed on 2026-10-11 that it is M-Squad GmbH's. If the site
  moves to another account, read that sentence again. Four more points from the review
  of karero/croftweaver-site#39 were answered the same day: the imprint has a phone
  number as a second contact channel; the number stays in plain text in the source, as
  the email address does, and is hidden in the served HTML; the privacy page does not
  name the mail host; and the Organization structured data keeps "M-Squad GmbH" as its
  name.
- `hello@croftweaver.com` is set up (owner, 2026-10-08). The domain's DNS is on Cloudflare
  and its MX records point to Google (seen 2026-10-08). Before launch a test mail to it
  must arrive, because the imprint and privacy pages publish it as their contact; record
  the date here.
- The AI panel on the home page and `/more-proof` is copied from the Builder Lab (read
  2026-10-08, second round of 20 August 2026). Re-read the Lab before launch and update
  `src/data/proof.ts` if its numbers changed, and the caveat sentences in
  `src/pages/index.astro` and `src/pages/more-proof.astro` if its caveats changed; the
  build only checks that the rows still average to the figures copied that day.
- `/proof` with fresh, dated figures for genai-wednesday.de (one site by owner
  decision, 2026-10-04; the earlier requirement was three sites). The AI check file comes
  from `python3 scripts/export-ai-check.py --out public/data/genai-wednesday-de-ai-check.csv`,
  which needs the tracker's history on the owner's machine and publishes that one site and
  nothing else (`tests/check_export_ai_check.sh` keeps that true). An assistant the check
  was not run for on a day is declared in `NOT_RUN` in `src/data/proof.ts`; the page
  build stops on any other gap in the file.
- Real icons and a logo in `public/` (icon-192/512, maskable, apple-touch, favicon,
  `images/logo.png`).
- The external link audit (`scripts/check_external_links.sh`) reports no warning. The
  links to `github.com/karero/croftweaver` cannot resolve before step 7; run the audit
  after step 7 and record its dated result in the table. The slide deck PDF carries the
  same link and the audit does not read PDFs; the deck takes the address from
  `SITE.repo`, so once that link resolves, the deck's link resolves too.
- The cache rule for `/brand/*` in `public/_headers` is tested from the file, because
  `astro preview` does not apply `_headers`. After launch run
  `curl -sI https://croftweaver.com/brand/badge/built-with-croftweaver-light.svg` and
  expect the `cache-control` value that the `/brand/*` rule in `public/_headers` sets.
  A Cloudflare Cache Rule or Browser Cache TTL on the zone could change what visitors
  get; record the date here.
- Analytics (Plausible on analytics.m-squad.com, live build only). The privacy page
  states things that only the owner can confirm. Nothing here is recorded yet; write
  each line with its date when it is true:
  - Where the instance runs: on a server of M-Squad GmbH, in the EU or EEA (name the
    hosting provider if it is rented, and add it to section 3 as a recipient). Its web
    server or reverse proxy keeps no IP addresses in access logs. The Cloudflare zone in
    front of analytics.m-squad.com is in the account confirmed for the site above (section 2, which section 3 points to, calls Cloudflare a processor). Cloudflare Web Analytics is off for this project (it would
    inject a beacon that section 3 does not describe).
  - What the instance does, from the instance itself and not from Plausible's hosted data
    policy: its version, that its event and session tables hold no IP address or raw
    user-agent column, and how its daily salt is handled. If any of that differs, change
    the sentences in section 3 that say it. The `deploy/plausible-m-squad` folder of the
    m-squad-website repository names Community Edition v3.2.1 with ClickHouse 24.12 and sets no
    retention or purge; confirm that is what runs.
  - Settings > General > Tracking in the instance: "Outbound links" and "File downloads"
    ticked, "Form submissions" unticked (the site has no form). Section 3 has one sentence
    for each of the two ticked ones; when the ticks change, change the sentences.
  - What deletes old records in the instance (a retention setting, a table TTL or a job
    you run), and the period it enforces. State only that period in the `[MISSING:` slot in section 3 (the slot asks for the period, not the mechanism); CI stays red until it is filled.
  - The no-banner position (see the header of `src/pages/privacy.astro`): until this line
    names who read it and accepted it, and when, the position is not accepted. If it is rejected, the script must not load before consent, or analytics comes out: set `ANALYTICS.enabled` false in `src/config.ts`, and in the same change remove the "Analytics gate" step in `.github/workflows/ci.yml` and `tests/check_analytics_gate.sh` (or change them to match), and rewrite section 3.
  - After the first ship: `curl -sI https://croftweaver.com/ | grep -i content-security-policy`
    shows analytics.m-squad.com in script-src and connect-src, and the installer's
    "Verify" step passes. `astro preview` does not apply `_headers`, so no test sees it.
    The gate test pins the script address; when the installer gives another one, change the pin in `tests/check_analytics_gate.sh` in the same change as `src/config.ts`, ship, run Verify, and revert both if it fails.
  - Exclude your own browser: run `localStorage.plausible_ignore = 'true'` in the console,
    once per address you visit: croftweaver.com, the production alias (`<project>.pages.dev`, not redirected until CANONICAL_URL is set), and each deployment URL (`<hash>.<project>.pages.dev`) you open, because the production build is served there
    too and a visit counts as a visit to croftweaver.com (the flag is stored per address).
