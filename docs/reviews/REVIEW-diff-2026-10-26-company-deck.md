# DIFF gate: the deck for companies (branch feat/company-deck)

Depth: Normal (build script, shipped page text, tests and a public PDF; no box, user data, logins,
money, deletion or schema). Plan: croftweaver-features, `sme-deck/PLAN.md`, PLAN gate clean.
Seats: Codex and a fresh-eyes host pass (Claude Sonnet). GLM 5.3 on melious was out of credit
and ollama at its weekly limit, so rounds run Codex-only (Daniel's rule of 2026-10-26).

## Round 1 (2026-10-26, base f75f9d2, head 276e6dc)

Codex: 3 BUG, 2 RISK (404 s, 68,263 tokens). Fresh-eyes: 4 RISK, 7 NIT (513 s, 180,188 tokens).

| # | Seat | Kind | Finding | Disposition |
|---|---|---|---|---|
| 1 | Codex | BUG | the overflow check cannot see text in the footer band | refuted: the Playwright test "flags a slide whose text reaches into the footer band" passes in Chromium, and fails when the check is made blind to the band (`+ 90`); the fresh-eyes seat measured the same function flagging fixtures ending at 610, 643 and 676 px. Codex could not run a browser |
| 2 | Codex | BUG | `//example.com/x` became `https://croftweaver.com//example.com/x` | fixed: refused like any other relative link; test added |
| 3 | Codex | BUG | README says every `COMPANY` contact field is tracked; the email is typed | fixed: README names the fields read and says the email is typed |
| 4 | Codex | RISK | a second paragraph in the rankings answer would be dropped silently | fixed: an answer with other than one paragraph stops the build |
| 5 | Codex | RISK | `--deck why` built both decks, so a reshaped company page blocked it | fixed: a named remake reads only that deck's pages |
| 6 | fresh | RISK | slide 6 names genai-wednesday.de by hand; slide 2 reads its site from /why | fixed: slide 6 takes the name from the first link of the /why evidence intro, or stops |
| 7 | fresh | RISK | "Tests check each change before it goes out" says more than /checks (the hook can be skipped) | fixed: "By default, tests check each change before it is pushed", as /why says |
| 8 | fresh | RISK | no test runs the real script's make path | fixed: a test runs `build-deck.mjs` as `npm run deck` does (after `--check`): "nothing to make", a bad deck name and a misspelt option fail; seen to fail with the selection replaced by every deck |
| 9 | fresh | RISK | a too-long slide in the second deck left the first deck's PDF written, untitled, lock stale | fixed: every deck is rendered and measured before any file is written; seen when slide 3 overflowed during the fixes (nothing written) |
| 10 | fresh | NIT | slide 4 colours keyed on label text | fixed: read from the page's `is-code` / `is-file` classes |
| 11 | fresh | NIT | "the helper" has no antecedent for a buyer | fixed: "The helper is a Croftweaver skill." |
| 12 | fresh | NIT | "There is no editor in the browser" drops the FAQ's qualifier | fixed: "…; an editor on your own computer can be added" |
| 13 | fresh | NIT | unknown options were ignored | fixed: they stop the script |
| 14 | fresh | NIT | a dated comment carried history | fixed |
| 15 | fresh | NIT | refusal tests did not cover #fit, #faq, #safer | fixed: three asserts added |
| 16 | fresh | NIT | "genai-wednesday.de … is his" stronger than /about | declined: /about says of the three measured sites "all three of them mine" |
| 17 | fresh | NIT | slide 3 has 14 px of headroom; another system font could overflow on `npm run deck` | follow-up: the build refuses loudly then; the committed PDF is not re-rendered by `--check` |
| 18 | fresh | NIT | "Build high-ranking websites." is approved for "Deck and /why" | declined: this is a deck |

Also found while fixing: the open branch `content/growth-quick-wins` adds an h3 "Who does what" inside
`#move`, which the first reader would have counted as a seventh step. The reader now takes the
headings of the numbered list only; a test shows an extra heading in the section leaves the deck
unchanged.

Change from Daniel during the round: the "Stay on WordPress when" line on /from-wordpress (which the
deck quotes) now asks that WordPress, its plugins and PHP are kept up to date, with a firewall plugin
or service in front of it (WordPress.org's hardening guide, read 2026-10-26).

## Round 2 (2026-10-26, base 276e6dc, head e7c1649; verify round)

Codex: 1 BUG, 2 RISK (491 s, 68,728 tokens). GLM 5.3 on melious, back with credit: 3 RISK, 4 NIT
(426 s, 36,263 tokens). Both confirmed the round-1 fixes they checked (#2–#16).

| # | Seat | Kind | Finding | Disposition |
|---|---|---|---|---|
| 19 | Codex | BUG | the PDFs were written to the repository before their titles were set; a title failure left both replaced and the locks stale | fixed: PDFs are written and titled in a scratch folder, copied into place only when all succeeded, then the locks |
| 20 | Codex, GLM | RISK | slide 6 took the first link of the /why intro as the measured site | fixed: the one link whose text is its own host name, or the build stops; a test adds a "/proof" link before it and slide 6 still names genai-wednesday.de |
| 21 | Codex, GLM | RISK | the make path (render, measure, title, write) had no test through the real script | fixed: a test runs `build-deck.mjs --deck company --out <scratch>`, checks a PDF with the deck title and the author `set_pdf_title.py` writes, and that no committed PDF or lock changed. CI installs pypdf 6.14.2 in a venv for it. Writing the test showed the doc-title alone cannot show the script ran (Chromium writes it from `<title>`, and `set_pdf_title.py` changes XMP only when a PDF has some); the author is the mark |
| 22 | GLM | RISK | an answer of one `<p>` plus a list would drop the list | fixed: the answer must be exactly one paragraph and nothing else; test with a list added |
| 23 | GLM | NIT | slide 4 colour falls back silently when a step has no class | declined: the "Visitor" steps have no class on the page by design; a lost class costs only colour, which Daniel's look covers |
| 24 | GLM | NIT | `--check --deck why` still checks every deck | fixed: the usage text says `--check` always checks every deck |
| 25 | GLM | NIT | a valueless `--deck` would remake every deck | refuted: `node scripts/build-deck.mjs --deck` prints "--deck needs a value." and exits 1; `--out --deck why` likewise |
| 26 | GLM | NIT | the seven-step test lacks a guard that its replace fired | fixed |

Seen while running tests: the growth session's worktree (`croftweaver-site-quickwins`) serves its
preview on the same port, 4725, so two sessions' Playwright runs collide ("already used"). A first
push of this branch failed that way; nothing was pushed.

Change from Daniel after round 2: slide 2 shows the /why figures as graphics (score rings, a
three-bar chart of clicks per 28 days, the AI counts as large numbers), drawn from the numbers in the
/why evidence sentences; a reworded sentence stops the build (test added). His screenshots (PageSpeed
100s with "Agentic Browsing 3/3", a Search Console badge of 90 clicks on 2 July 2026) were not used:
they differ from what /why states and nothing would keep them current; his choice, 2026-10-26.
The typed tests line is now "By default, tests run before each push" to fit the slide.

## Round 3 (2026-10-26, base e7c1649, head eb61a62; verify round)

Codex: 1 BUG, 1 RISK (221 s, 66,404 tokens). GLM 5.3 on melious: 2 RISK, 2 NIT, 2 follow-ups
(354 s, 27,456 tokens).

| # | Seat | Kind | Finding | Disposition |
|---|---|---|---|---|
| 27 | Codex | BUG | README says a change to the /why evidence turns tests red; slide 2 now reads only its figures, so a reworded trailing sentence changes nothing | fixed: README says what is read (introduction, caveat, the figures slide 2 draws) |
| 28 | Codex, GLM | RISK | the link "Why the second is zero" is printed whatever the from-memory count is | fixed: "What the counts mean" |
| 29 | GLM | RISK | `/Author (Croftweaver)` may not be a plain literal in a pypdf-written PDF | refuted: the committed handout, written by `set_pdf_title.py` with pypdf 6.14.2, holds the literal `/Author (Croftweaver)` (read with a regex over its bytes, 2026-10-26); the test passes on it; CI pins the same pypdf version |
| 30 | GLM | NIT | all-zero clicks would draw `NaN` bars | fixed: the scale's maximum is at least 1 |
| 31 | GLM | NIT | a copy failing midway leaves one deck replaced | re-sorted: rare (a local file copy failing after the scratch copies succeeded); the next run sees the mismatch and remakes |
| 32 | GLM | follow-up | two worktrees of a site share the Playwright port (`portFor(SITE.url)`), so sessions collide | follow-up for the toolkit's BUGLOG, offered to Daniel |
| 33 | GLM | follow-up | slide 3 headroom (#17) | stays a follow-up |

Round 4 is earned by #28 (kind: slide-2-figures).

## Round 4 (2026-10-26, base eb61a62, head 64cfb77; verify round, earned by #28)

Codex: "No BUG/RISK/NIT findings" (119 s, 48,815 tokens). GLM 5.3: 1 NIT (100 s, 9,950 tokens).

| # | Seat | Kind | Finding | Disposition |
|---|---|---|---|---|
| 34 | GLM | NIT | README says slide 2 draws the figures "as charts"; the AI counts are numbers, and the dates are read too | fixed: "the figures and dates …, which slide 2 draws as charts and numbers" (closing edit, not externally re-verified) |

Stop condition (a2): round 4 has no BUG or RISK. 4 rounds, 34 findings in all.

Wording pass (Codex, `--wording-pass`, base 64cfb77, head 984d46a): "No BUG/RISK/NIT findings"
(83 s, 41,745 tokens). Gate closed clean: 4 rounds, 34 findings, no BUG open. Daniel looks at the
PDF before the merge.

## Round 5 (2026-10-26, base d4248b3; after CI failed on the PR)

CI's `test` job failed on d4248b3: on Ubuntu the deck's system font is wider, so the make-path
test's real run refused slides 2, 3 and 5 ("text runs past the edge of slide 2, 3, 5"). Daniel
chose (2026-10-26) "Keep the look you approved": the test now requires a titled PDF on a Mac, and on
Linux requires the refusal, an empty output folder and unchanged committed files. README: make the
decks on a Mac. Seats run as separate commands (the global rule of 2026-10-26). GLM 5.3: 1 RISK,
2 NIT (204 s, 10,911 tokens). Codex: "model is at capacity" twice (423 s, 81 s), then 1 RISK
(1,508 s, 58,561 tokens).

| # | Seat | Kind | Finding | Disposition |
|---|---|---|---|---|
| 35 | GLM, Codex | RISK | on Linux CI the make-path test passes on the refusal, so PDF writing and titling are not checked there | waived by Daniel: asked "on Linux CI it checks that the script refuses cleanly and changes nothing", he chose "Keep the look you approved (Recommended)". The full check runs on his Mac in the pre-push hook on every push |
| 36 | GLM | NIT | a refused run is not checked for writing nothing | fixed: the output folder must be empty |
| 37 | GLM | NIT | a Mac failure hides the script's error | fixed: the message carries it |

One pre-push run of the full suite reported 1 failed, 469 passed, during this round; the next full
run passed 470 of 470. Which test failed was not recorded, so its cause is not known.

5 rounds, 37 findings in all; no BUG open.
