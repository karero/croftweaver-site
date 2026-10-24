# Review trail — PR 137 (Croftweaver 0.33 content), 2026-10-24

Gate: DIFF, Normal (shipped site text). Seats: Codex + GLM 5.3 on melious (`reviewers: codex OK, melious OK`).
Round 1 timings: codex 177s (76473 tokens), melious 56s (10553 tokens).

## Round 1 — 2 BUG, 4 RISK, 3 NIT

| # | Seat | Finding | Disposition |
|---|---|---|---|
| 1 | Codex | BUG: `INSPECTOR` link pinned to v0.32 while steps 4–5 describe 0.33 behaviour | Fixed: link and its comment on v0.33; the test-count links stay on v0.32 (they back 0.32 figures) |
| 2 | Codex | BUG: skills.ts says wordpress-inspector "reads only", the release row and page say it writes redirects | Fixed: "writes the redirect lines from your decisions … only reads the old site and changes nothing there" |
| 3 | Codex + GLM | RISK: "refuses any the file cannot hold" and "not as decided" unsupported | Refuted: v0.33 `skills/wordpress-inspector/SKILL.md` l.105–132 (make_redirects writes `public/_redirects`), l.142 ("What it refuses"), l.180 ("not as decided" with `--moves`) |
| 4 | Codex + GLM | RISK: Node build floors unsupported | Refuted: v0.33 `skills/new-website/templates/astro/package.json` engines `^22.23.4 \|\| ^24.22.1 \|\| >=26.12.1`; release notes name the 2026-10-21 security releases |
| 5 | GLM | RISK: version, date, count, tag URL unverified | Refuted: `gh release view v0.33` publishedAt 2026-10-24T19:37Z; 38 `SKILL.md` at v0.33 (37 at v0.32) |
| 6 | GLM | NIT: "or 26.12.1 or newer" breaks the "in the N line" pattern | Refuted: `>=26.12.1` covers 27 and later too, so no line is named |
| 7 | GLM | NIT: the paragraph leads with the installer's 22.12 | Refuted: the paragraph is about the installer; the build floor follows in the same paragraph |
| 8 | GLM | NIT: 26.12.1 implausible | Refuted: `node -v` on this machine prints v26.12.1 |
