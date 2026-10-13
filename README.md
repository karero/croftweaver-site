# croftweaver.com

Project homepage for **Croftweaver**, the open-source suite of website skills for AI
coding assistants (https://github.com/karero/croftweaver). Built with Croftweaver itself.

## Decision record (new-website interview, 2026-07-02)

1. **Pages:** 14 flat pages and a 404, no collections. The site started with three
   (`/`, `/privacy`, `/imprint`); more were planned on 2026-10-03 and built from
   2026-10-04. Inventory: `CONTENT_GUIDE.md`.
2. **Dynamic:** Tier 1, fully static pages, no forms. One Cloudflare Pages middleware
   (`functions/_middleware.ts`) sets noindex on previews and, once CANONICAL_URL is set in
   Cloudflare, redirects the production alias to the live domain. It has been set
   since 2026-10-12 (step 8).
3. **Editors:** owner + AI assistant via git. No CMS.
4. **Language:** English only, unprefixed default (German stays additive later).
5. **Analytics:** Google Search Console, and (configured 2026-10-12) cookieless Plausible
   on M-Squad's own instance, analytics.m-squad.com. The script loads on the live build
   only (`CF_PAGES_BRANCH` equals `PROD_BRANCH` in `src/config.ts`). No cookies, no banner
   (a position the owner accepted on 2026-10-12; see "Launch requirements" and the header of
   `src/pages/privacy.astro`).
6. **Publish model:** two-stage. `main` = noindexed preview
   (https://main.croftweaver-site.pages.dev), `production` = live at
   https://croftweaver.com. Publish with `npm run ship`.

## Decisions (owner, 2026-10-03, 2026-10-04 and 2026-10-08)

- **Positioning:** lead with being found by search engines and AI assistants; the test
  gate is the proof; ownership is the brand voice. Hero: "Weave websites that rank."
  (from 2026-10-08; before: "Build websites that rank."). The subline "Keep improving
  SEO and GEO, week by week." is retired; the one-liner replaces it. Details, the wording
  rule and the routes not chosen: `POSITIONING.md`; the home page story: `STORY.md`.
- **Name in text:** "Croftweaver". Lower case only in code contexts (domain, repo).
- **GitHub:** rename `karero/website-builder` to `karero/croftweaver` in place. The old
  name is never created again, or its redirect stops working.
- **Name and trademark check:** commissioned before the rename, which was to wait for
  its result. The rename went ahead on 2026-10-11 and release v0.31 came out on
  2026-10-12. The owner's own searches on 2026-10-12 found nothing (step 0a).
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
                     # tone / positioning / placeholders / email / links /
                     # llms-coverage / middleware (preview handling)
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
| 0a | Name and trademark check for "Croftweaver" | owner | done: the owner searched for "Croftweaver" on 2026-10-12 and found nothing ("ALL GREEN nothing found"). These were the owner's own searches, with no legal opinion; the owner had asked for the search pages of the US, EU, WIPO and UK registers, and which of them were searched is not recorded here. The earlier check was for the dropped name "Webcroft" (owner's own searches, 2026-10-04: no identical hit in TMview, USPTO, the UK register and EUIPO; similar marks "webcraft", "web craft" and "croft" in classes 9, 35 and 42, no legal opinion). Webcroft was then dropped as too close to an existing company | the owner's statement, 2026-10-12 |
| 0b | Fresh, publishable proof figures | owner | PageSpeed for three sites is on `/more-proof` (step 4b). Owner, 2026-10-04: `/proof` uses genai-wednesday.de only; its Search Console figures (28 days to 29 September 2026) and the AI check (five check days, 26 September to 8 October 2026) are on `/proof` (step 5) | karero/croftweaver-site#7, merged 2026-10-04 (`646bcd1`) |
| 1 | Requirements: `POSITIONING.md`, `CONTENT_GUIDE.md`, this table | PR | done | karero/croftweaver-site#3, merged 2026-10-04 (`f304bef`) |
| 2 | Brand: palette tokens, share-card colours, 404 page, `_headers` placeholder, `llms.txt` licence wording | PR | done | karero/croftweaver-site#4, merged 2026-10-04 (`0d38a11`) |
| 2a | Legal address into `imprint.astro` and `privacy.astro` | owner fact + PR | done: the operator is M-Squad GmbH, with the address, managing director, register entry and VAT ID the owner gave on 2026-10-09, and a phone number (owner, 2026-10-11). The structured data (`legalName` in `src/config.ts`) names the same company | karero/croftweaver-site#39, merged 2026-10-12 (`151fd44`) |
| 2b | Dependency: sharp 0.35.5, to clear an npm audit advisory | PR | done | karero/croftweaver-site#28, merged 2026-10-09 (`03992f3`); dependabot's pull request for the same bump (karero/croftweaver-site#29) was closed |
| 3 | Logo, favicon and app icons, schema logo | owner + PR | done | karero/croftweaver-site#18, merged 2026-10-08 (`48b1738`) |
| 4 | Header and navigation; home page rewrite | PR | done | karero/croftweaver-site#5, merged 2026-10-04 (`f7e7eb1`) |
| 4a | Home page as the visitor's story: hero "Weave websites that rank.", the villain, the one-liner, the plan, a short learning section (`STORY.md`) | PRs | done; a fresh-eyes check of the page then led to three fixes: the Quickstart leads with the one-prompt route; the hero says who the site is for; one scene shows life after, and two long sections became one | karero/croftweaver-site#19, merged 2026-10-08 (`d98ff84`); `STORY.md` and the page: karero/croftweaver-site#20, merged 2026-10-08 (`bfe7b0b`); the three fixes: karero/croftweaver-site#31, merged 2026-10-09 (`4f3f604`) |
| 4b | Home proof strip: the AI panel's SEO and GEO scores first, a try-it prompt, and a `/more-proof` page for PageSpeed and E-E-A-T | PR | done | karero/croftweaver-site#21, merged 2026-10-08 (`24b3738`) |
| 4c | Home page after a story check: the stakes section names both of a site's jobs (a rule for the home page, `POSITIONING.md` §4), the paragraph under it points to `/positioning`, and the third hero line and third card say "You catch common slips" (`STORY.md`) | PR | done | karero/croftweaver-site#46, merged 2026-10-12 (`a9c8e3c`) |
| 5 | Pages `/proof` + `/checks`, then `/skills` + `/start` | PRs | done | karero/croftweaver-site#6 (`40c6031`), karero/croftweaver-site#7 (`646bcd1`), karero/croftweaver-site#8 (`2ea1bd2`), all merged 2026-10-04 |
| 5a | Deck refresh and PDF export | owner + assistant | done: the deck is made in this repository (`npm run deck`), 11 slides as `public/croftweaver-why.pdf`. No record here that the owner has read the slide wording. The Google Slides decks are not part of this and are not refreshed | karero/croftweaver-site#40, merged 2026-10-12 (`59a8983`) |
| 5b | Page `/why` with the PDF | PR | done | page: karero/croftweaver-site#10, merged 2026-10-04 (`bea52e7`); download button and PDF: karero/croftweaver-site#40, merged 2026-10-12 (`59a8983`) |
| 5c | Pages `/compare` + `/roadmap` | PR | done (built before 5b: `/why` waited for the deck) | karero/croftweaver-site#9, merged 2026-10-04 (`fe7a5dc`) |
| 5d | Page `/positioning`: how the positioning is worked out and tested, with credits for both source methods (also on `/skills`) | PR | done | spec: karero/croftweaver-site#14, merged 2026-10-04 (`268fbe4`); page: karero/croftweaver-site#15, merged 2026-10-04 (`98f30be`) |
| 5e | Page `/partner-assets`: the partner kit (badge, logo, icon) to download, the code for a footer, the rules for using it and the request to credit Croftweaver; the badge in every footer | PR | done | karero/croftweaver-site#26, merged 2026-10-09 (`60fcbf4`) |
| 5f | Charts on `/proof`: Search Console clicks as a rolling 28-day total, and the AI check as one mark per call | PR | done | karero/croftweaver-site#23, merged 2026-10-09 (`fd45b44`) |
| 5g | The AI check of 8 October 2026 on `/proof` and as a published CSV file, for genai-wednesday.de only (`scripts/export-ai-check.py` makes the file) | PR | done | karero/croftweaver-site#24, merged 2026-10-09 (`904b69a`) |
| 5h | Page `/established-sites`: Croftweaver for sites that already exist | PR | done | karero/croftweaver-site#25, merged 2026-10-09 (`a4969ff`) |
| 5i | Launch wording: genai-wednesday.de launched on 27 March 2026 and was not relaunched (`/proof`, `/more-proof`, `/why`, `STORY.md`, `public/llms.txt`) | PR | done | karero/croftweaver-site#27, merged 2026-10-09 (`c48b39e`) |
| 5j | Perplexity's count in the AI check is worded as what it measures, not as a citation; the export script no longer stops on a valid row | PR | done | karero/croftweaver-site#30, merged 2026-10-09 (`fb2b415`) |
| 5k | `/skills` lists 34 skills, all of them in toolkit release 0.31. At the next release, update `RELEASE`, `SKILLS`, `RECENT` and `AS_OF` in `src/data/skills.ts` and clear `ADDED_SINCE` | PRs | done | release 0.31: karero/croftweaver-site#41; 33 skills: karero/croftweaver-site#32, merged 2026-10-09 (`dc4b20f`); the 34th, `facts-check`, and the `/established-sites` answers that no longer call it "in review": karero/croftweaver-site#37, merged 2026-10-11 (`2020179`) |
| 6 | Toolkit rename pull request (in the toolkit repo) | PR | done. Replaced karero/website-builder#147, which used the dropped name Webcroft | karero/croftweaver#212, merged 2026-10-12 (`0597a28`) |
| 7 | GitHub rename `website-builder` → `croftweaver`, release v0.31 (site links assume it; v0.30 ships first under the old name) | owner | done: the repository answers at `github.com/karero/croftweaver` and the old address leads there (seen 2026-10-11); v0.30 came out on 2026-10-11 and v0.31 on 2026-10-12. Step 0a, which this step was to wait for, got its result afterwards, on 2026-10-12: nothing found | releases `v0.30` and `v0.31` of karero/croftweaver |
| 8 | Launch: mailbox `hello@croftweaver.com` (set up, owner, 2026-10-08), Pages project, `production` branch, domain, Search Console, `npm run ship` | owner | live since 2026-10-12. Cloudflare Pages project `croftweaver` (owner), connected to this repository, production branch `production`, croftweaver.com attached. The project's name differs from its addresses, `croftweaver-site.pages.dev` and the preview `main.croftweaver-site.pages.dev`: on the evening of 2026-10-12 Wrangler 4.149.0 listed one project for this site, named `croftweaver`, with the domains `croftweaver-site.pages.dev` and `croftweaver.com`, and refused the name `croftweaver-site` (first refusal at 21:14 CEST), which it had still taken at 15:31 CEST the same day (both times from Wrangler's own logs on the computer the commands ran on). No record here of who changed the name or why. What to do when Wrangler does not find the project is at the top of `AGENTS.md`. The first publish was an upload with Wrangler, because Cloudflare showed the project as disconnected from GitHub and built nothing on a push or a merge. The owner repaired the connection the same day, and Cloudflare then built a pushed branch by itself (the preview of karero/croftweaver-site#41). `npm run ship` ran for the first time on 2026-10-12 and confirmed build `b129697` on the live domain. A test mail to `hello@croftweaver.com` arrived (owner, 2026-10-12). `CANONICAL_URL` is set to `https://croftweaver.com` for Production (owner, 2026-10-12); from the production build after that, `https://croftweaver-site.pages.dev` answers with a 301 to the same path and query on the live domain, and `https://main.croftweaver-site.pages.dev` stays the preview (both seen 2026-10-12). The sitemap `https://croftweaver.com/sitemap-index.xml` was submitted in Search Console on 2026-10-12 (read from Search Console the same day: pending, no errors) | `https://croftweaver.com/build.txt` served `b129697` on 2026-10-12; the project's name: `wrangler pages project list`, 2026-10-12 |
| 9 | Builder Lab, footers and other sites point at the new name | PRs | open | — |
| 10 | German translation | PRs | open | — |
| 11 | The rest of the toolkit template, from commit `8ea17a7` to release 0.31. The spec files, `tests/_helpers.ts` and `tests/check_ship_push.sh` are done and `tests/TESTS-VERSION` now names release 0.31, so the toolkit's `scripts/whats-new.sh` no longer lists what is left. Left: changes to `AGENTS.md`, `PUBLISHING.md`, `SETUP.md`, `CONTENT_GUIDE.md`, `.github/workflows/ci.yml`, `.nvmrc`, `public/_headers`, `scripts/hooks/pre-push`, `.claude/settings.json` and `tests/check_analytics_gate.sh` (this site's own copy); and four files the site does not have: `.gitattributes`, `scripts/verify.mjs`, `scripts/wire-hooks.mjs`, `.claude/hooks/git-stand.mjs`. To see them, in a clone of the toolkit: `git diff 8ea17a7 v0.31 -- skills/new-website/templates` | PRs | open; spec files done 2026-10-13 | karero/croftweaver-site#67 |

