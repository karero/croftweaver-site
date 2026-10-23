# DIFF review — karero/croftweaver-site#127 — ship.sh 0.22 site copies (plan steps D3.2 to D3.4), shared gate
Base: each site's merge base with `main` · depth: High (deploy code that deletes folders) · verdict: CLEAN (degraded: rounds 1 to 4 had one cross-model seat) · authority used: POST AUTHORITY, WORKTREE-WRITE and BRANCH-COMMIT — atom A, this session created the branch `claude/ship-0-22`, its worktree and the pull request

One gate for three site copies, as the toolkit's plan names them: Site A, Site B and Site C. This repository is Site A. The template's own 0.22 files were reviewed at High depth in karero/croftweaver#376. This gate's artifact holds each site's divergence from them (`diff -U6` against template 0.22, per file), plus that site's other changed files. It was sent with `--base none`, since the diff was not made by `git diff` in one repository. Each round after round 1 sent the per-site delta since the last reviewed heads, with the dispositions to check (`--verify`).

| Round | Heads (A / B / C) | Artifact | Reviewers | seconds, tokens per seat | BUG/RISK/NIT |
|---|---|---|---|---|---|
| 1 | 4741f28 / 4691274 / 904fe5e | full divergence | codex-cli 0.164.0 (gpt-6.1-sol, effort from config, read-only); fresh-eyes Opus 5.5 sub-agent; melious FAILED (balance 0), ollama stand-in FAILED (weekly limit) | codex 493 s, 145,294; fresh-eyes 575 s, 213,041 | 4 / 4 / 5 (13 after dedup) |
| 2 | e0fdec1 / e604ee4 / f3ebd2d | delta since round 1 | codex; fresh-eyes Opus; melious and ollama FAILED as above | codex 514 s, 81,572; fresh-eyes 1,202 s, 169,111 | 2 / 2 / 3, plus 1 unverifiable |
| 3 | f9ba460 / 184e1d1 / 6b4f348 | delta since round 2 | codex; fresh-eyes Opus; melious and ollama FAILED | codex 471 s, 91,261; fresh-eyes 410 s, 143,652 | 1 / 1 / 6 |
| 4 | 2d79f16 / baa8604 / 07cf41f | delta since round 3 | codex only (fresh-eyes runs rounds 1 to 3 at High); melious and ollama FAILED | codex 284 s, 60,996 | 1 / 0 / 0 |
| 5 | 2d79f16 / f1f377f / 07cf41f | delta since round 4 (Site B only) | codex; GLM 5.3 on melious | codex 336 s, 73,398; melious 74 s, 11,448 | 0 / 0 / 2 |
| final full read | 2d79f16 / 34cd461 / 07cf41f | full divergence, current heads | GLM 5.3 on melious (had not read the whole artifact) | 539 s, 79,457 | 0 / 2 / 2 |

