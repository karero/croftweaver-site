# DIFF review — branch `content/placeholders-comments-three` — Placeholders test: comments count three page readings, not two

Base `94f05a7` · depth: **Light** (two comments in this site's own test code, `tests/placeholders.spec.ts`; no code changes), Codex alone, `--seat codex --depth light`, `CODEX_EFFORT=medium`, one round because it found no BUG · verdict: **CLEAN** — 1 round, 0 findings · GATED-THIS-DIFF — Codex's round below, on `94f05a7...af7c35b`.

This takes the toolkit's fix for A1 in `REVIEW-diff-2026-10-14-content-placeholders-reader-toolkit-105dcf2.md`: karero/croftweaver PR 312, commit `6d68297`, wording copied unchanged.

Data consent: Codex reviewed this repository before (karero/croftweaver-site#67, #87). The diff was read for secrets before the round: none.

| Round | Head | Artifact | Reviewers | seconds, tokens | BUG/RISK/NIT |
|---|---|---|---|---|---|
| 1 | `af7c35b` | full `94f05a7...af7c35b` | Codex CLI, gpt-6.1-sol, medium, read-only | 45 s, 41,256 | 0 / 0 / 0 |

Codex checked each claim the new comments make against the code (the three readings, the fused and spaced spellings of a split slot, the whitespace-free comparison, which reading each fixture needs) and found them true. It traced the browser assertions and did not run them.

Waivers and deferrals: none.

Runs (head `af7c35b`):

| # | Command | Result |
|---|---|---|
| 00 | `diff` of the toolkit's file at `6d68297` against this branch's | only the `UNFILLED_UNTIL_LAUNCH` line differs, as before the change |
| 01 | `npm ci` | exit 0 |
| 02 | `npm run check` | 0 errors; exit 0 |
| 03 | `npm run build` | exit 0 |
| 04 | `npx playwright test` | 274 passed, none skipped, none flaky; exit 0 |

Notes: the two assertion messages that say "the fused reading" in the singular stay as they are, as in the toolkit's copy.
