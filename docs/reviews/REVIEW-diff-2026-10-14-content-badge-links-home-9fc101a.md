# DIFF review — croftweaver-site `content/badge-links-home` — the badge code on /partner-assets links to the home page

Base `origin/main` (`cc206be`) · depth: **Normal** (runtime copy and code on a live page, and the test that pins it) · verdict: **OPEN** · authority used: BRANCH-COMMIT — atom A, this session created the branch

| Round | Head | Artifact | Reviewers: CLI version, model, effort, sandbox | seconds, tokens per seat | BUG/RISK/NIT |
|---|---|---|---|---|---|
| 1 | pending | full, `origin/main...HEAD` without `docs/reviews/` | pending | pending | pending |

| id | Sev | Source | Round | Finding — one line | Status | Evidence |
|---|---|---|---|---|---|---|

Waivers: none. Deferrals: none. Follow-ups: none yet.

## Test record, taken before round 1

- Command: `npx playwright test --reporter=line` in `~/Devel/croftweaver-site`, on the change before it was committed (the committed `9fc101a` has the same content).
- Result: 274 passed, exit status 0; none skipped, none flaky. The partner-assets test ("partner assets: the code to paste works, and the downloads are exactly the files of the kit") is among them.
- That test can fail: with only the page's address set back to `/partner-assets?ref=badge`, `npx playwright test tests/navigation.spec.ts -g "partner assets: the code to paste"` failed (1 failed) at `tests/navigation.spec.ts:104`, "does not link to the home page". The page was then restored.
- The whole output is in the PR's review comment.

## Files the change takes

`src/pages/partner-assets.astro` and `tests/navigation.spec.ts`, plus this trail.

Notes:
- The owner decided on 2026-10-14 that the badge links to the home page for now, not to a landing page of its own.
- Data check: the diff holds no credentials and no private names. Destinations: Codex, and GLM 5.3 on Melious, the owner's standing pair; the repository is public.