| id | Sev | Source | Round | Finding — one line | Status | Evidence |
|---|---|---|---|---|---|---|
| F1 | BUG | codex | 1 | C probe: a commented-out Plausible tag passed the substring match | fixed, locally_verified + externally_reverified (r2) | comments removed before the match; case `probe-commented`; with the old code that case fails |
| F2 | BUG | codex | 1 | C probe: a cut-short reply with HTTP 500 read as a harmless blip | fixed, l_v + e_r (r2) | a real code other than 200 wins over curl's exit; case `probe-cut500` (500, exit 18); old code fails it |
| F3 | RISK | codex, fresh-eyes | 1 | C probe: no `-L`, unlike the build.txt poll | fixed, l_v + e_r (r2) | `curl -sL` |
| F4 | RISK | codex, fresh-eyes | 1 | B: "verify-prod.mjs needs only built-ins" unsupported | fixed, l_v + e_r (r2, r5) | its only import is `node:child_process`; Codex ran it under Node with mocked fetches; guard added, see G1, H1, J1 |
| F5 | RISK | codex | 1 | all: the hook check skipped any `set -` line, so `set -e; npm run build` passed | fixed, l_v + e_r (r2) | only option-only set lines are skipped; the block tests its own counterexample |
| F6 | BUG (prose) | codex; fresh-eyes NIT | 1 | B BUGLOG row still said 0.20 | fixed, e_r (r2) | row reworded |
| F7 | BUG (comment) | fresh-eyes | 1 | B push_once comment promised a wire-hooks.mjs B lacks | fixed, e_r (r2) | site note under the comment |
| F8 | RISK | fresh-eyes | 1 | A test: site addition under a plain 0.22 marker, no note | fixed, e_r (r2) | marker "0.22 plus site additions" and a note |
| F9 | NIT | fresh-eyes | 1 | B S12: the 30 s wait and run counts not asserted | fixed, e_r (r2) | sleep stub logs; asserts one `30` and two runs; break without the wait fails |
| F10 | NIT | fresh-eyes | 1 | C probe failure paths untested | fixed, e_r (r2) | cases notag, commented, cut500 |
| F11 | NIT | fresh-eyes | 1 | A, C wire-hooks.mjs header names another replaced line | kept: template text, byte-identical copy | `cmp` against template 0.22 |
| F12 | NIT | fresh-eyes | 1 | B header: "the gate tests exactly the commit" | fixed, e_r (r2) | site note: the gate here tests nothing |
| F13 | NIT | fresh-eyes | 1 | CI comment "within a minute or so" unmeasured | kept: the template's wording | fresh-eyes measured 1 to 2 min locally |
| G1 | BUG | codex; fresh-eyes NIT | 2 | B import guard missed template-literal and multi-line imports | fixed (strict shape rule), then H1, J1 | — |
| G2 | BUG | fresh-eyes (as RISK), host | 2 | C: the bash comment-strip loop took minutes on a homepage-sized page | fixed, l_v + e_r (r3) | awk: 0.04 s on a production build of the homepage; case `probe-big`; the old loop failed it at 252 s |
| G3 | RISK | codex; fresh-eyes NIT | 2 | C: a `<!--` in a script before the tag hides it | re-sorted: rare | the homepage's 30 comments all follow the tag; fails loud; BUGLOG row |
| G4 | NIT | fresh-eyes | 2 | C probe cases shared a fixture | fixed, e_r (r3) | one fixture per case |
| G5 | NIT | fresh-eyes | 2 | hook check: `set -e  # comment` counted as a step | fixed, e_r (r3) | trailing comment allowed; probe line added |
| G6 | NIT | fresh-eyes | 2 | B test header incomplete | fixed, e_r (r3) | header names every addition |
| G7 | NIT | fresh-eyes | 2 | B BUGLOG 2026-10-08 row reads as wholly open | follow-up | the inherited text it describes is still there |
| H1 | BUG | codex; fresh-eyes NIT | 3 | B guard: a two-line re-export passed (kind smoke-import-guard, back) | cut, then J1 | word rule: any line holding import/export/require must be one static node: import |
| H2 | RISK | fresh-eyes | 3 | C: no case had a comment closing before the tag | fixed, e_r (r4) | two `<head>` comments before the tag in probe-big; a never-close strip fails it |
| H3 | NIT | fresh-eyes | 3 | B guard had no committed counterexample | fixed, e_r (r4) | counterexample in the block |
| H4 | NIT | fresh-eyes | 3 | hook-probe message named one of two failures | fixed, e_r (r4) | prints what the filter took |
| H5 | NIT | fresh-eyes | 3 | C comments blamed bash 3.2 only | fixed, e_r (r4) | "3.2 and 5" |
| H6 | NIT | fresh-eyes | 3 | C probe-big 60 s limit on a loaded machine | fixed, e_r (r4) | 120 s |
| H7 | NIT | fresh-eyes | 3 | C test: `i`, `t0` not local | follow-up | no later case reads them (Codex r4) |
| J1 | BUG | codex | 4 | B guard: aliased createRequire from node:module passed (same kind, after its cut) | fixed, l_v + e_r (r5: codex, GLM 5.3) | exact list `smoke_allowed`: only today's import line may hold the words; counterexamples flag lines 1 and 3 |
| K1 | NIT | GLM 5.3 | 5 | B: the counterexample message misnames an over-flag | fixed, l_v; read by the final full read | "did not flag exactly lines 1 and 3" |
| K2 | NIT | GLM 5.3 | 5 | B: `awk -v` would mangle a backslash in the list | fixed, l_v; read by the final full read | list passed through ENVIRON |
| L1 | RISK | GLM 5.3 | final | A: test marker "0.22 plus site additions" vs ship.sh "0.22" | refuted | `version_of` takes the first word; the suite passes |
| L2 | RISK | GLM 5.3 | final | C probe hard-codes `src="https://plausible.` | follow-up: unchanged from before this PR | the live host plausible.genai-wednesday.de matches; a host change fails loud |
| L3 | NIT | GLM 5.3 | final | C: wall-clock bound in probe-big | kept | the only guard against a slow strip; passed at load averages of 130 to 400 |
| L4 | NIT | GLM 5.3 | final | B S12: `$D` vs `pwd -P` | refuted | the test's root comes from `pwd -P`; the case passes on macOS |

UNVERIFIABLE entries were asked in several rounds (curl's code after a redirect to a dead host, a browser's reading of odd comments, CI timings); none was confirmed as a finding.

Waivers and deferrals: none.
Follow-ups: G7 (B BUGLOG row); H7 (C locals); L2 (C probe host prefix); G3 (C BUGLOG row, added in this PR).
Notes:
- Degraded: GLM 5.3 failed in rounds 1 to 4 ("Insufficient balance … Available: 0"), and its ollama stand-in hit its weekly limit. Codex was the only cross-model seat there, beside the fresh-eyes Opus pass in rounds 1 to 3.
- Round 4 was earned by H1 (kind smoke-import-guard, BUG) and H2 (kind probe-strip-test, earning RISK), with a cut. Round 5 was earned by J1 (smoke-import-guard again), with `--cut "the word rule replaced by an exact list of allowed lines"`.
- The convergence stop (a kind back after its cut) was met at J1. The exact list is the strictest form of that guard; had round 5 broken it, the guard would have come out and the item gone to the maintainer.
- Final full read: GLM 5.3 over the whole divergence at the current heads. A first attempt got an artifact cut short by a builder error (another session had moved Site A's `main`), so the builder now diffs from the merge base.
- No wording pass ran: the record prose (this trail, the PR text, the plan's row 4) was written after the last round and has had no reviewer's read.
