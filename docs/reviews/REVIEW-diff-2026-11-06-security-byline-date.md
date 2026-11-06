# DIFF review — branch `content/security-byline-date` — /security byline, last-updated date, Article markup, PHP news cut

Base `557819e` (origin/main) · depth: Normal (shipped page code, the logic of a check script and structured data, so not Light) · verdict: CLEAN after one round; two NITs fixed, the fixes not re-reviewed · spec: `security-page/PLAN-seo-eeat-2026-11-06.md` in the private hub (branch `plan/security-seo-eeat`, commit `4860765`), PLAN gate trail `REVIEW-plan-seo-eeat-2026-11-06.md` beside it (5 rounds, a final full read and a wording pass).

Seats: Codex `gpt-6.1-sol` (read-only) and GLM 5.3 on melious.ai (`SECOND_SEAT=melious MELIOUS_MODEL=glm-5.3 MELIOUS_API_TIMEOUT=900`). Evidence file: the plan, the S4/S5/S6 outputs, the dead-CSS `rg` and the output of `tests/check_security_page.sh`.

| Round | Head | Artifact | Seats | Seconds, tokens | Findings |
|---|---|---|---|---|---|
| 1 | `015f8b0` | full, `557819e..015f8b0`, with evidence | codex, melious | 154 s 66.0k; 207 s 40.7k | 0 BUG, 0 RISK, 2 NIT |

Total 106,645 tokens (the script's gate line).

| id | Sev | Source | Rnd | Finding | Status | Evidence |
|---|---|---|---|---|---|---|
| R1-1 | NIT | melious | 1 | `checkUpdated`'s "`<time>` elements, not one" branch had no hand-made failing case | fixed | two cases added, "no `<time>` in the byline" and "two `<time>` elements in the byline"; the script lists both as `ok` |
| R1-2 | NIT | melious | 1 | the comment in `src/config.ts` said the two Person copies "cannot differ", but each page passes its own origin | fixed | the comment now says one function builds both and `tests/seo.spec.ts` compares the built pages field for field |

Both seats also listed UNVERIFIABLE items, which are not findings: the date the page first went live (23 October; the plan quotes PLAN.md row 10), Google's Article guidance and a Rich Results Test result (the manager runs the test before the merge, per the plan), and the LinkedIn redirect in a comment that moved unchanged from `index.astro`. Codex's remark that it ran no fresh build and no full Playwright run is answered by the PR's check outputs.

Self-check before the round (CLAUDE.md, "Writing code and judging findings", item 3): each new guard in `tests/check_security_page.sh` was seen to fail on a hand-made page (21 cases for the byline, the Article and the three bounds on `UPDATED`), and once on the real built page (the Article's `dateModified` set to the day before, then "Reviewed by" for "Published by" in `dist/security.html`; both failed, the original passed). The `seo.spec.ts` test was seen to fail with `datePublished` set to 24 October. Can a guard pass while the thing is broken? A forgotten bump of `UPDATED` inside the three bounds is not caught; the plan names that, and this review checks it: `UPDATED` is 6 November 2026, the day of the build. Does anything skip silently? A missing `READ_LAST` is refused by its own case rather than skipped; a missing `UPDATED` or `longDate` throws.