Launch requirements that no test enforces:

- No unfilled slot in `src` or `public`. The `[STREET AND NUMBER]` and `[POSTCODE]`
  slots in `src/pages/imprint.astro` and `src/pages/privacy.astro` were filled in
  karero/croftweaver-site#39 (step 2a). CI catches `[MISSING:` in the source, and since
  2026-10-13 `tests/placeholders.spec.ts` reads the built pages for the slot shapes it knows.
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
  the date here. A test mail arrived (owner, 2026-10-12).
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
  build stops on any other gap in the file. When the Search Console file is refreshed,
  read the event pages on genai-wednesday.de again and update `EVENTS` in
  `src/data/proof.ts`: the page says which events fall inside the best 28 days and that
  none followed, and the build stops if the new file no longer fits that. `EVENTS` lists
  its two days oldest first: the page also says the rise had begun before the first of
  them, with the 28-day totals on the day before it and two weeks earlier, and the build
  stops unless the later total is at least twice the earlier one. The two Gemini
  answers asked by hand and the attempt without a sign-in (`byHand`, also in
  `src/data/proof.ts`) are dated and stay as they are; a new one is the owner's to add.
- Real icons and a logo in `public/` (icon-192/512, maskable, apple-touch, favicon,
  `images/logo.png`).
- The external link audit (`scripts/check_external_links.sh`) reports no warning. The
  links to `github.com/karero/croftweaver` could not resolve before step 7, so the audit
  ran after it: on 2026-10-12, on the build of karero/croftweaver-site#41 at `15c3c5b`,
  it read 38 links and reported none dead, none redirected to another domain and none
  unverified. It does not report a redirect within the same domain. The slide deck PDF
  carries the same link and the audit does not read PDFs; the deck takes the address
  from `SITE.repo`, which resolves since step 7.
