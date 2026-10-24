# Review trail — PR 141 (toolkit tests taken up to 0.33), 2026-10-25

Gate: DIFF, Normal (copied test code that ships in the site). Seats: Codex, and a fresh-eyes Claude reviewer
standing in for GLM 5.3 (melious: "Insufficient balance … Available: 0"; the ollama stand-in out of quota).

## Round 1 — 3 BUG, 4 RISK, 4 NIT
Codex timings: 344s (96355 tokens), shared with the bump round that ran beside it.

| # | Seat | Finding | Disposition |
|---|---|---|---|
| 1 | Codex + Claude | BUG/RISK: the checklist guard's header says `suiteCommit` is the commit the breaks ran on, and to rerun them first | Fixed: the rule now allows a later commit whose four covered specs and `_helpers.ts` are byte-identical, recorded in the breaks notes; the build error says the same |
| 2 | Codex | BUG: `tables.spec.ts` comment and one message point at `src/styles/tables.css`, which this site does not have | Fixed: both name `global.css`; the README row says the copy differs from the template in these two lines |
| 3 | Codex + Claude | BUG/NIT: README row 11 still says "release 0.32 suites" and lists `functions/obfuscate.ts`, which does not exist | Fixed |
| 4 | Codex | RISK: refusing the breaks shortcut because the toolkit revisions are not in this repo | Refuted: `git -C ~/Devel/website-builder diff --quiet v0.32 v0.33 -- …/tests/{seo,images,navigation,anchors}.spec.ts …/tests/_helpers.ts` exits 0 for each (run 2026-10-25) |
| 5 | Codex | RISK: `tables.spec.ts:273` measures row headers without opening `<details>` | Re-sorted: upstream test, passes on this site (every table here is measured open or outside a disclosure); for the toolkit's BUGLOG |
| 6 | Codex | RISK: `tables.spec.ts:185` focus test checks style and reach, not a painted width or colour | Re-sorted: upstream test, a guard gap in the toolkit's spec; for the toolkit's BUGLOG |
| 7 | Claude | NIT: CONTENT_GUIDE "Fourteen test suites", POSITIONING "14 suites today" | Fixed: Fifteen (the site); POSITIONING describes the starter: 16 at 0.33, list completed (server-side analytics, tables) |
| 8 | Claude | NIT: breaks notes understate what else 0.33 changed | Fixed |

## Round 2 — Codex (verify) — 1 BUG, 1 RISK
Codex timings: 70s (51359 tokens). Fixes 2, 3, 7 and 8 confirmed.

| # | Seat | Finding | Disposition |
|---|---|---|---|
| 9 | Codex | BUG: the breaks notes' "Running them again" still asks for all eighteen runs when the template's tests or `package.json` change, against the new shortcut | Fixed by dropping the shortcut: the breaks were run again at v0.33 (below) |
| 10 | Codex | RISK: byte-identical specs do not prove the same failures under Astro 7.4.2 | Fixed the same way. The concern came back twice from two seats, so it was tested: all eighteen lines run on the v0.33 starter on 2026-10-25 (`git archive v0.33`, `npm ci`, baseline 109 passed / 1 skipped, then one edit and one spec at a time, `--workers=1`), each restored and checked with `diff -rq` before the next. Every line gave the published result; run 4 still times out (twice). `RED_RUNS` now names 0.33 and 25 October; the guard's rule and message are back to their original wording; the notes record both runs |

## Round 3 — Codex (verify) — 0 BUG, 1 RISK
Codex timings: 101s (67134 tokens).

| # | Seat | Finding | Disposition |
|---|---|---|---|
| 11 | Codex | RISK: the v0.33 rerun has only narrative support here | Refuted: the run kept a driver script and one log per line outside the repo (the session's scratch folder, not committed); two read back: run 1 "`<title> "…" is 63 chars > 60`", 1 failed / 8 passed; run 15 "`/: duplicate hreflang codes in the cluster (en, en, x-default)`", 1 failed / 8 passed |

**Result: CLEAN, degraded.** 3 rounds, 13 findings (5 BUG, 5 RISK, 3 NIT counting merged seats once per row: 11 rows), all fixed, refuted or re-sorted (2 upstream RISKs go to the toolkit's BUGLOG). Second seat: a fresh-eyes Claude reviewer in round 1; GLM 5.3 could not run (melious balance 0, ollama out of quota).
