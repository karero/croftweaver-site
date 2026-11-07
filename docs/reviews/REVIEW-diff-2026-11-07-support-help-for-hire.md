# DIFF gate: /support, the "Help for hire" section

Depth: Normal. A shipped page and a test are Never-Light under `~/.claude/REVIEW-RULES.md`, so the
Light default for prose did not apply; the sibling change (/established-sites#help, 2026-11-03) was
Normal too. No box, user data, logins, money, deletion or schema. Exempt from a PLAN gate: a wording
change with owner-approved text. Seats: Codex (gpt-6.1-sol, effort high) and GLM 5.3 on melious, one command.

## Round 1 (2026-11-07, base c1855e5, head 97a634c)

Codex: 1 RISK (205 s, 66,207 tokens). GLM 5.3: 1 NIT (32 s, 5,408 tokens). Both found the page and
test consistent: one link, exact URL, section last, after "Security problems".

| # | Seat | Kind | Finding | Disposition |
|---|---|---|---|---|
| 1 | Codex | RISK | nothing shows the destination's analytics tells `ref=croftweaver-support` from `ref=croftweaver` | refuted: same finding as round 1 of REVIEW-diff-2026-11-03-help-msquad-link.md; Plausible lists `ref` as a supported source parameter (https://plausible.io/docs/top-referrers, read 2026-11-03). The two URLs differ in any case. Whether M-Squad's own instance shows the value is a check on that instance after the page is live, not something this repo can test |
| 2 | GLM | NIT | the comment date "2026-11-07" reads like a typo | refuted: it is the date of the owner's approval and of today |

Clean after round 1: no BUG; the RISK and the NIT refuted, no change needed.

Checks run before the review: `npm run check` (0 errors), `npm run build`, the full suite (504 passed).
Mutations of the new test, each failing it: `ref=croftweaver` in place of `ref=croftweaver-support`;
the section moved above "Security problems". The latter first printed a misleading message, which
was fixed (separate assertion for the order) before the commit.
