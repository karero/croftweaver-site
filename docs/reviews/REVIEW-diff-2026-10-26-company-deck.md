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
