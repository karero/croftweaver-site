# DIFF review — `/proof`: Gemini's cell points to the answers asked by hand

Branch `content/proof-gemini-pointer`, base `32ebc1b` (origin/main). Not yet pushed when this was written.

Depth: **Normal** (`src/data/proof.ts` is shipped code, so never Light) · verdict: **CLEAN at round 2**, both seats · the owner's instruction, 2026-11-07: "Yes, add a pointer" (to the question whether Gemini's cell should point to the hand-asked answers below the table). Earlier trails record the owner's OK for Codex and melious.ai on this public repository.

| Round | Head | Reviewers | seconds, tokens per seat | BUG/RISK/NIT |
|---|---|---|---|---|
| 1 | `0bbc037` | codex gpt-6.1-sol · melious glm-5.3 | codex 116 s / 39,850 · melious 112 s / 13,193 | codex 1 / 0 / 0 · melious 0 / 2 / 1 |
| 2 | `6333052`, with round 1's findings (`--verify`) | codex, effort medium · melious glm-5.3 | codex 146 s / 62,996 · melious 147 s / 16,056 | codex 0 / 0 / 0 · melious 0 / 1 / 1 |

| Id | Kind | Seat | Finding | Disposition |
|---|---|---|---|---|
| R1-1 | BUG | codex | the test checked one phrase, so deleting the answers left it green | fixed `6333052`: three phrases with both dates and both results; codex confirmed in round 2 |
| R1-2 | RISK | melious | `#ai table` could match a second table and silently retarget | refuted: locator `evaluate` is strict and throws on several matches (codex read it in playwright-core in round 2), and the spec already asserts one `#ai table` |
| R1-3 | RISK | melious | nothing guards the Google AI Mode row | refuted: the existing `labels.some((l) => l.engine === 'google-ai-mode' …)` assertion; codex confirmed in round 2 |
| R1-4 | NIT | melious | the evidence cited the test's line, not the assertion's | refuted: 288 names the test; melious accepted in round 2 |
| R2-1 | RISK | melious | R1-2 again, the strictness claim unverified by that seat | refuted: same evidence as R1-2 |
| R2-2 | NIT | melious | `elementHandle()` is typed nullable behind `!` | refuted: a locator's `elementHandle()` waits and throws on a miss; it does not return null |

Mutations, each run against the built page and reverted; each turned the test red on the new assertion: the answers deleted; GenAI Wednesday's result changed; the paragraph moved above the table. Full suite before review: 498 passed, one phone-images timeout at load about 500 that passed on rerun.
