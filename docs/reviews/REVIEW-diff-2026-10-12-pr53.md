# DIFF review — karero/croftweaver-site#53 — /proof: the events around the peak in clicks, and two Gemini answers asked by hand

Base `22af6e3` · depth: **Normal** (shipped page copy with factual claims, and two build checks; no legal text of the site's own) · verdict: **CLEAN** — no BUG in any round; all 4 RISKs fixed and confirmed by both seats in round 2; of 8 NITs, 7 fixed and 1 refuted · authority used: POST AUTHORITY and BRANCH-COMMIT AUTHORITY — this session opened the pull request and created the branch; WORKTREE-WRITE AUTHORITY — the owner's instructions of 2026-10-12: "Can we integrate the results?" (the Gemini answers) and "I think we need to add on https://croftweaver.com/proof that there were no events during the summer and early autumn."

Files in the change: `src/data/proof.ts`, `src/pages/proof.astro`, `README.md` (from round 1 on), and this file.

| Round | Head | Artifact | Reviewers | seconds, tokens per seat | BUG/RISK/NIT (all seats, before dedup) |
|---|---|---|---|---|---|
| 1 | `a164480` | full `main...a164480` | codex-cli 0.162.1, gpt-6.1-sol, config effort, read-only; melious glm-5.3 (HTTP API, text only); fresh-eyes (Sonnet sub-agent, read-only, given the screenshot and the cited pages) | codex 215 s / 81,347; glm 99 s / 35,813; fresh-eyes 382 s / 189,272 | 0 / 4 / 7 · 13 questions asked, 0 confirmed beyond the findings |
| 2 | `32b3596` | delta `a164480..32b3596`, with the author's record of round 1 | codex (effort medium), melious glm-5.3 | codex 139 s / 67,339; glm 83 s / 38,717 | 0 / 0 / 1 · 7 questions asked, 0 confirmed |

| id | Sev | Source | Round | Finding — one line | Status | Evidence |
|---|---|---|---|---|---|---|
| F1 | RISK | codex | 1 | the page says flatly that the check does not ask Gemini with web search; a refreshed file with such rows would pass and the table would contradict the sentence | fixed `0f36a8b` — locally_verified, externally_reverified (round 2, both seats) | the build stops on such rows; probe 4 below |
| F2 | RISK | melious; as NIT: fresh-eyes | 1 | the page says "both" events while the list behind it could hold one or three days | fixed `0f36a8b` — locally_verified, externally_reverified (round 2, both seats) | the build stops unless `EVENTS` lists exactly two days; probe 3 below |
| F3 | RISK | fresh-eyes | 1 | the page gave Google's API terms as the reason ("counting is analysing") and then counted parts of an answer from the Gemini app, whose own terms were not read; the reason was undercut and the hand-asking looked cleared without support | fixed `0f36a8b` — locally_verified, externally_reverified (round 2, both seats) | the page no longer states or interprets the clause: it links the toolkit's guide at tag `v0.31` (the link answers 200) and says the app is not part of the check. It makes no claim about the app's terms |
| F4 | RISK | fresh-eyes | 1 | "signed in and on a phone" and the question read as true of both answers, but only the first is on record; "one account" asserted the same account twice | fixed `0f36a8b` — locally_verified, externally_reverified (round 2, both seats) | method, question and model now belong to the sentence about 10 October; the second answer is "The maintainer reports…"; "one person", not "one account" |
| F5 | NIT | fresh-eyes | 1 | "six of its passages" can be read as six mentions of the site; four of the six sit on passages about others | fixed `0f36a8b` | "four of them about other communities and platforms" |
| F6 | NIT | fresh-eyes | 1 | "four conferences": the heading is conferences and trade events, and one entry is a networking series | fixed `0f36a8b` | "four events" |
| F7 | NIT | fresh-eyes | 1 | the code comment credited the date to the screenshot, which shows none; the page did not say the screenshot is unpublished | fixed `0f36a8b` | comment corrected; the page says "the maintainer's screenshot, which is not published, and the date from the maintainer" |
| F8 | NIT | fresh-eyes | 1 | "One thing is known about that time" is ambiguous and can read as an explanation | fixed `0f36a8b` | "This much is known" and "Whether the gap explains the fall was not tested". The reviewer's other option, a sentence on when the rise began, is a follow-up for the owner |
| F9 | NIT | fresh-eyes | 1 | no test fails if one of the new build checks is deleted | refuted as an issue of this change; both seats read the reason in round 2 and raised nothing | the file's other build checks have no test either (`LAUNCHED`, `POSITIONS_PERIOD`, `LAB_AVERAGE`, `NOT_RUN`), and the reviewer calls a test optional; each new check was made to fail once, records below |
| F10 | NIT | fresh-eyes | 1 | the README does not say that a refreshed Search Console file needs the event pages read again | fixed `0f36a8b` | README, launch requirements, the `/proof` item |
| F11 | NIT | fresh-eyes | 1 | "As Croftweaver reads … (read on …)" repeats "read" | fixed `0f36a8b` | the sentence is gone with F3 |
| F12 | NIT | melious | 2 | the new README sentence said "in the same file" where the nearest file named is the CSV | fixed `2d9fb65` — locally_verified; read by the prose re-check | README now names `src/data/proof.ts` twice; codex confirmed both paths (`EVENTS` at line 114, `byHand` at line 383) |

## Where each fact on the page comes from

| Fact | Source | Who can check it |
|---|---|---|
| Events on 17 June and 1 July 2026 | `https://genai-wednesday.de/events/2026-06-17-albert-bozesan` and `/events/2026-07-01-mathias-schlolaut` (the `startDate` in each page's Event markup), read 2026-10-12 | anyone |
| No event after 1 July up to 29 September 2026 | the site's sitemap lists no later event page, and its home page said "To Be Announced" on 2026-10-12; the owner: "there were no events during the summer and early autumn" | the sitemap and home page: anyone; that no unlisted event took place: the owner only |
| Both events inside the best 28 days (16 June to 13 July 2026) | computed from `public/data/genai-wednesday-de-search-console.csv`; the build stops if it is not so | anyone |
| Gemini answer of 10 October 2026: model label, question, four events first, first among the communities, six source labels (four of them on passages about others) | the owner's screenshot, read by the author; the owner: "Screenshot is from Oct 10" | the owner; the fresh-eyes reviewer was given the image |
| Gemini answer of 12 October 2026 named GenAI Wednesday | the owner: "both runs named it" | the owner only |
| Why the check does not ask Gemini with web search (since round 1 the page links the guide and no longer restates the clause) | the toolkit, `skills/search-console-insights/scripts/geo_check.py` (`FINDS_SUPPORTED`) and `references/geo-check.md`; `https://ai.google.dev/gemini-api/terms`, read 2026-10-12 (last updated 2026-04-28) | anyone |

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

On head `0f36a8b`, after the round-1 fixes:

| Run | Result | Exit status |
|---|---|---|
| `npm run check` | 0 errors, 0 warnings, 0 hints | 0 |
| `npx playwright test` | 222 passed, none skipped or failed | 0 |
| Probe 3: a third day (2026-06-20) added to `EVENTS`, then `npx astro build` | stopped with "EVENTS lists 3 event days, but /proof says "both" and names two…" | 1, as intended |
| Probe 4: two rows `gemini,with_search` (questions 1 and 2, 2026-10-08) added to the AI-check file, then `npx astro build` | stopped with "…has with_search rows for gemini on 2026-10-08, but /proof says the check does not ask it with web search…" | 1, as intended |

Both files were restored with `git checkout`, and `git status` showed no change. For probes 3 and 4 the whole build output is kept.

On heads `32b3596` and `2d9fb65` the pre-push gate ran again: 222 passed each time, exit status 0.

Waivers: none. Deferrals: none.

Follow-ups, for the owner:
- A reviewer found in the daily figures that the rise began in late May, before the event of 17 June, and that the 28 days after the last event still had 84 clicks. The page keeps "was not tested"; a sentence on when the rise began would be a new figure for the owner to approve.

Notes:
- Round 2 was owed by F1 and F2 (build checks) and by F3 and F4 (what the page claims). It found no BUG and no RISK, so the rounds stop there. Fresh-eyes ran in round 1 only, as Normal depth says.
- Prose re-check, not a round: codex alone (effort medium, 174 s / 56,415 tokens) over `32b3596..2d9fb65`, one README sentence. Result: "No BUG/RISK/NIT findings". The stamp on the review comment relies on codex's chain: round 1 in full, round 2's delta, this re-check. Commits after `2d9fb65` change this file only.
- Questions no reviewer could settle, in every round: the date of the screenshot and the answer of 12 October (the owner's statements), and that no unlisted event took place (the owner's statement).
- Data check: the artifact holds no credentials, and the repository is public. Destinations: Codex and GLM 5.3 on melious, as in the gate of karero/croftweaver-site#46 earlier in the same session, where the owner said "Do it" (2026-10-12) to a review described as "Codex plus GLM 5.3".
- The owner's screenshot is not in this repository and not published.
