# DIFF review — /from-wordpress: apreet.com was moved from WordPress

Base `e0dfbe7` · depth: **Normal** (shipped page copy) · verdict: **CLEAN** — 3 rounds, 9 findings (0 BUG; 4 RISK, all fixed; 5 NIT, all fixed). Round 3's one NIT (C1) was fixed afterwards and not sent back.

The page said no WordPress site had been moved with Croftweaver from start to finish. apreet.com was, in June 2026, without the WordPress helper; `/more-proof` already counts it among three sites built with Croftweaver.

| Round | Head | Artifact | Reviewers | seconds, tokens per seat | BUG/RISK/NIT |
|---|---|---|---|---|---|
| 1 | `b2b865f` | full `e0dfbe7...b2b865f`, with a context block of the checked facts | codex; melious glm-5.3 | codex 133 s / 54,820; melious 191 s / 10,699 | 0 / 3 / 1 |
| 2 | `bfc805d` | delta, with round 1's record | codex; melious glm-5.3 | codex 68 s / 42,848; melious 156 s / 8,011 | 0 / 1 / 3 |
| 3 | `59da2d4` | delta, with round 2's record | codex; melious glm-5.3 | codex 1,323 s / 29,602; melious 60 s / 4,587 | 0 / 0 / 1 |

| id | Sev | Source | Finding | Disposition |
|---|---|---|---|---|
| A1 | RISK | codex | "done by hand" not established by the evidence | fixed: "That move did not use this helper" |
| A2 | RISK | melious | same as A1, also in the header comment | fixed in both places |
| A3 | RISK | melious | "before this helper existed": only its first ship date is known | fixed: "which first shipped in Croftweaver 0.32" |
| A4 | NIT | melious | a helper runs on a site, not on a move | fixed: run on a backup of the old WordPress site, its addresses checked against the new site |
| B1 | RISK | melious | ship date uncited | fixed: linked to the v0.32 release; 16 October 2026 (`gh release view`: publishedAt 2026-10-16T14:55:58Z) |
| B2 | NIT | melious | move dated to the year only | fixed: June 2026 (apreet-site `docs/DECISIONS_PENDING.md`: "the June 2026 migration") |
| B3 | NIT | melious | "each old address" promises exhaustive checking | fixed: "each address it finds" |
| B4 | NIT | melious | 87 tests uncited | fixed: linked to the v0.32 tests folder |
| C1 | NIT | codex | `public/llms.txt` still says "check every old address" | fixed after round 3: "check each address it finds after" |

Tests at the final head: `astro check` 0 errors; Playwright 309 passed at `59da2d4`, the llms and seo suites again after C1.
