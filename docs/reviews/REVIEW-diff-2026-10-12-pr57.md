# DIFF review — karero/croftweaver-site#57 — /proof: a shorter Gemini passage that says why the answers come from a signed-in account

Base `1ec53b5` · depth: **Normal** (shipped page copy with factual claims) · verdict: **OPEN** — round 1 has not run yet · authority used: POST AUTHORITY and BRANCH-COMMIT AUTHORITY — this session opened the pull request and created the branch; WORKTREE-WRITE AUTHORITY — the owner's messages of 2026-10-12: "They still do not support automated testing with a not logged in users, that's why I manually tested it. I think that's worth mentioning." and "It's a lot af text about gemini", then the two facts this session asked for before building.

Files in the change: `src/data/proof.ts`, `src/pages/proof.astro`, and this file.

| Round | Head | Artifact | Reviewers | seconds, tokens per seat | BUG/RISK/NIT (all seats, before dedup) |
|---|---|---|---|---|---|

| id | Sev | Source | Round | Finding — one line | Status | Evidence |
|---|---|---|---|---|---|---|

## Where each fact in the passage comes from

| Fact | Source | Who can check it |
|---|---|---|
| Without a sign-in, in a private browser window on 12 October 2026, the Gemini web app showed its results too briefly to read | the owner, 2026-10-12: "sign-in request, private window on the computer", "it briefly shows results", "it shows the screenshotteed page again – no time to read the results, and you cannot scroll", "so, NOT possible to use, not supported". The owner's screenshot shows the Gemini start page with "ki treffen in münchen" typed in and "Sign in to connect to Google apps, create images, and more" | the owner; the fresh-eyes reviewer was given the image |
| The maintainer asked by hand, signed in | the owner, 2026-10-12: "that's why I manually tested it"; the screenshot of the first answer shows "Your organization's chats aren't used to improve our models" | the owner; the image shows it for the first answer |
| The answer of 10 October 2026: model label, question, four events, first among the communities, six source labels, four of them on passages about others | unchanged from karero/croftweaver-site#53: the owner's screenshot, read by the author and by that review's fresh-eyes seat | the owner |
| Asked again on 12 October 2026, it named GenAI Wednesday too | the owner: "both runs named it" | the owner only |
| Why the check does not ask Gemini with web search | the toolkit's guide at tag `v0.31`, linked from the page | anyone |

What left the passage: "which lies in Google's terms for the Gemini API" (the linked guide says it), "on a phone", "nothing else of it was recorded" (now "by the maintainer's report"), and "the first was to a question the check does not ask" (the check's two questions are listed above the table).

## Test records (head `e83afd3`)

| Run | Result | Exit status |
|---|---|---|
| `npm ci` | installed, 0 vulnerabilities | 0 |
| `npm run check` | 0 errors, 0 warnings, 0 hints | 0 |
| `npx playwright test` (its web server runs `npm run build` first) | 223 passed, none skipped or failed | 0 |
| `git push` (the pre-push gate: build, then the tests) | 223 passed; "pre-push gate passed" | 0 |

The change adds no build check and no test: it changes sentences and one date.

Waivers: none. Deferrals: none. Follow-ups: none yet.

Notes:
- Data check: the artifact holds no credentials, and the repository is public. Destinations: Codex and GLM 5.3 on melious, as in the gates of karero/croftweaver-site#46, #53 and #54 earlier in the same session, where the owner said "Do it" (2026-10-12) to a review described as "Codex plus GLM 5.3".
- The owner's two screenshots are not in this repository and not published.
