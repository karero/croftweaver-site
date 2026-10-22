# Review trail: /what-it-runs-on (DIFF gate)

Gate: DIFF, Normal depth. The diff adds a public page, its registrations, inbound links and tests, with claims
about third parties; the High row (auth, payments, personal data, deletion, migrations, secrets, security
boundaries, public API, deploy, privacy text) does not apply, and shipped copy is never Light. No red team: no
user data, login, money, deletion or schema change. Gate id `20261022T200133Z-83632`.

Owner's words that started the gate (2026-10-22, chat): "Yes: run the DIFF review at Normal depth on the local
commit. Do not push yet." Seats as for the plan gate: Codex (`gpt-6.1-sol`, read-only, cwd = the worktree at
HEAD), GLM 5.3 on melious.ai (`SECOND_SEAT=melious`), and a Sonnet fresh-eyes sub-agent with no shared context
(read-only), started together before the script. Data check: the diff holds no keys, tokens, passwords or
personal data; it is a public page.

## Round 1

Artifact: `git diff origin/main...HEAD` at commit `2c43b84` (13 files, +308 −3), with a short note for the
reviewers pointing at the plan. GLM called that note "injection-adjacent" (it asserted that the plan had passed
its review); a false positive, but fair feedback, and later rounds carry no note. Diff sha256 `cffea292…`.
`reviewers: codex OK, melious OK`. `timings: codex 392s (124215 tokens), melious 163s (25177 tokens)`.
Fresh-eyes (Sonnet): 650 s, 267,251 tokens, 79 tool uses (the sub-agent's own report; logged by the host).
416,643 tokens logged for round 1.

Findings after de-duplication: 20 (2 BUG, 7 RISK, 11 NIT); Codex 4, GLM 2, fresh-eyes 14, no overlap. The
reviewers could not read vendor pages (no network), so all three listed the Cloudflare, GitHub, Astro and
Plausible claims as unverifiable; those readings are kept in `VENDOR-FACTS-2026-10-22-what-it-runs-on.md`. Each finding was
checked against the repo, the toolkit at `origin/main` or the vendor page before the fix. 19 confirmed and
fixed, 1 refuted with evidence (D19). The fixes are commit `e35a276` (2 files, +47 −33).

| # | Kind | Seat | Finding | Check | Disposition |
|---|---|---|---|---|---|
| D1 | RISK | Codex | Cloudflare function metering, the daily limit and exhaustion behaviour unverifiable | the toolkit's first-deploy guide lines 312 to 318: the quota is the account's, shared; "set Fail open" | fixed: the page says shared and fail open; readings kept; the dashboard check is the owner's |
| D2 | RISK | Codex | GitHub ruleset claims lack a dated observation | `gh api` by ID, 2026-10-22 | kept in the facts file; page unchanged |
| D3 | RISK | Codex | Plausible price and billing interval | the pricing page text shows a toggle, not which is selected; `/start` line 163 says 9 euros or US dollars | fixed: the page says the interval is not shown and matches `/start` |
| D4 | BUG | Codex | "Astro runs the tests"; Playwright runs them | `package.json` line 17 | fixed in the picture and the Astro paragraph |
| D5 | NIT | GLM | "free" without limits for DNS and Email Routing | vendor read: "available on all plans" | fixed: "every plan" |
| D6 | NIT | GLM | the acquisition sentence has no read date; the `AGENTS.md` claim has no link | read | fixed |
| D7 | BUG | fresh-eyes | Keystatic writes Markdoc, not plain Markdown | `keystatic-setup/SKILL.md` lines 33 to 48, 113 to 114 | fixed |
| D8 | RISK | fresh-eyes | the branch rule needs a public repository on a free plan | `website-team-setup` lines 201 and 259 | fixed |
| D9 | RISK | fresh-eyes | "every preview build counts" sits under a "read" label nobody read | Cloudflare's limits page does not say (read twice) | fixed: the claim is cut |
| D10 | RISK | fresh-eyes | the 100,000 a day is per account and shared | toolkit lines 312 to 318 | fixed with D1 |
| D11 | RISK | fresh-eyes | the middleware's optional third job is omitted | the template's header | fixed: one clause |
| D12 | RISK | fresh-eyes | `npm run ship` is not blocked by Claude Code; the rule is written; the list was not tried in a live session | `WHAT-THE-SKILLS-RUN.md` lines 37, 51, 72 to 80 | fixed: the page says so |
| D13 | RISK | fresh-eyes | the new tests lack the "Site-specific" marker | `a11y.spec.ts` lines 4, 7, 34, 129 | fixed |
| D14 | NIT | fresh-eyes | DNSSEC is a trap of the DNS move; the plan said the checklist lacks it | `CLOUDFLARE_FIRST_DEPLOY.md` lines 415 to 426; my search was cut off after four lines | fixed on the page; the plan note and the facts file corrected |
| D15 | NIT | fresh-eyes | the Plausible price differs from `/start` | line 163 | fixed with D3 |
| D16 | NIT | fresh-eyes | "not checked in the same way" is ambiguous | `ship.sh`, the pre-push hook | fixed |
| D17 | NIT | fresh-eyes | the CSS comment credits the wrong rule; the phone test cannot fail on current copy | measured by the sub-agent; mutation check by me | fixed: a 60-character word in the test; removing the protection fails it at 360 and 320 px |
| D18 | NIT | fresh-eyes | `ol` implies a sequence; the box headings repeat the section names unlinked | read | fixed: `ul`, headings link their sections |
| D19 | NIT | fresh-eyes | the source comment points to a private hub from a public repo | `from-wordpress.astro` line 5, `ai-website-seo-checklist.astro` line 5, `security.astro` line 4 carry the same pointer | refuted |
| D20 | NIT | fresh-eyes | "every Croftweaver site (AGENTS.md)" over-claims; two links read "read 22 October 2026" | read | fixed |

Two of my own earlier statements were wrong and were corrected here: that DNSSEC is absent from the toolkit's
checklist (a `head -4` cut the search off), and that "every preview build counts toward your monthly builds"
(never read from a vendor page).

Outside the page, found by the plan gate and put to the owner: `/checks` line 41 (F36 in
the plan gate's trail in the private hub (`what-it-runs-on/REVIEW-plan-2026-10-22.md`)).

## Round 2 (verification; the pair only)

Artifact: the delta `2c43b84..e35a276` (2 files, +47 −33, no note to the reviewers), with
`prior-diff-findings-r1.md`. Diff sha256 `6a7ea2cc…`. `reviewers: codex OK (medium effort), melious OK`.
`timings: codex 185s (56600 tokens), melious 149s (20043 tokens)`. 76,643 tokens; 493,286 logged for rounds 1
and 2 together.

Both seats checked the 19 fixed findings and the one refutation: **all landed in full**; no fix re-broke
anything; nothing re-raised. New: 8 findings, 0 BUG, 3 RISK, 5 NIT. Under SKILL step 6 a round without a
substantive BUG ends the rounds. Convergence (step 7): 20 findings fell to 8, all in new ground, none
re-raised. All eight are fixed locally; the fixes are commit `81ae653`.

| # | Kind | Seat | Finding | Check | Disposition |
|---|---|---|---|---|---|
| D21 | RISK | Codex | shared metering, the account quota and fail-open rest on vendor pages the reviewers cannot read | the readings exist: `VENDOR-FACTS-2026-10-22-what-it-runs-on.md` | fixed by retention: the record goes into `docs/reviews/` with this PR; the dashboard test is the owner's |
| D22 | RISK | Codex | the ruleset claims lack a retained observation | `gh api` read-back by ID, 2026-10-22 | fixed by retention: same record |
| D23 | RISK | Codex | the Plausible price and billing interval | the pricing page text | fixed: the page says what was shown and what was not; reading retained |
| D24 | NIT | Codex | the claim that removing `overflow-wrap: anywhere` fails the phone test was not measured | **measured**, 60-character word, 360 and 320 px: as built 0 and 0; without `anywhere` 0 and 0; without `minmax` 0 and 0; without both 191 and 231 px | fixed: either rule is enough and the test fails only when both are gone; the CSS and test comments say so. My round-1 check had removed both at once and credited the wrong rule |
| D25 | NIT | GLM | "$9 a month" and "did not show monthly or yearly" contradict | read | fixed |
| D26 | NIT | GLM | "available on every plan" (DNS, Email Routing) carries no source of its own | read | fixed: the DNS setup page is linked and dated; Email Routing carries its read date |
| D27 | NIT | GLM | "it was read from Claude Code's documentation" points at the wrong noun | read | fixed |
| D28 | NIT | GLM | "the toolkit's guide" is not linked | read | fixed |

## Merge of `origin/main`, then the merge-link review

`origin/main` (`cf254ff`: the `/security` page, PR #118, and the 0.32 suites, PR #115) moved under the branch,
which was 16 commits behind. A trial merge in a throwaway worktree showed no conflicts; the real merge is
`ab093c4`. On the merged branch the full suite ran under a machine load average above 400 (another session's
work). Whole-site loop tests timed out, a different one in each full run (the footer credit; the privacy host;
the operator check); each passes alone with a longer timeout, and a full run with `--timeout=300000
--workers=2` is the check of record. Listed here, not hidden.

The merge link (SKILL step 6, `merge_link.sh`) is the artifact: the change's own files from the last reviewed
head `e35a276` to the new head, merge effects included: 9 files, 236 lines. It carries the round-2 fixes and
the merge effects on the registration files. The pair read it as a verification link with
`prior-diff-findings-r2.md`. The wording pass is folded into this link: it covers the same prose edits with the
same cross-model seats, and a separate pass would read identical text.

Result: `reviewers: codex OK (medium effort), melious OK`. `timings: codex 160s (60660 tokens), melious 171s
(25205 tokens)`. 85,865 tokens; 579,151 logged for the gate. Both seats confirmed that D24 to D28 landed in
full. New: 2 BUG, 4 RISK, 2 NIT, which come to five distinct findings, because four of the six BUG and RISK
lines have one cause.

| # | Kind | Seat | Finding | Check | Disposition |
|---|---|---|---|---|---|
| D29 | BUG, 3 RISK (Codex) and 1 RISK (GLM) | both | the prior-findings said this pull request adds a facts record under `docs/reviews/`; none was there, so D21 to D23 stayed unresolved | `docs/reviews/` at `ab093c4` held no such file; `merge_link.sh` drops `docs/reviews/` from its list by design, so a file added there would not have shown in the link either | **real: my record promised something I had not done yet.** Fixed: the record is added (`VENDOR-FACTS-2026-10-22-what-it-runs-on.md`), with the vendor readings, the ruleset read-back and the layout measurement. A review record, no change to the page: not substantive |
| D30 | BUG | GLM | `tests/_helpers.ts`: the comment gives `[PDF]` as an allowlist example, but the set is empty | the code is main's, from PR #118 (`f490e7a`, merge `2535f0c`); the comment says "e.g."; `git grep '\[PDF\]'` on `main` finds only that comment and one in `placeholders.spec.ts`: no page uses it, nothing was lost | **refuted**, and not this change's code |
| D31 | NIT | GLM | the phone-test comment says "which is what a long future word would meet" | read | fixed: "this fails only when both are gone" (commit `78de238`) |
| D32 | NIT | GLM | `CONTENT_GUIDE.md` line 59 ("a count in copy is rendered, never typed") and `POSITIONING.md` line 192 ("counts in these lines are typed by hand") look opposite | both lines are on `main` (PRs #118 and #115); they govern different surfaces, page copy and POSITIONING's reference lines | out of scope: not this change; the owner may want the two lines to name their surfaces |
| D33 | (unverifiable) | Codex | the D24 measurement was not reproduced by the reviewers | the measurement is the author's | retained: the table is in the facts record, section 5 |

Full suite on the merged branch (`ab093c4`), the check of record: `npx playwright test --timeout=300000
--workers=2` gave **372 passed, exit 0** in 4.3 minutes, with the machine's load average near 580 at the end.
The default-timeout runs on the same tree had failed one or three whole-site loop tests each (the footer credit,
the privacy host, the operator check), a different set each time, and each of the three passed alone with a
longer timeout.

## Close

No BUG open: D29 is fixed, D30 refuted with evidence. The rounds ended at round 2 (no substantive BUG; step 6).
The wording pass was folded into the merge-link review, which covered the same prose edits with the same
cross-model seats. One more comment line was changed after it (D31); that one-line delta gets one Codex
confirmation, below. Counts: 2 rounds and the merge link; 32 findings (20 in round 1, 8 in round 2, 4 in the
link), plus one unverifiable measurement kept as evidence; 29 fixed, 2 refuted with evidence (D19, D30), 1 out
of scope (D32). Tokens logged: round 1 416,643; round 2 76,643; the link 85,865; the confirmation 44,502;
total 623,653.

## Confirmation (Codex, one seat; a re-gate, not a round)

Delta `ab093c4..78de238`: the one comment line of D31. `reviewers: codex OK`. `timings: codex 91s (44502
tokens)`. Result: **No BUG/RISK/NIT findings.** Codex confirmed that only a comment changed, that the test's
setup and assertion are as described, and that both layout protections and the site's global
`overflow-wrap: break-word` are in the code. It listed the layout claims as unverifiable in its sandbox, which
is the measurement in the facts record, section 5.

Closed 2026-10-22: no BUG open; head `78de238` (plus the record commit, which `merge_link.sh` and the skill
exclude as `docs/reviews/`). Not pushed; the owner's ship hold applies to any publish.

