# DIFF review — /from-wordpress, a page for WordPress content sites

Base `faa220f` · depth: **Normal** (shipped page copy) · verdict: **CLEAN** — 3 rounds, 12 findings (0 BUG; 6 RISK: 5 fixed, 1 partly refuted and fixed; 6 NIT: all fixed). Round 3's one NIT (F1) was fixed afterwards and not sent back to a reviewer.

The page follows a plan that passed the PLAN gate first (Normal, Codex and GLM 5.3, clean after 3 rounds, 19 findings, 0 BUG); the plan, its claim-by-claim sources and its trail are in the owner's private feature hub. A first draft was built before that gate (`98aafb9`, `99a151e`) and reviewed in round 1 below; the plan's fixes and this review's fixes follow in `5b255fb` and later.

Files in the change: `src/pages/from-wordpress.astro`, `src/data/wordpress-faq.ts`, `public/images/og/from-wordpress.jpg`, `scripts/generate_og_cards.py`, `public/llms.txt`, `src/layouts/Base.astro` (footer link), `src/pages/established-sites.astro` (link from "No import"), `tests/_helpers.ts`, `tests/positioning.spec.ts`, `tests/seo.spec.ts` (FAQ guard for two pages), `POSITIONING.md`, `CONTENT_GUIDE.md`, and this file.

Each round's artifact began with a context block: the facts read at tag v0.32 of karero/croftweaver and the outside sources read on 18 October 2026.

| Round | Head | Artifact | Reviewers | seconds, tokens per seat | BUG/RISK/NIT |
|---|---|---|---|---|---|
| 1 | `99a151e` | full `faa220f...99a151e` | codex-cli (read-only); melious glm-5.3 | codex 266 s / 98,216; melious 142 s / 23,231 | 0 / 4 / 2 |
| 2 | `5b255fb` | delta `99a151e..5b255fb`, with round 1's record | codex; melious glm-5.3 | codex 89 s / 45,105; melious 127 s / 15,886 | 0 / 2 / 3 |
| 3 | `58dec26` | delta `5b255fb..58dec26`, with round 2's record | codex; melious glm-5.3 | codex 86 s / 54,615; melious 36 s / 7,001 | 0 / 0 / 1 |

| id | Sev | Source | Finding | Disposition |
|---|---|---|---|---|
| D1 | RISK | codex | FAQ "found before your visitors" overstates coverage | fixed: the answer says the helper checks the addresses it finds, plus any added to the list by hand; step 5 and the lead say the same |
| D2 | RISK | codex | PageSpeed figures typed, duplicating src/data/proof.ts | fixed: the speed row is built from PROOF and PROOF_MEASURED |
| D3 | RISK | melious | "EmDash from Cloudflare" backed only by a README that does not say so | fixed: both places cite Cloudflare's announcement, https://blog.cloudflare.com/emdash-wordpress/ ("Introducing EmDash — the spiritual successor to WordPress", Cloudflare blog); the README stays as the source for the admin panel and importer |
| D4 | RISK | melious | 100-request default makes "every old address" read as exhaustive | partly refuted, partly fixed: records are read 100 per request, so the default covers a few thousand records (v0.32 SKILL.md "Run it"); step 1 now says the count names each gap when incomplete and that a larger site needs the limit raised; "every" replaced by "each address it finds" |
| D5 | NIT | melious | Skill link points at main | fixed: tree/v0.32 |
| D6 | NIT | melious | Middleware limit lacks the figure | fixed: "counts against the free plan's 100,000 requests a day" (v0.32 templates/SETUP.md) |

| E1 | RISK | codex | Speed summary "scored low or high" drops middle scores after a re-measurement | fixed: "ranged from {low} to {high}", or "scored {n}" when all are equal; renders "ranged from 99 to 100" |
| E2 | RISK | melious | D4 residue: step 5 title and prompt still say "every old address" | fixed: "Check each address on the list" / "Check each old address on the list against the preview." |
| E3 | NIT | melious | sitesWord gives "The no sites" / "The one sites" | fixed: singular handled ("The one site measured"), no "no" entry |
| E4 | NIT | melious | "Measured on one day" typed while the date is derived | fixed: "One PageSpeed run per site" (src/data/proof.ts comment: one run each) |
| E5 | NIT | melious | EmDash announcement URL typed twice | fixed: EMDASH_POST exported from src/data/wordpress-faq.ts, used by the FAQ and the page |
| — | follow-ups | melious | 87 tests and the Cloudflare guide date not re-verified by the reviewer | host-verified: v0.32 test files hold 59 + 28 test functions; the Cloudflare guide shows "updated April 21, 2026" (read 2026-10-18) |
| F1 | NIT | melious | Round 3: step 5 prompt still says "old" address while the list can hold hand-added ones | fixed after round 3, not sent back: "Check each address on the list against the preview." |

Guard test red run, 2026-10-18, at `99a151e` with `schemas={[wordpressFaqSchema]}` removed: `npx playwright test tests/seo.spec.ts -g "/from-wordpress keeps its FAQPage"` → 1 failed (tests/seo.spec.ts:266); restored, it passes.

Tests at the final head: `astro check` 0 errors; Playwright 287 passed.

Go-live: the pull request stays a draft until a trial on real data has run both helper scripts (a real WordPress site counted, its addresses checked against a small preview) and the page's "What has been tested so far" section carries the trial's date and numbers. At merge, every outside figure is read again and the page's date updated.
