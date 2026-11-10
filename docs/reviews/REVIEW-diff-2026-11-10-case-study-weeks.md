# DIFF review: case study, the weeks to 10 November (branch content/case-study-2026-11-09)

Depth: Normal (shipped page data: the log, the two exported CSV files, the tests card's source; no box,
user data, logins, money, deletion or schema). Seats: Codex, and GLM 5.3 flash on ollama-cloud (the melious
seat was out of balance, so ollama ran beside Codex). The 19 new entries' test counts and review rounds were
read from each pull request's own body; where a body gives none, the entry says so.

Checks before round 1: `npm run check` 0 errors, `npm run build`, `bash tests/check_case_study_card.sh`,
`bash tests/check_case_study_audit.sh`, `python3 scripts/case-study-audit.py --ref HEAD`: "All clear".
Full suite at b3e8ba1: 532 passed.

## Round 1 (base 12ce1a1, head 8afff11)

Codex: 1 BUG. ollama: 1 BUG, 1 RISK, 2 NIT. 76,108 tokens logged.

| # | Seat | Kind | Finding | Disposition |
|---|---|---|---|---|
| 1 | Codex | BUG | the 2 November observation says the site served every change in the log, which now holds later changes | fixed: "every change to it that this log holds up to that day" |
| 2 | ollama | BUG | an ASCII apostrophe in #185's text ends the string | refuted: it is U+2019; build and 532 tests pass; round 2 confirmed by import |
| 3 | ollama | RISK | #184's "531 tests" has no support in the evidence | refuted: PR 184's body says "`npm test` (531 passed)"; its trail (REVIEW-diff-2026-11-08-guide-links.md:23) records 531 passed; round 2 Codex verified both |
| 4 | ollama | NIT | the first new entry sat on the previous entry's line | fixed |
| 5 | ollama | NIT | #185's entry omitted its review | fixed: "review by Codex at Normal depth, 1 round" |

## Round 2 (delta 8afff11..HEAD), verification

Codex: no findings; all five dispositions verified (47,147 tokens). ollama: row 3 stands as a RISK only
because its evidence file cut the PR body's test line (the evidence listed lines by keyword, head -5);
the line exists and the trail supports it. Its two out-of-scope NITs (per-PR test counts that do not rise
in a straight line; the wording "Clean after round 1" in the PR 171 digest) are follow-ups with no change here:
the counts are what each pull request reports.

## Verdict

DIFF gate clean on the head of this branch: no open BUG; one RISK refuted with evidence. 2 rounds,
6 findings (2 BUG, 1 RISK, 2 NIT, plus one out-of-scope pair). Cost: 123,255 reviewer tokens logged
(2 runs gave no figure).
