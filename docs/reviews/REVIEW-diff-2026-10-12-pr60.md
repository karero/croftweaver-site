# DIFF review — karero/croftweaver-site#60 — /proof: the Gemini passage without the six source labels

Base `41a8acd` · depth: **Normal** (shipped page copy with factual claims) · verdict: **OPEN** — round 1 found no BUG, no RISK and 3 NITs, all fixed in `5f38af0`; round 2 checks that delta · authority used: POST AUTHORITY and BRANCH-COMMIT AUTHORITY — this session opened the pull request and created the branch; WORKTREE-WRITE AUTHORITY — the owner's instruction of 2026-10-12: "drop the six source labels, make it shorter".

Files in the change: `src/pages/proof.astro`, and this file.

| Round | Head | Artifact | Reviewers | seconds, tokens per seat | BUG/RISK/NIT (all seats, before dedup) |
|---|---|---|---|---|---|
| 1 | `296d482` | full `main...296d482` | codex-cli 0.162.1, gpt-6.1-sol, config effort, read-only; melious glm-5.3 (HTTP API, text only): the script could not parse its answer and marked the seat FAILED, the author read the raw answer and counted it by hand (one NIT, no BUG, no RISK); ollama-cloud glm-5.3 stood in and counted; fresh-eyes (Sonnet sub-agent, read-only, given both screenshots) | codex 165 s / 50,037; melious 33 s / 15,755; ollama-cloud 389 s; fresh-eyes 222 s / 130,077 | 0 / 0 / 4 · 7 questions asked, 0 confirmed |

| id | Sev | Source | Round | Finding — one line | Status | Evidence |
|---|---|---|---|---|---|---|
| J1 | NIT | fresh-eyes | 1 | "also named GenAI Wednesday, with nothing else recorded" can be read as "named only GenAI Wednesday" | fixed `5f38af0` — locally_verified | the live wording is back: "…also named GenAI Wednesday; nothing else of it was recorded." |
| J2 | NIT | fresh-eyes, melious | 1 | "By the same report" claims one report; the record has two separate statements of the owner | fixed `5f38af0` — locally_verified | the live wording is back: "Also by the maintainer's report, …" |
| J3 | NIT | fresh-eyes | 1 | the colon in the closing sentence makes its second clause read like a reason | fixed `5f38af0` — locally_verified | the live wording is back: "…the published file. They show what one person got on two days, nothing more." |

## What the change does, sentence by sentence

| Live passage (reviewed in karero/croftweaver-site#57) | This change |
|---|---|
| "Six passages, four of them about other communities and platforms, carried a source labelled "GenAI Wednesday"; the address behind the label was not checked." | removed, on the owner's instruction. Its two caveats go with the fact they qualified |
| every other sentence | unchanged. The first version of this change also rejoined three sentences beside the cut; round 1 found each join worse than the live wording, and all three are back as they were |

Nothing else in the repository mentions the source labels (`git grep` outside `docs/reviews/` finds none), and `src/data/proof.ts` has no field for them, so no data or README change follows. Since `5f38af0` a word diff against `main` shows the removed sentence and nothing else. The passage is 149 words where the live one has 173.

## Test records (head `5332591`)

| Run | Result | Exit status |
|---|---|---|
| `npm ci` | installed, 0 vulnerabilities | 0 |
| `npm run check` | 0 errors, 0 warnings, 0 hints | 0 |
| `npx playwright test` (its web server runs `npm run build` first) | 224 passed, none skipped or failed | 0 |
| `git push` (the pre-push gate: build, then the tests) | 224 passed; "pre-push gate passed" | 0 |

The change adds no build check and no test: it removes one sentence.

On head `5f38af0`, after the round-1 fixes: `npm run check` 0 errors, exit status 0; `npx playwright test` 224 passed, none skipped or failed, exit status 0.

Waivers: none. Deferrals: none. Follow-ups: none yet.

Notes:
- Data check: the artifact holds no credentials, and the repository is public. Destinations: Codex and GLM 5.3 on melious, as in the gates of karero/croftweaver-site#46, #53, #54 and #57 earlier in the same session, where the owner said "Do it" (2026-10-12) to a review described as "Codex plus GLM 5.3".
