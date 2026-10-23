# DIFF review — `/proof`: Gemini's cell with web search points to Google AI Mode

Branch `fix/proof-gemini-row`, base `4a25cc8` (origin/main). Not yet pushed when this was written; the pull request number is not known.

Depth: **Normal** (`src/data/proof.ts` and the page are shipped code, so never Light; nothing in the High row) · verdict: **CLEAN at round 2** by Codex alone · the gate is **degraded**: the standard pair did not run in either round (below) · the owner's instruction, 2026-10-23: "Point Gemini's with-search cell to Google AI Mode. Keep the asked 0 of 6. New branch from origin/main, update the tests, then review." The repository is public and earlier trails record the owner's OK for Codex and melious.ai; this session took "then review" as the OK for the same destinations, and sent no repository text beyond the public diff.

| Round | Head | Artifact | Reviewers | seconds, tokens per seat | BUG/RISK/NIT |
|---|---|---|---|---|---|
| 1 | `64cd7a1` | `4a25cc8...64cd7a1`, 3 files, +26 −3 | codex, gpt-6.1-sol, read-only · fresh-eyes, Claude Sonnet sub-agent, read-only, no shared context · melious glm-5.3 **FAILED** (HTTP 200, "Insufficient balance for request. Required: 80, Available: 0") · ollama-cloud glm-5.3 **FAILED** (429, weekly usage limit) | codex 301 s / 81,082 · fresh-eyes 238 s / 134,466 | codex 1 / 1 / 0 · fresh-eyes 0 / 2 / 3 |
| 2 | `352d90d` | delta `64cd7a1..352d90d`, with round 1's findings (`--verify`) | codex, effort medium, `--seat codex` (the other two seats were known to be out) | codex 125 s / 52,506 | 0 / 0 / 0 |

Per the owner's standing rule, no other model was sent to melious in place of the two that failed.

## Round 1 findings and what happened

- **R1-1 (BUG, Codex; RISK, fresh-eyes) — fixed by a cut.** The new build guard for a missing Google AI Mode row told the reader to "change GEMINI_POINTER", which would not clear the error, and the `unknown` check and the `NOT_RUN` check in `src/data/proof.ts` already stop the build first. The guard is gone. The row is covered by `tests/a11y.spec.ts` (the chart's engine id and its label "Google AI Mode"); Codex's in-memory probes in round 2 show that a removal or a rename of the row fails it.
- **R1-2 (RISK, Codex and fresh-eyes) — fixed.** "Built on Gemini" had no source. The paragraph under the table now links Google's post of 20 May 2025, which says Google is bringing "a custom version of Gemini 2.5" into Search for both AI Mode and AI Overviews (read live by the host on 2026-10-23, dated 20 May 2025). The page says "Google said on 20 May 2025 that AI Mode uses a custom version of Gemini 2.5". The test checks the sentence and the link target. The host broke the link on purpose: the test failed with its message.
- **R1-3 (NIT) — fixed.** A test comment said "the only Gemini-based answer with web search"; it now says "the nearest the table comes".
- **R1-4 (NIT) — refuted.** The Google AI Mode row reads "Not run that day. On 5 October 2026 it named it in 1 of 2 answers." That is true and dated; neither the cell nor the paragraph claims a result on the check day.
- **R1-5 (NIT) — refuted.** "Google AI Mode" is typed in four places; a rename of the row's label fails the test's label check.
- **Codex UNVERIFIABLE, the toolkit guide at v0.31 (text not in the diff).** Checked by the host: `git -C ~/Devel/website-builder show v0.31:skills/search-console-insights/references/geo-check.md` has the section "Why Gemini has no "Finds you"" with the Grounded Results quote. Codex repeated it as unverifiable in round 2 because its sandbox has no network and no access to that checkout.

Round 2 raised nothing. Deferrals: none. Round 3: not owed.

## Checks on `352d90d`

- `npx astro check`: 0 errors, 0 warnings, 0 hints.
- `npm test`: 405 passed, none failed or skipped. The same count passed on `64cd7a1`.
- Mutations, each turned the test red and was reverted: the pointer text emptied (`Expected: "Not asked with web search. Google AI Mode, built on Gemini, has its own row."`); the Google link's address changed ("the claim that AI Mode uses Gemini has no link to Google's statement").
- Not changed: the chart's cell for Gemini with web search still reads "Not asked" (the column has no room for the pointer); the table cell and the paragraph carry it.
