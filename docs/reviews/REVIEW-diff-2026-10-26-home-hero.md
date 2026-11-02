# DIFF review — content/home-hero — Home hero: "Build a complete website with AI."

Gate: independent-review, DIFF, depth Normal (copy plus a positioning-test change, which is never Light).

| Round | Seats | Findings | Disposition |
|---|---|---|---|
| 1 (on ac9639e) | Codex only: melious failed mid-stream, ollama out of quota (Codex-only rule, owner 2026-10-26) | 1 BUG, 1 RISK | both fixed in 5b36fce |
| 2 (on 5b36fce) | Codex, GLM 5.3 on melious | 0 BUG, 0 RISK, 3 NIT (GLM) | NITs fixed in the next commit |

Round 1:
- BUG, README.md: the hero record kept the 2026-10-08 date and the retired one-liner. Fixed.
- RISK, tests/positioning.spec.ts: a whole-body check also passes on the FAQ when the hero's
  definition line is gone. Fixed: a test asserts the term in `.hero p.what`; mutating the line
  makes it fail.

Round 2 (NITs, fixed): "brand line" already names the sign-off, so the kicker is "the rank
line"; one sentence in POSITIONING.md §2 reworded; the upkeep outcome uses one wording on the
hero, the card and STORY.md §7.

Totals: 2 rounds, 5 findings (1 BUG, 1 RISK, 3 NIT), all fixed. Tokens: round 1 codex 59,071
(747 s); round 2 codex 48,978 (2,120 s), melious 22,450 (219 s).
