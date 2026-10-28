# DIFF gate: karero/croftweaver-site#153 (/compare: one comparison, side by side)

Depth: Normal (page copy with measured claims about two runs, a data file and a test change; no box,
user data, logins, money, deletion or schema). The plan passed its PLAN gate (private hub,
`compare-claude-code/`). Seats: Codex and GLM 5.3 on melious (one command, no ollama), and a
fresh-eyes host pass that checked every value against the run records.

## Round 1 (2026-10-28, base df70d0f, head 3758247)

Codex: 1 BUG, 3 RISK (122 s, 37,534 tokens). GLM 5.3: 1 RISK, 4 NIT (246 s, 15,594 tokens).
Fresh-eyes: 3 BUG, 3 RISK, 6 NIT (285 s, 112,853 tokens); every table value matched the record.

| # | Seat | Kind | Finding | Disposition |
|---|---|---|---|---|
| 1 | Codex, GLM, fresh | BUG / NIT | `llms.txt` dates all measurements to 26 October and calls the cost a neutral tool's | fixed: "run on 26 October 2026 and measured with tools Croftweaver does not make on 26 and 27 October" |
| 2 | fresh | BUG | the note lowercases the brand names in its link text | fixed: `siteLabel` and `repoLabel` in `RUNS`, no lowercasing; the test checks each link's text |
| 3 | fresh | BUG | "its full transcript": the transcripts' tool results are cut to 1,500 characters | fixed: "its transcript in plain text (tool results shortened)" |
| 4 | Codex | RISK | identical inputs, settings and no intervention have no public evidence | fixed: each repository already held the brief, harness, prompt and transcript; the measurement record is now there too (`comparison-measures/`, run 1 `0649cdd`, run 2 `e60fc67`) |
| 5 | Codex | RISK | PageSpeed medians and the SEO explanation have no public reports | fixed: every run's scores, time and report link in `comparison-measures/pagespeed/runs.jsonl` in both repositories |
| 6 | Codex, fresh | RISK | the structured-data cell reads as two markups; the page has one Organization | fixed: re-ran the test on run 2's home page (2026-10-28): the "local business" item is the `#organization` markup, two optional fields missing; cell now "one organization markup, valid, which the test also lists as a local business; two optional fields missing" |
| 7 | fresh | RISK | the two runs' first prompts differ and the page does not say so | fixed: "Each run started from a one-line prompt, quoted in its repository" |
| 8 | GLM, fresh | RISK | test locators assume the only table in the section; test misses link texts, date labels and column heads | fixed: `#runs-comparison` id; link texts, both date labels and the column heads asserted |
| 9 | GLM | NIT | three wordings of what the repositories hold | fixed: one wording ("the brief, the prompt, the run's history, its transcript and the measurements") |
| 10 | GLM | NIT | the note names warnings, the row only errors | fixed: row "HTML errors and warnings" |
| 11 | GLM | NIT | redundant ARIA roles on the table | refuted: the site's stacked-table pattern (as `/case-study`), which `tables.spec.ts` expects |
| 12 | fresh | NIT | no question tool in headless mode | fixed in wording: "neither stopped to ask a question" |
| 13 | fresh | NIT | the note does not say who added the noindex | fixed: "The experimenter added a header to both sites …" |
| 14 | fresh | NIT | the `compare.ts` rule looks contradicted by "none detected" for Claude Code on its own | fixed: the data comment says these describe one run's output, not what Claude Code can or cannot do |
| 15 | fresh | NIT | `docs/competitors.md` gives one date | fixed: both dates |
| 16 | fresh | NIT | Croftweaver's own publishing steps were not compared, unsaid | fixed: added to the "not compared" list |
| 17 | fresh | NIT | ragged test comment | fixed |

## Round 2 (2026-10-28, delta 3758247..720d771), verification

Earned by rows 1-3 (BUG). Codex: No BUG/RISK/NIT findings (154 s, 56,446 tokens). GLM 5.3: 2 NIT
(166 s, 15,593 tokens). Fresh-eyes: all its round-1 findings FIXED, the other seats' dispositions
hold; 1 NIT (71 s). Push gate: 472 passed.

| # | Seat | Kind | Finding | Disposition |
|---|---|---|---|---|
| 18 | fresh | NIT | the structured-data cell says "the test", which a stacked cell on a phone does not name | fixed: "Google's Rich Results Test" |
| 19 | GLM | NIT | the test comment says it does not check the comparison's prose, but it checks the note's links and dates | fixed: "the rest of the comparison's prose" |
| 20 | GLM | NIT | `docs/competitors.md`'s not-compared list lacks the publishing steps | fixed |

A wording pass on the round-2 fixes (Codex, `--wording-pass`) answered that one changed line, the
structured-data cell, is in a TypeScript data file and so outside a prose-only pass. Round 3 reviewed
the same delta as code instead.

## Round 3 (2026-10-28, delta 720d771..b2e5221), verification

Codex: No BUG/RISK/NIT findings (63 s, 35,315 tokens). GLM 5.3: rows 18-20 FIXED, nothing new (27 s,
3,412 tokens).

## Verdict

DIFF gate clean on b2e5221cb34cc8a810ee5d18c5a46194990fb8cd: no open BUG or RISK. 3 rounds, 20 findings (3 BUG, 5 RISK, 12 NIT): 19
fixed, 1 refuted. Nothing changed after round 3 except this record. Cost: Codex 4 runs (3 rounds and
the wording pass), 431 s, 163,478 tokens; GLM 3 runs, 439 s, 34,599 tokens; fresh-eyes 2 rounds,
356 s, 128,864 tokens.
