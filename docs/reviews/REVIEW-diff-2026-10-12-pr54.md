# DIFF review — karero/croftweaver-site#54 — /proof: the rise in clicks had begun before the first event

Base `caf31ab` · depth: **Normal** (shipped page copy with figures, and a build check) · verdict: **OPEN** — round 1 has not run yet · authority used: POST AUTHORITY and BRANCH-COMMIT AUTHORITY — this session opened the pull request and created the branch; WORKTREE-WRITE AUTHORITY — the owner's instruction of 2026-10-12: "add the sentence on when the rise began".

Files in the change: `src/data/proof.ts`, `src/pages/proof.astro`, and this file.

| Round | Head | Artifact | Reviewers | seconds, tokens per seat | BUG/RISK/NIT (all seats, before dedup) |
|---|---|---|---|---|---|

| id | Sev | Source | Round | Finding — one line | Status | Evidence |
|---|---|---|---|---|---|---|

## Where each figure on the page comes from

| Figure | Source | Who can check it |
|---|---|---|
| 48 clicks in the 28 days up to 16 June 2026 (20 May to 16 June) | computed in `src/data/proof.ts` from `public/data/genai-wednesday-de-search-console.csv`, the same rolling totals the chart draws | anyone |
| 16 clicks in the 28 days up to 2 June 2026 (6 May to 2 June) | the same | anyone |
| 16 June is the day before the first event | `EVENTS` in `src/data/proof.ts` (17 June 2026), from the event page read for karero/croftweaver-site#53 | anyone |

The author also added the days up by hand from the file before writing the code: 48 and 16.

## Test records (head `39ecdc5`)

The reviewers of each round are given the complete output of that round's runs in their brief.

| Run | Result | Exit status |
|---|---|---|
| `npm ci` | installed, 0 vulnerabilities | 0 |
| `npm run check` | 0 errors, 0 warnings, 0 hints | 0 |
| `npx playwright test` (its web server runs `npm run build` first) | 222 passed, none skipped or failed | 0 |
| `git push` (the pre-push gate: build, then the tests) | 222 passed; "pre-push gate passed" | 0 |
| Probe: 32 clicks added on 2026-05-10 in the Search Console file, then `npx astro build` | stopped with "the 28 days up to 2026-06-16 had 48 clicks and the 28 days up to 2026-06-02 had 48, so /proof may no longer say the rise had begun before the first event." | 1, as intended |

After the probe the file was restored with `git checkout`, and `git status` showed no change. The other new stop, for a file with no full 28 days up to one of the two days, was not made to fail: every change that reaches it trips an earlier check first.

Waivers: none. Deferrals: none. Follow-ups: none yet.

Notes:
- Data check: the artifact holds no credentials, and the repository is public. Destinations: Codex and GLM 5.3 on melious, as in the gates of karero/croftweaver-site#46 and #53 earlier in the same session, where the owner said "Do it" (2026-10-12) to a review described as "Codex plus GLM 5.3".
