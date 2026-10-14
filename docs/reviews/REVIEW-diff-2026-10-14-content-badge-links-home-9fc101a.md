# DIFF review — croftweaver-site `content/badge-links-home` — the badge code on /partner-assets links to the home page

Base `origin/main` (`4bb7798`) · depth: **Normal** (runtime copy and code on a live page, and the test that pins it) · verdict: **CLEAN** · authority used: BRANCH-COMMIT and POST AUTHORITY — atom A, this session created the branch and opens the pull request; GATED-THIS-DIFF — atom A, round 1 saw the change in full

| Round | Head | Artifact | Reviewers: CLI version, model, effort, sandbox | seconds, tokens per seat | BUG/RISK/NIT |
|---|---|---|---|---|---|
| 1 | `0421fdc` | full, `origin/main...0421fdc` without `docs/reviews/` | codex-cli 0.162.1, `gpt-6.1-sol`, effort from its config file, read-only · `glm-5.3` on Melious, HTTP API, text only · fresh-eyes: a `sonnet` sub-agent with no shared context, read-only | codex 201 s, 61,495 · melious 52 s, 9,383 · fresh-eyes 48 s, 102,722 | 0 / 1 / 0 |

| id | Sev | Source | Round | Finding — one line | Status | Evidence |
|---|---|---|---|---|---|---|
| F1 | RISK | codex (melious and fresh-eyes listed it as UNVERIFIABLE, not a finding) | 1 | The comment says `ref=badge` lets the analytics count badge visitors; nothing in the repository shows Plausible reading `ref` | refuted; no change | Plausible's documentation, https://plausible.io/docs/top-referrers, read 2026-10-14: it lists `ref`, `source` and `utm_source` among "the query parameters that are valid and supported by Plausible", and its UTM Source view shows "any traffic tagged with "ref" and "source" parameters". Not observed on this site's own instance; a tagged visit would show it |

Waivers: none. Deferrals: none. Follow-ups: none.

## Test record, taken before round 1

- Command: `npx playwright test --reporter=line` in `~/Devel/croftweaver-site`, on the change before it was committed (the committed `9fc101a` has the same content).
- Result: 274 passed, exit status 0; none skipped, none flaky. The partner-assets test ("partner assets: the code to paste works, and the downloads are exactly the files of the kit") is among them.
- That test can fail: with only the page's address set back to `/partner-assets?ref=badge`, `npx playwright test tests/navigation.spec.ts -g "partner assets: the code to paste"` failed (1 failed) at `tests/navigation.spec.ts:104`, "does not link to the home page". The page was then restored.
- The whole output is in the PR's review comment.
- Round 1 had no BUG and no RISK that called for a fix, so it is the only round (independent-review step 6, stop condition a2).

## Files the change takes

`src/pages/partner-assets.astro` and `tests/navigation.spec.ts`, plus this trail.

Notes:
- The owner decided on 2026-10-14 that the badge links to the home page for now, not to a landing page of its own.
- Data check: the diff holds no credentials and no private names. Destinations: Codex, and GLM 5.3 on Melious, the owner's standing pair; the repository is public.
- The round 1 brief named the base as `cc206be` (the local `main` at the time); the real merge-base is `4bb7798`. The diff the seats read was computed against `origin/main` and is the right one; Codex checked it against the tree.
