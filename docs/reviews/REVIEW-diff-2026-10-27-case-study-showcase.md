# DIFF review — claude/case-study-showcase-27f4f6 — the case study opens with the site itself

Plan: `docs/reviews/PLAN-2026-10-27-case-study-showcase.md` (PLAN gate closed, trail beside it).
Gate: independent-review, DIFF, depth Normal (page code, data module and tests: never Light).

| Round | Seats | Findings | Disposition |
|---|---|---|---|
| 1 (on 366ee64) | Codex, GLM 5.3 on melious, fresh-eyes (Sonnet) | 0 BUG, 2 RISK (both raised by two seats), 8 NIT | RISKs fixed; NITs fixed, refuted or left, below |

Round 1:
- R1-R1 RISK (Codex, fresh-eyes), "Tests on the last change to this site in the log" goes false once a
  newer change is logged. Fixed: "Tests that ran on a change to this site".
- R1-R2 RISK (GLM, fresh-eyes), the Google card's 22 pages and 22 indexed were not bound to the cited
  entry. Fixed: each card's phrases are built from its figures (`The site now has ${pages} pages`,
  `Google lists all ${indexed} as indexed`, `${tests} tests`), and the build fails when one is missing
  from the entry. The Bing card's entry is checked the same way.
- R1-N1 NIT (fresh-eyes), `.DS_Store` would fail the image-folder test locally. Fixed: hidden files ignored.
- R1-N2 NIT (GLM), the hero test checks the fold only at 1280×800. Fixed: its comment says so.
- R1-N3 NIT (fresh-eyes), the summary test comment overstated what it checks of the hand-kept cards.
  Fixed: it says the build check binds figures to entries.
- R1-N4, N5 NIT (GLM), failure messages "is below the fold" and "a figure is coloured" read backwards.
  Refuted: Playwright prints the message only when the assertion fails, which is exactly that case.
- R1-N6 NIT (fresh-eyes), `SITE_REPO` is a third copy of the URL. Left: the test's literal is the
  independent check; folding the copies together touches the home page, outside this change.
- R1-N7 NIT (fresh-eyes), the OG card says "logged week by week". Left: the plan keeps the card; phase 2.
- R1-N8 NIT (fresh-eyes), the desktop image loads eagerly on phones too. Left: the plan chose it; it is
  65 KB.
- 439 typed by hand (fresh-eyes, CONTENT_GUIDE "counts rendered, never typed"): it restates a dated log
  entry and the build check binds it to that entry; the comment says so.

Tokens: round 1 Codex 67,148 (199 s), GLM 5.3 18,373 (172 s), fresh-eyes 95,840 (215 s).
