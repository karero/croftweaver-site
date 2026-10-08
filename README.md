# croftweaver.com

Project homepage for **Croftweaver**, the open-source suite of website skills for AI
coding assistants (https://github.com/karero/croftweaver). Built with Croftweaver itself.

## Decision record (new-website interview, 2026-07-02)

1. **Pages:** three flat pages (`/`, `/privacy`, `/imprint`) — no collections.
   Extended 2026-10-03: seven more flat pages are planned (`/checks`, `/skills`,
   `/start`, `/proof`, `/why`, `/compare`, `/roadmap`) plus a 404. Inventory:
   `CONTENT_GUIDE.md`.
2. **Dynamic:** Tier 1, fully static. No functions, no forms.
3. **Editors:** owner + AI assistant via git. No CMS.
4. **Language:** English only, unprefixed default (German stays additive later).
5. **Analytics:** none — Google Search Console only. No cookies, no banner.
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
testimonial. This site links to the Lab; the Lab links back in step 9. Details:
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
```

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
| 0b | Fresh, publishable proof figures | owner | PageSpeed for three sites is on the home page (step 4). Owner, 2026-10-04: `/proof` uses genai-wednesday.de only; its Search Console figures (28 days to 29 September 2026) and the AI check of 2026-09-28 are on `/proof` (step 5) | karero/croftweaver-site#7, merged 2026-10-04 (`646bcd1`) |
| 1 | Requirements: `POSITIONING.md`, `CONTENT_GUIDE.md`, this table | PR | done | karero/croftweaver-site#3, merged 2026-10-04 (`f304bef`) |
| 2 | Brand: palette tokens, share-card colours, 404 page, `_headers` placeholder, `llms.txt` licence wording | PR | done | karero/croftweaver-site#4, merged 2026-10-04 (`0d38a11`) |
| 2a | Legal address into `imprint.astro` and `privacy.astro` | owner fact + PR | open, needs the address | — |
| 3 | Logo, favicon and app icons, schema logo | owner + PR | done | karero/croftweaver-site#18, merged 2026-10-08 (`48b1738`) |
| 4 | Header and navigation; home page rewrite | PR | done | karero/croftweaver-site#5, merged 2026-10-04 (`f7e7eb1`) |
| 4a | Home page as the visitor's story: hero "Weave websites that rank.", the villain, the one-liner, the plan, a short learning section (`STORY.md`) | PRs | positioning done; `STORY.md` and the page rewrite in review | karero/croftweaver-site#19, merged 2026-10-08 (`d98ff84`); `STORY.md` and the page: karero/croftweaver-site#20 (open) |
| 5 | Pages `/proof` + `/checks`, then `/skills` + `/start` | PRs | done | karero/croftweaver-site#6 (`40c6031`), karero/croftweaver-site#7 (`646bcd1`), karero/croftweaver-site#8 (`2ea1bd2`), all merged 2026-10-04 |
| 5a | Deck refresh and PDF export | owner + assistant | open | — |
| 5b | Page `/why` with the PDF | PR | page done; the PDF waits for the deck refresh (5a) | karero/croftweaver-site#10, merged 2026-10-04 (`bea52e7`), page only |
| 5c | Pages `/compare` + `/roadmap` | PR | done (built before 5b: `/why` waited for the deck) | karero/croftweaver-site#9, merged 2026-10-04 (`fe7a5dc`) |
| 5d | Page `/positioning`: how the positioning is worked out and tested, with credits for both source methods (also on `/skills`) | PR | done | spec: karero/croftweaver-site#14, merged 2026-10-04 (`268fbe4`); page: karero/croftweaver-site#15, merged 2026-10-04 (`98f30be`) |
| 6 | Toolkit rename pull request (in the toolkit repo) | PR | draft, reviewed; merges right after the rename in step 7. Replaces karero/website-builder#147, which used the dropped name Webcroft | karero/website-builder#212 (draft) |
| 7 | GitHub rename `website-builder` → `croftweaver`, release v0.31 (site links assume it; v0.30 ships first under the old name) | owner | open, waits for 0a and v0.30 | — |
| 8 | Launch: mailbox `hello@croftweaver.com`, Pages project, `production` branch, domain, Search Console, `npm run ship` | owner | open | — |
| 9 | Builder Lab, footers and other sites point at the new name | PRs | open | — |
| 10 | German translation | PRs | open | — |

Launch requirements that no test enforces:

- No unfilled slot in `src` or `public`. The `[STREET AND NUMBER]` and `[POSTCODE]`
  slots in `src/pages/imprint.astro` and `src/pages/privacy.astro` are still open; CI
  only catches `[MISSING:`.
- A test mail to `hello@croftweaver.com` arrives; record the date here. The domain's DNS
  is on Cloudflare and its MX records point to Google (seen 2026-10-08), which alone does
  not prove the mailbox exists.
- `/proof` with fresh, dated figures for genai-wednesday.de (one site by owner
  decision, 2026-10-04; the earlier requirement was three sites).
- Real icons and a logo in `public/` (icon-192/512, maskable, apple-touch, favicon,
  `images/logo.png`).
- The external link audit (`scripts/check_external_links.sh`) reports no warning. The
  links to `github.com/karero/croftweaver` cannot resolve before step 7; run the audit
  after step 7 and record its dated result in the table.
