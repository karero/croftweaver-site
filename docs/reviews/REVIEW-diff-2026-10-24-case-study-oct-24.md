# Review trail: case study, the week to 24 October (DIFF gate)

Change: `src/data/case-study.ts` only. Fifteen change entries and two observations for 22 to 24 October 2026, and `UPDATED` set to 24 October. Depth: Normal (published text on a shipped page; nothing in the High row). Seats: Codex (gpt-6.1-sol) and GLM 5.3 on melious.ai, `reviewers: codex OK, melious OK` in every round; a fresh-eyes Claude Sonnet sub-agent in round 1.

The reviewers have no network, so rounds 1 and 2 sent the diff with an evidence appendix: quoted PR descriptions, merge times, Cloudflare production deploy times and lines from the 0.33 release notes. Because of that appendix those rounds ran with `--base none`. Round 3 sent a plain `git diff` with `--base 29733d7`.

| Round | Artifact | BUG/RISK/NIT | Timings |
|---|---|---|---|
| 1 | `86d77e7...f466e25` with appendix | Codex 3/0/0; GLM 1/0/3; fresh-eyes 2/3/2 | codex 429 s / 131,594; GLM 156 s / 27,414; fresh-eyes 153,019 tokens |
| 2 (verify) | `f466e25..29733d7` with appendix | Codex 1/0/0; GLM 0/0/0 | codex 90 s / 63,696; GLM 79 s / 13,472 |
| 3 (verify) | `29733d7..3771ab9` | Codex 0/0/0; GLM 0/1/1 | codex 74 s / 34,794; GLM 93 s / 10,781 |

3 rounds, 12 findings (de-duplicated across seats; 9 in round 1, 1 in round 2, 2 in round 3). Seat runs logged: 281,751 tokens; fresh-eyes 153,019.

## Round 1

| # | Seat | Finding | Disposition |
|---|---|---|---|
| 1 | Codex, GLM, fresh-eyes | BUG: #121's checks come from its stale description (372 tests, 2 rounds) | Fixed: 379 tests, 4 rounds, the last additions by Codex alone (its trail, Round 3, Round 4, the degraded deltas, "the suite passed (379)") |
| 2 | Codex | BUG: the footer says release 0.32 while the log announces 0.33 | Refuted for this change: #137 sets 0.33 and merged into `main` at 20:23 UTC; this branch does not merge `main` in. A #137 entry is added |
| 3 | Codex | BUG: "every page" ignores the home-page exception | Fixed (see round 2) |
| 4 | GLM, fresh-eyes | BUG/RISK: #130 "merged before its review" implies a review | Fixed: "merged without a review, which was still owed on 24 October" |
| 5 | fresh-eyes, GLM | BUG/NIT: #122 "two outside models" overstated | Fixed: "Codex took part in round 2 only" |
| 6 | GLM, fresh-eyes | NIT/RISK: the live-dates observation names #128, which has no entry | Fixed: #128 entry |
| 7 | fresh-eyes | RISK: other 24 October merges missing | Partly fixed: #134, #136, #137 added. Left out, as the log was selective before: #117, #120, #123, #131, #133, #138 |
| 8 | fresh-eyes | NIT: #57 omits "relaunch" to "launch" | Fixed |
| 9 | fresh-eyes | NIT: #114 "a check of the file" repeats itself | Fixed: "its own check script" |

## Round 2

| # | Seat | Finding | Disposition |
|---|---|---|---|
| 10 | Codex | BUG: "every page except the home page" still includes `/404` | Fixed: "except the home page and the error page" |

## Round 3

| # | Seat | Finding | Disposition |
|---|---|---|---|
| 11 | GLM | RISK: the `asked` text was rewritten so an unmet request reads as met | Refuted: the removed line is this branch's own unpublished wording from round 1, not #119's request. #119 says the footer lists every page in `PAGES` except home, and `PAGES` has no `/404` |
| 12 | GLM | NIT: the entry's "2 rounds" was not raised after this round's edit | Refuted: "2 rounds" is #119's own review, not this gate's |

No BUG in round 3: the gate ends clean at `3771ab9`.

## Checks on the branch

`npm run check` 0 errors; `npm run build`; the export, security.txt, analytics-gate and security-page checks; the `[MISSING:` grep; `npx playwright test` 439 passed (after round 2, on a private port: another session's preview held 4725).
