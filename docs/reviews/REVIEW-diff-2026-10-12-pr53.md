# DIFF review — karero/croftweaver-site#53 — /proof: the events around the peak in clicks, and two Gemini answers asked by hand

Base `22af6e3` · depth: **Normal** (shipped page copy with factual claims, and two build checks; no legal text of the site's own) · verdict: **OPEN** — round 1 has not run yet · authority used: POST AUTHORITY and BRANCH-COMMIT AUTHORITY — this session opened the pull request and created the branch; WORKTREE-WRITE AUTHORITY — the owner's instructions of 2026-10-12: "Can we integrate the results?" (the Gemini answers) and "I think we need to add on https://croftweaver.com/proof that there were no events during the summer and early autumn."

Files in the change: `src/data/proof.ts`, `src/pages/proof.astro`, and this file.

| Round | Head | Artifact | Reviewers | seconds, tokens per seat | BUG/RISK/NIT (all seats, before dedup) |
|---|---|---|---|---|---|

| id | Sev | Source | Round | Finding — one line | Status | Evidence |
|---|---|---|---|---|---|---|

## Where each fact on the page comes from

| Fact | Source | Who can check it |
|---|---|---|
| Events on 17 June and 1 July 2026 | `https://genai-wednesday.de/events/2026-06-17-albert-bozesan` and `/events/2026-07-01-mathias-schlolaut` (the `startDate` in each page's Event markup), read 2026-10-12 | anyone |
| No event after 1 July up to 29 September 2026 | the site's sitemap lists no later event page, and its home page said "To Be Announced" on 2026-10-12; the owner: "there were no events during the summer and early autumn" | the sitemap and home page: anyone; that no unlisted event took place: the owner only |
| Both events inside the best 28 days (16 June to 13 July 2026) | computed from `public/data/genai-wednesday-de-search-console.csv`; the build stops if it is not so | anyone |
| Gemini answer of 10 October 2026: model label, question, four conferences first, first among the communities, six source labels | the owner's screenshot, read by the author; the owner: "Screenshot is from Oct 10" | the owner; the fresh-eyes reviewer was given the image |
| Gemini answer of 12 October 2026 named GenAI Wednesday | the owner: "both runs named it" | the owner only |
| Why the check does not ask Gemini with web search | the toolkit, `skills/search-console-insights/scripts/geo_check.py` (`FINDS_SUPPORTED`) and `references/geo-check.md`; `https://ai.google.dev/gemini-api/terms`, read 2026-10-12 (last updated 2026-04-28) | anyone |

## Test records (head `4fa38c2`)

The complete output of each run is kept with the review's raw output and goes into the pull request's review comment.

| Run | Result | Exit status |
|---|---|---|
| `npm ci` | installed, 0 vulnerabilities | 0 |
| `npm run check` | 0 errors, 0 warnings, 0 hints | 0 |
| `npx playwright test` (its web server runs `npm run build` first) | 222 passed, none skipped or failed | 0 |
| `git push` (the pre-push gate: build, then the tests) | 222 passed; "pre-push gate passed" | 0 |
| Probe 1: the second event day set to 2026-08-01, then `npx astro build` | stopped with "the event of 2026-08-01 is outside the best 28 days (2026-06-16 to 2026-07-13)…" | 1, as intended |
| Probe 2: `readOn` set to 2026-09-01, then `npx astro build` | stopped with "the file now runs to 2026-09-29, past 2026-09-01…" | 1, as intended |

After each probe the file was restored with `git checkout -- src/data/proof.ts`; `git status` then showed no change. The probe record keeps the error lines and the exit status, not the whole build output.

Waivers: none. Deferrals: none. Follow-ups: none yet.

Notes:
- Data check: the artifact holds no credentials, and the repository is public. Destinations: Codex and GLM 5.3 on melious, as in the gate of karero/croftweaver-site#46 earlier in the same session, where the owner said "Do it" (2026-10-12) to a review described as "Codex plus GLM 5.3".
- The owner's screenshot is not in this repository and not published.
