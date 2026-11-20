# DIFF review: croftweaver.com tests, scripts and skills brought to Croftweaver 0.38
Base `2cc7876` · depth: High · verdict: CLEAN at round 2 (no BUG or RISK open; one NIT fixed after it) · 2 rounds · made by session `local_a90c4420-ddc5-4561-adbb-e5f68e5b718f`

Task: the site's tests, scripts and bundled skills brought from the 0.36 stamp (`39118dc7`) to release 0.38 (tag `v0.38`, `8e3c002e`), PR karero/croftweaver-site#204. The diff takes `scripts/ship.sh`, which is the "deploy or infra" row of the High depth, so the seats are Codex gpt-6.1-sol (read-only, config effort) and GLM 5.3 on melious.ai in both rounds (REVIEW-RULES). It touches no `AGENTS.md`, `PUBLISHING.md`, workflow or `_headers`.

No fresh-eyes subagent ran: the byte comparison (evidence READ 1 and 2, from `whats-new.sh`'s own file list at the tag) replaces it for a sync (`website-site-sync`, step 8). The B1 result: 20 tracked files byte-identical; the DIFFERS, MISSING and NO PATH lines are site-owned files or files left out on purpose, each named in `tests/TESTS-VERSION`. `PUBLISHING.md`, `AGENTS.md` and `scripts/deploy.sh` were compared by hand (READ 3). One correction to a sentence sent to the reviewers: `tests/check_ship_push.sh` is not byte-identical; it is the 0.38 copy plus the site's hook check.

| Round | Head | Seconds, tokens |
|---|---|---|
| 1 | `3072401` | Codex 219 s / 145,837; GLM 445 s / 130,439 |
| 2 | `0110135`, delta from `3072401` | Codex 128 s / 71,252; GLM 132 s / 32,526 |

Judgments sent to the reviewers to challenge: the breaks behind the checklist page were run on the 0.38 starter, not on this site's own spec copies (as at 0.35 and 0.36); `AGENTS.md` is left out because 0.38's "Ship again?" push is refused by this site's ruleset; `website-new-page` is not bundled (the owner's call).

| Sev | Round | Finding | Status | Evidence |
|---|---|---|---|---|
| BUG | 1 | Codex: `check_page_links.py:126`, a backslash in a link host (`https://other.test\@example.com/p`) is read as an internal link | deferred | Template file, same as v0.38 (READ 2); sent to the kit manager |
| BUG | 1 | Codex: `check_page_links.py:79`, an omitted `</li>` or `</p>` leaves `hidden` active across siblings | deferred | Same |
| BUG | 1 | Codex: `build-marker.mjs:50`, text inside `<desc>` or metadata that looks like Astro's path trips the guard | deferred | Template file, same as v0.38 (READ 1); kit manager |
| RISK | 1 | GLM: the absolute-form strings in `build-marker.mjs` rest on an unchecked claim about svgo's output | deferred | Template comment; kit manager |
| NIT | 1 | GLM: `check_ship_push.sh` case `w3` runs with `wname` still set by `w1b` | deferred | Pattern comes from the v0.38 template (READ 4); kit manager |
| BUG | 1 | Codex: the checklist page says the navigation suite ignores page-relative links; v0.38's resolves them | fixed | `src/data/ai-website-seo-checklist.ts` and the same sentence in `src/data/suites.ts` (/checks); the helper's own test cases, run by Codex in round 2 |
| BUG | 1 | Codex, GLM: README row 11 still said the guard names `39118dc7` and the breaks were not run again | fixed | Row 11 now says `8e3c002e` and that the breaks were run again |
| BUG | 1 | GLM: README row 11 ended with `git diff 8ea17a7 v0.36` | fixed | Now `v0.38` |
| RISK | 1 | GLM: `ship.sh` reads `grep -ob` output as `offset:match` on BSD grep | refuted | `printf 'abcXdef\n' \| grep -ob X` printed `3:X` on this Mac; Codex repeated it in round 2 |
| NIT | 1 | GLM: the breaks doc's Node, npm, Playwright and load figures had no evidence | fixed | READ 7 holds them; every figure is from the runs |
| UNVERIFIABLE | 1 | Evidence READ 3 came back empty | fixed | A wrong path (the two documents sit one folder above `astro/`); READ 3 now holds the 7,000-byte diff of the three files |
| UNVERIFIABLE | 1, 2 | Kit parity, the full suite run, the breaks, svgo's outputs, hosted settings | not changed | READ 1 to 7 are the host's runs; the PR's checks `test` and `Cloudflare Pages` run the suite again |
| RISK | 2 | GLM: the guard's value `8e3c002e` is in no hunk of the round-2 delta | refuted | It is in the round-1 diff, commit `72e393b`: `suiteCommit: '8e3c002e…'` (`src/data/ai-website-seo-checklist.ts:29`), and `suite_commit:` in `tests/TESTS-VERSION` line 1 |
| NIT | 2 | GLM: the checklist's navigation limit dropped "from the site root" | fixed | Now "written from the site root, in full or relative to the current page", as `suites.ts` says; a wording change, no third round |

Deferred BUGs are in files taken verbatim from the template; none was introduced by this change, and the brief says not to fix the kit here. They go to the Croftweaver manager, one line each, and the PR lists them for the owner's word at merge.

After the last edit: `npm run check` (0 errors), `npm run build`, every `tests/check_*.sh` (`SHIP_TEST_TTY=1` for `check_ship_push.sh`: 96 outcomes, 725 checks) and the full Playwright suite (567 passed) ran green; the pre-push gate ran the suite again.
