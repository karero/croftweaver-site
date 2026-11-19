# DIFF review: croftweaver.com brought to toolkit 0.36, with the release's public pages
Base `2008226` · depth: Normal · verdict: CLEAN at round 4 (no BUG or RISK open; one NIT fixed after it) · 4 rounds

Task: the tests, scripts, bundled skills and documents of the site brought to release 0.36 (tag `v0.36`, `39118dc7`), and the release's Step 7 on the public pages. The change touches `PUBLISHING.md`, `package.json`, `scripts/` (including `ship.sh`) and `tests/`; it does not touch `AGENTS.md`, `ci.yml` or `.claude/settings.json`.

Depth and seats: Normal. The diff takes the deploy script `scripts/ship.sh` and a deploy document, which is the "deploy or infra" row, so the seats are Codex gpt-6.1-sol (read-only, medium) and GLM 5.3 on melious.ai every round (REVIEW-RULES). Round 1 also had a fresh-eyes Sonnet subagent, which compared every copied file with the v0.36 template byte for byte and read the public pages against the tag. The repo is public and no secret is in the diff (grep). Evidence for rounds 2 to 4 was sent in files of READs: template differences between v0.35 and v0.36 for the files the checklist breaks use, the `playwright.config.ts` difference, a run of `tests/check_ship_push.sh` with `SHIP_TEST_TTY=1` (exit 0), the rulesets of the repository, the analytics stub in `Base.astro`, and the push lines of `ship.sh`.

| Round | Head | Seconds, tokens |
|---|---|---|
| 1 | `b1ccd4a` | Codex 209 s / 102,864; GLM 746 s / 83,573; fresh-eyes 541 s / 232,638 |
| 2 | `9b58631` | Codex 172 s / 82,615; GLM 193 s / 25,389 |
| 3 | `HEAD` of round 2 plus wording | Codex 56 s / 30,858; GLM 53 s / 6,897 |
| 4 | after the cut | Codex 67 s / 35,757; GLM 129 s / 17,703 |

Judgments sent to the reviewers to challenge: the guard of the checklist page names the 0.36 suite commit without running the breaks again (the files they use are byte-identical at 0.35 and 0.36); `tests/icons.spec.ts` keeps one site edit, the logo read from `COMPANY.logo` (owner decision of 2026-10-13); `AGENTS.md`, `scripts/deploy.sh`, `scripts/verify.mjs`, `tests/check_deploy.sh` are left, each with a `left_out:` reason; `PUBLISHING.md` takes only the "Ship again?" paragraph, reworded for this site.

| Sev | Round | Finding | Status | Evidence |
|---|---|---|---|---|
| RISK | 1 | Codex: advancing the checklist guard to 39118dc7 without rerunning the breaks is unsupported | refuted | The template files the breaks use show no difference between v0.35 and v0.36; `playwright.config.ts` differs in the cloud-browser fallback only |
| BUG | 1 | Codex: `scripts/build-marker.mjs:29`, "svgo does not hide it", is false for `forceAbsolutePath`; and the signature test matches text inside SVG metadata | deferred | Template file, byte-identical to v0.36 (fresh-eyes `cmp`); sent to the kit manager |
| RISK | 1 | Codex: the new terminal cases of `check_ship_push.sh` are skipped in the site's CI | refuted | The kit's own CI says a site's CI skips them by design; run here with `SHIP_TEST_TTY=1`: exit 0, 719 checks, the question on a fake terminal named |
| BUG | 1 | Codex: `ship.sh` sends readers to `PUBLISHING.md` for watch paths, and the site's copy lacks that text; fresh-eyes: the "Ship again?" retry pushes straight to `main`, which the site's ruleset refuses | fixed | Paragraph added to `PUBLISHING.md`: answer n on this site, and the watch-path note; `left_out:` reason updated |
| BUG | 1 | Codex, GLM: README rows 5k and 11 name a review trail and `#PRNUM` that did not exist yet | fixed | This file; `#PRNUM` filled once the PR is open; row 5k is `open` until the merge |
| RISK | 1 | GLM: `email.spec.ts` marker `plausible.init`; `go_selftest` fixtures; signatures in `build-marker.mjs` unsupported | refuted / deferred | `Base.astro:147` holds the marker and the full run passes it; `check_analytics_gate.sh` green; the signatures are in the template file (kit manager) |
| NIT | 1 | `--check` comment in `build-marker.mjs` | deferred | Template file; kit manager |
| NIT | 1 | `icons.spec.ts` ICONS comment; README "and its fixture"; "two wording changes" (three); `# changed:` lines for the other site-edited copies; roadmap "analytics and deploy checks" | fixed | Commit `9b58631` |
| NIT | 1 | fresh-eyes: the icons logo check reads the config, not the page, so it cannot fail if the home page drops its `image` | not changed | Deliberate: the owner's decision of 2026-10-13 is recorded in `tests/TESTS-VERSION` and README row 11; same as at 0.35 |
| RISK | 2 | GLM: "the live site stays as it was" after a refused retry rests on an unproved atomic push | fixed | First reworded (atomic push), then cut in round 3 |
| NIT | 2 | GLM: "only 0.36's paragraph is in it" against 0.35's ship wait; watch-path sentence advised a build the site should not make | fixed | README row 11, `tests/TESTS-VERSION`, `PUBLISHING.md` |
| RISK | 3 | Codex, GLM: the reworded claim still hid that the first upload may be building, and said nothing of the local commit | fixed | Cut, not patched: the paragraph now says only that the answer is n, that GitHub would refuse the upload, where to look, and the watch-path note for y |
| NIT | 4 | GLM: one over-long line in `PUBLISHING.md` | fixed | Re-wrapped; whitespace only |

Round 4 earned by `ship-again-outcome-claim`, a kind that came back in rounds 2 and 3, so the third fix was a cut.

Waivers and deferrals: the BUGs and NITs marked deferred are in files taken verbatim from the template; none was introduced by this change, and the brief says not to fix the kit here. They were sent to the manager. UNVERIFIABLE entries (the Cloudflare watch-path rule, GitHub's refusal under the ruleset, the Node release dates, the text of the release notes) are claims about outside systems; the paragraph in `PUBLISHING.md` states them as the template does, with its documentation link.

After the last edit: see the PR for the run of `npm ci`, `npm run check`, `npm run build`, the `tests/check_*.sh` scripts and the full Playwright suite.
