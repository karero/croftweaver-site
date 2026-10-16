# DIFF review — karero/croftweaver-site#90 — Home: a pill above the kicker says Croftweaver is free and open source

Base `48e85c2` · depth: **Normal** (shipped page markup and style; the owner asked for it "properly reviewed") · verdict: **CLEAN** — 2 rounds; no BUG, RISK or NIT from either seat in either round. One point the seats could not check (tap-target size) was measured by the author, found short of `BRAND.md`, and fixed in round 1.

Files in the change: `src/pages/index.astro`, `STORY.md`, and this file.

| Round | Head | Artifact | Reviewers | seconds, tokens per seat | BUG/RISK/NIT |
|---|---|---|---|---|---|
| 1 | `a7cab48` | full `main...a7cab48` | codex-cli (gpt-6.1-sol, read-only); melious glm-5.3 (HTTP API, text only) | codex 134 s / 52,967; melious 35 s / 5,693 | 0 / 0 / 0 |
| 2 | `8aa09d6` | delta `a7cab48..` round-2 head | codex; melious glm-5.3 | codex 74 s / 40,817; melious 25 s / 3,003 | 0 / 0 / 0 |

## Points the seats could not check, settled by the author

| id | Raised by | Round | Point | How settled |
|---|---|---|---|---|
| U1 | codex | 1 | the pill's rendered size; `BRAND.md:116` asks for tap targets of at least 44px | measured in Chromium: 282 × 37 px at 360 and 1100 px. Short, so fixed in round 1's commit (`min-height: 44px`, `inline-flex`, centred); measured again: 282 × 44 px at both widths |
| U2 | codex, melious | 1 | the linked file is the MIT licence | https://raw.githubusercontent.com/karero/croftweaver/main/LICENSE starts "MIT License", "Copyright (c) 2026 Daniel Melter" (read 2026-10-16) |
| U3 | melious | 1 | `--bg` is defined, so the hover and focus state stays legible | `src/styles/global.css` defines it for light (line 15) and both dark blocks (35, 51); the focus state was looked at in a screenshot |
| U4 | melious | 1, 2 | the positioning test reads the first `<p>` in `<main>` | `tests/positioning.spec.ts:104`, `main.querySelector('p')`; codex verified the same |
| U5 | melious | 2 | `.oss` has no inline siblings, so `inline-flex` baseline does not matter | it is the first child of `section.hero`, on its own line |

## Checked

- `npm run check`: 0 errors. `npx playwright test`: 274 passed, none skipped, before each push.
- The preview of the pull request shows the pill and its link.