- The cache rule for `/brand/*` in `public/_headers` is tested from the file, because
  `astro preview` does not apply `_headers`. After launch run
  `curl -sI https://croftweaver.com/brand/badge/built-with-croftweaver-light.svg` and
  expect the `cache-control` value that the `/brand/*` rule in `public/_headers` sets.
  A Cloudflare Cache Rule or Browser Cache TTL on the zone could change what visitors
  get; record the date here. Seen on 2026-10-12: `cache-control: public, max-age=86400`,
  the value the rule sets. The zone's Browser Cache TTL is 4 hours (owner's setting,
  2026-10-12). Seen that day with it in place: the brand files keep the rule's value,
  files without a rule of their own (`/favicon.svg`, the deck PDF) are sent with
  `max-age=14400`, and pages with `max-age=0`.
- Search engines. Bing Webmaster Tools is connected (owner, 2026-10-12). Crawler Hints,
  the Cloudflare switch that tells Bing about changed pages, can only be set in the
  dashboard; nothing here records that it is on. Search Console positions for seven
  search terms are read every Monday at 09:00 by a scheduled job on the owner's Mac (set
  up 2026-10-12); the history stays on that Mac, not in this repository.
- Analytics (Plausible on analytics.m-squad.com, live build only). The privacy page
  states things that only the owner can confirm. Write each line with its date when it
  is true:
  - Where the instance runs: on a server of M-Squad GmbH, in the EU or EEA (name the
    hosting provider if it is rented, and add it to section 3 as a recipient). Its web
    server or reverse proxy keeps no IP addresses in access logs. The Cloudflare zone in
    front of analytics.m-squad.com is in the account confirmed for the site above (section
    2, which section 3 points to, calls Cloudflare a processor). Cloudflare Web Analytics
    is off for this project (it would inject a beacon that section 3 does not describe).
  - What the instance does, from the instance itself and not from Plausible's hosted data
    policy: its version, that its event and session tables hold no IP address or raw
    user-agent column, and how its daily salt is handled. If any of that differs, change
    the sentences in section 3 that say it. The `deploy/plausible-m-squad` folder of the
    m-squad-website repository names Community Edition v3.2.1 with ClickHouse 24.12 and
    sets no retention or purge. The box's copy differs: ClickHouse was moved to 26.8.16.41 on
    2026-10-04 (apreet-stack, docs/CHANGES.md) and the stack sits in
    /home/prixi2/plausible-m-squad. OBSERVED 2026-10-12 at 22:55 CEST, on the box, by the owner:
    `docker inspect` on the app container `plausible-m-squad-plausible-1` returns the image
    tag `ghcr.io/plausible/community-edition:v3.2.1`. That is the tag the container was
    created from, not a digest, and the lookup did not record whether it was running. Not
    confirmed by that lookup: that nothing but the TTL below deletes records.
  - A goal for the email-click event: in the instance, Settings > Goals > Add goal > Custom event,
    named `Email Tap`. The site sends it when an email address is clicked, from
    `src/components/EmailLink.astro`; without the goal the events are stored but not shown.
    Section 3 says it.
  - Settings > General > Tracking in the instance: "Outbound links" and "File downloads"
    ticked, "Form submissions" unticked (the site has no form). Section 3 has one sentence
    for each of the two ticked ones; when the ticks change, change the sentences. After the
    first click on an outbound link and on a download on the live site, the instance's
    reports must list the address: section 3 says it is sent and stored.
  - What deletes old records in the instance (a retention setting, a table TTL or a job
    you run), and the period it enforces. If nothing deletes, set a table TTL or a job
    first, then state its period (Art. 13(2)(a) GDPR wants the period or the criteria).
    State only that period in section 3 (the page asks for the period, not the mechanism).
    The slot is filled; the CI placeholder grep no longer fails on it.
    Decided 2026-10-12 (owner): 24 months for the whole instance. The same sentence is to appear
    on the croftweaver.com, m-squad.com and apreet.com pages (the other two are separate pull
    requests); this repository's section 3 says it now, and a test in `tests/a11y.spec.ts`
    holds it. The table TTL on `events_v2` and `sessions_v2` is to be applied by the owner on
    the server. APPLIED 2026-10-12 at 15:21 CEST on the box (`/home/prixi2/plausible-m-squad`), by
    the owner; `SHOW CREATE TABLE` shows `TTL timestamp + toIntervalMonth(24)` on `events_v2` and
    `TTL start + toIntervalMonth(24)` on `sessions_v2`. The oldest event was 2026-05-22 (3,284
    events, queried at 14:41 CEST, before the ALTER), so the TTL had nothing to delete (the sessions table was not queried on its own; the
    instance's first event is that day). Rows older than the period go at the next background
    merge, which can be hours or days later. Re-check after every Plausible or ClickHouse upgrade.
    The same output also shows that neither table has an IP address or a raw user-agent column
    (ClickHouse 26.8). The daily salt, OBSERVED 2026-10-12 at 22:55 CEST on the box: the
    `salts` table in the instance's Postgres holds two rows, with `inserted_at` 2026-10-11
    00:00:01 and 2026-10-12 00:00:00 (the column has no time zone; read here as UTC, which the
    database clock's +00 offset at 20:55 suggests). A value added at each midnight with nothing
    older left is what daily replacement and a clean-up leave behind, and it does not contradict
    section 3 ("replaced every 24 hours"). It does not show which salt an identifier is built
    from or when a value stops being used, so section 3's sentence that the browser cannot be
    recognised once the value is replaced is not confirmed by it. That a salt is 16 random
    bytes, replaced daily, and that Plausible deletes salts older than 48 hours, is from
    Plausible's source (master branch), not read from the v3.2.1 code on the box.
    Copies: the nightly backup script did not cover this instance (apreet-stack docs, 2026-10-04).
    If it is extended to, an archive holds records up to 24 months old, so a record can outlive
    the 24 months by the archive's own retention (30 days for daily archives; the monthly copies
    are longer): keep that short and say so in a second sentence on the page. The m-squad-website
    README (section "Retention") has the statements, a scratch-table probe that proves the
    mechanism on this ClickHouse, and the re-check after upgrades.
  - The no-banner position (see the header of `src/pages/privacy.astro`): ACCEPTED on
    2026-10-12 by Daniel Melter, managing director of M-Squad GmbH, who instructed the ship
    and this record after the sources in that header were set out to him in the working
    session (EDPB Guidelines 2/2023 v2.0, paras 33, 53 and 56; DSK Orientierungshilfe
    Digitale Dienste v1.2, Rz. 87 to 90; § 25 TDDDG). It is a position, not a settled fact,
    and no counsel's view was taken. If it is ever rejected, the script must not load
    before consent, or analytics comes out. Then set
    `ANALYTICS.enabled` false in `src/config.ts` and, in the same change, remove the
    "Analytics gate" step in `.github/workflows/ci.yml` and `tests/check_analytics_gate.sh`
    (or change them to match), rewrite section 3, and take out the host in the CSP of
    `public/_headers`, README decision 5, this bullet block and the comments in
    `src/config.ts` and `public/_headers` that name the gate.
  - After the first ship: `curl -sI https://croftweaver.com/ | grep -i content-security-policy`
    shows analytics.m-squad.com in script-src and connect-src, and the installer's
    "Verify" step passes. `astro preview` does not apply `_headers`, so no test sees it.
    The gate test pins the script address; when the installer gives another one, change the
    pin in `tests/check_analytics_gate.sh` in the same change as `src/config.ts`, ship, run
    Verify, and revert both if it fails.
  - Exclude your own browser: run `localStorage.plausible_ignore = 'true'` in the console,
    once per address you visit: croftweaver.com, each production deployment's hash URL
    (`<hash>.<project>.pages.dev`; a preview deployment's carries no script) you open, and the production alias (`<project>.pages.dev`,
    not redirected until CANONICAL_URL is set). The production build is served at all of
    them with the domain written into the script, so a visit counts as a visit to
    croftweaver.com. The flag is stored per address.
