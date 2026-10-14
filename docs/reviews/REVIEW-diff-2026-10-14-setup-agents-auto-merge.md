# DIFF review — croftweaver-site `setup/agents-auto-merge` — AGENTS.md §2: auto-merge on the owner's request, after the preview look

Base `origin/main` (`8dd0a5c`) · depth: **Normal** (an instruction file that agents load; never Light) · verdict: **CLEAN** (no open BUG or RISK; one round 4 NIT fixed after the last round, unreviewed) · authority used: BRANCH-COMMIT and POST AUTHORITY — this session created the branch and opens the pull request

| Round | Head | Reviewers | seconds, tokens | BUG/RISK/NIT |
|---|---|---|---|---|
| 1 | `35f4110` | codex-cli 0.162.1 `gpt-6.1-sol` effort medium, read-only · `glm-5.3` on Melious, HTTP API | codex 94 s, 27,975 · melious 143 s, 8,528 | 0 / 3 / 2 |
| 2 | `9fc155e` | same pair, with round 1's findings to verify | codex 90 s, 34,965 · melious 84 s, 8,721 | 0 / 3 / 1 |
| 3 | `3c7a961` | same pair, with round 2's findings to verify | codex 120 s, 27,686 · melious 143 s, 9,717 | 0 / 2 / 1 |
| 4 | `756ddae` | same pair, with round 3's findings to verify | codex 97 s, 26,339 · melious 88 s, 8,818 | 0 / 1 / 1 |

**4 rounds, 14 findings** (0 BUG, 9 RISK, 5 NIT). Every artifact was the full diff `origin/main...<head>`, without `docs/reviews/`, after a short context note giving the facts below.

| id | Sev | Source | Round | Finding — one line | Status |
|---|---|---|---|---|---|
| C1 | RISK | codex | 1 | The preview look was not tied to a commit | fixed in `9fc155e`: "the preview of its latest commit" |
| C2 | RISK | codex | 1, repeated in 2, 3, 4 | The ruleset and settings the paragraph relies on were not shown | refuted; evidence below, read live |
| M1 | RISK | melious | 1 | The merge condition was stated as a closed list | fixed in `9fc155e`: "everything the ruleset on `main` requires", today's checks as the example |
| M2 | NIT | melious | 1 | "the toolkit's setup keeps it off" could be read as a GitHub setting | fixed in `9fc155e` |
| M3 | NIT | melious | 1 | "(next point)" was a positional reference | fixed in `9fc155e`: names "Preview before merging" |
| R2a | RISK | codex and melious, each on its own | 2 | With auto-merge on, a commit pushed after the look merges unseen | fixed in `3c7a961`: turn auto-merge off before pushing, on again after the new look |
| R2b | NIT | melious | 2 | "no conflict" is not a ruleset requirement | fixed in `3c7a961` |
| R3a | RISK | melious | 3 | The push rule bound only the assistant; anyone else's push would merge unseen | fixed in `756ddae`: "this holds for everyone" |
| R3b | NIT | melious | 3 | The docs/ exception was unclear for the new look | fixed in `756ddae`: stated once, "where one is needed" |
| R4 | NIT | melious | 4 | Turning auto-merge back on read as needing a new ask from the owner | fixed after round 4: "(the owner's ask for that pull request still stands)"; not reviewed again |

Counted once each in the 14: C2 in every round it was raised (4), R2a once per reviewer (2).

Waivers: none. Deferrals: none. Follow-ups: none.

## Evidence for C2, read by the author on 2026-10-14

- `gh api repos/karero/croftweaver-site/rules/branches/main` (the rules GitHub applies to `main`): `deletion`, `non_fast_forward`, `pull_request`, `required_status_checks` with `test` (any source) and `Cloudflare Pages` (integration 85455), all from ruleset 24992030.
- `gh api repos/karero/croftweaver-site/rulesets/24992030`: enforcement active, target `~DEFAULT_BRANCH`, no bypass actors.
- `gh api repos/karero/croftweaver-site`: `allow_auto_merge` true, `allow_merge_commit` true.
- Enforcement seen at work: on 2026-10-14, karero/croftweaver-site#81 showed `mergeStateStatus` BLOCKED while `test` was still running, and could merge once it passed. karero/croftweaver-site#83, merged after `Cloudflare Pages` became required, had both checks succeed (app 85455 and 15368).
- `gh pr merge --help` on this machine lists `--auto`, `--disable-auto` and `--match-head-commit`.

## Test record

`npm run check`: 0 errors. `npm run build`: clean. `npx playwright test`: 274 passed, none skipped, on `35f4110`. Later commits change only the same paragraph of `AGENTS.md`, which no test reads.

## Files the change takes

`AGENTS.md`, plus this trail.

Notes:
- The owner asked for this paragraph in chat on 2026-10-14, after allowing auto-merge and making Cloudflare Pages a required check the same day. The toolkit's `website-team-setup` keeps auto-merge off; the owner said the general setup stays that way.
- Data check: no credentials, no private names. Destinations: Codex, and GLM 5.3 on Melious, the owner's standing pair; this repository has gone to Melious before (the #77 and #80 trails); it is public.
