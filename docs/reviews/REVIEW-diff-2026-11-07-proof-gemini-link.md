# DIFF review — `/proof`: Gemini's cell links to the answers asked by hand; the passage in three paragraphs

Branch `content/proof-gemini-link`, base `788dabd` (origin/main). Not yet pushed when this was written.

Depth: **Normal** (`src/data/proof.ts` and the page are shipped code) · verdict: **CLEAN at round 2**, both seats; round 2's one NIT fixed by a rename (`c4cdba1`), checked by `astro check` and the /proof test, no third round · the owner's words, 2026-11-07: "In which table below? … There is no table I can find", "Make it a link", and "This text is very long. can you break it in paragraphs? or shorten?" The passage was split, not cut; one word added (R1-2).

| Round | Head | Reviewers | seconds, tokens per seat | BUG/RISK/NIT |
|---|---|---|---|---|
| 1 | `578704f` | codex gpt-6.1-sol · melious glm-5.3 | codex 156 s / 59,337 · melious 104 s / 15,346 | codex 0 / 0 / 0 · melious 0 / 1 / 2 |
| 2 | `44c09f0`, with round 1's findings (`--verify`) | codex · melious glm-5.3 | codex 102 s / 40,475 · melious 78 s / 13,709 | codex 0 / 0 / 0 · melious 0 / 0 / 1 |

| Id | Kind | Seat | Finding | Disposition |
|---|---|---|---|---|
| R1-1 | RISK | melious | `#gemini-app` has no scroll-margin and would land under a sticky header | re-sorted: rare. The site has no sticky header; global.css says to raise the margin if one is added; the site's other paragraph anchors have none either |
| R1-2 | NIT | melious | the linked paragraph opened "To see the app itself", the app named only before it | fixed `44c09f0`: "To see the Gemini app itself" |
| R1-3 | NIT | melious | the row flag repeats `'gemini'` beside `NOT_ASKED_WITH_SEARCH` | refuted: its comment ties it to the build stop; a second engine in the list gets the plain cell, which is right for it |
| R2-1 | NIT | melious | row flag `byHand` shares its name with the data `p.ai.byHand` | fixed `c4cdba1`: renamed `handLink` |

Mutations against the committed change, each reverted and each red on the named assertion: the link removed; the anchor renamed; the second answer deleted; both answer paragraphs moved above the table. Full suite: 500 passed, with timeouts at load 40 to 55 in untouched specs; the failed one passed on rerun.
