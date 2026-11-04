# DIFF review — branch `build/case-study-upkeep` — the case study upkeep check and the tests card finding its own entry

Base `768e1ac` (the stacked branch `content/case-study-2026-11-02` plus the plan) · depth: Normal (the diff changes the logic of a check script and of a build-time guard, so not Light) · verdict: CLEAN after four rounds and a wording pass · authority used: WORKTREE-WRITE and BRANCH-COMMIT, atom A (this session made the branch `build/case-study-upkeep` and works in the site's one folder, as the brief says: no worktrees); POST AUTHORITY and GATED-THIS-DIFF: not used yet, there is no pull request, so the review comment and the stamp wait for it

Seats: Codex `gpt-6.1-sol` (read-only; effort medium from round 2 on, the default for a verification round), GLM 5.3 on melious.ai (`MELIOUS_API_TIMEOUT=900`), fresh-eyes by a `sonnet` sub-agent in round 1 only.

| Round | Head | Artifact | Seats | Seconds, tokens | Findings |
|---|---|---|---|---|---|
| 1 | `8ba483e` | full, `768e1ac..8ba483e`, with evidence | codex, melious, fresh-eyes | 252 s 87.6k; 434 s 66.0k; 249 s 165.4k | 1 BUG, 1 BUG (fresh-eyes), 3 RISK, 6 NIT |
| 2 | `834e890` | delta since `8ba483e`, with evidence | codex, melious | 186 s 55.8k; 283 s 27.7k | 2 BUG, 2 RISK, 4 NIT |
| 3 | `7290cd6` | delta since `834e890`, with evidence | codex, melious | 212 s 71.8k; 184 s 25.1k | 1 BUG (a docstring), 1 RISK, 2 NIT |
| 4 | `e106634` | delta since `7290cd6`, with evidence | codex, melious | 129 s 43.9k; 330 s 22.0k | 0 BUG, 1 RISK (refuted), 2 NIT |
| wording | `6232c22` | delta since `e2f4a6d` (README row 15), `--wording-pass --first-success` | codex | 68 s 56.3k | 1 RISK (the trail did not exist yet; this file answers it) |

Total about 565k tokens for the four rounds, plus 56k for the wording pass. The plan gate (3 rounds) is in `REVIEW-plan-2026-11-03-case-study-upkeep.md`.

| id | Sev | Source | Rnd | Finding | Status | Evidence |
|---|---|---|---|---|---|---|
| R1-1 | BUG | codex | 1 | `--ref` is verified but later reads reuse the mutable name; a ref that moves mid-run mixes commits | fixed in round 2 and again after R2-1 | see R2-1 |
| R1-2 | BUG | fresh-eyes | 1 | the new Playwright suite changes the public count 17 to 18, and /checks says the suites are the template's | fixed by the planner's call, below | no suite added: `src/data/suites.ts`, `public/croftweaver-why.pdf` and `scripts/deck.lock.json` are the base commit's; `npm run deck`: every deck is current |
| R1-3 | RISK | fresh-eyes | 1 | a pull request merged on the UPDATED day after the update is shown only under "once more" | refuted | plan scenarios A3 and A3b decide the merge-day split; it is listed in this run and the next |
| R1-4 | RISK | fresh-eyes, melious | 1 | an unexpected exception ends as a traceback with exit 1, which means "due" | fixed `834e890` | `main()` is wrapped, any other error exits 2 with a message; scenario "an unexpected error is exit 2" (`--today not-a-date`); disabling the handler fails it |
| R1-5 | RISK | melious | 1 | the newest AI check day is not filtered by site | refuted | `scripts/export-own-site.py:107` skips every row whose site is not croftweaver.com |
| R1-6 | RISK | codex (again in rounds 2 to 4) | 1 | GitHub search completeness and the merge-day boundary are unsupported | answered with a READ | `gh pr list --state merged --limit 500` gave 160 pull requests (complete); for the start days 2026-10-20, 10-25, 10-29, 11-02 the query `merged:>=DAY` and a filter of that list on `mergedAt` gave equal sets (65, 24, 10, 7). Codex still asks for the sets themselves in round 4; that is a limit of what it can reach, and the claim was not changed |
| R1-7..R1-11 | NIT | codex, fresh-eyes, melious | 1 | a comment promised a reminder not yet registered; a suite example contradicted its own limit; "A1 to A6" in a test header; no comment on the `checks` field; `new RegExp` with a variable | fixed `834e890` | each wording or one-line change; the spec's `toThrow` takes a string |
| R1-12 | NIT | fresh-eyes | 1 | "12 tests added" also stops the build | kept | the plan (C4) accepts it; the build stops loudly and says how to write the count |
| R1-13 | unverifiable | all | 1 | "Node 22.18 or newer" | wording cut | the docstring says "a Node that strips TypeScript types"; CI runs Node 24, the checks ran on Node 26.13 |
| R2-1 | BUG | codex (melious NIT) | 2 | the end-of-run ref comparison misses a move A to B to A | fixed `7290cd6`, test widened `e106634` | the ref is resolved to a commit id once; every git read uses it; the name is kept only for messages. A git shim on PATH moves `main` one commit back at the first `git show`; the commit before the last holds another export and an exporter that exits. Reading the name instead of the id in `fresh_export`, `check_data` or `check_pulls` (three mutations) each fails that scenario. This was a cut: the comparison was removed, not patched |
| R2-2 | BUG | codex (melious NIT) | 2 | the comment on `Change` says the build stops on a count worded otherwise; "499 passing tests" does not | fixed `7290cd6`, again in R3-1 | comment and docstring name the wordings not noticed |
| R2-3 | RISK | codex, melious | 2 | the suite count and the /checks note (R1-2 still open) | fixed by the planner's call | below |
| R2-4 | RISK | melious | 2 | nothing shows a production build stopping on a misworded count | answered | a temporary newer change with checks `600 tests, no flakes`: `npm run build` failed rendering /case-study with `"experiment" (2026-11-02) states a test count, but not first as "N tests;"` |
| R2-5 | NIT | melious | 2 | the closing `rev-parse` had no handler; the docstring said "any other failure"; KeyboardInterrupt still tracebacks | fixed | the comparison is gone; docstring says "any other error" |
| R3-1 | BUG | codex | 3 | the docstring of `newestTestCount` said a count written differently is never skipped silently | fixed `e106634` | it names the two wordings it cannot see |
| R3-2 | RISK | melious | 3 | the shim fired after the exporter read, so that read was uncovered | fixed `e106634` | see R2-1; all three mutations fail the scenario on the current code |
| R3-3, R3-4 | NIT | melious | 3 | the unmoved reference came from another repository; the card check's catch named the wrong file and `newestTestCount(LOG)` was outside `check()` | fixed `e106634` | reference is a run on the same repository; the catch is gone; a throw is a failed check |
| R4-1 | RISK | melious | 4 | the record said the fresh-export mutation passed, so the scenario cannot fire for that read | refuted | the round's evidence file still held the earlier run; on `e106634` the three mutations were run again and each failed the scenario (`FAIL A5: a moved ref changed the answer`, exits 2, 1, 2) |
| R4-2, R4-3 | NIT | codex, melious | 4 | the stale-page message said "newer than" for "older than"; a missing source file crashed the card check with a stack trace | fixed `e2f4a6d` | existence and age are checked apart, the message says "older than"; the stale case was seen failing, then passing after `npm run build` |
| W-1 | RISK | codex | wording | "reviewed (four rounds)" without the record | answered | this file |

UNVERIFIABLE entries asked, none made a finding: the Node floor, the GitHub search sets (R1-6), the reruns of suites the read-only seats cannot write for, the scheduler registration (A6 is open on purpose).

## Planner's call that replaces the plan's spec file

The manager session (planner), 2026-11-04, after round 2: no Playwright suite. The plan named `tests/case-study-card.spec.ts`; a spec must be described in `src/data/suites.ts`, which raises the public suite count from 17 to 18 on https://croftweaver.com/, https://croftweaver.com/checks and https://croftweaver.com/why and in the deck, and /checks says the suites are the template's. So C1 to C5 run from `tests/check_case_study_card.mjs` (Node type stripping; the log module imports nothing), started by `tests/check_case_study_card.sh`, which CI runs after `npm run build`; the same script reads `dist/case-study.html` and compares the tests row with `newestTestCount(LOG)`, and refuses a page older than its sources. No toolkit spec is edited, the suite count stays 17, and no public wording changes.

## Checks and mutations

- Before round 1 (step 0, base `768e1ac`): `npx playwright test` 501 passed; `npx astro check` 0 errors. On the final head: 501 passed, 0 errors, `bash tests/check_case_study_audit.sh` all 24 checks passed, `bash tests/check_case_study_card.sh` 20 checks ok, `npm run deck` nothing to make.
- Audit script, by hand (a copy of the commit per mutation): 11 mutations of `scripts/case-study-audit.py` each failed `tests/check_case_study_audit.sh`; the Search Console file compared was added to scenario A1 after one survived; later the handler and the pinned-commit reads (above).
- The card check, by hand: five mutations (tie rule reversed, repository filter dropped, C4 guard off, date ordering dropped, card figure + 1 with a rebuild) each failed `bash tests/check_case_study_card.sh`, for the matching reason.
- The mutation-check skill's run on the earlier spec ended with "no result: the machine stayed busy" (load 100 to 500 from other sessions); the same five mutations were then run by hand against the spec, all five failed it. The skill was not used for the card script (its runner presets are unittest, playwright, rspec and xcodebuild).
- Round 4 ended the rounds: no substantive BUG and no earning RISK (R4-1 refuted); the two NITs were fixed without another round (their effect seen directly). The wording pass read README row 15 only; the code NIT fix `e2f4a6d` sits between the last seen head and that pass and was not sent to a seat. Deferred BUGs: none. Waivers: none. Rounds past 8: none.

## Deviations from the plan

- The CI step for the audit sits right after `actions/setup-node`, not next to `check_export_own_site.sh`: it needs Node's type stripping, which the runner's default Node may lack.
- Neither check is wired into the pre-push hook; both run in CI.
- Scenario A6 (the reminder) is not built yet: the task is registered after the merge; README row 15 says "not yet seen running on its own".

## Notes

- Round 4 was earned by the kind `moved-ref-test` (R3-2, a test that could not fire for one read); the cut since the kind first earned a round is R2-1's.
- Fresh-eyes ran in round 1 only, on `sonnet`; its report is the BUG and RISK rows marked fresh-eyes.
