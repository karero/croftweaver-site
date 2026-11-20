# DIFF review: croftweaver.com content for Croftweaver releases 0.37 and 0.38
Base `2cc7876` · depth: Normal · verdict: in progress (round 2 owed) · made by session `local_a90c4420-ddc5-4561-adbb-e5f68e5b718f`

Task: the site's content for releases 0.37 and 0.38 (`website-builder-release` Step 7, "croftweaver.com content"): `src/data/skills.ts`, `public/llms.txt`, `src/pages/roadmap.astro` and README row 5k. The claim ceiling is the customer part of the release notes of `v0.37` and `v0.38`.

Depth and seats: Normal. The diff changes shipped page text, so it is not Light (REVIEW-RULES). It touches no topic of the High row, so Codex alone (`--seat codex`, medium effort; REVIEW-RULES). No fresh-eyes subagent ran: the claims were checked against the release notes by the host, and the reviewer read the notes as evidence (READ 1 to 4). That departs from the skill's Normal round 1.

Evidence sent: release notes of 0.37 and 0.38 (whole), the skill folders of the tag against `skills.ts` (40 and 40, same names), the tag README's plugin-directory passage, and the checks run (READ 5). The claims sweep (`sweep_claims.sh`) found four sentences, all in README rows; each is checked below.

| Round | Head | Seconds, tokens |
|---|---|---|
| 1 | `c73d691` plus the README PR number | Codex 156 s / 65,390 |

| Sev | Round | Finding | Status | Evidence |
|---|---|---|---|---|
| BUG | 1 | Codex: README row 5k names this review trail, and the file did not exist | fixed | This file |
| UNVERIFIABLE | 1 | Six entries: the new-page workflow, the link checker, the starter checks, publishing, the directory plugin, release dates and "0.37 added no skill" rest on the release notes, not on a run of the tag | not changed | The brief makes the release notes' customer part the ceiling; every sentence on the pages restates a bullet of READ 1 or 2 and claims no more. The 40 skills match the tag (READ 3) |
| UNVERIFIABLE | 1 | READ 5 (564 passed, 0 errors, sweep) shows summaries without logs | not changed | The counts are from this worktree's runs; the PR checks `test` and `Cloudflare Pages` run the suite again on the pushed commit |

Claims sweep, README sentences: "`/skills` lists 40 skills, all of them in toolkit release 0.38" (READ 3: tag and site lists are the same 40 names); "0.37 added no skill" (the tag's 40 skills are the 40 the site listed at 0.36); "no longer" in row 5e/5k (describes earlier PRs, unchanged); "done; live since 2026-10-14" (row 143, not touched).

Judgments the reviewer was asked to challenge: the roadmap's Anthropic-directory sentence says the offer is one text-only page and does not say the listing is live; the 0.36 "Done" bullets were replaced by 0.37 and 0.38 ones.
