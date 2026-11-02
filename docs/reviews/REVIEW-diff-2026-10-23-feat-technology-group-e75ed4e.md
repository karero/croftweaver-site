# DIFF review — branch feat/technology-group — Security and What It Runs On become the Technology group
Base `414b9b1` (origin/main, PR 124 merged) · depth: Normal (shipped markup and styles; nothing in the High row) · verdict: CLEAN for code head `e75ed4e` once the one comment correction (T1) is in; no BUG, three RISKs (one fixed, two refuted), one NIT refuted · authority used: WORKTREE-WRITE and BRANCH-COMMIT, atom A for both (this session created the worktree `croftweaver-site-tech` and the branch); the owner's OK to send the diff to both reviewers, quoted in Notes · one round only, by the owner's instruction ("one round of Codex and GLM 5.3 on melious.ai, no fresh-eyes pass")

| Round | Head | Artifact | Reviewers: CLI version, model, effort, sandbox | seconds, tokens per seat | BUG/RISK/NIT |
|---|---|---|---|---|---|
| 1 | `e75ed4e` | full change (`414b9b1...e75ed4e`, 2 files, +14/−7) | Codex gpt-6.1-sol, config effort, read-only (Chromium could not launch in its sandbox, `EPERM`); GLM 5.3 on melious.ai, HTTP, text only | codex 149 s / 71,408; GLM 65 s / 8,926 | 0 / 3 / 1 (de-duplicated; both seats ran) |

Tokens logged for the gate: 80,334. Both seats of the standard pair ran: `reviewers: codex OK, melious OK`.

| id | Sev | Source | Round | Finding | Status | Evidence |
|---|---|---|---|---|---|---|
| T1 | RISK | Codex, GLM | 1 | the fold's clearance figures (809 px needed, 55 px spare at 864 px, Verdana close to DejaVu Sans) were unverifiable from the diff; the bold current-page states are not covered | fixed (the comment); the claim reproduced and corrected | measured here on a fresh build of `e75ed4e` (`dist/build.txt` names it), Chromium, 864 px window, one row in every case: Verdana nav 769 px on the home page (needs 809 with the 40 px header padding, spare 55), 782 px on `/security` and `/what-it-runs-on`, 784 px on `/checks` where a plain link is bold (needs 824, spare 40); Tahoma 700, Georgia 714, default font 702 on the home page. The comment claimed 55 px for every page; it now says 809 px on the home page, 824 px on a page whose current link is bold, 40 to 55 px spare. The plan's rule is at least 40 px, so the margin holds, with none to spare on `/checks` in Verdana. 860 px folds to the Menu in every font |
| T2 | RISK | GLM | 1 | the comment says the spec keeps the two numbers equal; the spec might pin the old 52rem value instead | refuted | `tests/navigation.spec.ts` reads both numbers from `Header.astro` and expects them equal (not a constant); the whole suite passed on `e75ed4e` (421), and Codex ran the equality test and an in-memory mismatched-threshold control, which failed as it should |
| T3 | RISK | GLM | 1 | the first link of the group, `/what-it-runs-on`, might 404 | refuted | `src/pages/what-it-runs-on.astro` exists; merge `4a25cc8` is an ancestor of base `414b9b1` (Codex: `git merge-base --is-ancestor`); `dist/what-it-runs-on.html` is built |
| T4 | NIT | GLM | 1 | 53.99rem is 863.84 px, so "864px leaves about 55px" is 0.2 px optimistic | refuted | the text says "about"; the measured spare at 864 px is whole pixels, 40 to 55 |

Not done, on purpose: a test that asserts one row in a wide font (Codex's fix for T1). Verdana is not installed on the Linux CI runner, so such a test would pass or fail by the runner's fonts, not by the code; the narrowest-unfolded-width row test stays in the default font. The measurement above is the check, kept in the plan's hub (`site-navigation/measure-header.cjs`). The owner can overrule this; it is a judgment, not a measured fact.

Waivers and deferrals: the wide-font row test (T1's suggested fix) waived by the owner, in chat, 2026-10-23: "I accept T1 as fixed and the wide-font test left out (waived)." Reason: Verdana is not on the CI runner, so such a test would follow the runner's fonts, not the code. No deferrals.

Follow-ups:
- At 864 px the header has 40 px to spare in Verdana on a page whose current link is bold. A seventh header item or a longer label needs the fold raised again; the plan's step list holds no such item.

Notes:
- The owner's OK to send the diff to Codex and GLM 5.3 on melious.ai, quoted: "Review it at Normal depth with one round of Codex and GLM 5.3 on melious.ai, no fresh-eyes pass. I OK sending the diff to both."
- Codex's Chromium launch failed in its sandbox (`EPERM` on its artifacts directory), so it ran no browser test; the measurements above are this session's.
- The fix after round 1 is a comment only (`src/components/Header.astro`, the fold comment); no behaviour changed.
