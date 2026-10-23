# Review trail: /what-it-runs-on (DIFF gate)

Gate: DIFF, Normal depth. The diff adds a public page, its registrations, inbound links and tests, with claims
about third parties; the High row (auth, payments, personal data, deletion, migrations, secrets, security
boundaries, public API, deploy, privacy text) does not apply, and shipped copy is never Light. No red team: no
user data, login, money, deletion or schema change. Gate id `20261022T200133Z-83632`.

Owner's words that started the gate (2026-10-22, chat): "Yes: run the DIFF review at Normal depth on the local
commit. Do not push yet." Seats as for the plan gate: Codex (`gpt-6.1-sol`, read-only, cwd = the worktree at
HEAD), GLM 5.3 on melious.ai (`SECOND_SEAT=melious`), and a Sonnet fresh-eyes sub-agent with no shared context
(read-only), started together before the script. Data check: the diff holds no keys, tokens, passwords or
personal data; it is a public page.

## Round 1

Artifact: `git diff origin/main...HEAD` at commit `2c43b84` (13 files, +308 −3), with a short note for the
reviewers pointing at the plan. GLM called that note "injection-adjacent" (it asserted that the plan had passed
its review); a false positive, but fair feedback, and later rounds carry no note. Diff sha256 `cffea292…`.
`reviewers: codex OK, melious OK`. `timings: codex 392s (124215 tokens), melious 163s (25177 tokens)`.
Fresh-eyes (Sonnet): 650 s, 267,251 tokens, 79 tool uses (the sub-agent's own report; logged by the host).
416,643 tokens logged for round 1.

Findings after de-duplication: 20 (2 BUG, 7 RISK, 11 NIT); Codex 4, GLM 2, fresh-eyes 14, no overlap. The
reviewers could not read vendor pages (no network), so all three listed the Cloudflare, GitHub, Astro and
Plausible claims as unverifiable; those readings are kept in `VENDOR-FACTS-2026-10-22-what-it-runs-on.md`. Each finding was
checked against the repo, the toolkit at `origin/main` or the vendor page before the fix. 19 confirmed and
fixed, 1 refuted with evidence (D19). The fixes are commit `e35a276` (2 files, +47 −33).

| # | Kind | Seat | Finding | Check | Disposition |
|---|---|---|---|---|---|
| D1 | RISK | Codex | Cloudflare function metering, the daily limit and exhaustion behaviour unverifiable | the toolkit's first-deploy guide lines 312 to 318: the quota is the account's, shared; "set Fail open" | fixed: the page says shared and fail open; readings kept; the dashboard check is the owner's |
| D2 | RISK | Codex | GitHub ruleset claims lack a dated observation | `gh api` by ID, 2026-10-22 | kept in the facts file; page unchanged |
| D3 | RISK | Codex | Plausible price and billing interval | the pricing page text shows a toggle, not which is selected; `/start` line 163 says 9 euros or US dollars | fixed: the page says the interval is not shown and matches `/start` |
| D4 | BUG | Codex | "Astro runs the tests"; Playwright runs them | `package.json` line 17 | fixed in the picture and the Astro paragraph |
| D5 | NIT | GLM | "free" without limits for DNS and Email Routing | vendor read: "available on all plans" | fixed: "every plan" |
| D6 | NIT | GLM | the acquisition sentence has no read date; the `AGENTS.md` claim has no link | read | fixed |
| D7 | BUG | fresh-eyes | Keystatic writes Markdoc, not plain Markdown | `keystatic-setup/SKILL.md` lines 33 to 48, 113 to 114 | fixed |
| D8 | RISK | fresh-eyes | the branch rule needs a public repository on a free plan | `website-team-setup` lines 201 and 259 | fixed |
| D9 | RISK | fresh-eyes | "every preview build counts" sits under a "read" label nobody read | Cloudflare's limits page does not say (read twice) | fixed: the claim is cut |
| D10 | RISK | fresh-eyes | the 100,000 a day is per account and shared | toolkit lines 312 to 318 | fixed with D1 |
| D11 | RISK | fresh-eyes | the middleware's optional third job is omitted | the template's header | fixed: one clause |
| D12 | RISK | fresh-eyes | `npm run ship` is not blocked by Claude Code; the rule is written; the list was not tried in a live session | `WHAT-THE-SKILLS-RUN.md` lines 37, 51, 72 to 80 | fixed: the page says so |
| D13 | RISK | fresh-eyes | the new tests lack the "Site-specific" marker | `a11y.spec.ts` lines 4, 7, 34, 129 | fixed |
| D14 | NIT | fresh-eyes | DNSSEC is a trap of the DNS move; the plan said the checklist lacks it | `CLOUDFLARE_FIRST_DEPLOY.md` lines 415 to 426; my search was cut off after four lines | fixed on the page; the plan note and the facts file corrected |
| D15 | NIT | fresh-eyes | the Plausible price differs from `/start` | line 163 | fixed with D3 |
| D16 | NIT | fresh-eyes | "not checked in the same way" is ambiguous | `ship.sh`, the pre-push hook | fixed |
| D17 | NIT | fresh-eyes | the CSS comment credits the wrong rule; the phone test cannot fail on current copy | measured by the sub-agent; mutation check by me | fixed: a 60-character word in the test; removing the protection fails it at 360 and 320 px |
| D18 | NIT | fresh-eyes | `ol` implies a sequence; the box headings repeat the section names unlinked | read | fixed: `ul`, headings link their sections |
| D19 | NIT | fresh-eyes | the source comment points to a private hub from a public repo | `from-wordpress.astro` line 5, `ai-website-seo-checklist.astro` line 5, `security.astro` line 4 carry the same pointer | refuted |
| D20 | NIT | fresh-eyes | "every Croftweaver site (AGENTS.md)" over-claims; two links read "read 22 October 2026" | read | fixed |

Two of my own earlier statements were wrong and were corrected here: that DNSSEC is absent from the toolkit's
checklist (a `head -4` cut the search off), and that "every preview build counts toward your monthly builds"
(never read from a vendor page).

Outside the page, found by the plan gate and put to the owner: `/checks` line 41 (F36 in
the plan gate's trail in the private hub (`what-it-runs-on/REVIEW-plan-2026-10-22.md`)).

## Round 2 (verification; the pair only)

Artifact: the delta `2c43b84..e35a276` (2 files, +47 −33, no note to the reviewers), with
`prior-diff-findings-r1.md`. Diff sha256 `6a7ea2cc…`. `reviewers: codex OK (medium effort), melious OK`.
`timings: codex 185s (56600 tokens), melious 149s (20043 tokens)`. 76,643 tokens; 493,286 logged for rounds 1
and 2 together.

Both seats checked the 19 fixed findings and the one refutation: **all landed in full**; no fix re-broke
anything; nothing re-raised. New: 8 findings, 0 BUG, 3 RISK, 5 NIT. Under SKILL step 6 a round without a
substantive BUG ends the rounds. Convergence (step 7): 20 findings fell to 8, all in new ground, none
re-raised. All eight are fixed locally; the fixes are commit `81ae653`.

| # | Kind | Seat | Finding | Check | Disposition |
|---|---|---|---|---|---|
| D21 | RISK | Codex | shared metering, the account quota and fail-open rest on vendor pages the reviewers cannot read | the readings exist: `VENDOR-FACTS-2026-10-22-what-it-runs-on.md` | fixed by retention: the record goes into `docs/reviews/` with this PR; the dashboard test is the owner's |
| D22 | RISK | Codex | the ruleset claims lack a retained observation | `gh api` read-back by ID, 2026-10-22 | fixed by retention: same record |
| D23 | RISK | Codex | the Plausible price and billing interval | the pricing page text | fixed: the page says what was shown and what was not; reading retained |
| D24 | NIT | Codex | the claim that removing `overflow-wrap: anywhere` fails the phone test was not measured | **measured**, 60-character word, 360 and 320 px: as built 0 and 0; without `anywhere` 0 and 0; without `minmax` 0 and 0; without both 191 and 231 px | fixed: either rule is enough and the test fails only when both are gone; the CSS and test comments say so. My round-1 check had removed both at once and credited the wrong rule |
| D25 | NIT | GLM | "$9 a month" and "did not show monthly or yearly" contradict | read | fixed |
| D26 | NIT | GLM | "available on every plan" (DNS, Email Routing) carries no source of its own | read | fixed: the DNS setup page is linked and dated; Email Routing carries its read date |
| D27 | NIT | GLM | "it was read from Claude Code's documentation" points at the wrong noun | read | fixed |
| D28 | NIT | GLM | "the toolkit's guide" is not linked | read | fixed |

## Merge of `origin/main`, then the merge-link review

`origin/main` (`cf254ff`: the `/security` page, PR #118, and the 0.32 suites, PR #115) moved under the branch,
which was 16 commits behind. A trial merge in a throwaway worktree showed no conflicts; the real merge is
`ab093c4`. On the merged branch the full suite ran under a machine load average above 400 (another session's
work). Whole-site loop tests timed out, a different one in each full run (the footer credit; the privacy host;
the operator check); each passes alone with a longer timeout, and a full run with `--timeout=300000
--workers=2` is the check of record. Listed here, not hidden.

The merge link (SKILL step 6, `merge_link.sh`) is the artifact: the change's own files from the last reviewed
head `e35a276` to the new head, merge effects included: 9 files, 236 lines. It carries the round-2 fixes and
the merge effects on the registration files. The pair read it as a verification link with
`prior-diff-findings-r2.md`. The wording pass is folded into this link: it covers the same prose edits with the
same cross-model seats, and a separate pass would read identical text.

Result: `reviewers: codex OK (medium effort), melious OK`. `timings: codex 160s (60660 tokens), melious 171s
(25205 tokens)`. 85,865 tokens; 579,151 logged for the gate. Both seats confirmed that D24 to D28 landed in
full. New: 2 BUG, 4 RISK, 2 NIT, which come to five distinct findings, because four of the six BUG and RISK
lines have one cause.

| # | Kind | Seat | Finding | Check | Disposition |
|---|---|---|---|---|---|
| D29 | BUG, 3 RISK (Codex) and 1 RISK (GLM) | both | the prior-findings said this pull request adds a facts record under `docs/reviews/`; none was there, so D21 to D23 stayed unresolved | `docs/reviews/` at `ab093c4` held no such file; `merge_link.sh` drops `docs/reviews/` from its list by design, so a file added there would not have shown in the link either | **real: my record promised something I had not done yet.** Fixed: the record is added (`VENDOR-FACTS-2026-10-22-what-it-runs-on.md`), with the vendor readings, the ruleset read-back and the layout measurement. A review record, no change to the page: not substantive |
| D30 | BUG | GLM | `tests/_helpers.ts`: the comment gives `[PDF]` as an allowlist example, but the set is empty | the code is main's, from PR #118 (`f490e7a`, merge `2535f0c`); the comment says "e.g."; `git grep '\[PDF\]'` on `main` finds only that comment and one in `placeholders.spec.ts`: no page uses it, nothing was lost | **refuted**, and not this change's code |
| D31 | NIT | GLM | the phone-test comment says "which is what a long future word would meet" | read | fixed: "this fails only when both are gone" (commit `78de238`) |
| D32 | NIT | GLM | `CONTENT_GUIDE.md` line 59 ("a count in copy is rendered, never typed") and `POSITIONING.md` line 192 ("counts in these lines are typed by hand") look opposite | both lines are on `main` (PRs #118 and #115); they govern different surfaces, page copy and POSITIONING's reference lines | out of scope: not this change; the owner may want the two lines to name their surfaces |
| D33 | (unverifiable) | Codex | the D24 measurement was not reproduced by the reviewers | the measurement is the author's | retained: the table is in the facts record, section 5 |

Full suite on the merged branch (`ab093c4`), the check of record: `npx playwright test --timeout=300000
--workers=2` gave **372 passed, exit 0** in 4.3 minutes, with the machine's load average near 580 at the end.
The default-timeout runs on the same tree had failed one or three whole-site loop tests each (the footer credit,
the privacy host, the operator check), a different set each time, and each of the three passed alone with a
longer timeout.

## Close

No BUG open: D29 is fixed, D30 refuted with evidence. The rounds ended at round 2 (no substantive BUG; step 6).
The wording pass was folded into the merge-link review, which covered the same prose edits with the same
cross-model seats. One more comment line was changed after it (D31); that one-line delta gets one Codex
confirmation, below. Counts: 2 rounds and the merge link; 32 findings (20 in round 1, 8 in round 2, 4 in the
link), plus one unverifiable measurement kept as evidence; 29 fixed, 2 refuted with evidence (D19, D30), 1 out
of scope (D32). Tokens logged: round 1 416,643; round 2 76,643; the link 85,865; the confirmation 44,502;
total 623,653.

## Confirmation (Codex, one seat; a re-gate, not a round)

Delta `ab093c4..78de238`: the one comment line of D31. `reviewers: codex OK`. `timings: codex 91s (44502
tokens)`. Result: **No BUG/RISK/NIT findings.** Codex confirmed that only a comment changed, that the test's
setup and assertion are as described, and that both layout protections and the site's global
`overflow-wrap: break-word` are in the code. It listed the layout claims as unverifiable in its sandbox, which
is the measurement in the facts record, section 5.

## Second merge of `main` (footer columns), 2026-10-23

After the push, GitHub reported a conflict with `main`, which had gained PR #119 (the footer, rebuilt as four
labelled columns from a `FOOTER` list in `src/config.ts`, with a test that every page is in it) and PR #120.
The conflict was in `src/layouts/Base.astro`: my one hand-typed footer link against `main`'s rewrite. Resolved by
Auto-fix on the app's report: `Base.astro` is `main`'s version byte for byte, and the page's entry went into
`FOOTER` ("Your site", between From WordPress and Security), which is what the plan's D5 said to do when
`FOOTER` exists. Merge commit `b4b58df`; 376 tests passed before the commit and again in the pre-push gate;
`astro check` clean.

The merge link (`merge_link.sh`, with `tests/navigation.spec.ts` passed as an extra path) was 195 lines, almost
all of it `main`'s own footer code, which PR #119's gate had reviewed; the prior-findings record said so and
named the three checks that mattered (my one entry; `Base.astro` equal to `main`'s; no stale text about a
hand-typed link). One Codex seat read it: `reviewers: codex OK`, `timings: codex 113s (36175 tokens)`. **No
BUG/RISK/NIT findings.** One cross-model seat is enough for the stamp (SKILL, closeout): Codex's chain is
unbroken from round 1; GLM's chain ended at the first merge link. Gate total: 659,828 tokens logged.

Closed 2026-10-22: no BUG open; head `78de238` (plus the record commit, which `merge_link.sh` and the skill
exclude as `docs/reviews/`). Pushed on 2026-10-23 on the owner's go (the pre-push gate: 372 passed in 1.2
minutes); PR karero/croftweaver-site#121 opened. The owner's ship hold applies to any publish.


## Round 3 (2026-10-23): a paragraph on Cloudflare, at the owner's request

The owner asked for two to five lines about Cloudflare being one of the backbones of the internet. The page now
has a four-line paragraph (commit `61dbda1`): W3Techs' 27.8% of all websites (October 2026), what Cloudflare
does between visitors and a site (Cloudflare's developer docs), and one stated inference (a site shares
Cloudflare's availability). The sources, and what was left out (the word "backbone", "generally trusted and
safe", Workers, the headquarters, "ICANN-accredited"), are in the facts record, section 6. A new claim about a
third party earns a round, so the pair read the 37-line page delta with `prior-diff-findings-r4.md`; no note to
the reviewers this time.

`reviewers: codex OK, melious FAILED (output is not a review), ollama-cloud OK`. The melious seat's reply was
judged not a review by the script, so the ollama GLM 5.3 seat stood in, as the rules say. `timings: codex 84s
(41690 tokens), melious 54s (7140 tokens), ollama-cloud 175s` (no token figure). 708,658 tokens logged for the
gate to here. Codex: **No BUG/RISK/NIT findings.**

| # | Kind | Seat | Finding | Check | Disposition |
|---|---|---|---|---|---|
| D34 | NIT | GLM (ollama) | "answers DNS requests for the domain" drops the qualifier Cloudflare's docs carry (the default full setup); DNS on Cloudflare is optional | the docs as read: "applies to the default full setup"; the page says in its own DNS paragraph that DNS can move | fixed: "can answer" (commit `5931e75`) |
| D35 | NIT, outside scope | GLM (ollama) | the header comment names only the private hub, which cannot cover a paragraph read on 2026-10-23 | the facts record, section 6 | fixed: the header names `docs/reviews/` |

Both seats' unverifiable lists (W3Techs and Cloudflare's docs have no primary capture in the repository) are
met by the author's dated readings in section 6.

Confirmation (Codex, one seat) on the 23-line delta `61dbda1..5931e75`: `timings: codex 63s (52759 tokens)`;
**No BUG/RISK/NIT findings.**

Totals after round 3: 3 rounds, two merge links and two one-seat confirmations; 34 findings (32 before, 2 in
this round); 31 fixed, 2 refuted (D19, D30), 1 out of scope (D32). Tokens: 708,658 logged through round 3,
plus 52,759 for the confirmation. Not pushed at the time of writing: the push of this change waits on the owner.


## The GitHub text and the picture (2026-10-23): a review of the delta, then round 4

The owner asked for a paragraph on what GitHub is, two items (version control, collaboration), and the picture
rebuilt as HTML and CSS with arrows, the technologies under each place and a box for the visitors' browsers
(commits `8f124f5`, `fd1d778`; sources and what was left out in the facts record, sections 7 and 8). New claims
about third parties earn a review: the pair read the page delta with no note to the reviewers, then, after the
fixes, read the fix delta `a6aa2a3..2c5a090` with `prior-diff-findings-r5.md` (the findings and the
dispositions below). The script's ledger counts the delta review inside round 3 and the check of the fixes as
round 4, earned by "overclaim" (`--earned-by overclaim`).

Delta review: `reviewers: codex OK, melious OK`; `timings: codex 309s (71985 tokens), melious 105s (13897
tokens)`. Check of the fixes: `reviewers: codex OK, melious OK`; `timings: codex 136s (38133 tokens), melious
187s (8613 tokens)`.

| # | Kind | Seat | Finding | Check | Disposition |
|---|---|---|---|---|---|
| D36 | BUG | Codex | "Git records every change to a project's files" promises recovery of changes that were never committed | GitHub's page says Git "keeps a history of changes"; uncommitted edits are not in it | fixed: "keeps a history of the changes that are committed"; the check of the fixes found the same promise in three more places (D41) |
| D37 | BUG | Codex (GLM unverifiable) | "Changes to different lines merge on their own" read as a rule; Codex reproduced adjacent different-line edits that conflict (`git merge-file`, exit 1) | GitHub's merge-conflict page says Git "usually" merges them; my sentence dropped "usually" | fixed: "usually", conflicts as examples; both seats confirmed in round 4 |
| D38 | RISK | Codex | the rollback was stated unconditionally | GitHub's page needs write permission and names two cases where individual commits are needed | fixed: "usually", "with write access", and a fallback; the second fallback case came back as D42 |
| D39 | NIT | GLM | the technology lists are real lists with `list-style: none` and no `role="list"`; Safari with VoiceOver drops list semantics from that combination | the earlier markup carried `role="list"` for the same reason | fixed: `role="list"` on all three; the effect in Safari is **not traced** (Chromium only here) |
| D40 | NIT | GLM | the test comment says "technologies" but counts list items; three empty items would pass | the test as written | fixed: counts non-empty entries; Codex ran the counting callback on empty, blank, mixed and valid fixtures |
| D41 | BUG | Codex, GLM | D36 only partly fixed: "the history of every change" in the GitHub card, "Git: every change" in its list and the same words in the GitHub section | `rg "every change"` on the page: three hits left | fixed: "the history of the changes you push" (card and section), "Git: the history of commits"; GitHub receives pushed commits only |
| D42 | NIT | GLM | the revert fallback names "if that conflicts" but GitHub's page names two cases (it conflicts, or the pull request was not merged on GitHub) | the facts record, section 7 | fixed: both cases |

GLM's side question, whether another list on the page is styled `list-style: none` without `role="list"`,
checked with `rg list-style` on the page: it appears once, on `.made`; the `.steps` list keeps its markers.

Confirmation (Codex, one seat) on the fix delta `2c5a090..ce5b570`: `timings: codex 92s (44531 tokens)`;
**No BUG/RISK/NIT findings.** Its unverifiable list (GitHub's Revert behaviour, the non-GitHub-merge fallback,
Git's reversion semantics) rests on the author's dated readings in the facts record, which record a small
model's rendering of each page, not a captured copy; a reader who wants more reads the linked GitHub pages.

Totals after round 4: 4 rounds, two merge links and three one-seat confirmations; 41 findings (34 before, 7 in
this stretch); 38 fixed, 2 refuted (D19, D30), 1 out of scope (D32). Tokens: 938,576 logged for the gate
(through the third confirmation); the fixes, the host's own work and the fresh-eyes seat in round 1 are not in
that figure. Full suite on `ce5b570`: 377 passed; `astro check` 0 errors. Not pushed at the time of writing:
the push of these commits waits on the owner. The ship hold stands.


## Analytics, the two dashboards and Keystatic's makers (2026-10-23): a review of the delta

The owner asked for an analytics section above Keystatic (Plausible as the optional second tool, with the two
dashboards of the example site genai-wednesday and a few words on who is behind Plausible and where), a closing
point that analytics is optional and needs no cookie banner, and a few words on who is behind Keystatic (commits
`e479c59`, `299d2e1`; the readings are in the facts record, section 9). New claims about third parties: the pair
read the 179-line page, test and image delta with no note to the reviewers.

One thing the owner may not have known, found while checking: the Cloudflare screenshot is of
genai-wednesday.com, which answers 302 and forwards to genai-wednesday.de, the site Plausible counts. The page
says so in the text under the pictures and calls the comparison rough. The question of a like-for-like
screenshot (the .de overview) went to the owner with the wrap-up of this stretch.

`reviewers: codex OK, melious OK`; `timings: codex 204s (69608 tokens), melious 105s (11965 tokens)`. No BUG.

| # | Kind | Seat | Finding | Check | Disposition |
|---|---|---|---|---|---|
| D43 | RISK | Codex | the server-mode claims (counts visitors who block scripts, skips most crawlers, reads nothing from the device) have no implementation or test behind them in the review | the guide (`SKILL.md`, "Script or server mode") says blockers, scroll depth, IP, quota, device; it does **not** say crawlers: that is the function's own comment on `navigationSkip()`, which no toolkit test traces | fixed: the crawler claim now says "many crawlers and scripts", not "most", and cites the function's code; the facts record gives the rule line by line and says no test covers it |
| D44 | RISK | Codex | zone-analytics rules (crawlers and threats counted) applied to the pictured Overview metric, which the record leaves open | the docs name the Analytics app's HTTP Traffic metrics; neither docs page read describes the Overview chart | fixed by hedge: the page says Cloudflare's documentation states it for its free-plan figures and that this "can account for part of the gap; the screenshots cannot show how much"; the gap in the record stays |
| D45 | RISK | Codex (GLM NIT) | the "two dashboards" test counts figures only; a broken image path passes | mutation: a wrong `src` left the test green | fixed: each figure must hold one image that loads (`naturalWidth > 0`, polled after scrolling to it); the same mutation now fails the test |
| D46 | NIT | GLM | the Cloudflare alt says "23 September to 23 October", the caption "30 days to 23 October" | the screenshot reads "30 Days" and "23 September — 23 October" | fixed: the alt gives the date range, the caption the 30 days; the numbers live in the caption only |
| D47 | NIT | GLM | each alt repeats its caption, so a screen reader reads the figures twice | the old alts | fixed: the alts describe what is shown; the captions give site, period and figures as text |
| D48 | BUG | Codex (confirmation) | the new Plausible alt says "six totals", but views per visit, bounce rate and visit duration are rates, not totals | the screenshot: six labelled metrics | fixed in `ce88f39`: "six metrics" |

Unverifiable lists (Plausible, Keystatic and Thinkmill, screenshot provenance): met by section 9 of the facts
record, which was read from the raw pages (the price in a real browser), not from a small model's rendering. The
owner's screenshots cannot be verified from the repository; Codex compared the captions with the pixels of the two
WebP files (domains, periods, figures matched).

An earlier confirmation run stalled for over two hours (Codex read Playwright's source in `node_modules` while the
machine's load average sat above 35); it was stopped by hand after checking that it was this session's own process, and
rerun.

Confirmation (Codex, one seat) on the fix delta `e479c59..299d2e1`: `timings: codex 147s (58865 tokens)`; one BUG (D48, above):
the alt I wrote in the fix said "six totals". It is fixed in `ce88f39`. That one-word alt correction got no second
model pass: the gate is named here, the wording was checked against the screenshot, and the suite passed (378). The
rest of the confirmation's notes repeat the unverifiable lists above and the crawler-header generalisation that the
page already words as "many".

Totals after this stretch: 4 rounds, two merge links, and the confirmations of the earlier stretches; the analytics
review was a review of new claims and, with no BUG found, needed no new round, only the confirmation above. 47
findings in all (41 before, 6 here, D43 to D48); 44 fixed, 2 refuted (D19, D30), 1 out of scope (D32).
Tokens: 1,079,014 logged for the gate through this confirmation (the stalled run, stopped by hand, has no figure in it). Not pushed at the time of writing; the ship hold stands.


## The "No cookie banner*" line, the footnote and the counting sentence (2026-10-23): a review of the delta, one seat

At the owner's choice (option B) the analytics section ends with a bold "No cookie banner*" line and a footnote; at
his go it also gained a sentence on German damages rulings, a sentence on how Plausible counts visitors, and the
Baden-Württemberg authority's conditions (commits `cceb06b`, `f2ad8a0`; the readings are in the facts record,
sections 9 and 10). Reviewed once, over the whole 105-line delta, as he asked.

**Degraded round, named as such.** `reviewers: codex OK, melious FAILED (error mid-stream (HTTP 200): Insufficient
balance for request. Required: 92, Available: 0), ollama-cloud FAILED (429, weekly usage limit)`. `timings: codex 315s
(93456 tokens)`. Per the rules no other model goes to melious and Kimi runs on ollama only, so there was no second
seat. One cross-model seat read the delta; gate total 1,172,470 tokens logged. The page is prose and tests; no BUG.

| # | Kind | Seat | Finding | Check | Disposition |
|---|---|---|---|---|---|
| D49 | RISK | Codex | the counting sentence and "stores no IP address" are stated as facts, backed by notes, not implementation | the claim is Plausible's own (its data policy and metrics definitions, read raw 2026-10-23); the repository's README records the v3.2.1 source: a new salt at midnight UTC, salts older than 48 hours deleted, a visit still open at midnight continues under the previous day's identifier | fixed: "Plausible says it counts ... and stores no IP address"; the source reading stays in the README, not on the page |
| D50 | RISK | Codex | the "must end" test checks that the claim exists, not that the footnote stays beside it | mutation: a paragraph inserted between them left the test green | fixed in `248c4fe`: the footnote must be the very next element after the claim and the last element of the section; the same mutation now fails the test |

Unverifiable lists (the EDPB, the DSK, the Baden-Württemberg FAQ, the court reports, the toolkit's server mode, the
owner's preference for the asterisk line): met by the facts record, sections 9 and 10, which quote the authority
texts from their PDF text layers and the court press release; the court reports are small-model readings and are
marked so there. The owner's instruction for the asterisk line is in the chat of 2026-10-23.

The two fixes (an attribution in one sentence, a tighter test) got no second model pass: there is no second seat to
ask while melious has no balance and ollama is at its weekly limit, and both fixes were checked by mutation and by the
full suite (379 passed, `astro check` 0 errors). Findings in all: 49 before this stretch's two, 2 here: 51 total; 48
fixed, 2 refuted, 1 out of scope.
