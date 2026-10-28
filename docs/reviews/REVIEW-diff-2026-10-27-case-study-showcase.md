# DIFF review — claude/case-study-showcase-27f4f6 — the case study opens with the site itself

Plan: `docs/reviews/PLAN-2026-10-27-case-study-showcase.md` (PLAN gate closed, trail beside it).
Gate: independent-review, DIFF, depth Normal (page code, data module and tests: never Light).

| Round | Seats | Findings | Disposition |
|---|---|---|---|
| 1 (on 366ee64) | Codex, GLM 5.3 on melious, fresh-eyes (Sonnet) | 0 BUG, 2 RISK (both raised by two seats), 8 NIT | RISKs fixed; NITs fixed, refuted or left, below |
| 2 (verify, on 6144807) | Codex, GLM 5.3 | 2 BUG (Codex), 1 RISK, 1 NIT (GLM) | all fixed, below |
| 3 (verify, on c4cf3b7) | Codex, GLM 5.3 | 2 BUG, 2 NIT, 1 follow-up | cut and fixed, below |
| 4 (verify, on d3923f0; earned by card-figure-binding, fold-box-null; cut) | Codex, GLM 5.3 | none | clean |

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
  First refuted ("printed only on failure"); round 2 showed traces use the message as the step title
  on success too. Fixed in round 2: neutral labels.
- R1-N6 NIT (fresh-eyes), `SITE_REPO` is a third copy of the URL. Left: the test's literal is the
  independent check; folding the copies together touches the home page, outside this change.
- R1-N7 NIT (fresh-eyes), the OG card says "logged week by week". Left: the plan keeps the card; phase 2.
- R1-N8 NIT (fresh-eyes), the desktop image loads eagerly on phones too. Left: the plan chose it; it is
  65 KB.
- 439 typed by hand (fresh-eyes, CONTENT_GUIDE "counts rendered, never typed"): it restates a dated log
  entry and the build check binds it to that entry; the comment says so.

Round 2:
- R2-B1 BUG (Codex), the R1-N4/N5 refutation was wrong: Playwright traces show the message as a
  step title on success. Fixed: "bottom edge within the first 800 px", "figure colour equals the body
  text colour".
- R2-B2 BUG (Codex), "39 tests" was found inside "439 tests", and a Bing number was bound to nothing.
  Fixed: a phrase counts only where it starts a word; a Bing figure is refused until its card cites the
  entry that measured it. Mutations run: tests 39 and Bing 0 each fail the build with their message.
- R2-R1 RISK, R2-N1 NIT (GLM), the comment claimed every figure is bound, Bing included. Fixed with the
  comment, which now says how Bing is handled.

Round 3:
- R3-B1 BUG (Codex), the phrase matcher still took "1,439 tests" and "439 testsuites" for "439 tests".
  Same kind as R2-B2 (card figure binding), so a cut, not a patch: the typed figures and the phrase
  matcher are gone. Each card reads its numbers from the entry it cites with anchored literal patterns
  (`^(\d+) tests;`, `The site now has (\d+) pages`, `Google lists all (\d+) as indexed`), so a card cannot
  disagree with its entry, and the build fails when the entry stops saying it that way (mutation
  "1,439 tests;" fails the build). Bing: the build checks its request is still pending in the log.
- R3-B2 BUG (GLM), a null bounding box reached `toBeLessThanOrEqual`. Fixed: asserted non-null first.
- R3-N1, N2 NIT (GLM), the Bing guard's comment and the one-sided boundary: gone with the cut.
- R3 follow-up (GLM), other CARDS figures unguarded: gone with the cut (no typed figures left).

Round 4: no findings from either seat. GLM's one open question (does anything read the removed
`title` or `phrases` fields?) settled by search: nothing in src, tests or scripts does.

Verdict: gate closed on d3923f0. 4 rounds, 19 findings (4 BUG, 4 RISK, 11 NIT): fixed, cut, refuted or
left as listed. Not run: a wording pass on the plan's status rows, which carry only commit and PR
references.

Tokens: round 1 Codex 67,148 (199 s), GLM 5.3 18,373 (172 s), fresh-eyes 95,840 (215 s). Round 2 Codex 50,464 (143 s), GLM 5.3 10,425 (107 s). Round 3 Codex 38,180 (144 s), GLM 5.3 9,943 (103 s). Round 4 Codex 42,568 (118 s), GLM 5.3 8,190 (75 s).
