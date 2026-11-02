# DIFF gate: case study, the week to 2 November (branch content/case-study-2026-11-02)

Depth: Normal (shipped page data: the log, the two exported CSV files and the tests card's source;
no box, user data, logins, money, deletion or schema). Seats: Codex and GLM 5.3 on melious. melious
was out of balance in both rounds ("Required: 81, Available: 0"), so each round stands on Codex
alone, by the owner's rule of 2026-10-27; no rerun is owed.

Checks before round 1: `npm test` at 37ca9a4 (load average 200 to 275): 498 passed, 1 failed, a11y
`/ [dark]`, "Test timeout of 30000ms exceeded" in AxeBuilder.analyze, a page the change does not
touch. Rerun alone: 3 passed (`/` dark, `/case-study` dark and light). `npx astro check`: 0 errors.

## Round 1 (2026-11-02, base origin/main c2bf309, head 37ca9a4)

Codex: 1 BUG (236 s, 85,728 tokens). GLM 5.3: did not run (out of balance).

| # | Seat | Kind | Finding | Disposition |
|---|---|---|---|---|
| 1 | Codex | BUG | the entry for PR 148 says 4 rounds; its review record adds a fifth after CI failed and totals 5 rounds | fixed in 84fb2f9: "5 rounds and a wording pass" |

Codex also listed as unverifiable from the files it had: the AI check's question wording and source
lists, the Search Console cache, the test counts of past PRs, and the live build. The evidence for
round 2 added the live build read over HTTP (`cloudflare-check.mjs croftweaver.com --build c2bf309`:
"serves build c2bf309ee28f, the one you expected") and the Search Console file the export reads.

## Round 2 (2026-11-02, delta 37ca9a4..84fb2f9), verification

Earned by row 1 (BUG). Codex: "No BUG/RISK/NIT findings"; row 1 verified fixed (44 s, 26,899
tokens). GLM 5.3: did not run (out of balance).

## Verdict

DIFF gate clean on 84fb2f9: no open BUG or RISK. 2 rounds, 1 finding (1 BUG, fixed). Codex alone
in both rounds. Cost: Codex 2 runs, 280 s, 112,627 tokens. The 14 new pull-request entries' test counts and review
rounds were drafted by a read-only helper from each PR's own body and comments; two PRs (154, 156)
give no full test count, and their entries say so.
