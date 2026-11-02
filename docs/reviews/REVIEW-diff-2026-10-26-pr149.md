# DIFF gate: karero/croftweaver-site#149 ("Claude Code on its own, or with Croftweaver")

Depth: Normal (new page copy with sourced claims and a test change; no box, user data, logins,
money, deletion or schema). The plan passed its own PLAN gate (private hub,
`compare-claude-code/`). Seats: Codex, GLM 5.3 on melious, and a fresh-eyes host pass.

## Round 1 (2026-10-26, base 64952c8, head 1b1605f)

Codex: 1 BUG (481 s, 65,404 tokens). GLM 5.3: 2 NIT (65 s, 8,246 tokens). Fresh-eyes: 3 NIT (142 s,
101,070 tokens); it found the copy word for word as the plan's draft and every list item backed by
its page.

| # | Seat | Kind | Finding | Disposition |
|---|---|---|---|---|
| 1 | Codex, fresh | BUG / NIT | `compare.astro`'s header and `docs/competitors.md` say statements about other products live in `src/data/compare.ts`; the Claude Code quotes were in the page | fixed: the quotes moved into `CLAUDE_CODE` and render from it; `docs/competitors.md` gets a dated section for them |
| 2 | fresh | NIT | `llms.txt` "nothing yet compares" reads as a claim about the whole web | fixed: "nothing on this site yet compares" |
| 3 | fresh | NIT | the test looks anywhere in the section, while its banner says "in place" | fixed: scoped to the quoting paragraph; seen to fail with the date moved to the closing note; banner names the section |
| 4 | GLM | NIT | one message covers both a missing link and wrong link text | fixed: a count check and a text check, each with its own message |
| 5 | GLM | NIT | the two quotes may come from different pages | refuted: both are on https://code.claude.com/docs/en/overview (curl, 2026-10-26) |

## Round 2 (2026-10-26, delta 1b1605f..e72e104), verification

Earned by row 1 (BUG). Codex: No BUG/RISK/NIT findings (1,472 s, 47,942 tokens). GLM 5.3: No
BUG/RISK/NIT findings (92 s, 9,784 tokens). Fresh-eyes: rows 1-3 FIXED, rows 4-5 hold, nothing new
(36 s).

## Verdict

DIFF gate clean on e72e1042daff0d6b2935da67c90b7c2216fcb7ef: no open BUG or RISK. 2 rounds, 5 findings (1 BUG, 4 NIT): 4 fixed, 1
refuted. Nothing changed after round 2 except this record. Cost: Codex 2 runs, 1,953 s, 113,346
tokens; GLM 2 runs, 157 s, 18,030 tokens; fresh-eyes 2 rounds, 178 s, 112,333 tokens.
