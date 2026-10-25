# DIFF gate: karero/croftweaver-site#144 (/compare WordPress, Joomla and Drupal group)

Depth: Normal (page copy with new sourced claims about other products, a template change and a new
test; no box, user data, logins, money, deletion or schema). The plan passed its own PLAN gate
(private feature hub, `compare-cms/`). Seats: Codex, GLM 5.3 on melious, and a fresh-eyes host
pass (a read-only sub-agent with only the diff, the plan and the repo).

## Round 1 (2026-10-25, base 83eee8d, head b44ff75)

Codex: No BUG/RISK/NIT findings (132 s, 61,214 tokens). GLM 5.3: 1 RISK, 2 NIT (112 s, 13,087
tokens). Fresh-eyes: 1 RISK, 3 NIT (271 s, 116,279 tokens).

| # | Seat | Kind | Finding | Disposition |
|---|---|---|---|---|
| 1 | GLM | RISK | a future group with `needs` but no `checked` reads `group.checked` and crashes the build | refuted: `npm run check` refuses it (removing `checked` gave 4 errors, `compare.astro:92` and `seo.spec.ts:707-708`), and CI runs `npm run check` (`ci.yml:92`); loud, not silent |
| 2 | GLM | NIT | the linked Drupal requirements page puts PHP on a sub-page | refuted: the page lists PHP among the requirements and links its own PHP section; the note links that page |
| 3 | GLM | NIT | "Site-specific (not in the shipped suite)" contradicts the test living in `seo.spec.ts` | refuted: the marker the site already uses for its own tests inside copied suite files (`a11y.spec.ts:966` and others) |
| 4 | fresh | RISK | the test's title and comment claim every source and date on /compare; it does not check the short answer's or the positioning note's dates and links | fixed: title and comment narrowed to each group's row and note links, each group's date and the hero's, and say what they do not check |
| 5 | fresh | NIT | Joomla's GPL quote in `docs/competitors.md` is about its extensions | fixed: "Joomla! is free, open, and available to anyone under the GPL license." added (curl) |
| 6 | fresh | NIT | WebFetch marked on some drupal.org quotes only | fixed: each drupal.org row marked as a whole |
| 7 | fresh | NIT | "with a host" and "updated" have no quoted source | fixed: WordPress requirements quotes added ("To run WordPress, it's recommended your host supports:"; older versions "have reached their official End Of Life…"); for Joomla and Drupal the notes say it is this site's reading, not a quote |

Preview (Cloudflare, branch preview of b44ff75): /compare#cms and /from-wordpress#fit looked at
on desktop in dark mode and at 375 px in light mode; no horizontal scroll.

## Round 2 (2026-10-25, delta b44ff75..5ca5fc7), verification

Earned by row 4 (RISK). Codex: 1 BUG (row 8; 93 s, 40,200 tokens). GLM 5.3: 2 NIT (91 s, 11,297
tokens). Fresh-eyes: rows 4-7 FIXED, refutations of rows 1-3 hold, no new findings (38 s).

| # | Seat | Kind | Finding | Disposition |
|---|---|---|---|---|
| 8 | Codex | BUG | the narrowed title still says "each group source" and "note links", which include the "Use them together" link the test does not check | fixed: title "links each row and each sources-note link in place…"; the comment names the `needs` note and lists the "Use them together" line among what it does not check |
| 9 | GLM | NIT | "with a host" and "updated" called quotes, but they are paraphrases | fixed: called this site's words, resting on WordPress's host sentence and end-of-life warning |
| 10 | GLM | NIT | which read produced the drupal.org/about quotes is unclear | fixed: "all three were read with WebFetch" |

## Round 3 (2026-10-25, delta 5ca5fc7..85676e0), verification

Earned by row 8 (BUG). Codex: 1 BUG (row 11; 59 s, 35,752 tokens). GLM 5.3: No BUG/RISK/NIT
findings (28 s, 4,750 tokens).

| # | Seat | Kind | Finding | Disposition |
|---|---|---|---|---|
| 11 | Codex | BUG | the test comment says the "Use them together" line keeps its own date; it has none and falls under the hero's | fixed: the comment says it does not check the short answer's or the positioning note's own dates, or the links in those two and in "Use them together" |

## Round 4 (2026-10-25, delta 85676e0..282335b), verification

Earned by row 11 (BUG, a comment claim). Codex: No BUG/RISK/NIT findings (37 s, 25,344 tokens).
GLM 5.3: No BUG/RISK/NIT findings (18 s, 3,161 tokens).

## Verdict

DIFF gate clean on 282335b5aef4bd2c8638e29cc04ceafbea56a2a1: no open BUG or RISK. 4 rounds, 11 findings (2 BUG, 2 RISK, 7 NIT), 3
refuted. Nothing changed after round 4 except this record, so no wording pass. Cost: the script
logged 8 seat runs, 194,805 tokens; fresh-eyes one agent over 2 rounds, about 309 s, 126,323 tokens.
