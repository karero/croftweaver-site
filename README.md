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

## Differentiation contract

genai-wednesday.de/builder-lab is the community showcase and owns GenAI Wednesday's own
evidence (its scorecard, the AI score table, FAQPage schema). This site is the project
home (the promise, the test gate, skills catalogue, quickstart, a cross-site proof
index, SoftwareSourceCode schema). No shared copy apart from one attributed
testimonial; the pages crosslink. Details: `POSITIONING.md`.

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
| 0a | Name and trademark check for "Webcroft" | owner | open | — |
| 0b | Fresh, publishable proof figures for three sites; consent for third-party site and testimonial | owner | open | — |
| 1 | Requirements: `POSITIONING.md`, `CONTENT_GUIDE.md`, this table | PR | in review | karero/webcroft-site#3 |
| 2 | Brand: palette tokens, share-card colours, 404 page, legal address, `_headers` placeholder, `llms.txt` licence wording | PR | open, needs the legal address | — |
| 3 | Logo, favicon and app icons, schema logo | owner + PR | logo in progress (owner) | — |
| 4 | Header and navigation; home page rewrite | PR | open | — |
| 5 | Pages `/proof` + `/checks`, then `/skills` + `/start` | PRs | open | — |
| 5a | Deck refresh and PDF export | owner + assistant | open | — |
| 5b | Page `/why` with the PDF | PR | open | — |
| 5c | Pages `/compare` + `/roadmap` | PR | open | — |
| 6 | Toolkit rename pull request (in the toolkit repo) | PR | open | — |
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
- Three sites with fresh, publicly checkable figures on `/proof`.
- Real icons and a logo in `public/` (icon-192/512, maskable, apple-touch, favicon,
  `images/logo.png`).
- The external link audit (`scripts/check_external_links.sh`) reports no warning. The
  links to `github.com/karero/webcroft` cannot resolve before step 7; run the audit
  after step 7 and record its dated result in the table.
