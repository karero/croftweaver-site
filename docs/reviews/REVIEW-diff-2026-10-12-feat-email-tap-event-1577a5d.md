# DIFF review — feat/email-tap-event — clicks on the site's email address are counted as an "Email Tap" event

Base `2ee1914` (origin/main) · depth: **High** (privacy text and a new data event) · verdict: **OPEN** — the round-1 fixes are not re-verified · authority used: BRANCH-COMMIT — atom A; POST AUTHORITY — atom A (this session opens the PR). GATED-THIS-DIFF is not claimed.

| Round | Head | Artifact | Reviewers | seconds, tokens per seat | BUG/RISK/NIT |
|---|---|---|---|---|---|
| 1 | `1577a5d` | full `origin/main...1577a5d` | codex-cli 0.162.1 gpt-6.1-sol high read-only; melious glm-5.3 | codex 206 s / 59,031; melious 179 s / 16,884 | 1 / 3 / 1 |

| id | Sev | Source | Round | Finding — one line | Status | Evidence |
|---|---|---|---|---|---|---|
| E1 | BUG | codex | 1 | "the handler cannot throw" was false: a throwing or non-callable tracker propagated | fixed | the call is in try/catch; the test covers a throwing tracker and a non-function |
| E2 | RISK | codex | 1 | the "no stub" test did not enforce it: a production build inherits the stub | fixed | the test deletes `window.plausible` and asserts `undefined` before the click |
| E3 | RISK | codex | 1 | tests clicked only the first of the page's email links | fixed | every link is clicked; each click adds exactly one call |
| E4 | RISK | codex, melious | 1 | the transmitted payload is unsupported | verified | the live per-site script (v33), run in a stubbed browser, sent `{n:"Email Tap", v:33, u:<page>, d:"croftweaver.com", r:<referrer>}` to `/api/event`; no props, no address |
| E5 | NIT | melious | 1 | a README code span was split across a line | fixed | one span |

Waivers: none. Deferrals: none. Follow-ups: the goal named "Email Tap" is set by the owner in the instance (README); until then events are stored but not shown.

Notes: fresh-eyes not run; the sister sites send the same event. Suite 218 passed, `astro check` 0 errors, analytics gate passes. `main` was merged into the branch at `66752d0` (the header PR).
