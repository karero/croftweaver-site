# webcroft.dev

Project homepage for **Webcroft**, the open-source suite of website skills for AI
coding assistants (https://github.com/karero/webcroft). Built with Webcroft itself.

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
   `production` = live at https://webcroft.dev. Publish with `npm run ship`.

## Decisions (owner, 2026-10-03 and 2026-10-04)

- **Positioning:** lead with being found by search engines and AI assistants; the test
  gate is the proof; ownership is the brand voice. Hero: "Build websites that rank."
  Subline: "Keep improving SEO and GEO, week by week." Details, the wording rule and
  the routes not chosen: `POSITIONING.md`.
- **Name in text:** "Webcroft". Lower case only in code contexts (domain, repo).
- **GitHub:** rename `karero/website-builder` to `karero/webcroft` in place. The old
  name is never created again, or its redirect stops working.
- **Name and trademark check:** commissioned before the rename; the rename and the
  v0.30 release wait for its result.
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
| 0a | Name and trademark check for "Webcroft" | owner | open, waits for a professional view on one earlier mark found among the similar marks. Identical name: no hit in TMview, USPTO, the UK register and EUIPO (owner's own searches, 2026-10-04). Similar marks: first look in TMview on 2026-10-04 ("webcraft", "web craft" and "croft" in classes 9, 35 and 42), no legal opinion | — |
| 0b | Fresh, publishable proof figures | owner | PageSpeed for three sites is on the home page (step 4). Owner, 2026-10-04: `/proof` uses genai-wednesday.de only; its Search Console figures (28 days to 29 September 2026) and the AI check of 2026-09-28 are on `/proof` (step 5) | karero/webcroft-site#7, merged 2026-10-04 (`646bcd1`) |
| 1 | Requirements: `POSITIONING.md`, `CONTENT_GUIDE.md`, this table | PR | done | karero/webcroft-site#3, merged 2026-10-04 (`f304bef`) |
| 2 | Brand: palette tokens, share-card colours, 404 page, `_headers` placeholder, `llms.txt` licence wording | PR | done | karero/webcroft-site#4, merged 2026-10-04 (`0d38a11`) |
| 2a | Legal address into `imprint.astro` and `privacy.astro` | owner fact + PR | open, needs the address | — |
| 3 | Logo, favicon and app icons, schema logo | owner + PR | logo in progress (owner) | — |
| 4 | Header and navigation; home page rewrite | PR | done | karero/webcroft-site#5, merged 2026-10-04 (`f7e7eb1`) |
| 5 | Pages `/proof` + `/checks`, then `/skills` + `/start` | PRs | done | karero/webcroft-site#6 (`40c6031`), karero/webcroft-site#7 (`646bcd1`), karero/webcroft-site#8 (`2ea1bd2`), all merged 2026-10-04 |
| 5a | Deck refresh and PDF export | owner + assistant | open | — |
| 5b | Page `/why` with the PDF | PR | page done; the PDF waits for the deck refresh (5a) | karero/webcroft-site#10, merged 2026-10-04 (`bea52e7`), page only |
| 5c | Pages `/compare` + `/roadmap` | PR | done (built before 5b: `/why` waited for the deck) | karero/webcroft-site#9, merged 2026-10-04 (`fe7a5dc`) |
| 5d | Page `/positioning`: how the positioning is worked out and tested, with credits for both source methods (also on `/skills`) | PR | done; the H1 is the owner's to confirm | spec: karero/webcroft-site#14 (`268fbe4`); page: karero/webcroft-site#15 (`98f30be`), both merged 2026-10-04 |
| 5e | Page `/stack`: the three places a site lives, what each costs, where Keystatic fits | PR | spec written and reviewed (2 rounds); page not built | — |
| 5f | Page `/teams`: the GitHub flow, `AGENTS.md`, two ways to run a team, people responsible for parts of the site, the one-time setup | PR | spec written and reviewed (2 rounds); page not built | — |
| 6 | Toolkit rename pull request (in the toolkit repo) | PR | draft, reviewed; to be merged right after the rename in step 7, with release v0.30 cut straight after | karero/website-builder#147 (draft) |
| 7 | GitHub rename `website-builder` → `webcroft`, release v0.30 (site links assume it) | owner | open, waits for 0a | — |
| 8 | Launch: mail for `hello@webcroft.dev`, DNS to Cloudflare, Pages project, `production` branch, domain, Search Console, `npm run ship` | owner | open | — |
| 9 | Builder Lab, footers and other sites point at the new name | PRs | open | — |
| 10 | German translation | PRs | open | — |

Launch requirements that no test enforces:

- No unfilled slot in `src` or `public`. The `[STREET AND NUMBER]` and `[POSTCODE]`
  slots in `src/pages/imprint.astro` and `src/pages/privacy.astro` are still open; CI
  only catches `[MISSING:`.
- `hello@webcroft.dev` receives mail after the move to Cloudflare DNS (the current
  forwarding is tied to the registrar's DNS).
- `/proof` with fresh, dated figures for genai-wednesday.de (one site by owner
  decision, 2026-10-04; the earlier requirement was three sites).
- Real icons and a logo in `public/` (icon-192/512, maskable, apple-touch, favicon,
  `images/logo.png`).
- The external link audit (`scripts/check_external_links.sh`) reports no warning. The
  links to `github.com/karero/webcroft` cannot resolve before step 7; run the audit
  after step 7 and record its dated result in the table.
