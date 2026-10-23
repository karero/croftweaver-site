# DIFF review — branch fix/tables-responsive — one table style for the whole site, stacked on a phone
Base `046d344` (origin/main, PR 119 merged; fetched 2026-10-23, the last fetch gave no newer commit) · round 1 saw head `ff2359c` · depth: Normal (shipped markup, styles and test logic; nothing in the High row) · verdict: CLEAN for head `7cd4f45` (round 3, Codex alone: "No BUG/RISK/NIT findings"); the gate is DEGRADED, see below.

Plan gate: not run. This is a visual fix to existing tables (layout and wording of CSS, no new behaviour of the site's code), exempt under the owner's rule of 2026-10-18; it goes straight to the DIFF gate.

Degraded: the standard pair did not run in any round. Round 1: Codex and the fresh-eyes pass counted; GLM 5.3 on melious.ai FAILED (`HTTP 200: Insufficient balance for request. Required: 308, Available: 0`) and the script's stand-in, ollama-cloud, FAILED (`429 ... weekly usage limit`). Rounds 2 and 3 ran with `--seat codex` alone, because both second seats were out. So every round had one cross-model reviewer (Codex), and no GLM review exists for this change. The owner's OK covered Codex and melious only; the script also tried ollama-cloud as a stand-in and that request was refused with the 429 before any review came back, so the diff may have been transmitted to ollama.com without the owner's OK for that service.

| Round | Head | Artifact | Reviewers | seconds / tokens per seat | BUG/RISK/NIT |
|---|---|---|---|---|---|
| 1 | `ff2359c` | full change (`046d344...ff2359c`, 52,842 bytes) | codex-cli gpt-6.1-sol, config effort, read-only; fresh-eyes Claude Sonnet sub-agent, read-only by instruction, ran no tests; GLM 5.3 melious FAILED; ollama-cloud FAILED | codex 401 s / 110,228; fresh-eyes 336 s / 157,831 | Codex 3 / 2 / 0; fresh-eyes 0 / 0 / 8 |
| 2 | `3ce5836` | delta `ff2359c..3ce5836` (17,112 bytes, `--verify`) | Codex medium, read-only | codex 197 s / 56,243 | 1 / 0 / 0 |
| 3 | `7cd4f45` | delta `3ce5836..7cd4f45` (`--verify`) | Codex medium, read-only | codex 115 s / 47,066 | 0 / 0 / 0 |
| merge link | `40faaa1` | `merge_link.sh 046d344 7cd4f45 0e1b175` (main merged in: PR 122, the header groups; one conflict, in `tests/navigation.spec.ts`, resolved by keeping both) | Codex medium, read-only | 47 to 60 s, tokens not recorded | 1 / 2 / 0 outside my change (see below), 1 / 0 / 0 in it |

Tokens logged for the gate: 371,368 over four counted seat runs (the failed seats gave no figure). No round past 3.

| id | Sev | Source | Round | Finding | Status | Evidence |
|---|---|---|---|---|---|---|
| T1 | RISK | Codex | 1 | the claim that explicit roles keep a stacked table's meaning has no accessibility-tree observation | fixed; externally_reverified as a rewording only (round 2 and 3 list the measurement as UNVERIFIABLE for them) | CDP `Accessibility.getFullAXTree` on /established-sites at 360 px. With roles: table 1, rowgroup 2, row 9, columnheader 3, rowheader 8, cell 16. Without roles: table 1, rowgroup 1, none 1, row 9, columnheader 3, rowheader 8, cell 16. So Chromium keeps the table either way; the comment in global.css now says that and says Safari with VoiceOver is reported, not checked |
| T2 | RISK | Codex | 1 | the tap-target test measures height only, the header test only the box height | fixed; externally_reverified (round 2) | `a.tap` has `min-width: 44px` and the test checks both sides; the header test also checks `clip-path` is `none`. Mutation: removing `min-width` fails "a link that stands alone in a cell is a 44px tap target" |
| T3 | BUG | Codex | 1 | "a page carries no table CSS" contradicts `security.astro` (`tr.own`) and `proof.astro` (`#search`) | fixed; externally_reverified (round 2) | BRAND.md and the global.css comment now say "no layout CSS for a table" and name the page's own row styling |
| T4 | BUG | Codex | 1 | "figures stay a table" contradicts the case-study's `stack figures` | fixed; externally_reverified (round 2) | both comments document the combination |
| T5 | BUG | Codex | 1 | a test comment says the FAQ answers are folded; they are visible divs | fixed; externally_reverified (round 2) | the comment says the `<details>` loop is precautionary and none is folded today |
| T6 | NIT | fresh-eyes | 1 | a non-last `td.num` keeps `padding-right: .2rem` in stacked figures, the numbers sit 3 px apart | fixed; externally_reverified (round 2, declaration change) | `.stack td.num` sets `padding: .35rem 0`. No test covers 3 px |
| T7 | NIT | fresh-eyes | 1 | the body sets `-webkit-hyphens: auto` and the cells only `hyphens: manual` | fixed; externally_reverified (round 2) | `-webkit-hyphens: manual` added; not testable in Chromium |
| T8 | NIT | fresh-eyes | 1 | the docs omit the `stack figures` combination and the `nowrap` and `tap` classes | fixed; externally_reverified (round 2) | documented in global.css |
| T9 | NIT | fresh-eyes | 1 | the wide-screen tests start at 768 px, the table returns at 641 px | fixed; externally_reverified (round 2) | 641 added. It found a defect: the FAQ table's row headers took 5 lines at 641 px. Fixed with a `long-head` modifier (first column 38%). Mutation: removing `long-head` fails the 641 px test |
| T10 | NIT | fresh-eyes | 1 | `standalone > 20` leaves little room (26 today) | fixed; externally_reverified (round 2) | now `> 10` |
| T11 | NIT | fresh-eyes | 1 | PR 117's checklist tests repeat the new loops | refuted as a finding | they are PR 117's tests and the rule is never to delete a test; they stay |
| T12 | NIT | fresh-eyes | 1 | the report counted 14 tables, the source has 13 | fixed in the report | 13 `<table` in `src` and in `dist`: nine stacked, four figures |
| T13 | NIT | fresh-eyes | 1 | `tabindex="0"` on regions that no longer scroll on a phone | follow-up: the owner's choice | kept: the pattern of the nine existing tables; a stop that does nothing on a phone |
| T14 | BUG | Codex | 2 | `.stack.long-head tbody th` (width 38%) outranks the phone reset `width: auto`: the FAQ row titles stay 38% wide on a phone | fixed; externally_reverified (round 3) | reproduced first: the phone test, extended to measure `th` as well as `td`, failed ("a cell is squeezed to 122 px in a 320 px table"); the reset now names `.stack.long-head` and the suite passes |

Merge link (head `40faaa1`, after main moved to `0e1b175`): one finding in my change, fixed in the next commit: the comment above the table tests said a table of figures stays a table, untrue for the case-study's `stack figures` (T15, BUG, fixed; comment only). Three more, none in my change: they sit in the header tests that PR 122 brought in (the CSP comment at `navigation.spec.ts` line 336, a `second!.label` access that crashes when the header has only one group, and a 4 px step in the breakpoint scan). They are PR 122's code, reviewed in its own gate: reported to its owner, not fixed here.

Follow-ups:
- T13: whether to drop `tabindex="0"` from regions that cannot scroll on a phone.
- Safari with VoiceOver on a stacked table (T1): not checked by anyone; the roles stay as insurance.
- No GLM 5.3 review exists for this change: melious.ai has no balance. A later round by GLM (or a third opinion) would close the degraded gate.
- Figure tables fit in 320 px only because their text is short today; the test fails if a column grows, and the answer is then `stack`.

Notes:
- Mutation runs, one break at a time, restored from memory and compared by a hash of `git diff`: the needs table loses `stack`, a table forced to 40rem, no `min-height` on the tap rule, the row header at 3%, hyphens auto with the row header at 3%, a missing role, a wrong label, stacking up to 80rem, a table outside the shared style; then `min-width` and `long-head` after round 1. Each was caught by its test. Two early runs overlapped and baked two mutations into the files; both were found by reading the diff and put back by hand.
- Tests and the full suite ran on a private port (4986) with an untracked `pw.own-port.config.ts`, not committed; the shared port is often held by another session.
- Full suite at `7cd4f45`: 376 passed, none skipped. `npm run check`, the five shell checks of `.github/workflows/ci.yml`, the placeholder grep and the /security claims check passed on the same head (run on 2026-10-23 after the last fix).
- The owner's OK, quoted: "Yes, send the diff to Codex and GLM 5.3 on melious.ai (Normal depth)." Data check: the diff holds no secrets (two hits for the word "token" in prose).
- The review script ran from the worktree; the skill's script has `SECOND_SEAT` (16 matches).
- POST AUTHORITY: not yet used; no PR exists. Nothing was pushed.
