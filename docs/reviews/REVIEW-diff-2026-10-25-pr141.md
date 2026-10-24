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
