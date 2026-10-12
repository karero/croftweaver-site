# DIFF review — karero/croftweaver-site#46 — home page: the stakes name both of a site's jobs, the pivot points to positioning, "You catch common slips"

Base `2c99142` · depth: **Normal** (shipped page copy and two strategy files; no legal text, no code path) · verdict: **OPEN** — the wording pass over `ccccfc5..0bbfc4d` is pending · authority used: POST AUTHORITY and BRANCH-COMMIT AUTHORITY — this session opened the pull request and created the branch; WORKTREE-WRITE AUTHORITY — the owner's instruction of 2026-10-12: "Do it: Apply it on a branch. Add the README status row. Open the pull request. Run the review pass."

| Round | Head | Artifact | Reviewers | seconds, tokens per seat | BUG/RISK/NIT (all seats, before dedup) |
|---|---|---|---|---|---|
| 1 | `f27571c` | full `main...f27571c` | codex-cli 0.162.1, gpt-6.1-sol, config effort, read-only; melious glm-5.3 (HTTP API, text only); fresh-eyes (Sonnet sub-agent, read-only) | codex 386 s / 98,497; glm 102 s / 14,157; fresh-eyes 216 s / 156,087 | 2 / 3 / 5 · 4 questions asked, 0 confirmed |
| 2 | `ccccfc5` | delta `f27571c..ccccfc5`, with the author's record of round 1 | codex (effort medium), melious glm-5.3 | codex 158 s / 45,511; glm 99 s / 10,675 | 0 / 1 / 1 · 4 questions asked, 0 confirmed |

| id | Sev | Source | Round | Finding — one line | Status | Evidence |
|---|---|---|---|---|---|---|
| F1 | BUG | codex; as RISK: melious, fresh-eyes | 1 | the new rule in `POSITIONING.md` §4 read as a rule for every page, while §4's own line above it, the lead of `/why` and the stakes section of `/established-sites` name one job or neither | fixed `ccccfc5` — locally_verified, externally_reverified (round 2, both seats) | the owner, 2026-10-12: "scope the rule to the home page"; `POSITIONING.md:107–108` |
| F2 | RISK | codex | 1, raised again in 2 | the pivot says the assistant "can tell the home page as your visitor's story", and this repository's bundled skills hold neither `website-story` nor `new-website` | refuted — locally_verified; not externally re-verified, because the evidence is in another repository that neither seat could open | the sentence is about the toolkit, karero/croftweaver. At its public tag `v0.31`: `skills/website-story/SKILL.md` line 22 "Optional, never part of the default build.", lines 50–51 "Offered once by `new-website` §2a … "No" or no answer means the standard home page"; `skills/new-website/SKILL.md` line 189 (step 2a, optional, offered once) and lines 217–228 (explain, ask, run on a yes). Read with `git show v0.31:<path>`. This shows what the skill tells an assistant, not that an assistant obeys; the page says "can" |
| F3 | BUG (wording) | fresh-eyes | 1 | the note in `STORY.md` said section 2 "closes on" the two job sentences; the pivot follows them | fixed `ccccfc5` — locally_verified, externally_reverified (round 2, both seats) | `STORY.md:173` |
| F4 | NIT | melious | 1 | a citation in `STORY.md` §6 did not say which file's §4 | fixed `ccccfc5` — externally_reverified | `STORY.md:91` |
| F5 | NIT | melious, fresh-eyes | 1 | "your customer's story" where `/positioning` and the skills list say "visitor" | fixed `ccccfc5` — externally_reverified | the owner, 2026-10-12: "visitor's story" |
| F6 | NIT | melious | 1 | the home page map still called the three hero lines "short" | fixed `ccccfc5` — externally_reverified | `STORY.md:125` |
| F7 | NIT | fresh-eyes | 1 | no README status row for this change | fixed `0bbfc4d` (row 4c, written after round 2) — locally_verified; the wording pass reads it | `README.md:98` |
| F8 | NIT | melious | 2 | lines edited in round 1 ran past the width of `STORY.md` | fixed `0bbfc4d` — locally_verified | `git diff ccccfc5..0bbfc4d --word-diff -- STORY.md` shows no changed word |

Waivers: none. Deferrals: none.

Follow-ups, for the owner:
- "Existing customers" (the minor third job) and "people who already know your name" (the first job) overlap in the new line of `POSITIONING.md` §4; a reviewer asked whether the line should separate them.
- "A site nobody finds earns nothing" still stands in `POSITIONING.md` §4 and opens `/why`; the owner turned it down as the home page's stakes line and has not decided on those two places.

Notes:
- Data check: the artifact holds no credentials, and the repository is public. Destinations: the owner said "Do it" on 2026-10-12 to a review pass this session had described as "Codex plus GLM 5.3"; the service that runs GLM 5.3 (melious) was not named in that exchange.
- Round 2 was owed by F1, a rule someone follows. It found no BUG and no RISK that calls for a fix, so the rounds stop there. Fresh-eyes ran in round 1 only, as Normal depth says.
- Checks on `f27571c` and `ccccfc5`: the pre-push gate, `npx playwright test` 203 passed, none skipped; `npm run check` 0 errors on `daec69d`.
