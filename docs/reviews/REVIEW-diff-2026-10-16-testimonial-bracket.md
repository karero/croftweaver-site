# DIFF review — Home testimonial: "[Croftweaver]" in square brackets before "Builder"

Base `f9e8c8e` · depth: **Normal** for round 1 (shipped page copy); round 2 was **Light** (one line of `STORY.md` prose, Codex alone) · verdict: **CLEAN** — 2 rounds, 3 findings (no BUG, 1 RISK refuted, 2 NITs: 1 fixed, 1 left by owner decision).

Files in the change: `src/pages/index.astro`, `STORY.md`, and this file.

| Round | Head | Artifact | Reviewers | seconds, tokens per seat | BUG/RISK/NIT |
|---|---|---|---|---|---|
| 1 | `e74ba50` | full `main...e74ba50` | codex-cli (read-only); melious glm-5.3 (HTTP API, text only) | codex 119 s / 74,255; melious 81 s / 6,006 | 0 / 1 / 2 |
| 2 | `2e8481c` | delta `e74ba50..2e8481c` | codex (effort medium), `--depth light` | codex 36 s / 19,612 | 0 / 0 / 0 |

| id | Sev | Source | Round | Finding — one line | Status | Evidence |
|---|---|---|---|---|---|---|
| B1 | RISK | melious | 1 | nothing in the diff shows that `data-placeholder-exempt` is honoured, so "[Croftweaver]" might be replaced or fail the build | refuted | the attribute is read by `tests/placeholders.spec.ts:371`, which drops exempt elements before it scans, and its fixture at line 478 covers it; nothing in the site substitutes placeholders. Codex verified the same in round 1. All 274 tests pass |
| B2 | NIT | melious | 1 | a bracket placed before "Builder" lets a reader take "Croftweaver Builder" as a product name; replacing the word would follow the usual convention | left | the owner asked for exactly "[Croftweaver] Builder" (chat, 2026-10-16) |
| B3 | NIT | melious | 1 | `STORY.md` still calls the quote "verbatim" in the same cell that names the insertion | fixed `2e8481c` — locally_verified, externally_reverified (round 2, codex) | the row now says "word for word … apart from one insertion in square brackets" |

## What the change does

The home page testimonial reads "Without the [Croftweaver] Builder it wouldn’t have been possible". The line under the card that explained "the Builder" is gone, because the bracket does its job. The bracketed word carries `data-placeholder-exempt`, so the placeholder test does not take it for an unfilled slot; the test itself is unchanged.
