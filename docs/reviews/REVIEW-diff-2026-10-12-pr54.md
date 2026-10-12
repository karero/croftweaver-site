# DIFF review — karero/croftweaver-site#54 — /proof: the rise in clicks had begun before the first event

Base `caf31ab` · depth: **Normal** (shipped page copy with figures, and a build check) · verdict: **CLEAN** — no BUG in any round; all 3 RISKs fixed and confirmed by both seats in round 2; of 7 NITs, 6 fixed and 1 refuted · authority used: POST AUTHORITY and BRANCH-COMMIT AUTHORITY — this session opened the pull request and created the branch; WORKTREE-WRITE AUTHORITY — the owner's instruction of 2026-10-12: "add the sentence on when the rise began".

Files in the change: `src/data/proof.ts`, `src/pages/proof.astro`, `tests/a11y.spec.ts` and `README.md` (both from round 1 on), and this file.

| Round | Head | Artifact | Reviewers | seconds, tokens per seat | BUG/RISK/NIT (all seats, before dedup) |
|---|---|---|---|---|---|
| 1 | `5d1fd23` | full `main...5d1fd23` | codex-cli 0.162.1, gpt-6.1-sol, config effort, read-only; melious glm-5.3 (HTTP API, text only); fresh-eyes (Sonnet sub-agent, read-only) | codex 296 s / 79,599; glm 53 s / 30,706; fresh-eyes 240 s / 139,055 | 0 / 4 / 9 · 8 questions asked, 0 confirmed |
| 2 | `380b2fe` | delta `5d1fd23..380b2fe`, with the author's record of round 1 | codex (effort medium), melious glm-5.3 | codex 271 s / 86,276; glm 185 s / 32,365 | 0 / 0 / 0 in scope; 1 NIT outside it · 5 questions asked, 0 confirmed |

| id | Sev | Source | Round | Finding — one line | Status | Evidence |
|---|---|---|---|---|---|---|
| G1 | RISK | codex, fresh-eyes | 1 | the code takes `EVENTS.days[0]` as the first event, and nothing checked that the list is oldest first | fixed `9cfb3fb` — locally_verified, externally_reverified (round 2, both seats) | the build stops unless the two days are in order; probe B below |
| G2 | RISK | fresh-eyes | 1 | "before the first of them" can be read as "before any event"; earlier events exist | fixed `9cfb3fb` — locally_verified, externally_reverified (round 2, both seats) | "the first of these two". The site's sitemap lists no event between 11 March and 17 June 2026, and the site launched on 27 March |
| G3 | RISK | fresh-eyes; noted by codex | 1 | no test reads the new sentence, so a change to the days the code picks would pass | fixed `9cfb3fb` — locally_verified, externally_reverified (round 2, both seats) | a new test in `tests/a11y.spec.ts` adds the two totals up from the CSV and reads them in the sentence; probe A below shows it fail |
| G4 | NIT | fresh-eyes | 1 | after the new sentence, "the gap" reads as the difference between the two totals | fixed `9cfb3fb` | "Whether the lack of events after 1 July 2026 explains the fall was not tested." |
| G5 | NIT | melious, fresh-eyes | 1 | the earlier total had no date | fixed `9cfb3fb` | "and the 28 days up to 2 June 2026 had 16", with a `time` element |
| G6 | NIT | melious, fresh-eyes | 1 | the build check compared direction only, so 48 against 47 would still say "had begun" | fixed `9cfb3fb` | the later total must be higher and at least twice the earlier one; probe C below |
| G7 | NIT | fresh-eyes | 1 | the 28 days up to 16 June include 16 June itself, the busiest day until then | refuted as an issue; both seats recounted the figures in round 2 and raised nothing | the page gives the date, and the claim holds a day earlier too: 39 clicks in the 28 days up to 15 June against 16 up to 1 June (the author's recount from the CSV, the same figures the reviewer gave) |
| G8 | NIT | fresh-eyes | 1 | the README did not name the new build check or that the order of `EVENTS` matters | fixed `9cfb3fb` | README, launch requirements, the `/proof` item |
| G9 | NIT | fresh-eyes | 1 | this file said the stop for a file without a full 28 days could not be reached on its own; it can | fixed | the sentence is gone and the stop was probed: probe D below |
| G10 | NIT | fresh-eyes | 1 | a second helper repeated the day arithmetic of `dayAfter` | fixed `9cfb3fb` | one `shiftDay`; `dayAfter` calls it |

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

After the probe the file was restored with `git checkout`, and `git status` showed no change.

On head `9cfb3fb`, after the round-1 fixes:

| Run | Result | Exit status |
|---|---|---|
| `npm run check` | 0 errors, 0 warnings, 0 hints | 0 |
| `npx playwright test`, first attempt | 222 passed, 1 failed: the new test compared a pattern with the paragraph's text as the source wraps it | 1 |
| `npx playwright test`, after the test read the text with white space collapsed | 223 passed, none skipped or failed | 0 |
| Probe A: the code made to count back two days from the first event, then the new test alone | failed with "the sentence does not say "the 28 days up to 16 June 2026, the day before it, had 48 clicks"" | 1, as intended |
| Probe B: `EVENTS` listed newest first, then `npx astro build` | stopped with "EVENTS must list its two days oldest first, but has 2026-07-01 before 2026-06-17." | 1, as intended |
| Probe C: 9 clicks added on 2026-05-10, then `npx astro build` | stopped with "…had 48 clicks and the 28 days up to 2026-06-02 had 25. That is not at least twice as many…" | 1, as intended |
| Probe D: the Search Console file cut to start on 2026-05-15, then `npx astro build` | stopped with "the file has no full 28 days up to 2026-06-02" | 1, as intended |

After each probe the files were restored with `git checkout`, and `git status` showed no change. The whole output of each probe is kept for the reviewers.

Waivers: none. Deferrals: none.

Follow-ups:
- Round 2, outside its scope (melious): the comment "Site-specific (not in the shipped suite)" above the new test could say what the shipped suite is. The file uses the same words above its other site-specific tests, so the new one follows them.

Notes:
- Round 2 was owed by G1 and G6 (build checks), G3 (a new test) and G2 (what the page says). It found nothing in scope, so the rounds stop there. Fresh-eyes ran in round 1 only, as Normal depth says.
- No wording pass and no re-check: nothing but this file changed after the head both seats saw in round 2. The stamp on the review comment relies on both seats' chains: round 1 in full, round 2's delta.
- The brief of round 2 left out the lines of the passing tests in two of its three suite records, to stay under the script's size limit; the complete output of the run on `9cfb3fb` was in it.
- Data check: the artifact holds no credentials, and the repository is public. Destinations: Codex and GLM 5.3 on melious, as in the gates of karero/croftweaver-site#46 and #53 earlier in the same session, where the owner said "Do it" (2026-10-12) to a review described as "Codex plus GLM 5.3".
